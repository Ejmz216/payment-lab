import { ArrowRight, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { Card, CardTitle } from '@/components/ui/Card'
import { getMessage } from '@/lib/i18nContent'
import { findById } from '@/lib/tree'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'

interface TraceOriginalPaymentProps {
  originalMessageId: string
  returnMessageId: string
}

// Pulls the actual identifier field values out of the two messages' real
// data model (not hardcoded per lesson) so the trace stays correct if the
// underlying message content ever changes.
export function TraceOriginalPayment({ originalMessageId, returnMessageId }: TraceOriginalPaymentProps) {
  const lang = useUIStore((s) => s.lang)
  const t = useT()

  const original = getMessage(originalMessageId, lang)
  const returnMsg = getMessage(returnMessageId, lang)
  if (!original || !returnMsg) return null

  const originalTree = original.versions[0].tree
  const returnTree = returnMsg.versions[0].tree

  const originalMsgId = findById(originalTree, 'MsgId')
  const originalE2E = findById(originalTree, 'EndToEndId')
  const originalTxId = findById(originalTree, 'TxId')

  const returnMsgId = findById(returnTree, 'MsgId')
  const returnOrgnlE2E = findById(returnTree, 'OrgnlEndToEndId')

  const matches = !!(originalE2E?.exampleValue && returnOrgnlE2E?.exampleValue && originalE2E.exampleValue === returnOrgnlE2E.exampleValue)

  return (
    <Card>
      <CardTitle>{t('trace.title')}</CardTitle>
      <div className="mt-3 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        <div className="flex-1 rounded-md border border-border bg-surface2 p-3">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted">{t('trace.original')}</div>
          <Link to={`/atlas/messages/${original.id}`} className="font-mono text-sm font-semibold text-primary hover:underline">{original.id}</Link>
          <dl className="mt-2 flex flex-col gap-1 font-mono text-xs">
            {originalMsgId?.exampleValue && <div><dt className="inline text-muted">MsgId: </dt><dd className="inline">{originalMsgId.exampleValue}</dd></div>}
            {originalE2E?.exampleValue && (
              <div className={clsx('rounded px-1 -mx-1', matches && 'bg-success/15')}>
                <dt className="inline text-muted">EndToEndId: </dt><dd className="inline font-semibold">{originalE2E.exampleValue}</dd>
              </div>
            )}
            {originalTxId?.exampleValue && <div><dt className="inline text-muted">TxId: </dt><dd className="inline">{originalTxId.exampleValue}</dd></div>}
          </dl>
        </div>

        <div className="flex shrink-0 flex-col items-center justify-center gap-1 px-2 text-muted">
          <ArrowRight size={20} className="hidden sm:block" />
          <span className="text-[10px] uppercase tracking-wide">{t('trace.references')}</span>
        </div>

        <div className="flex-1 rounded-md border border-border bg-surface2 p-3">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted">{t('trace.returnLabel')}</div>
          <Link to={`/atlas/messages/${returnMsg.id}`} className="font-mono text-sm font-semibold text-primary hover:underline">{returnMsg.id}</Link>
          <dl className="mt-2 flex flex-col gap-1 font-mono text-xs">
            {returnMsgId?.exampleValue && <div><dt className="inline text-muted">MsgId: </dt><dd className="inline">{returnMsgId.exampleValue}</dd></div>}
            {returnOrgnlE2E?.exampleValue && (
              <div className={clsx('rounded px-1 -mx-1', matches && 'bg-success/15')}>
                <dt className="inline text-muted">OrgnlEndToEndId: </dt><dd className="inline font-semibold">{returnOrgnlE2E.exampleValue}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {matches && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-success">
          <CheckCircle2 size={14} /> {t('trace.matchNote')}
        </p>
      )}
      <p className="mt-2 text-xs text-muted">{t('trace.disclaimer')}</p>
    </Card>
  )
}
