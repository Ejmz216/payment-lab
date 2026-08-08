import { useState } from 'react'
import { Link } from 'react-router-dom'
import { messages } from '@/content/messages'
import { Card } from '@/components/ui/Card'
import clsx from 'clsx'

const familyColor: Record<string, string> = { pain: 'text-pain border-pain/40', pacs: 'text-pacs border-pacs/40', camt: 'text-camt border-camt/40', admi: 'text-pacs border-pacs/40', head: 'text-pacs border-pacs/40', remt: 'text-pain border-pain/40' }

export function MessageCatalog() {
  const [query, setQuery] = useState('')
  const [family, setFamily] = useState<string>('all')

  const filtered = messages.filter((m) => {
    const matchesQuery = (m.id + ' ' + m.name + ' ' + m.shortDescription).toLowerCase().includes(query.toLowerCase())
    const matchesFamily = family === 'all' || m.family === family
    return matchesQuery && matchesFamily
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Message Catalog</h1>
        <p className="mt-1 text-sm text-muted">Search across covered ISO 20022 messages.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pacs.008, customer credit transfer, status report…"
          className="min-w-[16rem] flex-1 rounded-md border border-border bg-surface2 px-3 py-2 text-sm outline-none focus-ring"
        />
        <select value={family} onChange={(e) => setFamily(e.target.value)} className="rounded-md border border-border bg-surface2 px-3 py-2 text-sm">
          <option value="all">All families</option>
          <option value="pain">pain</option>
          <option value="pacs">pacs</option>
          <option value="camt">camt</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map((m) => (
          <Link key={m.id} to={`/atlas/messages/${m.id}`}>
            <Card className={clsx('h-full border-l-4 hover:border-primary/60', familyColor[m.family])}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold">{m.id}</span>
                <span className="text-[10px] uppercase tracking-wide text-muted">{m.fastPaymentsRelevance}</span>
              </div>
              <div className="mt-1 text-sm text-text/90">{m.name}</div>
              <div className="mt-1 text-xs text-muted">{m.shortDescription}</div>
            </Card>
          </Link>
        ))}
        {filtered.length === 0 && <div className="text-sm text-muted">No messages match your search.</div>}
      </div>
    </div>
  )
}
