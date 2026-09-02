import { useEffect, useRef, useState } from 'react'
import { Eraser, Radio, WifiOff } from 'lucide-react'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { useUIStore } from '@/store/uiStore'

const ROOM_NAME = 'payment-lab-info-extra-study-canvas-v1'
const ROOM_PASSWORD = 'payment-lab-info-extra-session-v1'
const SIGNALING_URL = 'wss://y-webrtc-signaling.fly.dev'
const MAX_LENGTH = 12_000
const LOCAL_ORIGIN = Symbol('shared-study-canvas')

type ConnectionState = 'connecting' | 'active' | 'offline'

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
    sharedTextRef.current = sharedText

    const syncFromDocument = () => {
      const nextValue = sharedText.toString()
      setValue(nextValue)

      const textarea = textareaRef.current
      if (!textarea) return
      const selectionStart = Math.min(textarea.selectionStart, nextValue.length)
      const selectionEnd = Math.min(textarea.selectionEnd, nextValue.length)
      requestAnimationFrame(() => textarea.setSelectionRange(selectionStart, selectionEnd))
    }

    sharedText.observe(syncFromDocument)

    let provider: WebrtcProvider | null = null
    let signalingConnection: {
      connected: boolean
      on: (event: string, handler: () => void) => void
      off: (event: string, handler: () => void) => void
    } | null = null
    const handleSignalConnect = () => setConnectionState('active')
    const handleSignalDisconnect = () => setConnectionState('offline')

    try {
      provider = new WebrtcProvider(ROOM_NAME, document, {
        password: ROOM_PASSWORD,
        signaling: [SIGNALING_URL],
        maxConns: 40,
      })
      // Presence metadata is unnecessary: only document updates are shared.
      provider.awareness.setLocalState(null)
      signalingConnection = provider.signalingConns[0] ?? null
      signalingConnection?.on('connect', handleSignalConnect)
      signalingConnection?.on('disconnect', handleSignalDisconnect)
      setConnectionState(signalingConnection?.connected ? 'active' : 'connecting')
    } catch {
      setConnectionState('offline')
    }

    return () => {
      signalingConnection?.off('connect', handleSignalConnect)
      signalingConnection?.off('disconnect', handleSignalDisconnect)
      provider?.destroy()
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
