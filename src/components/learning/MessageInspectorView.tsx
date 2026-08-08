import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardTitle } from '@/components/ui/Card'
import { MessageTree } from '@/components/messages/MessageTree'
import { FieldDetail } from '@/components/messages/FieldDetail'
import { findParent } from '@/lib/tree'
import { getMessage } from '@/lib/i18nContent'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import type { MessageFieldNode } from '@/types/content'

export function MessageInspectorView({ messageId, versionIndex = 0, intro }: { messageId: string; versionIndex?: number; intro?: string }) {
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const [selected, setSelected] = useState<MessageFieldNode | null>(null)
  const message = getMessage(messageId, lang)

  if (!message) return null
  const version = message.versions[versionIndex] ?? message.versions[0]
  const parentName = selected ? findParent(version.tree, selected.id)?.name : undefined

  return (
    <Card>
      <CardTitle>
        {t('msg.explorer')}: <span className="font-mono">{message.id}</span>
      </CardTitle>
      {intro && <p className="mb-2 text-sm text-text/90">{intro}</p>}
      <div className="mt-2 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <MessageTree root={version.tree} selectedId={selected?.id ?? null} onSelect={setSelected} />
        {selected ? (
          <FieldDetail node={selected} parentName={parentName} />
        ) : (
          <div className="flex items-center justify-center rounded-md border border-border bg-surface2 p-4 text-center text-sm text-muted">
            {t('msg.selectField')}
          </div>
        )}
      </div>
      <Link to={`/atlas/messages/${message.id}`} className="mt-3 inline-block text-xs text-primary hover:underline">
        {t('xmllab.viewMessage')}: {message.id} →
      </Link>
    </Card>
  )
}
