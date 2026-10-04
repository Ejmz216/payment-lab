import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { searchReference } from '@/lib/referenceSearch'
import { getCategoryLabels, type EntryCategory } from '@/content/reference/entries'
import { useL, useRefLang } from '@/i18n/reference/useLang'

export function CommandPalette() {
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const L = useL()
  const lang = useRefLang()
  const categoryLabels = getCategoryLabels(lang)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const dialog = useRef<HTMLDivElement>(null)
  const filtered = useMemo(() => {
    const spaces = [
      { id: 'visual', title: L('Guía visual', 'Visual guide'), description: L('Diagramas, secuencias y arquitecturas de pagos', 'Payment diagrams, sequences and architectures'), category: L('espacio', 'space'), to: '/visual' },
      { id: 'recorridos', title: L('Recorridos', 'Journeys'), description: L('Un pago completo en el tiempo: transferencia, rechazo, devolución, timeout, cancelación, débito directo', 'A complete payment over time: transfer, reject, return, timeout, cancellation, direct debit'), category: L('espacio', 'space'), to: '/recorridos' },
      { id: 'classic', title: L('Estudio clásico', 'Classic study'), description: L('Lecciones, simuladores y práctica', 'Lessons, simulators and practice'), category: L('espacio', 'space'), to: '/classic' },
      { id: 'info-extra', title: L('Info extra', 'Extra info'), description: L('Comparativa Barbados vs. Bahamas', 'Barbados vs. Bahamas comparison'), category: L('espacio', 'space'), to: '/learn/info-extra' },
      { id: 'xml', title: L('Explorador XML', 'XML explorer'), description: 'pacs.008.001.10', category: 'xml', to: '/reference/pacs.008?tab=xml' },
    ].filter((item) => !query || `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase()))
    return [...spaces, ...searchReference(query, 'all', lang)].slice(0, 30)
  }, [query, lang])
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    dialog.current?.querySelector('input')?.focus()
    return () => previous?.focus()
  }, [])
  useEffect(() => { dialog.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }) }, [selected])
  function go(to: string) { navigate(to); setOpen(false) }

  return <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/65 px-3 pt-[10vh]" onClick={() => setOpen(false)}>
    <div ref={dialog} role="dialog" aria-modal="true" aria-label={L('Buscar en Aula Libre de Pagos', 'Search Aula Libre de Pagos')} className="reference-nav w-full max-w-2xl overflow-hidden rounded-lg border border-border bg-surface shadow-xl" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => {
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
      <div className="flex items-center gap-3 border-b border-border px-4"><Search size={17} className="shrink-0 text-muted" /><input aria-label={L('Buscar concepto, mensaje o campo', 'Search concept, message or field')} role="combobox" aria-controls="reference-results" aria-expanded="true" aria-autocomplete="list" aria-activedescendant={filtered[selected] ? `result-${selected}` : undefined} value={query} onChange={(event) => { setQuery(event.target.value); setSelected(0) }} placeholder={L('Concepto, mensaje o campo XML…', 'Concept, message or XML field…')} className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none" /><button aria-label={L('Cerrar búsqueda', 'Close search')} title={L('Cerrar búsqueda', 'Close search')} className="ref-icon border-0" onClick={() => setOpen(false)}><X size={16} /></button></div>
      <div id="reference-results" role="listbox" aria-label={L('Resultados', 'Results')} className="max-h-[60vh] overflow-auto py-1">
        {!filtered.length && <p className="px-4 py-6 text-sm text-muted">{L('Sin resultados.', 'No results.')}</p>}
        {filtered.map((item, index) => <button id={`result-${index}`} role="option" aria-selected={selected === index} key={item.id} onClick={() => go(item.to)} className={`flex w-full flex-col gap-1 px-4 py-3 text-left ${selected === index ? 'bg-primary/10' : 'hover:bg-surface2'}`}>
          <span className="text-sm font-medium break-all">{item.title}<span className="ml-3 text-[10px] font-normal text-muted">{categoryLabels[item.category as EntryCategory] ?? item.category.toUpperCase()}</span></span>
          <span className="line-clamp-2 text-xs text-muted">{item.description}</span>
          {item.id.startsWith('xml:') && <span className="w-full truncate font-mono text-[10px] text-camt">{item.id.slice(4)}</span>}
        </button>)}
      </div>
    </div>
  </div>
}
