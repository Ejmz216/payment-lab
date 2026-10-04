import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react'
import { journeyActors as actorsEs, journeys as journeysEs, phaseTone, type JourneyStep } from '@/content/reference/journeys'
import { journeyText } from '@/i18n/reference/journeysEn'
import { useL, useRefLang } from '@/i18n/reference/useLang'
import { getReferenceEntry } from '@/content/reference/entries'
import { ColorIcon, Icon3D, familyTones, type ReferenceTone } from '@/components/reference/ReferenceIdentity'
import { portrait } from '@/components/reference/SequenceDiagram'
import { XxxNote } from '@/components/reference/XxxNote'

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
  const L = useL()
  const lang = useRefLang()
  const T = (text: string) => journeyText(text, lang)
  // Journeys and actors in the chosen language (phase stays as a key for colors).
  const journeys = useMemo(() => journeysEs.map((item) => ({ ...item, title: journeyText(item.title, lang), kind: journeyText(item.kind, lang), summary: journeyText(item.summary, lang), takeaway: journeyText(item.takeaway, lang), steps: item.steps.map((step) => ({ ...step, label: journeyText(step.label, lang), detail: journeyText(step.detail, lang), money: journeyText(step.money, lang), status: journeyText(step.status, lang) })) })), [lang])
  const journeyActors = useMemo(() => actorsEs.map((item) => ({ ...item, title: journeyText(item.title, lang), does: journeyText(item.does, lang) })), [lang])
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

  const messageEntry = step.message ? getReferenceEntry(step.message, lang) : undefined
  const actorIndex = focus.kind === 'actor' ? focus.actor : -1
  const actor = actorIndex >= 0 ? journeyActors[actorIndex] : undefined
  const columns = journeyActors.length

  return <div className="ref-page journeys">
    <header className="reference-heading">
      <p className="ref-eyebrow text-camt">{L('Recorridos', 'Journeys')} · SIMPLIFIED MODEL</p>
      <h1 className="mt-2 text-3xl font-semibold">{L('Un pago de punta a punta', 'A payment end to end')}</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{L('Sigue una transacción completa en el tiempo, del cliente que paga al cliente que cobra. Elige un escenario, avanza paso a paso y toca cualquier mensaje o actor para ver qué está pasando y qué viaja en el XML.', 'Follow a complete transaction over time, from the customer who pays to the customer who gets paid. Pick a scenario, go step by step and tap any message or actor to see what is happening and what travels in the XML.')}</p>
    </header>

    <div className="journey-picker" role="group" aria-label={L('Escenarios', 'Scenarios')}>
      {journeys.map((item) => <button key={item.id} aria-pressed={item.id === journey.id} onClick={() => setParams({ scenario: item.id }, { replace: true })} className={`journey-option tone-${item.tone}`}>
        <ColorIcon icon={item.icon} tone={item.tone} small />
        <span className="min-w-0"><strong className="block text-sm leading-5">{item.title}</strong><span className="block text-[11px] text-muted">{item.kind} · {item.steps.length} {L('pasos', 'steps')}</span></span>
      </button>)}
    </div>

    <section className={`journey-intro tone-${journey.tone}`}>
      <p className="text-sm leading-6">{journey.summary}</p>
      <p className="journey-takeaway"><Icon3D name="light-bulb" size={16} />{journey.takeaway}</p>
      <XxxNote />
    </section>

    <div className="journey-layout">
      <aside ref={panel} className="journey-panel" aria-label={L('Detalle', 'Detail')} aria-live="polite">
        {actor ? <>
          <button className="mb-3 inline-flex items-center gap-1.5 text-xs text-primary" onClick={() => setFocus({ kind: 'step' })}><ArrowLeft size={13} />{L('Volver al paso', 'Back to step')} {index + 1}</button>
          <div className="flex items-center gap-3"><ColorIcon {...portrait(actor.role)} /><div className="min-w-0"><p className="ref-eyebrow text-muted">{actor.title}</p><h2 className="mt-1 font-mono text-lg font-semibold">{actor.label}</h2></div></div>
          <p className="mt-4 text-sm leading-6">{actor.does}</p>
          <div className="mt-4"><p className="ref-eyebrow text-muted">{L('En este recorrido', 'In this journey')}</p>
            <div className="mt-2 flex flex-col gap-1">{steps.map((item, i) => (item.from === actorIndex || item.to === actorIndex) && <button key={i} onClick={() => go(i)} className="journey-mini"><span className="font-mono text-[10px] text-muted">{String(i + 1).padStart(2, '0')}</span><span className="min-w-0 flex-1 truncate">{item.label}</span>{item.message && <code className={`tone-text tone-${stepTone(item)}`}>{item.message}</code>}</button>)}</div>
          </div>
          <Link to={`/reference/${actor.entry}`} className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary">{L('Leer el concepto', 'Read the entry')} <ArrowRight size={12} /></Link>
        </> : <>
          <p className={`ref-eyebrow tone-text tone-${phaseTone[step.phase]}`}>{L('Paso', 'Step')} {index + 1} {L('de', 'of')} {steps.length} · {T(step.phase)}</p>
          <h2 className="mt-1.5 text-lg font-semibold">{step.label}</h2>
          <p className="mt-1 font-mono text-[11px] text-muted">{journeyActors[step.from].label}{step.from === step.to ? ` · ${L('acción interna', 'internal action')}` : ` → ${journeyActors[step.to].label}`}</p>
          <div className="mt-4"><p className="ref-eyebrow text-camt">{L('Qué está pasando', 'What is happening')}</p><p className="mt-1.5 text-sm leading-6">{step.detail}</p></div>
          <dl className="journey-states">
            <div><dt>{L('Dinero', 'Money')}</dt><dd>{step.money}</dd></div>
            <div><dt>{L('Estado del pago', 'Payment status')}</dt><dd>{step.status}</dd></div>
          </dl>
          {step.message && <div className={`journey-message tone-${stepTone(step)}`}>
            <div className="flex items-center gap-2"><code className="tone-text text-sm font-semibold">{step.message}</code>{messageEntry && <span className="truncate text-[11px] text-muted">{messageEntry.subtitle}</span>}</div>
            {messageEntry && <p className="mt-2 text-xs leading-5">{messageEntry.plain ?? messageEntry.summary}</p>}
            {messageEntry && <Link to={`/reference/${messageEntry.id}`} className="mt-2 inline-flex items-center gap-1 text-[11px] text-primary">{L(`Abrir ${step.message} en la enciclopedia`, `Open ${step.message} in the encyclopedia`)} <ArrowRight size={11} /></Link>}
          </div>}
          {step.xml && <details className="mt-4" open>
            <summary className="cursor-pointer ref-eyebrow text-pain">{L('El mensaje en este momento', 'The message at this moment')}</summary>
            <XmlSnippet xml={step.xml} />
            <p className="mt-1.5 text-[10px] leading-4 text-muted">{L('Fragmento simplificado y sintético: solo los campos clave. Las versiones y códigos son ilustrativos; cada esquema define los suyos.', 'Simplified, synthetic fragment: key fields only. Versions and codes are illustrative; each scheme defines its own.')}</p>
          </details>}
          {step.message === 'pacs.008' && <Link to="/reference/pacs.008?tab=xml" className="mt-3 inline-flex items-center gap-1 text-[11px] text-primary">{L('Ver el pacs.008 completo anotado', 'See the full annotated pacs.008')} <ArrowRight size={11} /></Link>}
          <div className="mt-5 flex gap-2"><button className="ref-icon" aria-label={L('Paso anterior', 'Previous step')} title={L('Paso anterior', 'Previous step')} disabled={!index} onClick={() => go(index - 1)}><ChevronLeft size={16} /></button><button className="ref-icon" aria-label={L('Paso siguiente', 'Next step')} title={L('Paso siguiente', 'Next step')} disabled={index === steps.length - 1} onClick={() => go(index + 1)}><ChevronRight size={16} /></button></div>
        </>}
      </aside>

      <section className="journey-stage" aria-label={`${L('Línea de tiempo', 'Timeline')}: ${journey.title}`}>
        <div className="journey-controls">
          <div className="flex items-center gap-2">
            <button className="ref-icon" aria-label={L('Paso anterior', 'Previous step')} title={L('Paso anterior', 'Previous step')} disabled={!index} onClick={() => go(index - 1)}><ChevronLeft size={16} /></button>
            <button className="journey-play" onClick={() => { if (index >= steps.length - 1) setIndex(0); setFocus({ kind: 'step' }); setPlaying((value) => !value) }} aria-pressed={playing}>{playing ? <Pause size={14} /> : <Play size={14} />}{playing ? L('Pausar', 'Pause') : L('Reproducir', 'Play')}</button>
            <button className="ref-icon" aria-label={L('Paso siguiente', 'Next step')} title={L('Paso siguiente', 'Next step')} disabled={index === steps.length - 1} onClick={() => go(index + 1)}><ChevronRight size={16} /></button>
            <button className="ref-icon" aria-label={L('Volver al inicio', 'Back to start')} title={L('Volver al inicio', 'Back to start')} onClick={() => { setPlaying(false); go(0) }}><RotateCcw size={14} /></button>
          </div>
          <div className="journey-progress" aria-hidden="true"><span style={{ width: `${((index + 1) / steps.length) * 100}%` }} /></div>
        </div>
        <div className="journey-track">
          <span><em>{L('Dinero', 'Money')}</em>{step.money}</span>
          <span><em>{L('Pago', 'Payment')}</em>{step.status}</span>
        </div>

        <div className="journey-scroll" tabIndex={0} onKeyDown={onKey} aria-label={L('Diagrama de secuencia. Usa las flechas del teclado para avanzar.', 'Sequence diagram. Use the arrow keys to move forward.')}>
          <div className="journey-grid" style={{ '--cols': columns } as CSSProperties}>
            <div className="journey-head">
              <span className="journey-phase-col ref-eyebrow text-muted">{L('Fase', 'Phase')}</span>
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
                  <span className="journey-phase-col">{newPhase && <span className={`journey-phase tone-${phaseTone[item.phase]}`}>{T(item.phase)}</span>}</span>
                  <div className="journey-lane">
                    <button className={`journey-step tone-${stepTone(item)} ${self ? 'is-action' : item.to > item.from ? 'is-right' : 'is-left'}`} style={{ left: `${left}%`, width: `${width}%` }} aria-pressed={i === index && focus.kind === 'step'} aria-label={`${L('Paso', 'Step')} ${i + 1}: ${item.label}${item.message ? ` (${item.message})` : ''}`} onClick={() => { setPlaying(false); go(i, true) }}>
                      <span className="journey-label"><span className="journey-num">{i + 1}</span>{item.message && <code>{item.message}</code>}<span className="truncate">{item.label}</span></span>
                      {!self && <span className="journey-arrow" aria-hidden="true" />}
                    </button>
                  </div>
                </div>
              })}
            </div>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-muted">{L('El tiempo avanza hacia abajo, sin escala de duración. Toca un actor para ver su papel.', 'Time flows downwards, not to scale. Tap an actor to see its role.')}</p>
      </section>
    </div>

    <p className="visual-scope mt-6">{L('Modelo didáctico con datos sintéticos (BANK_A, BANK_B, PAYMENT_SYSTEM, XXX). Muestra usos comunes de ISO 20022; el flujo, los mensajes, las versiones, los códigos y los tiempos reales los define cada esquema de pagos. No describe la implementación de ninguna institución.', 'Teaching model with synthetic data (BANK_A, BANK_B, PAYMENT_SYSTEM, XXX). It shows common ISO 20022 usages; the real flow, messages, versions, codes and timings are defined by each payment scheme. It does not describe any institution’s implementation.')}</p>
  </div>
}
