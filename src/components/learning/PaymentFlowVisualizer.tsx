import { ArrowRight, Building2, CircleDot, Landmark, UserRound } from 'lucide-react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import type { ActorKind, FlowActor, FlowStep } from '@/types/blocks'

const statusColor: Record<string, string> = {
  inactive: 'border-border text-muted',
  active: 'border-primary text-primary bg-primary/10',
  success: 'border-success text-success bg-success/10',
  failure: 'border-danger text-danger bg-danger/10',
  warning: 'border-warning text-warning bg-warning/10',
}

const actorIcons: Record<ActorKind | 'neutral', typeof UserRound> = {
  party: UserRound,
  agent: Building2,
  infrastructure: Landmark,
  neutral: CircleDot,
}

const actorStyles: Record<ActorKind | 'neutral', string> = {
  party: 'border-party/40 bg-party/10 text-party',
  agent: 'border-agent/40 bg-agent/10 text-agent',
  infrastructure: 'border-infra/40 bg-infra/10 text-infra',
  neutral: 'border-border bg-surface2 text-text',
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
    <div className="overflow-x-auto pb-2" role="group" aria-label="Payment flow diagram">
      <div className="mx-auto flex min-w-max items-stretch py-2">
        {actors.map((actor, i) => {
          const next = actors[i + 1]
          const step = next ? stepBetween(actor.id, next.id) : undefined
          const stepIndex = step ? steps.indexOf(step) : -1
          const kind = actor.kind ?? 'neutral'
          const ActorIcon = actorIcons[kind]
          const connector = next && (
            <>
              {step?.label && (
                <span
                  className={clsx(
                    'max-w-12 rounded border px-1 py-0.5 text-center font-mono text-[9px] leading-tight',
                    statusColor[step.status ?? 'inactive'],
                    selectedIndex === stepIndex && 'ring-1 ring-primary',
                  )}
                >
                  {step.messageId && !onStepClick ? (
                    <Link to={`/atlas/messages/${step.messageId}`} className="hover:underline">
                      {step.label}
                    </Link>
                  ) : (
                    step.label
                  )}
                </span>
              )}
              <ArrowRight size={18} className={clsx('shrink-0', step?.status ? statusColor[step.status].split(' ')[1] : 'text-muted')} />
            </>
          )

          return (
            <div key={actor.id} className="flex items-stretch">
              <div className={clsx('flex min-h-24 w-28 flex-col items-center justify-center rounded-md border px-1.5 py-3 text-center', actorStyles[kind])}>
                <span className="flex h-8 w-8 items-center justify-center rounded border border-current/35">
                  <ActorIcon size={17} />
                </span>
                <span className="mt-2 max-w-full break-all text-[11px] font-semibold leading-tight">{actor.label}</span>
                {actor.role && <span className="mt-1 break-words text-[10px] leading-tight opacity-75">{actor.role}</span>}
              </div>
              {next && (onStepClick && step ? (
                <button
                  type="button"
                  onClick={() => onStepClick(step, stepIndex)}
                  className="flex w-12 shrink-0 flex-col items-center justify-center gap-1 px-1 hover:bg-surface2/50"
                  aria-label={step.label ?? `${step.from} to ${step.to}`}
                >
                  {connector}
                </button>
              ) : (
                <div className="flex w-12 shrink-0 flex-col items-center justify-center gap-1 px-1">{connector}</div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
