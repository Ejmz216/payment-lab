import { lazy, Suspense } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink } from 'lucide-react'
import { getCategoryLabels, getReferenceEntry } from '@/content/reference/entries'
import { getMessage } from '@/lib/i18nContent'
import { SequenceDiagram, ArchitectureMap } from '@/components/reference/SequenceDiagram'
import { BookmarkButton } from '@/components/ui/BookmarkButton'
import { XxxNote } from '@/components/reference/XxxNote'
import { Icon3D, ReferenceIcon, type IconName } from '@/components/reference/ReferenceIdentity'
import { useL, useRefLang } from '@/i18n/reference/useLang'

// The annotated XML (sample parser + raw XML) is only fetched when its tab opens.
const XmlExplorer = lazy(() => import('@/components/reference/XmlExplorer').then((m) => ({ default: m.XmlExplorer })))

export function EntryPage() {
  const L = useL()
  const lang = useRefLang()
  const { entryId = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const entry = getReferenceEntry(entryId, lang)
  if (!entry) return <div className="ref-page py-8"><h1 className="text-xl">{L('Referencia no encontrada', 'Reference not found')}</h1><Link className="mt-4 inline-block text-primary" to="/">{L('Volver a la enciclopedia', 'Back to the encyclopedia')}</Link></div>
  const message = entry.messageId ? getMessage(entry.messageId, lang) : undefined
  const tabs: { id: string; label: string; icon: IconName }[] = [
    { id: 'summary', label: L('En pocas palabras', 'In a nutshell'), icon: 'light-bulb' },
    ...(entry.xml ? [{ id: 'xml', label: L('XML anotado', 'Annotated XML'), icon: 'page-facing-up' as const }] : []),
    ...(message ? [{ id: 'versions', label: L('Versiones y estructura', 'Versions and structure'), icon: 'card-index-dividers' as const }] : []),
    { id: 'sources', label: L('Fuentes', 'Sources'), icon: 'books' },
  ]
  // Old links to the former diagrams tab land on the summary, where diagrams now live.
  const requested = params.get('tab') ?? 'summary'
  const active = tabs.some((tab) => tab.id === requested) ? requested : 'summary'
  function setView(id: string) {
    const next = new URLSearchParams()
    if (id !== 'summary') next.set('tab', id)
    setParams(next, { replace: true })
  }
  return <article className="ref-page" key={entry.id}>
    <Link to={`/?category=${entry.category}`} className="mb-5 inline-flex items-center gap-2 text-xs text-muted hover:text-camt"><ArrowLeft size={13} />{getCategoryLabels(lang)[entry.category]}</Link>
    <header className="reference-heading entry-heading">
      <ReferenceIcon category={entry.category} id={entry.id} />
      <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0 flex-1"><div className="ref-eyebrow text-camt">{entry.publicScheme ? 'PUBLIC SCHEME' : entry.category === 'architecture' ? 'SIMPLIFIED MODEL' : L('REFERENCIA', 'REFERENCE')}</div><h1 className="mt-2 break-words text-3xl font-semibold">{entry.title}</h1><p className="mt-1 break-words text-sm text-muted">{entry.subtitle}</p></div><BookmarkButton id={`reference:${entry.id}`} /></div>
      <p className="mt-5 max-w-3xl text-base leading-7">{entry.summary}</p>
    </header>
    <div role="tablist" aria-label={L('Secciones de la referencia', 'Reference sections')} className="entry-tabs">
      {tabs.map((tab) => <button key={tab.id} id={`entry-tab-${tab.id}`} role="tab" aria-selected={active === tab.id} aria-controls="entry-panel" onClick={() => setView(tab.id)} className="entry-tab"><Icon3D name={tab.icon} size={18} />{tab.label}</button>)}
    </div>
    <div role="tabpanel" id="entry-panel" aria-labelledby={`entry-tab-${active}`}>
      {active === 'summary' && <>
        {entry.plain && <section className="plain-box"><div className="ref-eyebrow text-camt">{L('En palabras simples', 'In plain words')}</div><p className="mt-2 text-base leading-7">{entry.plain}</p></section>}
        {entry.diagram && <SequenceDiagram key={`${entry.id}-${lang}-sequence`} diagram={entry.diagram} />}
        {entry.architecture && <ArchitectureMap key={`${entry.id}-${lang}-architecture`} architecture={entry.architecture} />}
        {(entry.diagram || entry.architecture) && <p className="-mt-2 mb-2 text-[11px] text-muted">{entry.publicScheme ? L('Relaciones públicas entre roles; no asigna mensajes ISO a las flechas ni describe conexiones técnicas internas.', 'Public relationships between roles; it assigns no ISO messages to the arrows and describes no internal technical connections.') : L('Modelo simplificado. Mensajes, tiempos y responsabilidades reales dependen de cada esquema.', 'Simplified model. Real messages, timings and responsibilities depend on each scheme.')} <Link className="text-primary" to={`/visual?topic=${entry.id}`}>{L('Ver en la guía visual', 'Open in the visual guide')}</Link></p>}
        <section className="ref-section"><h2 className="ref-eyebrow text-muted">{L('Lo esencial', 'The essentials')}</h2><dl className="mt-3 grid gap-5 sm:grid-cols-2">{entry.facts.map((fact) => <div key={fact.label}><dt className="text-xs font-semibold text-text">{fact.label}</dt><dd className="mt-1.5 text-sm leading-6 text-muted">{fact.value}</dd></div>)}</dl></section>
        {entry.analogy && <section className="ref-section analogy-section"><div className="ref-eyebrow text-party">{L('Una analogía', 'An analogy')}</div><p className="mt-2 text-sm leading-6">{entry.analogy.text}</p><p className="mt-3 border-l-2 border-party/50 pl-3 text-xs leading-5 text-muted"><strong className="text-party">{L('Hasta dónde sirve: ', 'Where it stops working: ')}</strong>{entry.analogy.limit}</p></section>}
        {entry.example && <section className="ref-section"><div className="ref-eyebrow text-pacs">{L('Ejemplo sintético', 'Synthetic example')}</div><h2 className="mt-2 text-base font-semibold">{entry.example.title}</h2><p className="mt-2 text-sm leading-6">{entry.example.text}</p>{entry.example.outcome && <p className="mt-3 text-sm leading-6 text-muted">{entry.example.outcome}</p>}{entry.id !== 'currency-code' && /XXX/.test(`${entry.example.text} ${entry.example.outcome}`) && <XxxNote />}</section>}
        {entry.caution && <p className="my-5 border-l-2 border-warning pl-4 text-sm leading-6 text-muted"><strong className="text-warning">{L('Distinción clave. ', 'Key distinction. ')}</strong>{entry.caution}</p>}
        {entry.xml && <button className="my-3 inline-flex items-center gap-2 text-sm text-camt" onClick={() => setView('xml')}>{L('Leer el XML anotado', 'Read the annotated XML')} <ArrowRight size={14} /></button>}
      </>}
      {active === 'xml' && <div className="pt-5"><Suspense fallback={<p className="py-12 text-center text-sm text-muted">{L('Cargando XML anotado…', 'Loading annotated XML…')}</p>}><XmlExplorer key={`${params.get('group') ?? 'focus'}-${lang}`} initialGroup={params.get('group') ?? entry.xmlFocus} /></Suspense></div>}
      {active === 'versions' && message && <section className="ref-section"><h2 className="text-base font-semibold">{L('Versiones incluidas en la referencia', 'Versions included in the reference')}</h2><p className="mt-2 text-sm text-muted">{L('Los árboles heredados son resúmenes educativos. La guía XML corresponde exclusivamente a pacs.008.001.10.', 'The legacy trees are educational summaries. The XML guide covers pacs.008.001.10 only.')}</p><div className="mt-4 divide-y divide-border">{message.versions.map((version) => <div key={version.fullIdentifier} className="py-4"><div className="font-mono text-sm text-pacs">{version.fullIdentifier}</div><p className="mt-2 text-xs leading-5 text-muted">{version.cardinalityNotes}</p><p className="mt-1 text-xs text-muted">{L('Revisión registrada', 'Last reviewed')}: {version.lastReviewed}</p></div>)}</div><Link to={`/atlas/messages/${message.id}`} className="mt-4 inline-flex items-center gap-2 text-sm text-primary"><BookOpen size={16} />{L('Explorador de estructura clásico', 'Classic structure explorer')}</Link></section>}
      {active === 'sources' && <section className="ref-section"><h2 className="text-base font-semibold">{L('Fuentes y alcance', 'Sources and scope')}</h2><p className="mt-2 text-sm leading-6 text-muted">{entry.publicScheme ? L('Síntesis de material público del operador. Los diagramas explican roles, sin atribuir arquitectura interna.', 'Summary of the operator’s public material. The diagrams explain roles without attributing any internal architecture.') : L('Explicación educativa. Los ejemplos y diagramas son modelos simplificados; los detalles normativos se verifican en la versión y guía de uso aplicables.', 'Educational explanation. Examples and diagrams are simplified models; normative details must be checked against the applicable version and usage guide.')}</p>{entry.reviewed && <p className="mt-2 text-xs text-muted">{L('Consultado', 'Checked')}: {entry.reviewed}</p>}<ul className="mt-4 space-y-3">{entry.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-primary">{source.title}<ExternalLink size={13} /></a></li>)}</ul>{!entry.sources.length && <p className="mt-4 text-xs text-warning">{L('Síntesis didáctica del proyecto; esta ficha no documenta una implementación específica.', 'A teaching summary written for this project; this entry does not document any specific implementation.')}</p>}</section>}
    </div>
    <footer className="ref-section"><h2 className="ref-eyebrow text-muted">{L('Conectado con', 'Connected to')}</h2><div className="mt-3 flex flex-wrap gap-3">{entry.related.map((id) => getReferenceEntry(id, lang)).filter((item) => !!item).map((item) => <Link key={item.id} to={`/reference/${item.id}`} className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">{item.title}<ArrowRight size={12} /></Link>)}</div></footer>
  </article>
}
