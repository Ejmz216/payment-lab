import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, LayoutGrid, Rows3, Search, X } from 'lucide-react'
import { categoryLabels, type EntryCategory } from '@/content/reference/entries'
import { searchReference } from '@/lib/referenceSearch'
import { VisualOverview } from '@/components/reference/VisualOverview'
import { ReferenceIcon, referenceIdentity } from '@/components/reference/ReferenceIdentity'

const filters = [{ id: 'all', label: 'Todo' }, ...Object.entries(categoryLabels).map(([id, label]) => ({ id, label })), { id: 'xml', label: 'Campos XML' }]

export function Library() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const category = filters.some((item) => item.id === params.get('category')) ? params.get('category')! : 'all'
  const results = useMemo(() => searchReference(query, category), [query, category])
  const view = params.get('view') === 'list' || (query && params.get('view') !== 'grid') ? 'list' : 'grid'
  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value); else next.delete(key)
    setParams(next, { replace: true })
  }
  return <div className="ref-page">
    <header className="reference-heading">
      <div className="ref-eyebrow text-camt">Payment Lab · El mundo de los pagos</div>
      <h1 className="mt-2 text-3xl font-semibold">Enciclopedia de pagos</h1>
      <p className="mt-2 text-sm text-muted">Entender el recorrido. Conectar las piezas. Llegar al detalle.</p>
      <div className="relative mt-6">
        <Search size={20} className="absolute left-4 top-4 text-camt" />
        <input aria-label="Buscar en la enciclopedia" type="search" value={query} onChange={(event) => update('q', event.target.value)} placeholder="¿Qué quieres entender hoy?" className="reference-search" />
        {query && <button title="Limpiar búsqueda" aria-label="Limpiar búsqueda" onClick={() => update('q', '')} className="absolute right-3 top-3 ref-icon"><X size={16} /></button>}
      </div>
      {!query && <div className="search-suggestions"><span>Consultas frecuentes</span>{['pacs.008', 'Settlement', 'EndToEndId'].map((term) => <button key={term} onClick={() => { setParams({ q: term }) }}>{term}<ArrowRight size={11} /></button>)}</div>}
    </header>
    {!query && category === 'all' && <VisualOverview />}
    <div className="flex flex-wrap items-center gap-2 border-b border-border py-3" aria-label="Filtrar referencias">
      {filters.map((filter) => <button key={filter.id} aria-pressed={category === filter.id} className={`px-3 py-2 text-xs rounded-md ${category === filter.id ? 'bg-camt/10 text-camt font-semibold' : 'text-muted hover:bg-surface2 hover:text-text'}`} onClick={() => update('category', filter.id === 'all' ? '' : filter.id)}>{filter.label}</button>)}
    </div>
    <div className="reference-results-toolbar"><span className="min-w-0 break-all">{query ? `Resultados para “${query}”` : 'La colección'}</span><div className="flex shrink-0 items-center gap-3"><span role="status">{results.length} entradas</span><div className="view-switch" role="group" aria-label="Presentación de referencias"><button title="Ver fichas" aria-label="Ver fichas" aria-pressed={view === 'grid'} onClick={() => update('view', 'grid')}><LayoutGrid size={16} /></button><button title="Ver lista" aria-label="Ver lista" aria-pressed={view === 'list'} onClick={() => update('view', 'list')}><Rows3 size={16} /></button></div></div></div>
    <div className={view === 'grid' ? 'reference-collection' : 'divide-y divide-border'}>
      {results.map((entry) => <Link key={entry.id} to={entry.to} className={`group reference-result tone-${referenceIdentity(entry.category, entry.id).tone} ${view === 'grid' ? 'reference-result-tile' : ''}`}>
        <ReferenceIcon category={entry.category} id={entry.id} />
        <div className="min-w-0"><h2 className={`text-sm font-semibold ${entry.category === 'xml' || entry.category === 'messages' ? 'font-mono text-pacs' : 'text-text'} group-hover:text-camt`}>{entry.title}</h2><p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">{entry.description}</p>{entry.category === 'xml' && <p className="mt-1 truncate font-mono text-[10px] text-muted">{entry.id.slice(4)}</p>}</div>
        <span className={`reference-tag result-category tone-${referenceIdentity(entry.category, entry.id).tone}`}>{entry.category === 'xml' ? 'Campo XML · V10' : categoryLabels[entry.category as EntryCategory]}</span><ArrowRight size={15} className="hidden text-muted group-hover:text-camt sm:block" />
      </Link>)}
      {!results.length && <div className="col-span-full py-12 text-center"><p className="text-sm">Sin resultados para esta consulta.</p><button className="mt-3 text-sm text-primary" onClick={() => setParams({})}>Ver todo el índice</button></div>}
    </div>
  </div>
}
