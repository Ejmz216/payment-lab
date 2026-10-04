import { ArrowDown, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { CSSProperties } from 'react'
import { scales, scaleText } from '@/content/reference/scales'
import { ColorIcon } from './ReferenceIdentity'
import { useL, useRefLang } from '@/i18n/reference/useLang'

export function VisualOverview({ onJump }: { onJump: (scaleId: string) => void }) {
  const L = useL()
  const lang = useRefLang()
  return <section className="visual-overview" aria-label={L('De lo grande a lo pequeño', 'From big to small')}>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="ref-eyebrow text-muted">{L('De lo grande a lo pequeño', 'From big to small')}</p><h2 className="guide-title mt-1">{L('Un pago, cinco escalas', 'One payment, five scales')}</h2></div>
      <div className="flex flex-wrap gap-4"><Link to="/recorridos" className="visual-link">{L('Recorridos de un pago', 'Payment journeys')} <ArrowRight size={15} /></Link><Link to="/visual" className="visual-link">{L('Guía visual', 'Visual guide')} <ArrowRight size={15} /></Link></div>
    </div>
    <figure className="payment-illustration">
      <img src={`${import.meta.env.BASE_URL}images/payment-network.png`} width="1536" height="1024" alt={L('Ilustración conceptual de un teléfono, instituciones y un documento conectados alrededor de una red de pagos.', 'Conceptual illustration of a phone, institutions and a document connected around a payment network.')} decoding="async" />
      <figcaption>{L('Personas · instituciones · información', 'People · institutions · information')}<span>{L('Ilustración conceptual', 'Conceptual illustration')}</span></figcaption>
    </figure>
    <ol className="learning-stops" aria-label={L('Escalas de la enciclopedia', 'Encyclopedia scales')}>
      {scales.map((scale) => {
        const text = scaleText(scale, lang)
        return <li key={scale.id} className={`tone-${scale.tone}`} style={{ '--step': scale.level - 1 } as CSSProperties}>
          <button type="button" onClick={() => onJump(scale.id)} className="learning-stop">
            <ColorIcon icon={scale.icon} tone={scale.tone} />
            <span className="min-w-0"><span className="stop-number">{scale.level === 1 ? `01 · ${L('Empieza aquí', 'Start here')}` : `0${scale.level} · ${text.scale}`}</span><strong className="block text-sm font-semibold">{text.title}</strong><span className="mt-1 block text-xs text-muted">{scale.level === 1 ? text.scale : text.question}</span></span>
            <ArrowDown size={14} className="stop-arrow" />
          </button>
        </li>
      })}
    </ol>
  </section>
}
