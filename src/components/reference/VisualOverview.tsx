import { ArrowDown, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { CSSProperties } from 'react'
import { scales } from '@/content/reference/scales'
import { ColorIcon } from './ReferenceIdentity'

export function VisualOverview({ onJump }: { onJump: (scaleId: string) => void }) {
  return <section className="visual-overview" aria-label="De lo grande a lo pequeño">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="ref-eyebrow text-muted">De lo grande a lo pequeño</p><h2 className="guide-title mt-1">Un pago, cinco escalas</h2></div>
      <div className="flex flex-wrap gap-4"><Link to="/recorridos" className="visual-link">Recorridos de un pago <ArrowRight size={15} /></Link><Link to="/visual" className="visual-link">Guía visual <ArrowRight size={15} /></Link></div>
    </div>
    <figure className="payment-illustration">
      <img src={`${import.meta.env.BASE_URL}images/payment-network.png`} width="1536" height="1024" alt="Ilustración conceptual de un teléfono, instituciones y un documento conectados alrededor de una red de pagos." decoding="async" />
      <figcaption>Personas · instituciones · información<span>Ilustración conceptual</span></figcaption>
    </figure>
    <ol className="learning-stops" aria-label="Escalas de la enciclopedia">
      {scales.map((scale) => <li key={scale.id} className={`tone-${scale.tone}`} style={{ '--step': scale.level - 1 } as CSSProperties}>
        <button type="button" onClick={() => onJump(scale.id)} className="learning-stop">
          <ColorIcon icon={scale.icon} tone={scale.tone} />
          <span className="min-w-0"><span className="stop-number">{scale.level === 1 ? '01 · Empieza aquí' : `0${scale.level} · ${scale.scale}`}</span><strong className="block text-sm font-semibold">{scale.title}</strong><span className="mt-1 block text-xs text-muted">{scale.level === 1 ? scale.scale : scale.question}</span></span>
          <ArrowDown size={14} className="stop-arrow" />
        </button>
      </li>)}
    </ol>
  </section>
}
