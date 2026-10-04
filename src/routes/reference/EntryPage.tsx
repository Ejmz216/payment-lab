import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpen, Braces, ExternalLink } from 'lucide-react'
import { getReferenceEntry, categoryLabels } from '@/content/reference/entries'
import { getMessage } from '@/lib/i18nContent'
import { SequenceDiagram, ArchitectureMap } from '@/components/reference/SequenceDiagram'
import { BookmarkButton } from '@/components/ui/BookmarkButton'
import { ReferenceIcon, referenceIdentity } from '@/components/reference/ReferenceIdentity'

export function EntryPage() {
  const { entryId = '' } = useParams()
  const entry = getReferenceEntry(entryId)
  const [view, setView] = useState('summary')
  useEffect(() => { setView('summary') }, [entryId])
  if (!entry) return <div className="ref-page py-8"><h1 className="text-xl">Referencia no encontrada</h1><Link className="mt-4 inline-block text-primary" to="/">Volver a la enciclopedia</Link></div>
  const message = entry.messageId ? getMessage(entry.messageId, 'es') : undefined
  const tabs = [{ id: 'summary', label: 'En pocas palabras' }, ...(entry.diagram || entry.architecture ? [{ id: 'flow', label: 'Diagramas' }] : []), ...(message ? [{ id: 'versions', label: 'Versiones y estructura' }] : []), { id: 'sources', label: 'Fuentes' }]
  const active = tabs.some((tab) => tab.id === view) ? view : 'summary'
  return <article className="ref-page" key={entry.id}>
    <Link to={`/?category=${entry.category}`} className="mb-5 inline-flex items-center gap-2 text-xs text-muted hover:text-camt"><ArrowLeft size={13} />{categoryLabels[entry.category]}</Link>
    <header className="reference-heading entry-heading">
      <ReferenceIcon category={entry.category} id={entry.id} />
      <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0 flex-1"><div className="ref-eyebrow text-camt">{entry.publicScheme ? 'PUBLIC SCHEME' : entry.category === 'architecture' ? 'SIMPLIFIED MODEL' : 'REFERENCIA'}</div><h1 className="mt-2 break-words text-3xl font-semibold">{entry.title}</h1><p className="mt-1 break-words text-sm text-muted">{entry.subtitle}</p></div><BookmarkButton id={`reference:${entry.id}`} /></div>
      <p className="mt-5 max-w-3xl text-base leading-7">{entry.summary}</p>
      {entry.xml && <Link to="/xml" className="mt-4 inline-flex items-center gap-2 rounded-md border border-camt/40 bg-camt/10 px-3 py-2 text-sm text-camt"><Braces size={17} />Abrir XML anotado <ArrowRight size={14} /></Link>}
    </header>
    <div role="tablist" aria-label="Secciones de la referencia" className="flex flex-wrap gap-1 border-b border-border pt-2">
      {tabs.map((tab) => <button key={tab.id} role="tab" aria-selected={active === tab.id} onClick={() => setView(tab.id)} className={`border-b-2 px-3 py-3 text-xs ${active === tab.id ? 'border-camt text-camt' : 'border-transparent text-muted hover:text-text'}`}>{tab.label}</button>)}
    </div>
    <div role="tabpanel">
      {active === 'summary' && <>
        <section className="ref-section"><dl className="grid gap-5 sm:grid-cols-2">{entry.facts.map((fact) => <div key={fact.label}><dt className="ref-eyebrow text-muted">{fact.label}</dt><dd className="mt-2 text-sm leading-6">{fact.value}</dd></div>)}</dl></section>
        {entry.analogy && <section className="ref-section analogy-section"><div className="ref-eyebrow text-party">Una analogía</div><p className="mt-2 text-sm leading-6">{entry.analogy.text}</p><p className="mt-3 border-l-2 border-party/50 pl-3 text-xs leading-5 text-muted"><strong className="text-party">Hasta dónde sirve: </strong>{entry.analogy.limit}</p></section>}
        {entry.example && <section className="ref-section"><div className="ref-eyebrow text-pacs">Ejemplo sintético</div><h2 className="mt-2 text-base font-semibold">{entry.example.title}</h2><p className="mt-2 text-sm leading-6">{entry.example.text}</p>{entry.example.outcome && <p className="mt-3 text-sm leading-6 text-muted">{entry.example.outcome}</p>}</section>}
        {entry.caution && <p className="my-5 border-l-2 border-warning pl-4 text-sm leading-6 text-muted"><strong className="text-warning">Distinción clave. </strong>{entry.caution}</p>}
        {(entry.diagram || entry.architecture) && <button className="my-3 inline-flex items-center gap-2 text-sm text-camt" onClick={() => setView('flow')}>Ver el proceso en un diagrama <ArrowRight size={14} /></button>}
      </>}
      {active === 'flow' && <><Link className={`reference-tag tone-${referenceIdentity(entry.category, entry.id).tone} mt-4`} to={`/visual?topic=${entry.id}`}>Ver en la guía visual <ArrowRight size={12} /></Link>{entry.architecture && <ArchitectureMap key={entry.id} architecture={entry.architecture} />}{entry.diagram && <SequenceDiagram key={entry.id} diagram={entry.diagram} />}</>}
      {active === 'versions' && message && <section className="ref-section"><h2 className="text-base font-semibold">Versiones incluidas en la referencia</h2><p className="mt-2 text-sm text-muted">Los árboles heredados son resúmenes educativos. La guía XML corresponde exclusivamente a pacs.008.001.10.</p><div className="mt-4 divide-y divide-border">{message.versions.map((version) => <div key={version.fullIdentifier} className="py-4"><div className="font-mono text-sm text-pacs">{version.fullIdentifier}</div><p className="mt-2 text-xs leading-5 text-muted">{version.cardinalityNotes}</p><p className="mt-1 text-xs text-muted">Revisión registrada: {version.lastReviewed}</p></div>)}</div><Link to={`/atlas/messages/${message.id}`} className="mt-4 inline-flex items-center gap-2 text-sm text-primary"><BookOpen size={16} />Explorador de estructura clásico</Link></section>}
      {active === 'sources' && <section className="ref-section"><h2 className="text-base font-semibold">Fuentes y alcance</h2><p className="mt-2 text-sm leading-6 text-muted">{entry.publicScheme ? 'Síntesis de material público del operador. Los diagramas explican roles, sin atribuir arquitectura interna.' : 'Explicación educativa. Los ejemplos y diagramas son modelos simplificados; los detalles normativos se verifican en la versión y guía de uso aplicables.'}</p>{entry.reviewed && <p className="mt-2 text-xs text-muted">Consultado: {entry.reviewed}</p>}<ul className="mt-4 space-y-3">{entry.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-primary">{source.title}<ExternalLink size={13} /></a></li>)}</ul>{!entry.sources.length && <p className="mt-4 text-xs text-warning">Síntesis didáctica del proyecto; esta ficha no documenta una implementación específica.</p>}</section>}
    </div>
    <footer className="ref-section"><h2 className="ref-eyebrow text-muted">Conectado con</h2><div className="mt-3 flex flex-wrap gap-3">{entry.related.map((id) => getReferenceEntry(id)).filter((item) => !!item).map((item) => <Link key={item.id} to={`/reference/${item.id}`} onClick={() => setView('summary')} className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">{item.title}<ArrowRight size={12} /></Link>)}</div></footer>
  </article>
}
