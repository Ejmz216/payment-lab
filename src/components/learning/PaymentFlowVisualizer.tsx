import { ArrowRight } from 'lucide-react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import type { FlowActor, FlowStep } from '@/types/blocks'

const statusColor: Record<string, string> = {
  inactive: 'border-border text-muted',
  active: 'border-primary text-primary bg-primary/10',
  success: 'border-success text-success bg-success/10',
  failure: 'border-danger text-danger bg-danger/10',
  warning: 'border-warning text-warning bg-warning/10',
}

interface PaymentFlowVisualizerProps {
  actors: FlowActor[]
  steps: FlowStep[]
  onStepClick?: (step: FlowStep, index: number) => void
  selectedIndex?: number | null
}

export function PaymentFlowVisualizer({ actors, steps, onStepClick, selectedIndex }: PaymentFlowVisualizerProps) {
  function stepBetween(fromId: string, toId: string) {
    return steps.find((s) => s.from === fromId && s.to === toId)
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 overflow-x-auto py-2" role="group" aria-label="Payment flow diagram">
      {actors.map((actor, i) => {
        const next = actors[i + 1]
        const step = next ? stepBetween(actor.id, next.id) : undefined
        const stepIndex = step ? steps.indexOf(step) : -1
        return (
          <div key={actor.id} className="flex items-center gap-1">
            <div className="rounded-md border border-border bg-surface2 px-3 py-2 text-sm font-medium">{actor.label}</div>
            {next && (
              <button
                type="button"
                disabled={!onStepClick || !step}
                onClick={() => step && onStepClick?.(step, stepIndex)}
                className={clsx(
                  'flex flex-col items-center gap-0.5 px-1 text-center',
                  onStepClick && step && 'cursor-pointer',
                  !onStepClick && 'cursor-default',
                )}
              >
                {step?.label && (
                  <span
                    className={clsx(
                      'rounded border px-1.5 py-0.5 font-mono text-[10px]',
                      statusColor[step.status ?? 'inactive'],
                      selectedIndex === stepIndex && 'ring-1 ring-primary',
                    )}
                  >
                    {step.messageId && !onStepClick ? (
                      <Link to={`/atlas/messages/${step.messageId}`} onClick={(e) => e.stopPropagation()} className="hover:underline">
                        {step.label}
                      </Link>
                    ) : (
                      step.label
                    )}
                  </span>
                )}
                <ArrowRight size={16} className={clsx('shrink-0', step?.status ? statusColor[step.status].split(' ')[1] : 'text-muted')} />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
