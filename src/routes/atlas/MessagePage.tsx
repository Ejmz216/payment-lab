import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getMessage } from '@/lib/i18nContent'
import { relationLabelsEs } from '@/i18n/messagesEs'
import { Card, CardTitle } from '@/components/ui/Card'
import { BookmarkButton } from '@/components/ui/BookmarkButton'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { MessageTree } from '@/components/messages/MessageTree'
import { FieldDetail } from '@/components/messages/FieldDetail'
import { findParent } from '@/lib/tree'
import { useProgressStore } from '@/store/progressStore'
import type { MessageFieldNode } from '@/types/content'
import clsx from 'clsx'

const familyColor: Record<string, string> = { pain: 'text-pain', pacs: 'text-pacs', camt: 'text-camt', admi: 'text-pacs', head: 'text-pacs', remt: 'text-pain' }

export function MessagePage() {
  const { messageId } = useParams()
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const message = messageId ? getMessage(messageId, lang) : undefined
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
      <Breadcrumbs
        items={[
          { label: t('nav.dashboard'), to: '/' },
          { label: t('atlas.title'), to: '/atlas' },
          { label: t('catalog.title'), to: '/atlas/messages' },
          { label: message.id },
        ]}
      />

      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className={clsx('text-2xl font-semibold', familyColor[message.family])}>{message.id}</h1>
          <BookmarkButton id={`message:${message.id}`} />
        </div>
        <p className="mt-1 text-sm text-muted">{message.name}</p>
        <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
          <span className="rounded-full border border-border bg-surface2 px-2 py-0.5">{message.domain}</span>
          <span className="rounded-full border border-border bg-surface2 px-2 py-0.5">{message.businessArea}</span>
          <span className="rounded-full border border-border bg-surface2 px-2 py-0.5">{t('msg.relevance')}: {message.fastPaymentsRelevance}</span>
          <span className="rounded-full border border-border bg-surface2 px-2 py-0.5">{t('msg.coverage')}: {message.coverage.replace('-', ' ')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardTitle>{t('msg.what')}</CardTitle><p className="text-sm text-text/90">{message.shortDescription}</p></Card>
        <Card><CardTitle>{t('msg.why')}</CardTitle><p className="text-sm text-text/90">{message.purpose}</p></Card>
        <Card><CardTitle>{t('msg.who')}</CardTitle><p className="text-sm text-text/90">{message.actors.join(', ')}</p></Card>
        <Card><CardTitle>{t('msg.when')}</CardTitle><p className="text-sm text-text/90">{message.lifecycleStage.join(' → ')}</p></Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card><CardTitle>{t('msg.before')}</CardTitle><p className="text-sm text-text/90">{message.whatComesBefore}</p></Card>
        <Card><CardTitle>{t('msg.after')}</CardTitle><p className="text-sm text-text/90">{message.whatComesAfter}</p></Card>
      </div>

      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{t('msg.explorer')}</h2>
          <div className="flex items-center gap-2">
            {version && (
              <span
                className={clsx(
                  'rounded-full border px-2 py-0.5 text-[10px] font-medium',
                  version.status === 'current-iso' && 'border-success/50 bg-success/10 text-success',
                  version.status === 'archived-iso' && 'border-muted/50 bg-surface2 text-muted',
                  version.status === 'illustrative' && 'border-warning/50 bg-warning/10 text-warning',
                )}
                title={version.reviewedAgainstCatalogue ? `${t('version.checkedAgainst')}: ${version.reviewedAgainstCatalogue}` : undefined}
              >
                {version.status === 'current-iso' && t('version.current')}
                {version.status === 'archived-iso' && t('version.archived')}
                {version.status === 'illustrative' && t('version.illustrative')}
              </span>
            )}
            {message.versions.length > 1 ? (
              <select
                value={versionIdx}
                onChange={(e) => { setVersionIdx(Number(e.target.value)); setSelected(null) }}
                className="rounded-md border border-border bg-surface2 px-2 py-1 text-xs"
              >
                {message.versions.map((v, i) => <option key={v.version} value={i}>{v.fullIdentifier}</option>)}
              </select>
            ) : (
              <span className="text-xs text-muted">{message.versions[0].fullIdentifier} · {t('lesson.lastReviewed')} {message.versions[0].lastReviewed}</span>
            )}
          </div>
        </div>
        {message.versions.length > 1 && <p className="mb-2 text-xs text-muted">{t('version.schemeNote')}</p>}
        {lang === 'es' && <p className="mb-2 text-xs text-muted">{t('msg.treeNote')}</p>}
        {version?.cardinalityNotes && (
          <p className="mb-3 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning">{version.cardinalityNotes}</p>
        )}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {version && <MessageTree root={version.tree} selectedId={selected?.id ?? null} onSelect={setSelected} />}
          {selected ? (
            <FieldDetail node={selected} parentName={parentName} />
          ) : (
            <Card className="flex items-center justify-center text-sm text-muted">{t('msg.selectField')}</Card>
          )}
        </div>
      </div>

      {message.commonMistakes && message.commonMistakes.length > 0 && (
        <Card className="border-warning/30">
          <CardTitle>{t('msg.commonMistake')}</CardTitle>
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
          <CardTitle>{t('msg.related')}</CardTitle>
          <div className="mt-2 flex flex-wrap gap-2">
            {message.relatedMessages.map((r) => (
              <Link key={r.messageId} to={`/atlas/messages/${r.messageId}`} className="rounded-md border border-border bg-surface2 px-2.5 py-1 text-xs hover:bg-bg">
                {r.messageId} <span className="text-muted">({lang === 'es' ? relationLabelsEs[r.relation] ?? r.relation.replace(/-/g, ' ') : r.relation.replace(/-/g, ' ')})</span>
              </Link>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <CardTitle>{t('msg.sources')}</CardTitle>
        <ul className="mt-1 flex flex-col gap-1 text-xs text-muted">
          {message.sources.map((s) => (
            <li key={s.sourceName}>{s.sourceName} ({s.sourceType}) — {t('lesson.lastReviewed')} {s.lastReviewed}{s.notes ? ` — ${s.notes}` : ''}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
