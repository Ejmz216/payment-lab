import { Link } from 'react-router-dom'
import { ArrowRight, MessageSquareText } from 'lucide-react'
import clsx from 'clsx'
import type { MessageSequenceStep } from '@/types/blocks'

const toneStyles = {
  pain: 'border-pain/45 bg-pain/10 text-pain',
  pacs: 'border-pacs/45 bg-pacs/10 text-pacs',
  camt: 'border-camt/45 bg-camt/10 text-camt',
  scheme: 'border-scheme/45 bg-scheme/10 text-scheme',
  neutral: 'border-border bg-surface2 text-text',
}

export function MessageSequenceView({ steps }: { steps: MessageSequenceStep[] }) {
  return (
    <ol className="relative flex flex-col gap-3 before:absolute before:bottom-5 before:left-[1.15rem] before:top-5 before:w-px before:bg-border">
      {steps.map((step, index) => (
        <li key={step.id} className="relative grid grid-cols-[2.3rem_minmax(0,1fr)] gap-3">
          <span className="z-10 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-xs font-semibold text-muted">
            {index + 1}
          </span>
          <div className="min-w-0 rounded-md border border-border bg-bg/45 p-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="font-medium text-text">{step.from}</span>
              <ArrowRight size={13} />
              <span className="font-medium text-text">{step.to}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {step.messageId ? (
                <Link to={`/atlas/messages/${step.messageId}`} className={clsx('inline-flex items-center gap-1.5 rounded border px-2 py-1 font-mono text-xs font-semibold hover:underline', toneStyles[step.tone ?? 'neutral'])}>
                  <MessageSquareText size={13} /> {step.label}
                </Link>
              ) : (
                <span className={clsx('inline-flex items-center gap-1.5 rounded border px-2 py-1 text-xs font-semibold', toneStyles[step.tone ?? 'neutral'])}>
                  <MessageSquareText size={13} /> {step.label}
                </span>
              )}
              <span className="text-sm text-text/85">{step.description}</span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}
