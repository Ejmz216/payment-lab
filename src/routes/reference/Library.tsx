import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, ChevronDown, ChevronsDownUp, ChevronsUpDown, LayoutGrid, Rows3, Search, X } from 'lucide-react'
import { categoryLabels, referenceEntries, type EntryCategory, type ReferenceEntry } from '@/content/reference/entries'
import { entriesByScale, messageFamilies, scales, xmlBlockLink, xmlBlocks, type Scale, type ScaleId } from '@/content/reference/scales'
import { searchReference, type ReferenceResult } from '@/lib/referenceSearch'
import { VisualOverview } from '@/components/reference/VisualOverview'
import { ColorIcon, Icon3D, referenceIdentity, type IconName, type ReferenceTone } from '@/components/reference/ReferenceIdentity'

// Filters follow the same big-to-small order as the staircase.
const filterOrder: { id: string; label: string; icon: IconName }[] = [
  { id: 'all', label: 'Todo', icon: 'books' },
  { id: 'architecture', label: categoryLabels.architecture, icon: 'building-construction' },
  { id: 'schemes', label: categoryLabels.schemes, icon: 'globe-showing-americas' },
  { id: 'concepts', label: categoryLabels.concepts, icon: 'light-bulb' },
  { id: 'messages', label: categoryLabels.messages, icon: 'incoming-envelope' },
  { id: 'xml', label: 'Campos XML', icon: 'label' },
]
type View = 'grid' | 'list'
type CardItem = Pick<ReferenceResult, 'id' | 'title' | 'description' | 'category' | 'to'> & { subtitle?: string; badge?: string }

// Which scales the viewer folded. A per-browser convenience only; the page
// renders fully expanded whenever storage is unavailable.
const COLLAPSED_KEY = 'payment-lab:collapsed-scales'
function readCollapsed(): Set<ScaleId> {
  try { return new Set(JSON.parse(localStorage.getItem(COLLAPSED_KEY) ?? '[]')) } catch { return new Set() }
}
function useCollapsedScales() {
  const [collapsed, setCollapsed] = useState(readCollapsed)
  function save(next: Set<ScaleId>) {
    setCollapsed(next)
    try { localStorage.setItem(COLLAPSED_KEY, JSON.stringify([...next])) } catch { /* storage unavailable */ }
  }
  return {
    collapsed,
    toggle: (id: ScaleId) => { const next = new Set(collapsed); if (next.has(id)) next.delete(id); else next.add(id); save(next) },
    expand: (id: ScaleId) => { if (collapsed.has(id)) { const next = new Set(collapsed); next.delete(id); save(next) } },
    setAll: (folded: boolean) => save(new Set(folded ? scales.map((scale) => scale.id) : [])),
  }
}

const toCard = (entry: ReferenceEntry): CardItem => ({ id: entry.id, title: entry.title, description: entry.summary, category: entry.category, to: `/reference/${entry.id}`, subtitle: entry.category === 'messages' ? entry.subtitle : undefined, badge: entry.category === 'messages' && entry.xml ? 'Incluye XML anotado' : undefined })

export function Library() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const category = filterOrder.some((item) => item.id === params.get('category')) ? params.get('category')! : 'all'
  const results = useMemo(() => searchReference(query, category), [query, category])
  const view: View = params.get('view') === 'list' || (query && params.get('view') !== 'grid') ? 'list' : 'grid'
  const home = !query && category === 'all'
  const folding = useCollapsedScales()
  const allFolded = folding.collapsed.size === scales.length
  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value); else next.delete(key)
    setParams(next, { replace: true })
  }
  function jump(id: string) {
    folding.expand(id as ScaleId)
    document.getElementById(`scale-${id}`)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  }
  return <div className="ref-page">
    <header className="reference-heading">
      <div className="ref-eyebrow text-camt">Payment Lab · El mundo de los pagos</div>
      <h1 className="mt-2 text-3xl font-semibold">Enciclopedia de pagos</h1>
      <p className="mt-2 text-sm text-muted">Del ecosistema completo al último campo del XML: cinco escalas para entender un pago.</p>
      <div className="relative mt-6">
        <Search size={20} className="absolute left-4 top-4 text-camt" />
        <input aria-label="Buscar en la enciclopedia" type="search" value={query} onChange={(event) => update('q', event.target.value)} placeholder="¿Qué quieres entender hoy?" className="reference-search" />
        {query && <button title="Limpiar búsqueda" aria-label="Limpiar búsqueda" onClick={() => update('q', '')} className="absolute right-3 top-3 ref-icon"><X size={16} /></button>}
      </div>
      {!query && <div className="search-suggestions"><span>Consultas frecuentes</span>{['pacs.008', 'Settlement', 'EndToEndId'].map((term) => <button key={term} onClick={() => { setParams({ q: term }) }}>{term}<ArrowRight size={11} /></button>)}</div>}
    </header>
    {home && <VisualOverview onJump={jump} />}
    <div className="reference-filters" aria-label="Filtrar referencias">
      {filterOrder.map((filter) => <button key={filter.id} aria-pressed={category === filter.id} className="reference-filter" onClick={() => update('category', filter.id === 'all' ? '' : filter.id)}><Icon3D name={filter.icon} size={18} />{filter.label}</button>)}
    </div>
    <div className="reference-results-toolbar"><span className="min-w-0 break-all">{query ? `Resultados para “${query}”` : home ? 'La colección, de lo grande a lo pequeño' : filterOrder.find((item) => item.id === category)?.label}</span><div className="flex shrink-0 items-center gap-3"><span role="status">{home ? referenceEntries.length : results.length} entradas</span>{home && <button className="fold-all" onClick={() => folding.setAll(!allFolded)} aria-label={allFolded ? 'Expandir todas las escalas' : 'Contraer todas las escalas'} title={allFolded ? 'Expandir todas las escalas' : 'Contraer todas las escalas'}>{allFolded ? <ChevronsUpDown size={15} /> : <ChevronsDownUp size={15} />}<span className="hidden sm:inline">{allFolded ? 'Expandir todo' : 'Contraer todo'}</span></button>}<div className="view-switch" role="group" aria-label="Presentación de referencias"><button title="Ver fichas" aria-label="Ver fichas" aria-pressed={view === 'grid'} onClick={() => update('view', 'grid')}><LayoutGrid size={16} /></button><button title="Ver lista" aria-label="Ver lista" aria-pressed={view === 'list'} onClick={() => update('view', 'list')}><Rows3 size={16} /></button></div></div></div>
    {home ? <Staircase view={view} collapsed={folding.collapsed} onToggle={folding.toggle} />
      : category === 'messages' && !query ? <MessageFamilies entries={referenceEntries.filter((entry) => entry.category === 'messages')} view={view} />
      : <CardGrid items={results} view={view} empty={<div className="col-span-full py-12 text-center"><p className="text-sm">Sin resultados para esta consulta.</p><button className="mt-3 text-sm text-primary" onClick={() => setParams({})}>Ver todo el índice</button></div>} />}
  </div>
}

function Staircase({ view, collapsed, onToggle }: { view: View; collapsed: Set<ScaleId>; onToggle: (id: ScaleId) => void }) {
  const groups = entriesByScale()
  const fold = (scale: Scale) => ({ open: !collapsed.has(scale.id), onToggle: () => onToggle(scale.id) })
  return <div className="scale-stairs">
    {scales.map((scale) => {
      const entries = groups[scale.id]
      if (scale.id === 'messages') {
        const language = entries.filter((entry) => entry.category !== 'messages')
        const messages = entries.filter((entry) => entry.category === 'messages')
        return <ScaleSection key={scale.id} scale={scale} count={entries.length} focus {...fold(scale)}>
          <div className="message-language"><span className="ref-eyebrow text-muted">El lenguaje de los mensajes</span>{language.map((entry) => <Link key={entry.id} to={`/reference/${entry.id}`} className={`language-chip tone-${referenceIdentity(entry.category, entry.id).tone}`}><Icon3D name={referenceIdentity(entry.category, entry.id).icon} size={18} />{entry.title}</Link>)}</div>
          <MessageFamilies entries={messages} view={view} />
        </ScaleSection>
      }
      if (scale.id === 'xml') return <ScaleSection key={scale.id} scale={scale} count={entries.length + xmlBlocks.length} {...fold(scale)}>
        <CardGrid view={view} tone={scale.tone} items={[...entries.map(toCard), ...xmlBlocks.map((block) => ({ id: `xml-block-${block.group}`, title: block.title, description: block.detail, category: 'xml', to: xmlBlockLink(block.group), icon: block.icon }))]} />
      </ScaleSection>
      return <ScaleSection key={scale.id} scale={scale} count={entries.length} {...fold(scale)}><CardGrid items={entries.map(toCard)} view={view} tone={scale.tone} /></ScaleSection>
    })}
  </div>
}

function ScaleSection({ scale, count, focus = false, open, onToggle, children }: { scale: Scale; count: number; focus?: boolean; open: boolean; onToggle: () => void; children: ReactNode }) {
  const panel = `scale-panel-${scale.id}`
  return <section id={`scale-${scale.id}`} aria-labelledby={`scale-title-${scale.id}`} data-open={open} className={`scale-section tone-${scale.tone} ${focus ? 'scale-focus' : ''}`} style={{ '--level': scale.level - 1 } as CSSProperties}>
    <header className="scale-head">
      <span className="scale-level" aria-hidden="true">{scale.level}</span>
      <ColorIcon icon={scale.icon} tone={scale.tone} />
      <div className="min-w-0 flex-1">
        <p className="ref-eyebrow scale-eyebrow">Escala {scale.level} · {scale.scale}{focus && <span className="scale-badge">Centro de la enciclopedia</span>}</p>
        {/* The title button is stretched over the whole header, so any part of it folds the scale. */}
        <h2 id={`scale-title-${scale.id}`} className="mt-1 text-xl font-semibold"><button type="button" className="scale-toggle" aria-expanded={open} aria-controls={panel} onClick={onToggle}>{scale.title}</button></h2>
        <p className="mt-1 text-sm text-muted">{scale.question}</p>
      </div>
      <span className="scale-count">{count} entradas</span>
      <ChevronDown size={20} className="scale-chevron" aria-hidden="true" />
    </header>
    <div id={panel} hidden={!open}>{children}</div>
  </section>
}

function MessageFamilies({ entries, view }: { entries: ReferenceEntry[]; view: View }) {
  const byNumber = (a: ReferenceEntry, b: ReferenceEntry) => a.id.localeCompare(b.id)
  return <div className="message-families">
    {messageFamilies.map((family) => {
      const items = entries.filter((entry) => entry.id.startsWith(`${family.id}.`)).sort(byNumber)
      if (!items.length) return null
      return <div key={family.id} className={`message-family tone-${family.tone}`}>
        <div className="message-family-head"><span className="family-code">{family.id}</span><span className="min-w-0"><strong className="block text-sm">{family.title}</strong><span className="block text-xs text-muted">{family.flow}</span></span><span className="ml-auto text-xs text-muted">{items.length}</span></div>
        <CardGrid items={items.map(toCard)} view={view} />
      </div>
    })}
  </div>
}

function CardGrid({ items, view, empty, tone: sectionTone }: { items: (CardItem & { icon?: IconName })[]; view: View; empty?: ReactNode; tone?: ReferenceTone }) {
  return <div className={view === 'grid' ? 'reference-collection' : 'divide-y divide-border'}>
    {items.map((item) => {
      const identity = referenceIdentity(item.category, item.id)
      const tone = sectionTone ?? identity.tone
      const mono = item.category === 'xml' || item.category === 'messages'
      return <Link key={item.id} to={item.to} className={`group reference-result tone-${tone} ${view === 'grid' ? 'reference-result-tile' : ''}`}>
        <ColorIcon icon={item.icon ?? identity.icon} tone={tone} />
        <div className="min-w-0"><h3 className={`text-sm font-semibold ${mono ? 'font-mono tone-text' : 'text-text'} group-hover:text-camt`}>{item.title}</h3>{item.subtitle && <p className="mt-0.5 truncate text-[11px] text-muted">{item.subtitle}</p>}<p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">{item.description}</p>{item.category === 'xml' && item.id.startsWith('xml:') && <p className="mt-1 truncate font-mono text-[10px] text-muted">{item.id.slice(4)}</p>}</div>
        <span className={`reference-tag result-category tone-${tone}`}>{item.badge ? <><Icon3D name="page-facing-up" size={14} />{item.badge}</> : item.category === 'xml' ? 'Campo XML · V10' : categoryLabels[item.category as EntryCategory]}</span><ArrowRight size={15} className="hidden text-muted group-hover:text-camt sm:block" />
      </Link>
    })}
    {!items.length && empty}
  </div>
}
