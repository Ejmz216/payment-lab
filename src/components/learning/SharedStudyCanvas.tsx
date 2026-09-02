import { useEffect, useRef, useState } from 'react'
import { Eraser, Radio, WifiOff } from 'lucide-react'
import mqtt, { type MqttClient } from 'mqtt'
import * as Y from 'yjs'
import { useUIStore } from '@/store/uiStore'

const BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt'
const CHANNEL = 'payment-lab/info-extra/anonymous-canvas/v2-7f4c61d3'
const MAX_LENGTH = 12_000
const MAX_WIRE_BYTES = 256_000
const LOCAL_ORIGIN = Symbol('shared-study-canvas')
const REMOTE_ORIGIN = Symbol('shared-study-canvas-remote')

type ConnectionState = 'connecting' | 'active' | 'offline'

type WireMessage =
  | { type: 'sync-request'; sender: string }
  | { type: 'sync-response'; sender: string; target: string; update: string }
  | { type: 'update'; sender: string; update: string }

function createEphemeralId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function encodeUpdate(update: Uint8Array) {
  let binary = ''
  for (const byte of update) binary += String.fromCharCode(byte)
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
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting')
  const sharedTextRef = useRef<Y.Text | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const copy = lang === 'es'
    ? {
        eyebrow: 'LIENZO COMPARTIDO',
        title: 'Notas de estudio',
        placeholder: 'Escribe aquí…',
        connecting: 'Conectando…',
        active: 'Sincronización activa',
        offline: 'Sin conexión',
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
        clear: 'Clear the shared canvas',
        confirmClear: 'Clear the canvas content for everyone?',
      }

  useEffect(() => {
    const document = new Y.Doc()
    const sharedText = document.getText('notes')
    const sender = createEphemeralId()
    sharedTextRef.current = sharedText

    const syncFromDocument = () => {
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

    sharedText.observe(syncFromDocument)

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
        if (sharedText.length > 0) {
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
      sharedText.unobserve(syncFromDocument)
      sharedTextRef.current = null
      document.destroy()
    }
  }, [])

  const statusLabel = connectionState === 'active'
    ? copy.active
    : connectionState === 'offline'
      ? copy.offline
      : copy.connecting

  function handleChange(nextValue: string) {
    const limitedValue = nextValue.slice(0, MAX_LENGTH)
    setValue(limitedValue)
    const sharedText = sharedTextRef.current
    if (sharedText) replaceSharedText(sharedText, limitedValue)
  }

  function clearCanvas() {
    if (!value || !window.confirm(copy.confirmClear)) return
    const sharedText = sharedTextRef.current
    if (!sharedText) return
    sharedText.doc?.transact(() => sharedText.delete(0, sharedText.length), LOCAL_ORIGIN)
  }

  return (
    <section className="mx-auto w-full max-w-4xl border-y border-camt/35 py-5" aria-labelledby="shared-canvas-title">
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
          <button
            type="button"
            onClick={clearCanvas}
            disabled={!value}
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
    </section>
  )
}
