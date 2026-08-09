import { useState } from 'react'
import { Activity, Landmark, MessageSquareText, UserRound } from 'lucide-react'
import clsx from 'clsx'
import type { FourLayerStep } from '@/types/blocks'
import { Badge } from '@/components/ui/Badge'

const layers = [
  { key: 'actor', label: 'ACTORS', icon: UserRound, tone: 'border-party/35 bg-party/10 text-party' },
  { key: 'message', label: 'MESSAGES', icon: MessageSquareText, tone: 'border-pacs/35 bg-pacs/10 text-pacs' },
  { key: 'money', label: 'MONEY STATE', icon: Landmark, tone: 'border-success/35 bg-success/10 text-success' },
  { key: 'payment', label: 'PAYMENT STATE', icon: Activity, tone: 'border-iso/35 bg-iso/10 text-iso' },
] as const

export function FourLayerExplorer({ steps }: { steps: FourLayerStep[] }) {
  const [selectedId, setSelectedId] = useState(steps[0]?.id)
  const selected = steps.find((step) => step.id === selectedId) ?? steps[0]

  if (!selected) return null

  return (
    <div className="grid gap-4 xl:grid-cols-[13rem_minmax(0,1fr)]">
      <div className="flex gap-2 overflow-x-auto pb-1 xl:flex-col xl:overflow-visible" role="tablist" aria-label="Payment flow steps">
        {steps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            role="tab"
            aria-selected={step.id === selected.id}
            onClick={() => setSelectedId(step.id)}
            className={clsx(
              'flex min-h-11 min-w-[10rem] items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors xl:min-w-0',
              step.id === selected.id
                ? 'border-scheme bg-scheme/15 text-text'
                : 'border-border bg-bg/35 text-muted hover:bg-surface2 hover:text-text',
            )}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-current/30 text-xs font-semibold">
              {index + 1}
            </span>
            <span className="leading-tight">{step.title}</span>
          </button>
        ))}
      </div>

      <div className="min-w-0">
        <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-scheme/15 text-xs font-bold text-scheme">
            {steps.findIndex((step) => step.id === selected.id) + 1}
          </span>
          <h4 className="text-base font-semibold">{selected.title}</h4>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {layers.map(({ key, label, icon: Icon, tone }) => {
            const value = selected[key]
            return (
              <section key={key} className={clsx('min-w-0 rounded-md border p-3', tone)}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide">
                    <Icon size={14} /> {label}
                  </span>
                  {value.badge && <Badge type={value.badge} />}
                </div>
                <div className="mt-3 text-sm font-semibold text-text">{value.label}</div>
                <p className="mt-1 text-sm leading-relaxed text-text/80">{value.detail}</p>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
