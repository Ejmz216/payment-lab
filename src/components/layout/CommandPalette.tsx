import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '@/store/uiStore'
import { fastPaymentsLessons } from '@/content/lessons/fastPaymentsPath'
import { messages } from '@/content/messages'
import { glossary } from '@/content/glossary'

interface Item {
  id: string
  label: string
  sub: string
  to: string
  group: string
}

export function CommandPalette() {
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const items: Item[] = useMemo(() => {
    const lessonItems: Item[] = fastPaymentsLessons.map((l) => ({
      id: `lesson-${l.id}`,
      label: l.title,
      sub: l.subtitle ?? 'Lesson',
      to: `/learn/fast-payments/${l.id}`,
      group: 'Lessons',
    }))
    const messageItems: Item[] = messages.map((m) => ({
      id: `msg-${m.id}`,
      label: m.id,
      sub: m.name,
      to: `/atlas/messages/${m.id}`,
      group: 'Messages',
    }))
    const glossaryItems: Item[] = glossary.map((g) => ({
      id: `gloss-${g.id}`,
      label: g.term,
      sub: g.oneLine,
      to: `/glossary#${g.id}`,
      group: 'Glossary',
    }))
    const labItems: Item[] = [
      { id: 'lab-sim', label: 'Payment Simulator', sub: 'Simulate a payment end to end', to: '/lab/simulator', group: 'Lab' },
      { id: 'lab-debug', label: 'Payment Debugger', sub: 'Investigate a failed payment', to: '/lab/debugger', group: 'Lab' },
      { id: 'lab-id', label: 'Identifier Lab', sub: 'MsgId, InstrId, EndToEndId, TxId', to: '/lab/identifiers', group: 'Lab' },
    ]
    return [...lessonItems, ...messageItems, ...glossaryItems, ...labItems]
  }, [])

  const filtered = items.filter((i) => (i.label + ' ' + i.sub).toLowerCase().includes(query.toLowerCase())).slice(0, 20)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-24" onClick={() => setOpen(false)}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-lg border border-border bg-surface shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search lessons, messages, glossary, lab tools…"
          className="w-full border-b border-border bg-transparent px-4 py-3 text-sm outline-none"
        />
        <div className="max-h-96 overflow-y-auto py-1">
          {filtered.length === 0 && <div className="px-4 py-6 text-center text-sm text-muted">No results.</div>}
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.to)
                setOpen(false)
              }}
              className="flex w-full flex-col items-start gap-0.5 px-4 py-2 text-left hover:bg-surface2"
            >
              <span className="text-sm font-medium">{item.label}</span>
              <span className="text-xs text-muted">{item.sub} · {item.group}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
