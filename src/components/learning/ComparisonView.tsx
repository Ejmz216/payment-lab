import {
  Ban,
  Braces,
  Building2,
  CircleDot,
  CircleHelp,
  Landmark,
  Tags,
  UserRound,
  Wrench,
} from 'lucide-react'
import clsx from 'clsx'
import type { ComparisonBlock, ComparisonTone } from '@/types/blocks'
import { Badge } from '@/components/ui/Badge'
import { Card, CardTitle } from '@/components/ui/Card'
import { useT } from '@/i18n/strings'

const toneIcons: Record<ComparisonTone, typeof UserRound> = {
  party: UserRound,
  agent: Building2,
  infrastructure: Landmark,
  iso: Braces,
  scheme: Landmark,
  implementation: Wrench,
  neutral: CircleDot,
}

const toneStyles: Record<ComparisonTone, string> = {
  party: 'border-party/40 bg-party/10 text-party',
  agent: 'border-agent/40 bg-agent/10 text-agent',
  infrastructure: 'border-infra/40 bg-infra/10 text-infra',
  iso: 'border-iso/40 bg-iso/10 text-iso',
  scheme: 'border-scheme/40 bg-scheme/10 text-scheme',
  implementation: 'border-warning/40 bg-warning/10 text-warning',
  neutral: 'border-border bg-surface2 text-text',
}

export function ComparisonView({ block }: { block: ComparisonBlock }) {
  const t = useT()

  return (
    <Card variant="study" className="technical-surface overflow-hidden p-0">
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="mb-0 text-base">{block.heading}</CardTitle>
          {block.badge && <Badge type={block.badge} />}
        </div>
        {block.intro && <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text/85">{block.intro}</p>}
      </div>

      <div className="grid md:grid-cols-3">
        {block.items.map((item, index) => {
          const Icon = toneIcons[item.tone]
          return (
            <section
              key={item.id}
              className={clsx(
                'min-w-0 border-b border-border p-4 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0',
                index > 2 && 'md:border-t',
              )}
            >
              <div className="flex items-center gap-2">
                <span className={clsx('flex h-9 w-9 shrink-0 items-center justify-center rounded-md border', toneStyles[item.tone])}>
                  <Icon size={18} />
                </span>
                <h4 className="text-sm font-semibold">{item.label}</h4>
              </div>

              <div className="mt-4 flex items-start gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                <CircleHelp size={14} className="mt-0.5 shrink-0" />
                <span>{t('comparison.keyQuestion')}</span>
              </div>
              <p className="mt-1 text-sm font-medium leading-relaxed">{item.keyQuestion}</p>
              <p className="mt-2 text-sm leading-relaxed text-text/75">{item.summary}</p>

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
                <Tags size={14} /> {t('comparison.examples')}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.examples.map((example) => (
                  <span key={example} className="rounded border border-border bg-bg/55 px-2 py-1 font-mono text-[11px] text-text/85">
                    {example}
                  </span>
                ))}
              </div>

              <div className="mt-4 border-t border-border pt-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-warning">
                  <Ban size={14} /> {t('comparison.notThis')}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-text/75">{item.notThis}</p>
              </div>
            </section>
          )
        })}
      </div>
    </Card>
  )
}
