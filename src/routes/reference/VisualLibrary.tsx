import { ArrowRight, Network, Route } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { getReferenceEntry, type ReferenceEntry } from '@/content/reference/entries'
import { ArchitectureMap, SequenceDiagram } from '@/components/reference/SequenceDiagram'
import { ReferenceIcon, referenceIdentity } from '@/components/reference/ReferenceIdentity'

// Every topic is shown first as a sequence in time; architecture is an extra view.
const topicIds = ['fast-payments', 'payment-system', 'settlement', 'clearing', 'identifiers', 'timeouts', 'host-to-host', 'payment-web-app', 'bimpay', 'pacs.008', 'return', 'recall']
const topics = topicIds.map((id) => getReferenceEntry(id)).filter((entry): entry is ReferenceEntry => !!entry?.diagram)

export function VisualLibrary() {
  const [params, setParams] = useSearchParams()
  const topic = topics.find((entry) => entry.id === params.get('topic')) ?? topics[0]
  const hasBoth = !!topic.architecture
  const view = params.get('view') === 'architecture' && topic.architecture ? 'architecture' : 'sequence'
  function changeView(value: string) { setParams({ topic: topic.id, view: value }, { replace: true }) }

  return <div className="ref-page visual-library">
    <header className="reference-heading">
      <p className="ref-eyebrow text-camt">Conectar las ideas</p>
      <h1 className="mt-2 text-3xl font-semibold">Guía visual</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">Quién participa, qué se intercambia y en qué orden. Una vista del conjunto antes de entrar en cada detalle.</p>
    </header>
    <div className="visual-topic-grid" role="group" aria-label="Temas visuales">
      {topics.map((entry) => <button key={entry.id} aria-pressed={entry.id === topic.id} onClick={() => setParams({ topic: entry.id })} className={`visual-topic tone-${referenceIdentity(entry.category, entry.id).tone}`}>
        <ReferenceIcon category={entry.category} id={entry.id} />
        <span className="min-w-0"><strong className="block text-sm">{entry.title}</strong><span className="mt-1 block text-xs text-muted">Secuencia{entry.architecture ? ' + arquitectura' : ''}</span></span>
      </button>)}
    </div>
    <section className="visual-reader" aria-label={`Gráficos de ${topic.title}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1"><span className={`reference-tag tone-${referenceIdentity(topic.category, topic.id).tone}`}>{topic.publicScheme ? 'PUBLIC SCHEME · mapa de roles' : 'SIMPLIFIED MODEL'}</span><h2 className="guide-title mt-3">{topic.title}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{topic.plain ?? topic.summary}</p></div>
        <Link to={`/reference/${topic.id}`} className="visual-link">Leer concepto <ArrowRight size={14} /></Link>
      </div>
      {hasBoth && <div className="mt-5 flex gap-1" role="tablist" aria-label="Tipo de gráfico">
        <button role="tab" aria-selected={view === 'sequence'} className="visual-mode" onClick={() => changeView('sequence')}><Route size={15} />Secuencia</button>
        <button role="tab" aria-selected={view === 'architecture'} className="visual-mode" onClick={() => changeView('architecture')}><Network size={15} />Arquitectura</button>
      </div>}
      <div key={`${topic.id}-${view}`} role={hasBoth ? 'tabpanel' : undefined}>
        {view === 'sequence' && topic.diagram && <SequenceDiagram diagram={topic.diagram} />}
        {view === 'architecture' && topic.architecture && <ArchitectureMap architecture={topic.architecture} />}
      </div>
      <p className="visual-scope">{topic.publicScheme ? 'Relaciones públicas entre roles; no representa conexiones técnicas internas ni asigna mensajes ISO a las flechas.' : 'Modelo didáctico. El orden operativo, los mensajes y los tiempos de un sistema real dependen de su esquema.'}</p>
    </section>
    <section className="visual-next">
      <ReferenceIcon category="xml" />
      <div className="min-w-0 flex-1"><h2 className="text-sm font-semibold">Del diagrama al dato</h2><p className="mt-1 text-xs text-muted">pacs.008.001.10 · partes, agentes, identificadores e importe</p></div>
      <Link to="/reference/pacs.008?tab=xml" className="visual-link">Abrir XML <ArrowRight size={14} /></Link>
    </section>
  </div>
}
