import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronRight, Code2, Copy, Download, ExternalLink, ListTree, Search, Table2 } from 'lucide-react'
import { archiveSource } from '@/content/reference/entries'
import { normalizeQuery, parseStudyXml, type StudyField } from '@/lib/xmlStudy'
import { getXmlSample, type XmlGroup } from '@/content/reference/samples'
import { useL, useRefLang } from '@/i18n/reference/useLang'

const layerColors = { transport: 'text-party', header: 'text-pain', payment: 'text-camt' }

function inGroup(field: StudyField, group: XmlGroup) {
  if (group.layer) return field.layer === group.layer
  return group.match ? group.match.test(field.path) : true
}

// Annotated synthetic sample of an ISO 20022 message, rendered as a tab of its
// reference entry; `initialGroup` lets a concept open it on a relevant block.
export function XmlExplorer({ sampleId = 'pacs.008', initialGroup = 'all' }: { sampleId?: string; initialGroup?: string }) {
  const L = useL()
  const lang = useRefLang()
  const en = lang === 'en'
  const t = (pair: readonly [string, string]) => pair[en ? 1 : 0]
  const sample = getXmlSample(sampleId)
  const groups = sample.groups
  const { fields, lines } = useMemo(() => parseStudyXml(sample.xml, lang, sample.resolve), [sample, lang])
  const layers = new Set(fields.map((field) => field.layer))
  const layerLabels = { transport: L('Transporte', 'Transport'), header: L('Cabecera BAH', 'BAH header'), payment: `${L('Mensaje', 'Message')} ${sample.id}` }
  const layerLegend = [
    { layer: 'transport', label: L('Transporte · ejemplo', 'Transport · example'), color: 'text-party', dot: 'bg-party' },
    { layer: 'header', label: L('Cabecera · head.001', 'Header · head.001'), color: 'text-pain', dot: 'bg-pain' },
    { layer: 'payment', label: `${L('Mensaje', 'Message')} · ${sample.id}`, color: 'text-camt', dot: 'bg-camt' },
  ].filter((item) => layers.has(item.layer as StudyField['layer']))
  const [params, setParams] = useSearchParams()
  const [mode, setMode] = useState<'table' | 'xml' | 'tree'>('xml')
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState(groups.some((item) => item.id === initialGroup) ? initialGroup : 'all')
  const activeGroup = groups.find((item) => item.id === group) ?? groups[0]
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [copyState, setCopyState] = useState('')
  const surface = useRef<HTMLDivElement>(null)
  const inspector = useRef<HTMLElement>(null)
  const defaultField = fields.find((field) => field.tag === sample.defaultTag) ?? fields[0]
  const selected = fields.find((field) => field.id === params.get('field')) ?? defaultField
  const selectedElement = selected.attribute ? selected.parentId : selected.id
  const filtered = fields.filter((field) => inGroup(field, activeGroup) && (!query || normalizeQuery(`${field.path} ${field.value} ${field.note.name} ${field.note.meaning} ${field.note.note}`).includes(normalizeQuery(query))))
  const matchingIds = new Set(filtered.map((field) => field.attribute ? field.parentId : field.id))
  const selectedLine = lines.find((line) => line.fieldId === selectedElement && !line.closing)?.text ?? ''
  const attributes = fields.filter((field) => field.attribute && field.parentId === selectedElement)
  const treeFields = filtered.filter((field) => query || !Array.from(collapsed).some((id) => field.path.startsWith(`${id}/`)))

  useEffect(() => {
    const selectedButton = surface.current?.querySelector('[data-selected="true"]') as HTMLElement | null
    if (selectedButton && surface.current) {
      const bounds = selectedButton.getBoundingClientRect()
      const container = surface.current.getBoundingClientRect()
      if (bounds.top < container.top || bounds.bottom > container.bottom) surface.current.scrollTop += bounds.top - container.top - 100
    }
  }, [selected.id, mode])

  useEffect(() => { if (!copyState) return; const timer = setTimeout(() => setCopyState(''), 2500); return () => clearTimeout(timer) }, [copyState])

  function select(id: string) {
    const next = new URLSearchParams(params)
    next.set('field', id)
    setParams(next, { replace: true })
    if (window.matchMedia('(max-width: 1279px)').matches) requestAnimationFrame(() => inspector.current?.scrollIntoView({ block: 'start' }))
  }
  async function copy(text: string, success: string) {
    try { await navigator.clipboard.writeText(text); setCopyState(success) } catch { setCopyState(L('No se pudo copiar. Selecciona el texto manualmente.', 'Could not copy. Select the text manually.')) }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([sample.xml], { type: 'application/xml' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${sample.version}-${L('ejemplo-sintetico', 'synthetic-sample')}.xml`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  function toggle(id: string) { setCollapsed((old) => { const next = new Set(old); if (next.has(id)) next.delete(id); else next.add(id); return next }) }

  return <section className="xml-explorer" aria-label={`${L('XML anotado', 'Annotated XML')} ${sample.version}`}>
    <div className="xml-explorer-head">
      <div className="min-w-0">
        <div className="ref-eyebrow text-pain">{L('XML anotado · instancia sintética', 'Annotated XML · synthetic instance')}</div>
        <h2 className="mt-1 break-words font-mono text-lg font-semibold">{sample.version}</h2>
        <p className="mt-1 max-w-2xl text-xs leading-5 text-muted">{t(sample.story)}</p>
        <div className="xml-legend" aria-label={L('Capas del ejemplo', 'Sample layers')}>{layerLegend.map((item) => <span key={item.layer} className={item.color}><i className={item.dot} aria-hidden="true" />{item.label}</span>)}</div>
      </div>
      <div className="flex items-center gap-2"><button className="ref-icon" onClick={() => void copy(sample.xml, L('XML copiado', 'XML copied'))} aria-label={L('Copiar XML', 'Copy XML')} title={L('Copiar XML', 'Copy XML')}><Copy size={16} /></button><button className="ref-icon" onClick={download} aria-label={L('Descargar XML sintético', 'Download synthetic XML')} title={L('Descargar XML sintético', 'Download synthetic XML')}><Download size={16} /></button></div>
    </div>
    <div className="xml-filter" role="group" aria-labelledby="xml-filter-title">
      <div className="flex flex-wrap items-baseline justify-between gap-2"><span id="xml-filter-title" className="ref-eyebrow text-muted">{L('Ver solo una parte del mensaje', 'Show only one part of the message')}</span><span className="text-[11px] text-muted">{L('Útil para estudiar un bloque a la vez', 'Handy to study one block at a time')}</span></div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {groups.map((item) => <button key={item.id} aria-pressed={group === item.id} onClick={() => setGroup(item.id)} className="xml-chip">{t(item.label)}</button>)}
      </div>
      <p className="mt-2 text-xs leading-5 text-muted" aria-live="polite"><strong className="text-text">{t(activeGroup.label)}: </strong>{t(activeGroup.help)}</p>
    </div>
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <div className="relative min-w-0 flex-1 basis-56"><Search size={15} className="absolute left-3 top-3 text-muted" /><input aria-label={L('Buscar campo XML', 'Search XML field')} placeholder={L('Etiqueta, significado, ruta o valor…', 'Tag, meaning, path or value…')} value={query} onChange={(event) => setQuery(event.target.value)} className="ref-input pl-9" /></div>
      <div role="tablist" aria-label={L('Vista del XML', 'XML view')} className="flex rounded-md border border-border p-1">
        {([{ id: 'xml', label: 'XML', icon: Code2 }, { id: 'tree', label: L('Árbol', 'Tree'), icon: ListTree }, { id: 'table', label: L('Tabla', 'Table'), icon: Table2 }] as const).map((tab) => <button role="tab" aria-selected={mode === tab.id} key={tab.id} onClick={() => setMode(tab.id)} className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs ${mode === tab.id ? 'bg-camt/15 text-camt' : 'text-muted hover:text-text'}`}><tab.icon size={14} />{tab.label}</button>)}
      </div>
    </div>
    <p className="my-3 text-[11px] text-muted">{filtered.length} {L('elementos y atributos de la muestra · no es el catálogo completo de campos ni un validador XSD', 'elements and attributes in the sample · not the full field catalogue nor an XSD validator')}</p>
    <div className="xml-workspace grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_21rem]">
      <div ref={surface} className="max-h-[65vh] min-w-0 overflow-auto rounded-md border border-border bg-surface/60" role="tabpanel" aria-label={L('Contenido XML', 'XML content')}>
        {mode === 'table' && <table className="w-full table-fixed text-left text-xs"><colgroup><col className="w-[38%]" /><col className="w-[62%]" /></colgroup><thead className="sticky top-0 z-10 bg-surface text-muted"><tr><th className="p-3 font-medium">{L('Campo / valor', 'Field / value')}</th><th className="p-3 font-medium">{L('Significado', 'Meaning')}</th></tr></thead><tbody>
          {filtered.map((field) => <tr key={field.id} className={`border-t border-border ${selected.id === field.id ? 'bg-camt/10' : 'hover:bg-surface2'}`} data-selected={selected.id === field.id}>
            <td className="p-3 align-top"><button onClick={() => select(field.id)} aria-label={`${L('Inspeccionar', 'Inspect')} ${field.path}`} className={`max-w-full text-left font-mono text-xs font-semibold break-all ${layerColors[field.layer]}`}>{field.tag}</button><div className="mt-1 break-all text-[11px] text-muted">{field.value || L('Bloque', 'Block')}</div><div className="mt-1 break-all text-[10px] text-muted/70">{field.parentId?.split('/').slice(-2).join('/') || L('Raíz', 'Root')}</div></td>
            <td className="p-3 align-top"><button onClick={() => select(field.id)} className="text-left text-xs leading-5">{field.note.meaning}</button></td>
          </tr>)}
        </tbody></table>}
        {mode === 'xml' && <div className="min-w-max py-2 font-mono text-xs leading-6">{lines.map((line, index) => {
          const field = fields.find((item) => item.id === line.fieldId)!
          if ((query || group !== 'all') && !matchingIds.has(line.fieldId)) return null
          return <button key={index} onClick={() => select(line.fieldId)} data-selected={selectedElement === line.fieldId && !line.closing} aria-label={`${L('Línea', 'Line')} ${index + 1}: ${line.text}`} className={`flex w-full pr-6 text-left ${selectedElement === line.fieldId ? 'bg-camt/15' : 'hover:bg-surface2'}`}><span className="sticky left-0 w-10 shrink-0 bg-surface px-2 text-right text-muted/60">{index + 1}</span><code style={{ paddingLeft: line.depth * 16 + 8 }} className={layerColors[field.layer]}>{line.text}</code></button>
        })}</div>}
        {mode === 'tree' && <div className="py-2">{treeFields.map((field) => <div key={field.id} data-selected={field.id === selected.id} className={`flex items-center gap-1 py-1 pr-3 ${selected.id === field.id ? 'bg-camt/10' : ''}`} style={{ paddingLeft: Math.min(field.depth, 6) * 14 + 8 }}>
          {field.container ? <button onClick={() => toggle(field.id)} aria-expanded={!collapsed.has(field.id)} aria-label={`${collapsed.has(field.id) ? L('Expandir', 'Expand') : L('Contraer', 'Collapse')} ${field.path}`} className="p-1 text-muted">{collapsed.has(field.id) ? <ChevronRight size={13} /> : <ChevronDown size={13} />}</button> : <span className="w-[21px] shrink-0" />}
          <button onClick={() => select(field.id)} className="min-w-0 py-1 text-left"><span className={`font-mono text-xs break-all ${layerColors[field.layer]}`}>{field.tag}</span><span className="ml-2 break-all text-[11px] text-muted">{field.value || field.note.name}</span></button>
        </div>)}</div>}
        {!filtered.length && <div className="p-8 text-center text-sm text-muted">{L('Sin campos para este filtro.', 'No fields for this filter.')}<button className="mt-2 block w-full text-camt" onClick={() => { setGroup('all'); setQuery('') }}>{L('Restablecer filtros', 'Reset filters')}</button></div>}
      </div>
      <aside ref={inspector} className="min-w-0 rounded-md border border-border bg-surface px-4 py-5 xl:sticky xl:top-4" aria-label={L('Detalle del campo', 'Field detail')}>
        <button onClick={() => surface.current?.scrollIntoView({ block: 'start' })} className="mb-4 flex items-center gap-2 text-xs text-primary xl:hidden"><ArrowLeft size={13} />{L('Volver al XML', 'Back to the XML')}</button>
        <div className={`ref-eyebrow ${layerColors[selected.layer]}`}>{layerLabels[selected.layer]} · {selected.attribute ? L('ATRIBUTO', 'ATTRIBUTE') : selected.container ? L('BLOQUE', 'BLOCK') : L('ELEMENTO', 'ELEMENT')}</div>
        <h2 className="mt-2 break-all font-mono text-lg font-semibold">{selected.tag}</h2><p className="mt-1 text-xs text-muted">{selected.note.name}</p>
        {selectedLine && <div className="mt-4"><div className="ref-eyebrow text-muted">{L('En el XML', 'In the XML')}</div><code className="xml-line mt-2">{selectedLine}</code></div>}
        <div className="mt-4"><div className="ref-eyebrow text-camt">{L('Qué es', 'What it is')}</div><p className="mt-1.5 text-sm leading-6">{selected.note.explain ?? selected.note.meaning}</p>{selected.note.explain && <p className="mt-2 text-xs leading-5 text-muted">{selected.note.meaning}</p>}</div>
        {selected.note.parts && <div className="mt-4"><div className="ref-eyebrow text-pacs">{L('Cómo leerlo', 'How to read it')}</div><dl className="xml-parts mt-2">{selected.note.parts.map((part) => <div key={part.label}><dt>{part.label}</dt><dd>{part.text}</dd></div>)}</dl></div>}
        {selected.value && <div className="mt-4 border-y border-border py-3"><div className="ref-eyebrow text-muted">{L('Valor en la muestra', 'Value in the sample')}</div><div className="mt-2 break-all font-mono text-xs text-camt">{selected.value}</div></div>}
        {selected.note.equivalent && <div className="mt-4"><div className="ref-eyebrow text-pain">{L('Dicho de otra forma', 'In other words')}</div><blockquote className="xml-equivalent mt-2">{selected.note.equivalent}</blockquote></div>}
        {attributes.length > 0 && !selected.attribute && <div className="mt-4"><div className="ref-eyebrow text-muted">{L('Atributos de esta etiqueta', 'Attributes of this tag')}</div>{attributes.map((field) => <button key={field.id} onClick={() => select(field.id)} className="xml-attribute"><code><span className="text-pain">{field.tag.slice(1)}</span>="{field.value}"</code><span className="mt-1 block text-xs leading-5 text-muted">{field.note.meaning}</span><span className="mt-1 inline-flex items-center gap-1 text-[11px] text-primary">{L('Ver explicación completa', 'See full explanation')} <ArrowRight size={11} /></span></button>)}</div>}
        <div className="mt-4 rounded-md border-l-2 border-warning bg-warning/5 py-2 pl-3 pr-2"><div className="ref-eyebrow text-warning">{L('Ojo', 'Watch out')}</div><p className="mt-1 text-xs leading-6">{selected.note.note}</p></div>
        <div className="mt-4 border-t border-border pt-3"><div className="flex items-center justify-between"><span className="ref-eyebrow text-muted">{L('Ruta estructural', 'Structural path')}</span><button className="ref-icon" aria-label={L('Copiar ruta', 'Copy path')} title={L('Copiar ruta', 'Copy path')} onClick={() => void copy(selected.path, L('Ruta copiada', 'Path copied'))}><Copy size={13} /></button></div><code className="mt-2 block break-all text-[11px] leading-5 text-muted">{selected.path}</code></div>
        <details className="mt-4 text-xs"><summary className="cursor-pointer text-muted">{L('Namespace y contexto XML', 'Namespace and XML context')}</summary><code className="mt-2 block break-all text-[11px]">{selected.namespace || L('(atributo sin namespace)', '(attribute without namespace)')}</code><p className="mt-2 leading-5 text-muted">{L('Ruta por nombres locales para lectura. Una consulta XPath debe resolver los namespaces del documento.', 'Path by local names, for reading. An XPath query must resolve the document namespaces.')}</p></details>
        {selected.note.concept && <Link to={`/reference/${selected.note.concept}`} className="mt-5 inline-flex items-center gap-2 text-xs text-primary">{L('Ver concepto relacionado', 'See related entry')} <ArrowRight size={12} /></Link>}
      </aside>
    </div>
    <div className="min-h-7 pt-2 text-xs text-camt" role="status">{copyState && <span className="inline-flex items-center gap-1"><Check size={12} />{copyState}</span>}</div>
    <details className="ref-section text-xs"><summary className="cursor-pointer font-semibold text-muted">{L('Alcance y procedencia de la guía', 'Scope and origin of the guide')}</summary>{sample.id === 'pacs.008' ? <p className="mt-3 max-w-3xl leading-6 text-muted">{L('Adaptación de la guía de estudio pacs.008.001.10 proporcionada por el usuario. Se conserva su estructura y se sustituyen nombres, referencias, cuentas y moneda por datos sintéticos. Las notas explican esta instancia; no afirman cardinalidades completas ni validación contra el XSD. La guía no determina qué mensajes ni códigos utiliza una institución real.', 'Adapted from a pacs.008.001.10 study guide provided by the user. Its structure is kept, while names, references, accounts and currency are replaced with synthetic data. The notes explain this instance; they do not claim full cardinalities or validation against the XSD. The guide does not determine which messages or codes a real institution uses.')}</p> : <p className="mt-3 max-w-3xl leading-6 text-muted">{L(`Instancia sintética construida para esta aula con la estructura de ${sample.version}. Los nombres, el orden y los elementos obligatorios se comprobaron contra definiciones generadas del XSD oficial, y los códigos contra las listas externas de ISO 20022. Usa datos ficticios (BANK_A, BANK_B, XXX) y no refleja las reglas de ningún esquema concreto: cada esquema elige la versión, los campos y los códigos que usa.`, `Synthetic instance built for this classroom with the ${sample.version} structure. Names, order and mandatory elements were checked against definitions generated from the official XSD, and codes against the ISO 20022 external code lists. It uses fictitious data (BANK_A, BANK_B, XXX) and reflects no specific scheme’s rules: each scheme chooses the version, fields and codes it uses.`)}</p>}<a className="mt-3 inline-flex items-center gap-1 text-primary" href={archiveSource.url} target="_blank" rel="noreferrer">{L(archiveSource.title, 'ISO 20022 · version archive')}<ExternalLink size={12} /></a></details>
  </section>
}
