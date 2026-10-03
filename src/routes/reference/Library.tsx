import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, BookOpen, Braces, Layers, Network, Search, X } from 'lucide-react'
import { categoryLabels, type EntryCategory } from '@/content/reference/entries'
import { searchReference } from '@/lib/referenceSearch'

const filters = [{ id: 'all', label: 'Todo' }, ...Object.entries(categoryLabels).map(([id, label]) => ({ id, label })), { id: 'xml', label: 'Campos XML' }]
const paths = [
  { label: 'El sistema de pagos', detail: 'Fast Payments · clearing · settlement', to: '/reference/fast-payments', icon: Network, color: 'text-camt' },
  { label: 'La integración', detail: 'Canales · aplicaciones · participantes', to: '/reference/payment-web-app', icon: Layers, color: 'text-party' },
  { label: 'El mensaje', detail: 'ISO 20022 · roles · identificadores', to: '/reference/pacs.008', icon: BookOpen, color: 'text-pacs' },
  { label: 'El campo XML', detail: 'pacs.008.001.10 · guía anotada', to: '/xml', icon: Braces, color: 'text-pain' },
]

export function Library() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const category = filters.some((item) => item.id === params.get('category')) ? params.get('category')! : 'all'
  const results = useMemo(() => searchReference(query, category), [query, category])
  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value); else next.delete(key)
    setParams(next, { replace: true })
  }
  return <div className="ref-page">
    <header className="border-b border-border pb-6">
      <div className="ref-eyebrow text-camt">PAYMENT LAB / REFERENCIA</div>
      <h1 className="mt-2 text-3xl font-semibold">Enciclopedia de pagos</h1>
      <p className="mt-2 text-sm text-muted">Sistemas, mensajes y campos. Del proceso al dato.</p>
      <div className="relative mt-6">
        <Search size={20} className="absolute left-4 top-4 text-camt" />
        <input aria-label="Buscar en la enciclopedia" type="search" value={query} onChange={(event) => update('q', event.target.value)} placeholder="Concepto, mensaje o campo XML…" className="h-14 w-full rounded-md border border-border bg-surface pl-12 pr-12 text-base outline-none focus:border-camt focus:ring-1 focus:ring-camt" />
        {query && <button title="Limpiar búsqueda" aria-label="Limpiar búsqueda" onClick={() => update('q', '')} className="absolute right-3 top-3 ref-icon"><X size={16} /></button>}
      </div>
    </header>
    {!query && category === 'all' && <section className="grid gap-0 border-b border-border sm:grid-cols-2 xl:grid-cols-4" aria-label="Del sistema al campo">
      {paths.map((path, i) => <Link key={path.to} to={path.to} className="group flex items-start gap-3 px-1 py-5 sm:px-3 hover:bg-surface/50">
        <path.icon size={19} className={`${path.color} mt-1 shrink-0`} /><span className="min-w-0"><span className="text-[10px] font-mono text-muted">0{i + 1}</span><span className="block text-sm font-semibold group-hover:text-camt">{path.label}</span><span className="mt-1 block text-xs leading-5 text-muted">{path.detail}</span></span>
      </Link>)}
    </section>}
    <div className="flex flex-wrap items-center gap-2 border-b border-border py-3" aria-label="Filtrar referencias">
      {filters.map((filter) => <button key={filter.id} aria-pressed={category === filter.id} className={`px-3 py-2 text-xs rounded-md ${category === filter.id ? 'bg-camt/10 text-camt font-semibold' : 'text-muted hover:bg-surface2 hover:text-text'}`} onClick={() => update('category', filter.id === 'all' ? '' : filter.id)}>{filter.label}</button>)}
    </div>
    <div className="flex items-center justify-between gap-3 pt-4 text-xs text-muted"><span className="min-w-0 break-all">{query ? `Resultados para “${query}”` : 'Índice de referencia'}</span><span className="shrink-0" role="status">{results.length} entradas</span></div>
    <div className="divide-y divide-border">
      {results.map((entry) => <Link key={entry.id} to={entry.to} className="group grid gap-2 px-2 py-4 hover:bg-surface/60 sm:grid-cols-[minmax(0,1fr)_8rem_auto] sm:items-center sm:gap-5">
        <div className="min-w-0"><h2 className={`text-sm font-semibold ${entry.category === 'xml' || entry.category === 'messages' ? 'font-mono text-pacs' : 'text-text'} group-hover:text-camt`}>{entry.title}</h2><p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">{entry.description}</p>{entry.category === 'xml' && <p className="mt-1 truncate font-mono text-[10px] text-muted">{entry.id.slice(4)}</p>}</div>
        <span className="text-[11px] text-muted">{entry.category === 'xml' ? 'Campo XML · V10' : categoryLabels[entry.category as EntryCategory]}</span><ArrowRight size={15} className="hidden text-muted group-hover:text-camt sm:block" />
      </Link>)}
      {!results.length && <div className="py-12 text-center"><p className="text-sm">Sin resultados para esta consulta.</p><button className="mt-3 text-sm text-primary" onClick={() => setParams({})}>Ver todo el índice</button></div>}
    </div>
  </div>
}
