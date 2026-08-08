import { useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { X } from 'lucide-react'
import { Card, CardTitle } from '@/components/ui/Card'
import { MessageInspectorView } from '@/components/learning/MessageInspectorView'
import { TraceOriginalPayment } from '@/components/learning/TraceOriginalPayment'
import { XmlEditor } from '@/components/xml/XmlEditor'
import { xmlSamples } from '@/content/xmlSamples'
import { getMessage } from '@/lib/i18nContent'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'

type View = 'friendly' | 'structure' | 'xml' | 'trace'

export function MessageDetailPanel({ messageId, onClose }: { messageId: string; onClose: () => void }) {
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const message = getMessage(messageId, lang)
  const sample = xmlSamples.find((s) => s.messageId === messageId)
  const returnsMessageId = message?.relatedMessages.find((r) => r.relation === 'returns')?.messageId
  const [view, setView] = useState<View>('friendly')

  if (!message) return null

  return (
    <Card className="border-primary/40">
      <div className="mb-2 flex items-center justify-between">
        <CardTitle className="mb-0">
          {t('sim.messageObject')}: <span className="font-mono text-primary">{message.id}</span>
        </CardTitle>
        <button onClick={onClose} className="text-muted hover:text-text" aria-label="Close">
          <X size={16} />
        </button>
      </div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {(['friendly', 'structure', ...(sample ? (['xml'] as View[]) : []), ...(returnsMessageId ? (['trace'] as View[]) : [])] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={clsx(
              'rounded-md border px-2.5 py-1 text-xs font-medium',
              view === v ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted hover:text-text',
            )}
          >
            {v === 'friendly' && t('sim.viewFriendly')}
            {v === 'structure' && t('sim.viewStructure')}
            {v === 'xml' && t('sim.viewXml')}
            {v === 'trace' && t('trace.title')}
          </button>
        ))}
      </div>

      {view === 'friendly' && (
        <dl className="flex flex-col gap-2 text-sm">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">{message.name}</dt>
            <dd className="mt-0.5 text-text/90">{message.shortDescription}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">{t('msg.why')}</dt>
            <dd className="mt-0.5 text-text/90">{message.purpose}</dd>
          </div>
        </dl>
      )}

      {view === 'structure' && <MessageInspectorView messageId={message.id} />}

      {view === 'xml' && sample && <XmlEditor value={sample.xml} height="20rem" />}

      {view === 'trace' && returnsMessageId && <TraceOriginalPayment originalMessageId={returnsMessageId} returnMessageId={message.id} />}

      <Link to={`/atlas/messages/${message.id}`} className="mt-3 inline-block text-xs text-primary hover:underline">
        {t('sim.openInAtlas')} →
      </Link>
    </Card>
  )
}
