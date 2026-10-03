import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronRight, Code2, Copy, Download, ExternalLink, ListTree, Search, Table2 } from 'lucide-react'
import { archiveSource } from '@/content/reference/entries'
import { normalizeQuery, parseStudyXml, studyXml, type StudyField } from '@/lib/xmlStudy'

const layerLabels = { transport: 'Transporte', header: 'Cabecera BAH', payment: 'Mensaje pacs.008' }
const layerColors = { transport: 'text-party', header: 'text-pain', payment: 'text-camt' }
const groups = [
  { id: 'all', label: 'Todo el ejemplo' }, { id: 'transport', label: 'Envelope' }, { id: 'header', label: 'AppHdr' },
  { id: 'group', label: 'GrpHdr' }, { id: 'ids', label: 'Identificadores' }, { id: 'actors', label: 'Partes y cuentas' }, { id: 'amount', label: 'Importe y liquidación' }, { id: 'purpose', label: 'Tipo y propósito' },
]
function inGroup(field: StudyField, group: string) {
  if (group === 'all') return true
  if (group === 'transport' || group === 'header') return field.layer === group
  const expressions: Record<string, RegExp> = { group: /\/GrpHdr(?:\/|$)/, ids: /\/PmtId(?:\/|$)/, actors: /\/(?:Dbtr|Cdtr|InstgAgt|InstdAgt)/, amount: /\/(?:IntrBkSttlmAmt|IntrBkSttlmDt|SttlmInf|ChrgBr)(?:\/|$)/, purpose: /\/(?:PmtTpInf|Purp|RmtInf)(?:\/|$)/ }
  return expressions[group]?.test(field.path) ?? true
}

export function XmlWorkspace() {
  const { fields, lines } = useMemo(() => parseStudyXml(), [])
  const [params, setParams] = useSearchParams()
  const [mode, setMode] = useState<'table' | 'xml' | 'tree'>('table')
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('all')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [copyState, setCopyState] = useState('')
  const surface = useRef<HTMLDivElement>(null)
  const inspector = useRef<HTMLElement>(null)
  const defaultField = fields.find((field) => field.tag === 'IntrBkSttlmAmt')!
  const selected = fields.find((field) => field.id === params.get('field')) ?? defaultField
  const selectedElement = selected.attribute ? selected.parentId : selected.id
  const filtered = fields.filter((field) => inGroup(field, group) && (!query || normalizeQuery(`${field.path} ${field.value} ${field.note.name} ${field.note.meaning} ${field.note.note}`).includes(normalizeQuery(query))))
  const matchingIds = new Set(filtered.map((field) => field.attribute ? field.parentId : field.id))
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
    setParams({ field: id }, { replace: true })
    if (window.matchMedia('(max-width: 1279px)').matches) requestAnimationFrame(() => inspector.current?.scrollIntoView({ block: 'start' }))
  }
  async function copy(text: string, success: string) {
    try { await navigator.clipboard.writeText(text); setCopyState(success) } catch { setCopyState('No se pudo copiar. Selecciona el texto manualmente.') }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([studyXml], { type: 'application/xml' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'pacs.008.001.10-ejemplo-sintetico.xml'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  function toggle(id: string) { setCollapsed((old) => { const next = new Set(old); if (next.has(id)) next.delete(id); else next.add(id); return next }) }

  return <div className="ref-page">
    <Link to="/reference/pacs.008" className="mb-4 inline-flex items-center gap-2 text-xs text-muted hover:text-camt"><ArrowLeft size={13} />Mensaje y contexto</Link>
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
      <div className="min-w-0"><div className="ref-eyebrow text-pain">EXPLORADOR XML / GUÍA DE ESTUDIO</div><h1 className="mt-2 break-words font-mono text-2xl font-semibold">pacs.008.001.10</h1><p className="mt-2 text-sm text-muted">FIToFICustomerCreditTransferV10 · instancia sintética anotada</p></div>
      <div className="flex items-center gap-2"><button className="ref-icon" onClick={() => void copy(studyXml, 'XML copiado')} aria-label="Copiar XML" title="Copiar XML"><Copy size={16} /></button><button className="ref-icon" onClick={download} aria-label="Descargar XML sintético" title="Descargar XML sintético"><Download size={16} /></button></div>
    </header>
    <div className="flex flex-wrap gap-2 border-b border-border py-3 text-xs"><span className="text-party">Envelope de ejemplo</span><ChevronRight size={13} className="text-muted" /><span className="text-pain">head.001.001.02</span><span className="text-muted">+</span><span className="text-camt">pacs.008.001.10</span></div>
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <div className="relative min-w-0 flex-1 basis-56"><Search size={15} className="absolute left-3 top-3 text-muted" /><input aria-label="Buscar campo XML" placeholder="Etiqueta, significado, ruta o valor…" value={query} onChange={(event) => setQuery(event.target.value)} className="ref-input pl-9" /></div>
      <select aria-label="Bloque del mensaje" value={group} onChange={(event) => setGroup(event.target.value)} className="ref-input w-auto max-w-full">{groups.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
      <div role="tablist" aria-label="Vista del XML" className="flex rounded-md border border-border p-1">
        {([{ id: 'table', label: 'Tabla', icon: Table2 }, { id: 'xml', label: 'XML', icon: Code2 }, { id: 'tree', label: 'Árbol', icon: ListTree }] as const).map((tab) => <button role="tab" aria-selected={mode === tab.id} key={tab.id} onClick={() => setMode(tab.id)} className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs ${mode === tab.id ? 'bg-camt/10 text-camt' : 'text-muted hover:text-text'}`}><tab.icon size={14} />{tab.label}</button>)}
      </div>
    </div>
    <p className="my-3 text-[11px] text-muted">{filtered.length} elementos y atributos de la muestra · no es el catálogo completo de campos ni un validador XSD</p>
    <div className="xml-workspace grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_21rem]">
      <div ref={surface} className="max-h-[65vh] min-w-0 overflow-auto rounded-md border border-border bg-surface/60" role="tabpanel">
        {mode === 'table' && <table className="w-full table-fixed text-left text-xs"><colgroup><col className="w-[38%]" /><col className="w-[62%]" /></colgroup><thead className="sticky top-0 z-10 bg-surface text-muted"><tr><th className="p-3 font-medium">Campo / valor</th><th className="p-3 font-medium">Significado</th></tr></thead><tbody>
          {filtered.map((field) => <tr key={field.id} className={`border-t border-border ${selected.id === field.id ? 'bg-camt/10' : 'hover:bg-surface2'}`} data-selected={selected.id === field.id}>
            <td className="p-3 align-top"><button onClick={() => select(field.id)} aria-label={`Inspeccionar ${field.path}`} className={`max-w-full text-left font-mono text-xs font-semibold break-all ${layerColors[field.layer]}`}>{field.tag}</button><div className="mt-1 break-all text-[11px] text-muted">{field.value || 'Bloque'}</div><div className="mt-1 break-all text-[10px] text-muted/70">{field.parentId?.split('/').slice(-2).join('/') || 'Raíz'}</div></td>
            <td className="p-3 align-top"><button onClick={() => select(field.id)} className="text-left text-xs leading-5">{field.note.meaning}</button></td>
          </tr>)}
        </tbody></table>}
        {mode === 'xml' && <div className="min-w-max py-2 font-mono text-xs leading-6">{lines.map((line, index) => {
          const field = fields.find((item) => item.id === line.fieldId)!
          if ((query || group !== 'all') && !matchingIds.has(line.fieldId)) return null
          return <button key={index} onClick={() => select(line.fieldId)} data-selected={selectedElement === line.fieldId && !line.closing} aria-label={`Línea ${index + 1}: ${line.text}`} className={`flex w-full pr-6 text-left ${selectedElement === line.fieldId ? 'bg-camt/15' : 'hover:bg-surface2'}`}><span className="sticky left-0 w-10 shrink-0 bg-surface px-2 text-right text-muted/60">{index + 1}</span><code style={{ paddingLeft: line.depth * 16 + 8 }} className={layerColors[field.layer]}>{line.text}</code></button>
        })}</div>}
        {mode === 'tree' && <div className="py-2">{treeFields.map((field) => <div key={field.id} data-selected={field.id === selected.id} className={`flex items-center gap-1 py-1 pr-3 ${selected.id === field.id ? 'bg-camt/10' : ''}`} style={{ paddingLeft: Math.min(field.depth, 6) * 14 + 8 }}>
          {field.container ? <button onClick={() => toggle(field.id)} aria-expanded={!collapsed.has(field.id)} aria-label={`${collapsed.has(field.id) ? 'Expandir' : 'Contraer'} ${field.path}`} className="p-1 text-muted">{collapsed.has(field.id) ? <ChevronRight size={13} /> : <ChevronDown size={13} />}</button> : <span className="w-[21px] shrink-0" />}
          <button onClick={() => select(field.id)} className="min-w-0 py-1 text-left"><span className={`font-mono text-xs break-all ${layerColors[field.layer]}`}>{field.tag}</span><span className="ml-2 break-all text-[11px] text-muted">{field.value || field.note.name}</span></button>
        </div>)}</div>}
        {!filtered.length && <div className="p-8 text-center text-sm text-muted">Sin campos para este filtro.<button className="mt-2 block w-full text-camt" onClick={() => { setGroup('all'); setQuery('') }}>Restablecer filtros</button></div>}
      </div>
      <aside ref={inspector} className="min-w-0 rounded-md border border-border bg-surface px-4 py-5 xl:sticky xl:top-4" aria-label="Detalle del campo">
        <button onClick={() => surface.current?.scrollIntoView({ block: 'start' })} className="mb-4 flex items-center gap-2 text-xs text-primary xl:hidden"><ArrowLeft size={13} />Volver al XML</button>
        <div className={`ref-eyebrow ${layerColors[selected.layer]}`}>{layerLabels[selected.layer]} · {selected.attribute ? 'ATRIBUTO' : selected.container ? 'BLOQUE' : 'ELEMENTO'}</div>
        <h2 className="mt-2 break-all font-mono text-lg font-semibold">{selected.tag}</h2><p className="mt-1 text-xs text-muted">{selected.note.name}</p>
        <p className="mt-4 text-sm leading-6">{selected.note.meaning}</p>
        {selected.value && <div className="mt-4 border-y border-border py-3"><div className="ref-eyebrow text-muted">Valor en la muestra</div><div className="mt-2 break-all font-mono text-xs text-camt">{selected.value}</div></div>}
        <div className="mt-4"><div className="ref-eyebrow text-warning">Nota de lectura</div><p className="mt-2 text-xs leading-6 text-muted">{selected.note.note}</p></div>
        <div className="mt-4 border-t border-border pt-3"><div className="flex items-center justify-between"><span className="ref-eyebrow text-muted">Ruta estructural</span><button className="ref-icon" aria-label="Copiar ruta" title="Copiar ruta" onClick={() => void copy(selected.path, 'Ruta copiada')}><Copy size={13} /></button></div><code className="mt-2 block break-all text-[11px] leading-5 text-muted">{selected.path}</code></div>
        <details className="mt-4 text-xs"><summary className="cursor-pointer text-muted">Namespace y contexto XML</summary><code className="mt-2 block break-all text-[11px]">{selected.namespace || '(atributo sin namespace)'}</code><p className="mt-2 leading-5 text-muted">Ruta por nombres locales para lectura. Una consulta XPath debe resolver los namespaces del documento.</p></details>
        {fields.some((field) => field.attribute && field.parentId === selected.id) && <div className="mt-4 border-t border-border pt-3"><div className="ref-eyebrow text-muted">Atributos</div>{fields.filter((field) => field.attribute && field.parentId === selected.id).map((field) => <button key={field.id} onClick={() => select(field.id)} className="mt-2 block text-xs text-pain">{field.tag} <ArrowRight size={12} className="inline" /></button>)}</div>}
        {selected.note.concept && <Link to={`/reference/${selected.note.concept}`} className="mt-5 inline-flex items-center gap-2 text-xs text-primary">Ver concepto relacionado <ArrowRight size={12} /></Link>}
      </aside>
    </div>
    <div className="min-h-7 pt-2 text-xs text-camt" role="status">{copyState && <span className="inline-flex items-center gap-1"><Check size={12} />{copyState}</span>}</div>
    <details className="ref-section text-xs"><summary className="cursor-pointer font-semibold text-muted">Alcance y procedencia de la guía</summary><p className="mt-3 max-w-3xl leading-6 text-muted">Adaptación de la guía de estudio pacs.008.001.10 proporcionada por el usuario. Se conserva su estructura y se sustituyen nombres, referencias, cuentas y moneda por datos sintéticos. Las notas explican esta instancia; no afirman cardinalidades completas ni validación contra el XSD. La guía no determina qué mensajes ni códigos utiliza una institución real.</p><a className="mt-3 inline-flex items-center gap-1 text-primary" href={archiveSource.url} target="_blank" rel="noreferrer">{archiveSource.title}<ExternalLink size={12} /></a></details>
  </div>
}
