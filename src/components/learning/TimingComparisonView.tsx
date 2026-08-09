import { ArrowRight, CalendarClock, Clock3, Zap } from 'lucide-react'
import clsx from 'clsx'
import type { TimingComparisonBlock, TimingLaneTone } from '@/types/blocks'
import { Badge } from '@/components/ui/Badge'
import { Card, CardTitle } from '@/components/ui/Card'

const laneStyles: Record<TimingLaneTone, { border: string; surface: string; icon: string; accent: string }> = {
  scheduled: {
    border: 'border-warning/35',
    surface: 'bg-warning/5',
    icon: 'border-warning/40 bg-warning/10 text-warning',
    accent: 'text-warning',
  },
  fast: {
    border: 'border-success/35',
    surface: 'bg-success/5',
    icon: 'border-success/40 bg-success/10 text-success',
    accent: 'text-success',
  },
}

export function TimingComparisonView({ block }: { block: TimingComparisonBlock }) {
  return (
    <Card variant="study" className="technical-surface overflow-hidden p-0">
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="mb-0 text-base">{block.heading}</CardTitle>
          {block.badge && <Badge type={block.badge} />}
        </div>
        {block.intro && <p className="mt-2 max-w-4xl text-sm leading-relaxed text-text/85">{block.intro}</p>}
      </div>

      <div className="grid lg:grid-cols-2" role="group" aria-label={block.heading}>
        {block.lanes.map((lane, laneIndex) => {
          const styles = laneStyles[lane.tone]
          const LaneIcon = lane.tone === 'fast' ? Zap : CalendarClock

          return (
            <section
              key={lane.id}
              className={clsx(
                'min-w-0 p-4 sm:p-5',
                styles.surface,
                laneIndex === 0 ? 'border-b border-border lg:border-b-0 lg:border-r' : '',
              )}
            >
              <div className="flex items-start gap-3">
                <span className={clsx('flex h-10 w-10 shrink-0 items-center justify-center rounded-md border', styles.icon)}>
                  <LaneIcon size={19} />
                </span>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold">{lane.label}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-text/75">{lane.summary}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className={clsx('rounded-md border px-3 py-2', styles.border)}>
                  <div className="text-muted">{lane.availability}</div>
                </div>
                <div className={clsx('rounded-md border px-3 py-2 font-semibold', styles.border, styles.accent)}>
                  {lane.elapsed}
                </div>
              </div>

              <ol className="mt-5">
                {lane.stages.map((stage, stageIndex) => {
                  const StepIcon = stage.wait ? Clock3 : ArrowRight
                  return (
                    <li key={stage.id} className="relative grid min-h-20 grid-cols-[2.25rem_minmax(0,1fr)] gap-3 pb-4 last:min-h-0 last:pb-0">
                      {stageIndex < lane.stages.length - 1 && (
                        <span className="absolute left-[1.08rem] top-8 h-[calc(100%-1.5rem)] w-px bg-border" aria-hidden="true" />
                      )}
                      <span className={clsx('relative z-10 flex h-9 w-9 items-center justify-center rounded-md border', styles.icon)}>
                        <StepIcon size={16} />
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                          <span className="text-sm font-semibold">{stage.label}</span>
                          <span className={clsx('font-mono text-[11px] font-semibold', styles.accent)}>{stage.timing}</span>
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-text/75">{stage.description}</p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </section>
          )
        })}
      </div>

      <div className="border-t border-border bg-bg/35 px-4 py-3 text-sm leading-relaxed text-text/85 sm:px-5">
        {block.conclusion}
      </div>
    </Card>
  )
}
