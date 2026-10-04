import { ArrowRight, Blocks, FileCode2, Mails, Route } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ColorIcon, type ReferenceTone } from './ReferenceIdentity'

const steps = [
  { title: 'Entender el sistema', question: '¿Cómo viaja un pago?', to: '/reference/fast-payments', icon: Route, tone: 'coral' },
  { title: 'Conectar las piezas', question: '¿Qué hace cada sistema?', to: '/reference/payment-web-app', icon: Blocks, tone: 'violet' },
  { title: 'Leer el mensaje', question: '¿Qué se están diciendo?', to: '/reference/pacs.008', icon: Mails, tone: 'blue' },
  { title: 'Explorar el XML', question: '¿Qué significa este dato?', to: '/xml', icon: FileCode2, tone: 'mint' },
] as const

export function VisualOverview() {
  return <section className="visual-overview" aria-label="Del sistema al campo">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="ref-eyebrow text-muted">De lo general al detalle</p><h2 className="guide-title mt-1">Un pago, cuatro miradas</h2></div>
      <Link to="/visual" className="visual-link">Guía visual <ArrowRight size={15} /></Link>
    </div>
    <figure className="payment-illustration">
      <img src={`${import.meta.env.BASE_URL}images/payment-network.png`} width="1536" height="1024" alt="Ilustración conceptual de un teléfono, instituciones y un documento conectados alrededor de una red de pagos." decoding="async" />
      <figcaption>Personas · instituciones · información<span>Ilustración conceptual</span></figcaption>
    </figure>
    <ol className="learning-stops">
      {steps.map((step, index) => <li key={step.to} className={`tone-${step.tone}`}>
        <Link to={step.to} className="learning-stop">
          <ColorIcon icon={step.icon} tone={step.tone as ReferenceTone} />
          <span className="min-w-0"><span className="stop-number">{index === 0 ? '01 · Empieza aquí' : `0${index + 1}`}</span><strong className="block text-sm font-semibold">{step.title}</strong><span className="mt-1 block text-xs text-muted">{step.question}</span></span>
          <ArrowRight size={14} className="stop-arrow" />
        </Link>
      </li>)}
    </ol>
  </section>
}
