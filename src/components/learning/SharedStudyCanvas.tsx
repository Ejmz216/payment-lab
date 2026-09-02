import { type ChangeEvent, type ClipboardEvent, useEffect, useRef, useState } from 'react'
import { Eraser, ImagePlus, LoaderCircle, Radio, Trash2, WifiOff } from 'lucide-react'
import mqtt, { type MqttClient } from 'mqtt'
import * as Y from 'yjs'
import { useUIStore } from '@/store/uiStore'

const BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt'
const CHANNEL = 'payment-lab/info-extra/anonymous-canvas/v2-7f4c61d3'
const MAX_LENGTH = 12_000
const MAX_IMAGES = 4
const MAX_IMAGE_BYTES = 420_000
const MAX_SOURCE_IMAGE_BYTES = 12_000_000
const MAX_TOTAL_IMAGE_BYTES = MAX_IMAGES * MAX_IMAGE_BYTES
const MAX_IMAGE_DIMENSION = 1_400
const MAX_WIRE_BYTES = 3_000_000
const LOCAL_ORIGIN = Symbol('shared-study-canvas')
const REMOTE_ORIGIN = Symbol('shared-study-canvas-remote')

type ConnectionState = 'connecting' | 'active' | 'offline'
type ImageState = 'idle' | 'processing' | 'limit' | 'too-large' | 'error'

type StoredImage = {
  id: string
  mimeType: string
  width: number
  height: number
  data: Uint8Array
}

type SharedImage = StoredImage & { url: string }

type WireMessage =
  | { type: 'sync-request'; sender: string }
  | { type: 'sync-response'; sender: string; target: string; update: string }
  | { type: 'update'; sender: string; update: string }

class ImagePreparationError extends Error {
  constructor(readonly reason: Exclude<ImageState, 'idle' | 'processing'>) {
    super(reason)
  }
}

function createEphemeralId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function encodeUpdate(update: Uint8Array) {
  let binary = ''
  const chunkSize = 32_768
  for (let index = 0; index < update.length; index += chunkSize) {
    binary += String.fromCharCode(...update.subarray(index, index + chunkSize))
  }
  return btoa(binary)
}

function decodeUpdate(encoded: string) {
  const binary = atob(encoded)
  const update = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    update[index] = binary.charCodeAt(index)
  }
  return update
}

function isStoredImage(value: unknown): value is StoredImage {
  if (!value || typeof value !== 'object') return false
  const image = value as Partial<StoredImage>
  return typeof image.id === 'string'
    && ['image/webp', 'image/png', 'image/jpeg'].includes(image.mimeType ?? '')
    && typeof image.width === 'number'
    && typeof image.height === 'number'
    && Number.isFinite(image.width)
    && Number.isFinite(image.height)
    && (image.width ?? 0) > 0
    && (image.height ?? 0) > 0
    && (image.width ?? 0) <= MAX_IMAGE_DIMENSION
    && (image.height ?? 0) <= MAX_IMAGE_DIMENSION
    && image.data instanceof Uint8Array
    && image.data.byteLength > 0
    && image.data.byteLength <= MAX_IMAGE_BYTES
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new ImagePreparationError('error')),
      'image/webp',
      quality,
    )
  })
}

async function prepareImage(file: File): Promise<StoredImage> {
  if (file.size > MAX_SOURCE_IMAGE_BYTES) throw new ImagePreparationError('too-large')

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new ImagePreparationError('error')
  }

  try {
    if (!bitmap.width || !bitmap.height) throw new ImagePreparationError('error')

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) throw new ImagePreparationError('error')

    let scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height))
    let quality = 0.82
    let blob: Blob | null = null

    for (let attempt = 0; attempt < 8; attempt += 1) {
      canvas.width = Math.max(1, Math.round(bitmap.width * scale))
      canvas.height = Math.max(1, Math.round(bitmap.height * scale))
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
      blob = await canvasToBlob(canvas, quality)
      if (blob.size <= MAX_IMAGE_BYTES) break

      if (quality > 0.46) {
        quality -= 0.12
      } else {
        scale *= 0.75
        quality = 0.7
      }
    }

    if (!blob || blob.size > MAX_IMAGE_BYTES) throw new ImagePreparationError('too-large')

    return {
      id: createEphemeralId(),
      mimeType: blob.type || 'image/webp',
      width: canvas.width,
      height: canvas.height,
      data: new Uint8Array(await blob.arrayBuffer()),
    }
  } finally {
    bitmap.close()
  }
}

function replaceSharedText(sharedText: Y.Text, nextValue: string) {
  const currentValue = sharedText.toString()
  if (currentValue === nextValue) return

  let start = 0
  while (
    start < currentValue.length
    && start < nextValue.length
    && currentValue[start] === nextValue[start]
  ) {
    start += 1
  }

  let currentEnd = currentValue.length
  let nextEnd = nextValue.length
  while (
    currentEnd > start
    && nextEnd > start
    && currentValue[currentEnd - 1] === nextValue[nextEnd - 1]
  ) {
    currentEnd -= 1
    nextEnd -= 1
  }

  sharedText.doc?.transact(() => {
    if (currentEnd > start) sharedText.delete(start, currentEnd - start)
    if (nextEnd > start) sharedText.insert(start, nextValue.slice(start, nextEnd))
  }, LOCAL_ORIGIN)
}

function publish(client: MqttClient, message: WireMessage) {
  if (!client.connected) return
  client.publish(CHANNEL, JSON.stringify(message), { qos: 0, retain: false })
}

export function SharedStudyCanvas() {
  const lang = useUIStore((state) => state.lang)
  const [value, setValue] = useState('')
  const [images, setImages] = useState<SharedImage[]>([])
  const [imageState, setImageState] = useState<ImageState>('idle')
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting')
  const sharedTextRef = useRef<Y.Text | null>(null)
  const sharedImagesRef = useRef<Y.Array<StoredImage> | null>(null)
  const imageUrlsRef = useRef<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const copy = lang === 'es'
    ? {
        eyebrow: 'LIENZO COMPARTIDO',
        title: 'Notas de estudio',
        placeholder: 'Escribe aquí…',
        connecting: 'Conectando…',
        active: 'Sincronización activa',
        offline: 'Sin conexión',
        addImage: 'Añadir imagen',
        removeImage: 'Borrar imagen compartida',
        imageAlt: 'Imagen compartida',
        processing: 'Preparando imagen…',
        limit: 'El lienzo admite hasta cuatro imágenes pequeñas.',
        tooLarge: 'La imagen es demasiado grande para este lienzo temporal.',
        imageError: 'No se pudo procesar la imagen.',
        clear: 'Borrar el lienzo compartido',
        confirmClear: '¿Borrar el contenido del lienzo para todas las personas?',
      }
    : {
        eyebrow: 'SHARED CANVAS',
        title: 'Study notes',
        placeholder: 'Write here…',
        connecting: 'Connecting…',
        active: 'Sync active',
        offline: 'Offline',
        addImage: 'Add image',
        removeImage: 'Delete shared image',
        imageAlt: 'Shared image',
        processing: 'Preparing image…',
        limit: 'The canvas accepts up to four small images.',
        tooLarge: 'The image is too large for this temporary canvas.',
        imageError: 'The image could not be processed.',
        clear: 'Clear the shared canvas',
        confirmClear: 'Clear the canvas content for everyone?',
      }

  useEffect(() => {
    const document = new Y.Doc()
    const sharedText = document.getText('notes')
    const sharedImages = document.getArray<StoredImage>('images')
    const sender = createEphemeralId()
    sharedTextRef.current = sharedText
    sharedImagesRef.current = sharedImages

    const syncTextFromDocument = () => {
      if (sharedText.length > MAX_LENGTH) {
        document.transact(() => sharedText.delete(MAX_LENGTH, sharedText.length - MAX_LENGTH), LOCAL_ORIGIN)
        return
      }

      const nextValue = sharedText.toString()
      setValue(nextValue)

      const textarea = textareaRef.current
      if (!textarea) return
      const selectionStart = Math.min(textarea.selectionStart, nextValue.length)
      const selectionEnd = Math.min(textarea.selectionEnd, nextValue.length)
      requestAnimationFrame(() => textarea.setSelectionRange(selectionStart, selectionEnd))
    }

    const syncImagesFromDocument = () => {
      let totalBytes = 0
      const validImages = sharedImages.toArray().filter((image) => {
        if (!isStoredImage(image) || totalBytes + image.data.byteLength > MAX_TOTAL_IMAGE_BYTES) return false
        totalBytes += image.data.byteLength
        return true
      }).slice(0, MAX_IMAGES)

      imageUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      const nextImages = validImages.map((image) => {
        const bytes = image.data.slice().buffer as ArrayBuffer
        const url = URL.createObjectURL(new Blob([bytes], { type: image.mimeType }))
        return { ...image, url }
      })
      imageUrlsRef.current = nextImages.map((image) => image.url)
      setImages(nextImages)
    }

    sharedText.observe(syncTextFromDocument)
    sharedImages.observe(syncImagesFromDocument)

    const client = mqtt.connect(BROKER_URL, {
      clientId: `payment-lab-${sender}`,
      clean: true,
      connectTimeout: 10_000,
      keepalive: 30,
      queueQoSZero: false,
      reconnectPeriod: 2_000,
      resubscribe: true,
    })

    const handleDocumentUpdate = (update: Uint8Array, origin: unknown) => {
      if (origin === REMOTE_ORIGIN) return
      publish(client, { type: 'update', sender, update: encodeUpdate(update) })
    }

    const applyRemoteUpdate = (encoded: string) => {
      if (encoded.length > MAX_WIRE_BYTES) return
      try {
        Y.applyUpdate(document, decodeUpdate(encoded), REMOTE_ORIGIN)
      } catch {
        // Ignore malformed messages on the public relay channel.
      }
    }

    const handleMessage = (topic: string, payload: Uint8Array) => {
      if (topic !== CHANNEL || payload.byteLength > MAX_WIRE_BYTES) return

      try {
        const message = JSON.parse(new TextDecoder().decode(payload)) as Partial<WireMessage>
        if (typeof message.sender !== 'string' || message.sender === sender) return

        if (message.type === 'sync-request') {
          publish(client, {
            type: 'sync-response',
            sender,
            target: message.sender,
            update: encodeUpdate(Y.encodeStateAsUpdate(document)),
          })
          return
        }

        if (message.type === 'sync-response') {
          if (message.target === sender && typeof message.update === 'string') {
            applyRemoteUpdate(message.update)
          }
          return
        }

        if (message.type === 'update' && typeof message.update === 'string') {
          applyRemoteUpdate(message.update)
        }
      } catch {
        // Ignore traffic that does not belong to this canvas protocol.
      }
    }

    const handleConnect = () => {
      client.subscribe(CHANNEL, { qos: 0 }, (error) => {
        if (error) {
          setConnectionState('offline')
          return
        }

        setConnectionState('active')
        if (sharedText.length > 0 || sharedImages.length > 0) {
          publish(client, {
            type: 'update',
            sender,
            update: encodeUpdate(Y.encodeStateAsUpdate(document)),
          })
        }
        publish(client, { type: 'sync-request', sender })
      })
    }

    const handleReconnect = () => setConnectionState('connecting')
    const handleOffline = () => setConnectionState('offline')

    document.on('update', handleDocumentUpdate)
    client.on('connect', handleConnect)
    client.on('reconnect', handleReconnect)
    client.on('offline', handleOffline)
    client.on('close', handleOffline)
    client.on('error', handleOffline)
    client.on('message', handleMessage)

    return () => {
      client.off('connect', handleConnect)
      client.off('reconnect', handleReconnect)
      client.off('offline', handleOffline)
      client.off('close', handleOffline)
      client.off('error', handleOffline)
      client.off('message', handleMessage)
      client.end(true)
      document.off('update', handleDocumentUpdate)
      sharedText.unobserve(syncTextFromDocument)
      sharedImages.unobserve(syncImagesFromDocument)
      imageUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      imageUrlsRef.current = []
      sharedTextRef.current = null
      sharedImagesRef.current = null
      document.destroy()
    }
  }, [])

  const statusLabel = connectionState === 'active'
    ? copy.active
    : connectionState === 'offline'
      ? copy.offline
      : copy.connecting

  const imageStatusLabel = imageState === 'processing'
    ? copy.processing
    : imageState === 'limit'
      ? copy.limit
      : imageState === 'too-large'
        ? copy.tooLarge
        : imageState === 'error'
          ? copy.imageError
          : ''

  function handleChange(nextValue: string) {
    const limitedValue = nextValue.slice(0, MAX_LENGTH)
    setValue(limitedValue)
    const sharedText = sharedTextRef.current
    if (sharedText) replaceSharedText(sharedText, limitedValue)
  }

  async function addImages(files: File[]) {
    const sharedImages = sharedImagesRef.current
    if (!sharedImages || files.length === 0) return

    setImageState('processing')
    for (const file of files) {
      if (sharedImages.toArray().filter(isStoredImage).length >= MAX_IMAGES) {
        setImageState('limit')
        return
      }

      try {
        const image = await prepareImage(file)
        const latestImages = sharedImages.toArray().filter(isStoredImage)
        const latestBytes = latestImages.reduce((total, item) => total + item.data.byteLength, 0)
        if (latestImages.length >= MAX_IMAGES || latestBytes + image.data.byteLength > MAX_TOTAL_IMAGE_BYTES) {
          throw new ImagePreparationError('limit')
        }
        sharedImages.doc?.transact(() => sharedImages.push([image]), LOCAL_ORIGIN)
      } catch (error) {
        setImageState(error instanceof ImagePreparationError ? error.reason : 'error')
        return
      }
    }
    setImageState('idle')
  }

  function handlePaste(event: ClipboardEvent<HTMLElement>) {
    const files = Array.from(event.clipboardData.items)
      .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
      .map((item) => item.getAsFile())
      .filter((file): file is File => file !== null)
    if (files.length === 0) return

    event.preventDefault()
    void addImages(files)
  }

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith('image/'))
    event.target.value = ''
    void addImages(files)
  }

  function removeImage(id: string) {
    const sharedImages = sharedImagesRef.current
    if (!sharedImages) return
    const index = sharedImages.toArray().findIndex((image) => isStoredImage(image) && image.id === id)
    if (index >= 0) sharedImages.doc?.transact(() => sharedImages.delete(index, 1), LOCAL_ORIGIN)
    setImageState('idle')
  }

  function clearCanvas() {
    if ((!value && images.length === 0) || !window.confirm(copy.confirmClear)) return
    const sharedText = sharedTextRef.current
    const sharedImages = sharedImagesRef.current
    const document = sharedText?.doc ?? sharedImages?.doc
    document?.transact(() => {
      if (sharedText?.length) sharedText.delete(0, sharedText.length)
      if (sharedImages?.length) sharedImages.delete(0, sharedImages.length)
    }, LOCAL_ORIGIN)
    setImageState('idle')
  }

  return (
    <section
      className="mx-auto w-full max-w-4xl border-y border-camt/35 py-5"
      aria-labelledby="shared-canvas-title"
      onPaste={handlePaste}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-camt">{copy.eyebrow}</div>
          <h2 id="shared-canvas-title" className="mt-1 text-lg font-semibold">{copy.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 text-xs ${connectionState === 'offline' ? 'text-danger' : 'text-muted'}`}>
            {connectionState === 'offline' ? <WifiOff size={14} /> : <Radio size={14} className={connectionState === 'active' ? 'text-success' : 'text-warning'} />}
            {statusLabel}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={handleFileSelection}
            tabIndex={-1}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={imageState === 'processing' || images.length >= MAX_IMAGES}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted transition-colors hover:border-camt/60 hover:text-camt disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={copy.addImage}
            title={copy.addImage}
          >
            {imageState === 'processing' ? <LoaderCircle size={16} className="animate-spin" /> : <ImagePlus size={16} />}
          </button>
          <button
            type="button"
            onClick={clearCanvas}
            disabled={!value && images.length === 0}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted transition-colors hover:border-danger/50 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={copy.clear}
            title={copy.clear}
          >
            <Eraser size={16} />
          </button>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        maxLength={MAX_LENGTH}
        spellCheck="true"
        aria-label={copy.title}
        placeholder={copy.placeholder}
        className="min-h-56 w-full resize-y rounded-md border border-border bg-surface/80 px-4 py-3 text-[15px] leading-7 text-text outline-none transition-colors placeholder:text-muted/70 focus:border-camt focus:ring-2 focus:ring-camt/20"
      />
      {imageStatusLabel && (
        <p
          className={`mt-2 text-xs ${imageState === 'processing' ? 'text-muted' : 'text-warning'}`}
          role="status"
          aria-live="polite"
        >
          {imageStatusLabel}
        </p>
      )}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {images.map((image, index) => (
            <figure key={image.id} className="relative overflow-hidden rounded-md border border-border bg-surface">
              <img
                src={image.url}
                width={image.width}
                height={image.height}
                alt={`${copy.imageAlt} ${index + 1}`}
                className="max-h-80 w-full object-contain"
              />
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-md border border-danger/40 bg-bg/90 text-danger shadow-sm transition-colors hover:bg-danger hover:text-white"
                aria-label={copy.removeImage}
                title={copy.removeImage}
              >
                <Trash2 size={16} />
              </button>
            </figure>
          ))}
        </div>
      )}
    </section>
  )
}
