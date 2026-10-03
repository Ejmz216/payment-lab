import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { searchReference } from '@/lib/referenceSearch'
import { categoryLabels, type EntryCategory } from '@/content/reference/entries'

export function CommandPalette() {
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const dialog = useRef<HTMLDivElement>(null)
  const filtered = useMemo(() => {
    const spaces = [
      { id: 'classic', title: 'Estudio clásico', description: 'Lecciones, simuladores y práctica', category: 'espacio', to: '/classic' },
      { id: 'info-extra', title: 'Info extra', description: 'Comparativa Barbados vs. Bahamas', category: 'espacio', to: '/learn/info-extra' },
      { id: 'xml', title: 'Explorador XML', description: 'pacs.008.001.10', category: 'xml', to: '/xml' },
    ].filter((item) => !query || `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase()))
    return [...spaces, ...searchReference(query)].slice(0, 30)
  }, [query])
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    dialog.current?.querySelector('input')?.focus()
    return () => previous?.focus()
  }, [])
  useEffect(() => { dialog.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }) }, [selected])
  function go(to: string) { navigate(to); setOpen(false) }

  return <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/65 px-3 pt-[10vh]" onClick={() => setOpen(false)}>
    <div ref={dialog} role="dialog" aria-modal="true" aria-label="Buscar en Payment Lab" className="reference-nav w-full max-w-2xl overflow-hidden rounded-lg border border-border bg-surface shadow-xl" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => {
      if (event.key === 'Escape') setOpen(false)
      if (event.key === 'ArrowDown') { event.preventDefault(); setSelected((old) => Math.min(old + 1, filtered.length - 1)) }
      if (event.key === 'ArrowUp') { event.preventDefault(); setSelected((old) => Math.max(0, old - 1)) }
      if (event.key === 'Enter' && event.target instanceof HTMLInputElement && filtered[selected]) { event.preventDefault(); go(filtered[selected].to) }
      if (event.key === 'Tab') {
        const elements = Array.from(dialog.current?.querySelectorAll<HTMLElement>('input, button') ?? [])
        const first = elements[0], last = elements[elements.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }}>
      <div className="flex items-center gap-3 border-b border-border px-4"><Search size={17} className="shrink-0 text-muted" /><input aria-label="Buscar concepto, mensaje o campo" role="combobox" aria-controls="reference-results" aria-expanded="true" aria-autocomplete="list" aria-activedescendant={filtered[selected] ? `result-${selected}` : undefined} value={query} onChange={(event) => { setQuery(event.target.value); setSelected(0) }} placeholder="Concepto, mensaje o campo XML…" className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none" /><button aria-label="Cerrar búsqueda" title="Cerrar búsqueda" className="ref-icon border-0" onClick={() => setOpen(false)}><X size={16} /></button></div>
      <div id="reference-results" role="listbox" aria-label="Resultados" className="max-h-[60vh] overflow-auto py-1">
        {!filtered.length && <p className="px-4 py-6 text-sm text-muted">Sin resultados.</p>}
        {filtered.map((item, index) => <button id={`result-${index}`} role="option" aria-selected={selected === index} key={item.id} onClick={() => go(item.to)} className={`flex w-full flex-col gap-1 px-4 py-3 text-left ${selected === index ? 'bg-primary/10' : 'hover:bg-surface2'}`}>
          <span className="text-sm font-medium break-all">{item.title}<span className="ml-3 text-[10px] font-normal text-muted">{categoryLabels[item.category as EntryCategory] ?? item.category.toUpperCase()}</span></span>
          <span className="line-clamp-2 text-xs text-muted">{item.description}</span>
          {item.id.startsWith('xml:') && <span className="w-full truncate font-mono text-[10px] text-camt">{item.id.slice(4)}</span>}
        </button>)}
      </div>
    </div>
  </div>
}
