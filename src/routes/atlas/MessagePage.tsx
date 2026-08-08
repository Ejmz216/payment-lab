import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { getMessage } from '@/content/messages'
import { Card, CardTitle } from '@/components/ui/Card'
import { MessageTree } from '@/components/messages/MessageTree'
import { FieldDetail } from '@/components/messages/FieldDetail'
import { findParent } from '@/lib/tree'
import { useProgressStore } from '@/store/progressStore'
import type { MessageFieldNode } from '@/types/content'
import clsx from 'clsx'

const familyColor: Record<string, string> = { pain: 'text-pain', pacs: 'text-pacs', camt: 'text-camt', admi: 'text-pacs', head: 'text-pacs', remt: 'text-pain' }

export function MessagePage() {
  const { messageId } = useParams()
  const message = messageId ? getMessage(messageId) : undefined
  const viewMessage = useProgressStore((s) => s.viewMessage)
  const [versionIdx, setVersionIdx] = useState(0)
  const [selected, setSelected] = useState<MessageFieldNode | null>(null)

  useEffect(() => {
    if (message) viewMessage(message.id)
  }, [message, viewMessage])

  const version = message?.versions[versionIdx]

  const parentName = useMemo(() => {
    if (!version || !selected) return undefined
    const parent = findParent(version.tree, selected.id)
    return parent?.name
  }, [version, selected])

  if (!message) return <Navigate to="/atlas/messages" replace />

  return (
    <div className="flex flex-col gap-6">
      <div className="text-xs text-muted">
        <Link to="/atlas" className="hover:text-text">ISO 20022 Atlas</Link>
        <span className="mx-1.5">/</span>
        <Link to="/atlas/messages" className="hover:text-text">Messages</Link>
        <span className="mx-1.5">/</span>
        {message.id}
      </div>

      <div>
        <h1 className={clsx('text-2xl font-semibold', familyColor[message.family])}>{message.id}</h1>
        <p className="mt-1 text-sm text-muted">{message.name}</p>
        <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
          <span className="rounded-full border border-border bg-surface2 px-2 py-0.5">{message.domain}</span>
          <span className="rounded-full border border-border bg-surface2 px-2 py-0.5">{message.businessArea}</span>
          <span className="rounded-full border border-border bg-surface2 px-2 py-0.5">Fast Payments relevance: {message.fastPaymentsRelevance}</span>
          <span className="rounded-full border border-border bg-surface2 px-2 py-0.5">Coverage: {message.coverage.replace('-', ' ')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardTitle>What?</CardTitle><p className="text-sm text-text/90">{message.shortDescription}</p></Card>
        <Card><CardTitle>Why?</CardTitle><p className="text-sm text-text/90">{message.purpose}</p></Card>
        <Card><CardTitle>Who?</CardTitle><p className="text-sm text-text/90">{message.actors.join(', ')}</p></Card>
        <Card><CardTitle>When?</CardTitle><p className="text-sm text-text/90">{message.lifecycleStage.join(' → ')}</p></Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card><CardTitle>What comes before?</CardTitle><p className="text-sm text-text/90">{message.whatComesBefore}</p></Card>
        <Card><CardTitle>What can come after?</CardTitle><p className="text-sm text-text/90">{message.whatComesAfter}</p></Card>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Message Explorer</h2>
          {message.versions.length > 1 && (
            <select
              value={versionIdx}
              onChange={(e) => { setVersionIdx(Number(e.target.value)); setSelected(null) }}
              className="rounded-md border border-border bg-surface2 px-2 py-1 text-xs"
            >
              {message.versions.map((v, i) => <option key={v.version} value={i}>{v.fullIdentifier}</option>)}
            </select>
          )}
          {message.versions.length === 1 && (
            <span className="text-xs text-muted">{message.versions[0].fullIdentifier} · reviewed {message.versions[0].lastReviewed}</span>
          )}
        </div>
        {version?.cardinalityNotes && (
          <p className="mb-3 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning">{version.cardinalityNotes}</p>
        )}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {version && <MessageTree root={version.tree} selectedId={selected?.id ?? null} onSelect={setSelected} />}
          {selected ? (
            <FieldDetail node={selected} parentName={parentName} />
          ) : (
            <Card className="flex items-center justify-center text-sm text-muted">Select a field in the tree to see its details.</Card>
          )}
        </div>
      </div>

      {message.commonMistakes && message.commonMistakes.length > 0 && (
        <Card className="border-warning/30">
          <CardTitle>Common mistake</CardTitle>
          {message.commonMistakes.map((c) => (
            <div key={c.title} className="mt-1 text-sm">
              <div className="font-medium">{c.title}</div>
              <p className="text-text/90">{c.explanation}</p>
            </div>
          ))}
        </Card>
      )}

      {message.relatedMessages.length > 0 && (
        <Card>
          <CardTitle>Related messages</CardTitle>
          <div className="mt-2 flex flex-wrap gap-2">
            {message.relatedMessages.map((r) => (
              <Link key={r.messageId} to={`/atlas/messages/${r.messageId}`} className="rounded-md border border-border bg-surface2 px-2.5 py-1 text-xs hover:bg-bg">
                {r.messageId} <span className="text-muted">({r.relation.replace(/-/g, ' ')})</span>
              </Link>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <CardTitle>Sources & references</CardTitle>
        <ul className="mt-1 flex flex-col gap-1 text-xs text-muted">
          {message.sources.map((s) => (
            <li key={s.sourceName}>{s.sourceName} ({s.sourceType}) — last reviewed {s.lastReviewed}{s.notes ? ` — ${s.notes}` : ''}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
