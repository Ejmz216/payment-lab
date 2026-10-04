import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react'
import { journeyActors, journeys, phaseTone, type JourneyStep } from '@/content/reference/journeys'
import { getReferenceEntry } from '@/content/reference/entries'
import { ColorIcon, Icon3D, familyTones, type ReferenceTone } from '@/components/reference/ReferenceIdentity'
import { portrait } from '@/components/reference/SequenceDiagram'

type Focus = { kind: 'step' } | { kind: 'actor'; actor: number }
const AUTOPLAY_MS = 2600

function stepTone(step: JourneyStep): ReferenceTone {
  if (step.outcome === 'fail') return 'red'
  if (step.message) return familyTones[step.message.split('.')[0]] ?? 'blue'
  if (step.outcome === 'warn') return 'gold'
  if (step.outcome === 'ok') return 'mint'
  return 'blue'
}

// Tiny XML highlighter: tags, attributes and text become separate spans.
function XmlSnippet({ xml }: { xml: string }) {
  const tokens = xml.split(/(<\/?[\w.:]+|\s[\w:]+="[^"]*"|\/?>)/)
  return <pre className="journey-xml" aria-label="Fragmento XML del mensaje"><code>{tokens.map((token, i) => {
    if (!token) return null
    if (token.startsWith('<')) return <span key={i} className="x-tag">{token}</span>
    if (/^\s[\w:]+="/.test(token)) { const [name, ...value] = token.trim().split('='); return <span key={i}> <span className="x-attr">{name}</span>=<span className="x-val">{value.join('=')}</span></span> }
    if (token === '>' || token === '/>') return <span key={i} className="x-tag">{token}</span>
    return <span key={i} className="x-text">{token}</span>
  })}</code></pre>
}

export function Journeys() {
  const [params, setParams] = useSearchParams()
  const journey = journeys.find((item) => item.id === params.get('scenario')) ?? journeys[0]
  const [index, setIndex] = useState(0)
  const [focus, setFocus] = useState<Focus>({ kind: 'step' })
  const [playing, setPlaying] = useState(false)
  const panel = useRef<HTMLElement>(null)
  const steps = journey.steps
  const step = steps[index]

  useEffect(() => { setIndex(0); setFocus({ kind: 'step' }); setPlaying(false) }, [journey.id])
  useEffect(() => {
    if (!playing) return
    if (index >= steps.length - 1) { setPlaying(false); return }
    const timer = setTimeout(() => setIndex((value) => value + 1), AUTOPLAY_MS)
    return () => clearTimeout(timer)
  }, [playing, index, steps.length])

  function go(target: number, reveal = false) {
    setIndex(Math.max(0, Math.min(steps.length - 1, target)))
    setFocus({ kind: 'step' })
    if (reveal && window.matchMedia('(max-width: 1279px)').matches) requestAnimationFrame(() => panel.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }))
  }
  function showActor(actor: number) {
    setPlaying(false)
    setFocus({ kind: 'actor', actor })
    if (window.matchMedia('(max-width: 1279px)').matches) requestAnimationFrame(() => panel.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }))
  }
  function onKey(event: KeyboardEvent) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); go(index + 1) }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); go(index - 1) }
  }

  const messageEntry = step.message ? getReferenceEntry(step.message) : undefined
  const actorIndex = focus.kind === 'actor' ? focus.actor : -1
  const actor = actorIndex >= 0 ? journeyActors[actorIndex] : undefined
  const columns = journeyActors.length

  return <div className="ref-page journeys">
    <header className="reference-heading">
      <p className="ref-eyebrow text-camt">Recorridos · SIMPLIFIED MODEL</p>
      <h1 className="mt-2 text-3xl font-semibold">Un pago de punta a punta</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">Sigue una transacción completa en el tiempo, del cliente que paga al cliente que cobra. Elige un escenario, avanza paso a paso y toca cualquier mensaje o actor para ver qué está pasando y qué viaja en el XML.</p>
    </header>

    <div className="journey-picker" role="group" aria-label="Escenarios">
      {journeys.map((item) => <button key={item.id} aria-pressed={item.id === journey.id} onClick={() => setParams({ scenario: item.id }, { replace: true })} className={`journey-option tone-${item.tone}`}>
        <ColorIcon icon={item.icon} tone={item.tone} small />
        <span className="min-w-0"><strong className="block text-sm leading-5">{item.title}</strong><span className="block text-[11px] text-muted">{item.kind} · {item.steps.length} pasos</span></span>
      </button>)}
    </div>

    <section className={`journey-intro tone-${journey.tone}`}>
      <p className="text-sm leading-6">{journey.summary}</p>
      <p className="journey-takeaway"><Icon3D name="light-bulb" size={16} />{journey.takeaway}</p>
    </section>

    <div className="journey-layout">
      <aside ref={panel} className="journey-panel" aria-label="Detalle" aria-live="polite">
        {actor ? <>
          <button className="mb-3 inline-flex items-center gap-1.5 text-xs text-primary" onClick={() => setFocus({ kind: 'step' })}><ArrowLeft size={13} />Volver al paso {index + 1}</button>
          <div className="flex items-center gap-3"><ColorIcon {...portrait(actor.role)} /><div className="min-w-0"><p className="ref-eyebrow text-muted">{actor.title}</p><h2 className="mt-1 font-mono text-lg font-semibold">{actor.label}</h2></div></div>
          <p className="mt-4 text-sm leading-6">{actor.does}</p>
          <div className="mt-4"><p className="ref-eyebrow text-muted">En este recorrido</p>
            <div className="mt-2 flex flex-col gap-1">{steps.map((item, i) => (item.from === actorIndex || item.to === actorIndex) && <button key={i} onClick={() => go(i)} className="journey-mini"><span className="font-mono text-[10px] text-muted">{String(i + 1).padStart(2, '0')}</span><span className="min-w-0 flex-1 truncate">{item.label}</span>{item.message && <code className={`tone-text tone-${stepTone(item)}`}>{item.message}</code>}</button>)}</div>
          </div>
          <Link to={`/reference/${actor.entry}`} className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary">Leer el concepto <ArrowRight size={12} /></Link>
        </> : <>
          <p className={`ref-eyebrow tone-text tone-${phaseTone[step.phase]}`}>Paso {index + 1} de {steps.length} · {step.phase}</p>
          <h2 className="mt-1.5 text-lg font-semibold">{step.label}</h2>
          <p className="mt-1 font-mono text-[11px] text-muted">{journeyActors[step.from].label}{step.from === step.to ? ' · acción interna' : ` → ${journeyActors[step.to].label}`}</p>
          <div className="mt-4"><p className="ref-eyebrow text-camt">Qué está pasando</p><p className="mt-1.5 text-sm leading-6">{step.detail}</p></div>
          <dl className="journey-states">
            <div><dt>Dinero</dt><dd>{step.money}</dd></div>
            <div><dt>Estado del pago</dt><dd>{step.status}</dd></div>
          </dl>
          {step.message && <div className={`journey-message tone-${stepTone(step)}`}>
            <div className="flex items-center gap-2"><code className="tone-text text-sm font-semibold">{step.message}</code>{messageEntry && <span className="truncate text-[11px] text-muted">{messageEntry.subtitle}</span>}</div>
            {messageEntry && <p className="mt-2 text-xs leading-5">{messageEntry.plain ?? messageEntry.summary}</p>}
            {messageEntry && <Link to={`/reference/${messageEntry.id}`} className="mt-2 inline-flex items-center gap-1 text-[11px] text-primary">Abrir {step.message} en la enciclopedia <ArrowRight size={11} /></Link>}
          </div>}
          {step.xml && <details className="mt-4" open>
            <summary className="cursor-pointer ref-eyebrow text-pain">El mensaje en este momento</summary>
            <XmlSnippet xml={step.xml} />
            <p className="mt-1.5 text-[10px] leading-4 text-muted">Fragmento simplificado y sintético: solo los campos clave. Las versiones y códigos son ilustrativos; cada esquema define los suyos.</p>
          </details>}
          {step.message === 'pacs.008' && <Link to="/reference/pacs.008?tab=xml" className="mt-3 inline-flex items-center gap-1 text-[11px] text-primary">Ver el pacs.008 completo anotado <ArrowRight size={11} /></Link>}
          <div className="mt-5 flex gap-2"><button className="ref-icon" aria-label="Paso anterior" title="Paso anterior" disabled={!index} onClick={() => go(index - 1)}><ChevronLeft size={16} /></button><button className="ref-icon" aria-label="Paso siguiente" title="Paso siguiente" disabled={index === steps.length - 1} onClick={() => go(index + 1)}><ChevronRight size={16} /></button></div>
        </>}
      </aside>

      <section className="journey-stage" aria-label={`Línea de tiempo: ${journey.title}`}>
        <div className="journey-controls">
          <div className="flex items-center gap-2">
            <button className="ref-icon" aria-label="Paso anterior" title="Paso anterior" disabled={!index} onClick={() => go(index - 1)}><ChevronLeft size={16} /></button>
            <button className="journey-play" onClick={() => { if (index >= steps.length - 1) setIndex(0); setFocus({ kind: 'step' }); setPlaying((value) => !value) }} aria-pressed={playing}>{playing ? <Pause size={14} /> : <Play size={14} />}{playing ? 'Pausar' : 'Reproducir'}</button>
            <button className="ref-icon" aria-label="Paso siguiente" title="Paso siguiente" disabled={index === steps.length - 1} onClick={() => go(index + 1)}><ChevronRight size={16} /></button>
            <button className="ref-icon" aria-label="Volver al inicio" title="Volver al inicio" onClick={() => { setPlaying(false); go(0) }}><RotateCcw size={14} /></button>
          </div>
          <div className="journey-progress" aria-hidden="true"><span style={{ width: `${((index + 1) / steps.length) * 100}%` }} /></div>
        </div>
        <div className="journey-track">
          <span><em>Dinero</em>{step.money}</span>
          <span><em>Pago</em>{step.status}</span>
        </div>

        <div className="journey-scroll" tabIndex={0} onKeyDown={onKey} aria-label="Diagrama de secuencia. Usa las flechas del teclado para avanzar.">
          <div className="journey-grid" style={{ '--cols': columns } as CSSProperties}>
            <div className="journey-head">
              <span className="journey-phase-col ref-eyebrow text-muted">Fase</span>
              <div className="journey-actors">
                {journeyActors.map((item, i) => <button key={item.id} onClick={() => showActor(i)} aria-pressed={focus.kind === 'actor' && focus.actor === i} data-active={step.from === i || step.to === i} className="journey-actor" title={`${item.label}: ${item.title}`}>
                  <ColorIcon {...portrait(item.role)} small /><span>{item.label}</span>
                </button>)}
              </div>
            </div>
            <div className="journey-body">
              <div className="journey-lifelines" aria-hidden="true">{journeyActors.map((item) => <span key={item.id} />)}</div>
              {steps.map((item, i) => {
                const self = item.from === item.to
                const left = self ? (item.from / columns) * 100 + 1.5 : ((Math.min(item.from, item.to) + 0.5) / columns) * 100
                const width = self ? 100 / columns - 3 : (Math.abs(item.to - item.from) / columns) * 100
                const newPhase = i === 0 || steps[i - 1].phase !== item.phase
                return <div key={i} className="journey-row" data-state={i < index ? 'done' : i === index ? 'current' : 'next'}>
                  <span className="journey-phase-col">{newPhase && <span className={`journey-phase tone-${phaseTone[item.phase]}`}>{item.phase}</span>}</span>
                  <div className="journey-lane">
                    <button className={`journey-step tone-${stepTone(item)} ${self ? 'is-action' : item.to > item.from ? 'is-right' : 'is-left'}`} style={{ left: `${left}%`, width: `${width}%` }} aria-pressed={i === index && focus.kind === 'step'} aria-label={`Paso ${i + 1}: ${item.label}${item.message ? ` (${item.message})` : ''}`} onClick={() => { setPlaying(false); go(i, true) }}>
                      <span className="journey-label"><span className="journey-num">{i + 1}</span>{item.message && <code>{item.message}</code>}<span className="truncate">{item.label}</span></span>
                      {!self && <span className="journey-arrow" aria-hidden="true" />}
                    </button>
                  </div>
                </div>
              })}
            </div>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-muted">El tiempo avanza hacia abajo, sin escala de duración. Toca un actor para ver su papel.</p>
      </section>
    </div>

    <p className="visual-scope mt-6">Modelo didáctico con datos sintéticos (BANK_A, BANK_B, PAYMENT_SYSTEM, XXX). Muestra usos comunes de ISO 20022; el flujo, los mensajes, las versiones, los códigos y los tiempos reales los define cada esquema de pagos. No describe la implementación de ninguna institución.</p>
  </div>
}
