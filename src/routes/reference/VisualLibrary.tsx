import { ArrowRight, Network, Route } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { getReferenceEntry, type ReferenceEntry } from '@/content/reference/entries'
import { ArchitectureMap, SequenceDiagram } from '@/components/reference/SequenceDiagram'
import { ReferenceIcon, referenceIdentity } from '@/components/reference/ReferenceIdentity'
import { useL, useRefLang } from '@/i18n/reference/useLang'

// Every topic is shown first as a sequence in time; architecture is an extra view.
const topicIds = ['fast-payments', 'payment-system', 'settlement', 'clearing', 'identifiers', 'timeouts', 'host-to-host', 'payment-web-app', 'bimpay', 'pacs.008', 'return', 'recall']

export function VisualLibrary() {
  const L = useL()
  const lang = useRefLang()
  const topics = topicIds.map((id) => getReferenceEntry(id, lang)).filter((entry): entry is ReferenceEntry => !!entry?.diagram)
  const [params, setParams] = useSearchParams()
  const topic = topics.find((entry) => entry.id === params.get('topic')) ?? topics[0]
  const hasBoth = !!topic.architecture
  const view = params.get('view') === 'architecture' && topic.architecture ? 'architecture' : 'sequence'
  function changeView(value: string) { setParams({ topic: topic.id, view: value }, { replace: true }) }

  return <div className="ref-page visual-library">
    <header className="reference-heading">
      <p className="ref-eyebrow text-camt">{L('Conectar las ideas', 'Connecting the ideas')}</p>
      <h1 className="mt-2 text-3xl font-semibold">{L('Guía visual', 'Visual guide')}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{L('Quién participa, qué se intercambia y en qué orden. Una vista del conjunto antes de entrar en cada detalle.', 'Who takes part, what is exchanged and in which order. The big picture before going into each detail.')}</p>
    </header>
    <div className="visual-topic-grid" role="group" aria-label={L('Temas visuales', 'Visual topics')}>
      {topics.map((entry) => <button key={entry.id} aria-pressed={entry.id === topic.id} onClick={() => setParams({ topic: entry.id })} className={`visual-topic tone-${referenceIdentity(entry.category, entry.id).tone}`}>
        <ReferenceIcon category={entry.category} id={entry.id} />
        <span className="min-w-0"><strong className="block text-sm">{entry.title}</strong><span className="mt-1 block text-xs text-muted">{L('Secuencia', 'Sequence')}{entry.architecture ? L(' + arquitectura', ' + architecture') : ''}</span></span>
      </button>)}
    </div>
    <section className="visual-reader" aria-label={L(`Gráficos de ${topic.title}`, `Diagrams for ${topic.title}`)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1"><span className={`reference-tag tone-${referenceIdentity(topic.category, topic.id).tone}`}>{topic.publicScheme ? L('PUBLIC SCHEME · mapa de roles', 'PUBLIC SCHEME · role map') : 'SIMPLIFIED MODEL'}</span><h2 className="guide-title mt-3">{topic.title}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{topic.plain ?? topic.summary}</p></div>
        <Link to={`/reference/${topic.id}`} className="visual-link">{L('Leer concepto', 'Read the entry')} <ArrowRight size={14} /></Link>
      </div>
      {hasBoth && <div className="mt-5 flex gap-1" role="tablist" aria-label={L('Tipo de gráfico', 'Diagram type')}>
        <button role="tab" aria-selected={view === 'sequence'} className="visual-mode" onClick={() => changeView('sequence')}><Route size={15} />{L('Secuencia', 'Sequence')}</button>
        <button role="tab" aria-selected={view === 'architecture'} className="visual-mode" onClick={() => changeView('architecture')}><Network size={15} />{L('Arquitectura', 'Architecture')}</button>
      </div>}
      <div key={`${topic.id}-${view}-${lang}`} role={hasBoth ? 'tabpanel' : undefined}>
        {view === 'sequence' && topic.diagram && <SequenceDiagram diagram={topic.diagram} />}
        {view === 'architecture' && topic.architecture && <ArchitectureMap architecture={topic.architecture} />}
      </div>
      <p className="visual-scope">{topic.publicScheme ? L('Relaciones públicas entre roles; no representa conexiones técnicas internas ni asigna mensajes ISO a las flechas.', 'Public relationships between roles; it shows no internal technical connections and assigns no ISO messages to the arrows.') : L('Modelo didáctico. El orden operativo, los mensajes y los tiempos de un sistema real dependen de su esquema.', 'Teaching model. The operating order, messages and timings of a real system depend on its scheme.')}</p>
    </section>
    <section className="visual-next">
      <ReferenceIcon category="concepts" id="fast-payments" />
      <div className="min-w-0 flex-1"><h2 className="text-sm font-semibold">{L('Un pago completo, de punta a punta', 'A complete payment, end to end')}</h2><p className="mt-1 text-xs text-muted">{L('Recorridos: el cliente, los dos bancos y el sistema, con todos los mensajes y qué pasa si algo falla', 'Journeys: the customer, both banks and the system, with every message and what happens if something fails')}</p></div>
      <Link to="/recorridos" className="visual-link">{L('Abrir recorridos', 'Open journeys')} <ArrowRight size={14} /></Link>
    </section>
    <section className="visual-next">
      <ReferenceIcon category="xml" />
      <div className="min-w-0 flex-1"><h2 className="text-sm font-semibold">{L('Del diagrama al dato', 'From the diagram to the data')}</h2><p className="mt-1 text-xs text-muted">{L('pacs.008.001.10 · partes, agentes, identificadores e importe', 'pacs.008.001.10 · parties, agents, identifiers and amount')}</p></div>
      <Link to="/reference/pacs.008?tab=xml" className="visual-link">{L('Abrir XML', 'Open XML')} <ArrowRight size={14} /></Link>
    </section>
  </div>
}
