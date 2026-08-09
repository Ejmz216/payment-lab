import clsx from 'clsx'
import type { ContentBadge } from '@/types/content'

const styles: Record<ContentBadge, string> = {
  reference: 'bg-iso/15 text-iso border-iso/30',
  'public-scheme': 'bg-scheme/15 text-scheme border-scheme/30',
  'simplified-model': 'bg-warning/15 text-warning border-warning/30',
  simulation: 'bg-camt/15 text-camt border-camt/30',
  'scheme-dependent': 'bg-scheme/15 text-scheme border-scheme/30',
  'to-verify': 'bg-warning/15 text-warning border-warning/30',
  'implementation-question': 'bg-danger/10 text-danger border-danger/30',
}

const labels: Record<ContentBadge, string> = {
  reference: 'REFERENCE',
  'public-scheme': 'PUBLIC SCHEME',
  'simplified-model': 'SIMPLIFIED MODEL',
  simulation: 'SIMULATION',
  'scheme-dependent': 'DEPENDS ON SCHEME',
  'to-verify': 'TO VERIFY',
  'implementation-question': 'IMPLEMENTATION QUESTION',
}

export function Badge({ type, title }: { type: ContentBadge; title?: string }) {
  return (
    <span
      title={title ?? labels[type]}
      className={clsx('inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold tracking-wide', styles[type])}
    >
      {labels[type]}
    </span>
  )
}
