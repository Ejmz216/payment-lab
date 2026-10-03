import { useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ReferenceEntry } from '@/content/reference/entries'

export function SequenceDiagram({ diagram }: { diagram: NonNullable<ReferenceEntry['diagram']> }) {
  const [selected, setSelected] = useState(0)
  const current = diagram.steps[selected]
  const columns = diagram.actors.length
  return (
    <section className="ref-section" aria-label={diagram.title}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-base font-semibold">{diagram.title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">{selected + 1} / {diagram.steps.length}</span>
          <button className="ref-icon" title="Paso anterior" aria-label="Paso anterior" disabled={!selected} onClick={() => setSelected((s) => s - 1)}><ChevronLeft size={16} /></button>
          <button className="ref-icon" title="Paso siguiente" aria-label="Paso siguiente" disabled={selected === diagram.steps.length - 1} onClick={() => setSelected((s) => s + 1)}><ChevronRight size={16} /></button>
          <button className="ref-icon" title="Volver al inicio" aria-label="Volver al inicio" onClick={() => setSelected(0)}><RotateCcw size={14} /></button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-md border border-border bg-surface/50">
        <div className="relative px-4 pb-4" style={{ minWidth: Math.max(470, columns * 145) }}>
          <div className="grid relative z-10 gap-4 bg-surface py-4 text-center" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {diagram.actors.map((actor, i) => <div key={actor} className={`text-xs font-semibold ${i === 0 ? 'text-party' : i === columns - 1 ? 'text-camt' : 'text-pacs'}`}>{actor}</div>)}
          </div>
          <div className="absolute inset-x-4 bottom-4 top-14 grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }} aria-hidden="true">
            {diagram.actors.map((actor) => <div key={actor} className="mx-auto border-l border-dashed border-muted/40" />)}
          </div>
          {diagram.steps.map((step, i) => {
            const left = ((Math.min(step.from, step.to) + 0.5) / columns) * 100
            const width = (Math.abs(step.to - step.from) / columns) * 100
            return <div key={`${step.label}-${i}`} className="relative h-[76px]">
              <button aria-label={`Paso ${i + 1}: ${step.label}`} aria-pressed={selected === i} onClick={() => setSelected(i)} className={`absolute top-1 flex h-16 flex-col items-center justify-center gap-1 px-1 text-xs transition-colors ${selected === i ? 'text-camt' : 'text-muted hover:text-text'}`} style={{ left: `${left}%`, width: `${width}%` }}>
                <span className={`relative z-10 max-w-full rounded px-2 py-1 text-center ${selected === i ? 'bg-camt/10 font-semibold' : 'bg-surface'}`}>{i + 1}. {step.label}</span>
                <span className={`relative block w-full border-t-2 ${selected === i ? 'border-camt' : 'border-muted/60'}`}>
                  {step.to > step.from ? <ArrowRight className="absolute -right-1 -top-[9px]" size={16} /> : <ArrowLeft className="absolute -left-1 -top-[9px]" size={16} />}
                </span>
              </button>
            </div>
          })}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1 text-[11px] text-muted"><ArrowDown size={12} /> Tiempo relativo · sin escala de duración</div>
      <div className="mt-4 min-h-24 border-l-2 border-camt pl-4" aria-live="polite">
        <div className="text-sm font-semibold">{current.label}</div>
        <p className="mt-1 text-sm leading-relaxed text-muted">{current.detail}</p>
        {current.entry && <Link to={`/reference/${current.entry}`} className="mt-2 inline-flex items-center gap-1 text-xs text-primary">Abrir {current.entry}<ArrowRight size={12} /></Link>}
      </div>
    </section>
  )
}

export function ArchitectureMap({ architecture }: { architecture: NonNullable<ReferenceEntry['architecture']> }) {
  const [selected, setSelected] = useState(0)
  return <section className="ref-section">
    <h2 className="mb-4 text-base font-semibold">{architecture.title}</h2>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {architecture.nodes.map((node, i) => <button key={node.label} onClick={() => setSelected(i)} aria-pressed={selected === i} className={`relative flex min-h-24 items-start gap-3 rounded-md border p-4 text-left ${selected === i ? 'border-camt bg-camt/5' : 'border-border bg-surface/60 hover:border-muted'}`}>
        <span className="mt-0.5 font-mono text-xs text-camt">0{i + 1}</span><span className="min-w-0"><span className="block text-sm font-semibold">{node.label}</span><span className="mt-1 block text-xs text-muted">{node.role}</span></span>
        {i < architecture.nodes.length - 1 && <ArrowRight size={13} className="ml-auto shrink-0 text-muted" />}
      </button>)}
    </div>
    <p className="mt-3 text-xs text-muted" aria-live="polite">{architecture.nodes[selected].label}: {architecture.nodes[selected].role}.</p>
  </section>
}
