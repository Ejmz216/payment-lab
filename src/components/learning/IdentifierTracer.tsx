import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { CheckCircle2 } from 'lucide-react'
import { Card, CardTitle } from '@/components/ui/Card'
import { getMessage } from '@/lib/i18nContent'
import { findById } from '@/lib/tree'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import type { IdentifierTraceMessage } from '@/types/blocks'

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

interface ResolvedMessage {
  id: string
  msgId?: string
  linkLabel: string
  linkValue?: string
}

export function IdentifierTracer({ messages }: { messages: IdentifierTraceMessage[] }) {
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const resolved: ResolvedMessage[] = useMemo(() => {
    return messages.map((m) => {
      const message = getMessage(m.messageId, lang)
      const tree = message?.versions[0].tree
      const msgIdNode = tree ? findById(tree, m.msgIdFieldId ?? 'MsgId') : null
      const linkNode = tree ? findById(tree, m.linkFieldId) : null
      return { id: m.messageId, msgId: msgIdNode?.exampleValue, linkLabel: m.linkFieldLabel, linkValue: linkNode?.exampleValue }
    })
  }, [messages, lang])

  const correctLinkValue = resolved[0]?.linkValue

  const optionsByIndex = useMemo(() => {
    return resolved.map((r, i) => {
      if (i === 0 || !correctLinkValue) return []
      const distractors = [r.msgId, resolved[0]?.msgId].filter((v): v is string => !!v && v !== correctLinkValue)
      return shuffle([correctLinkValue, ...distractors])
    })
  }, [resolved, correctLinkValue])

  return (
    <Card>
      <CardTitle>{t('idtrace.title')}</CardTitle>
      <p className="mb-3 text-sm text-muted">{t('idtrace.instructions')}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {resolved.map((r, i) => {
          const answered = answers[i]
          const isSource = i === 0
          return (
            <div key={r.id} className="rounded-md border border-border bg-surface2 p-3">
              <div className="font-mono text-sm font-semibold text-primary">{r.id}</div>
              {r.msgId && <div className="mt-1 font-mono text-xs text-muted">MsgId: {r.msgId}</div>}
              <div className="mt-2 text-xs font-medium uppercase tracking-wide text-muted">{r.linkLabel}</div>
              {isSource ? (
                <div className="mt-1 rounded bg-success/15 px-1.5 py-1 font-mono text-xs font-semibold">{r.linkValue}</div>
              ) : answered ? (
                <div
                  className={clsx(
                    'mt-1 rounded px-1.5 py-1 font-mono text-xs font-semibold',
                    answered === correctLinkValue ? 'bg-success/15' : 'bg-danger/15',
                  )}
                >
                  {answered}
                </div>
              ) : (
                <div className="mt-1 flex flex-col gap-1">
                  {optionsByIndex[i]?.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setAnswers((prev) => ({ ...prev, [i]: opt }))}
                      className="rounded border border-border bg-bg px-1.5 py-1 text-left font-mono text-xs hover:bg-surface"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {resolved.slice(1).every((_, i) => answers[i + 1] !== undefined) && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-success">
          <CheckCircle2 size={14} /> {t('idtrace.complete')}
        </p>
      )}
    </Card>
  )
}
