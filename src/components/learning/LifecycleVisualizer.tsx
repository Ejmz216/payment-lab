import { useState } from 'react'
import clsx from 'clsx'
import type { LifecycleStageInfo } from '@/types/blocks'
import { Card } from '@/components/ui/Card'
import { useT } from '@/i18n/strings'

interface LifecycleVisualizerProps {
  stages: LifecycleStageInfo[]
  onSelect?: (stage: LifecycleStageInfo) => void
}

export function LifecycleVisualizer({ stages, onSelect }: LifecycleVisualizerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const t = useT()
  const selected = stages.find((s) => s.id === selectedId)

  function select(stage: LifecycleStageInfo) {
    setSelectedId(stage.id)
    onSelect?.(stage)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Payment lifecycle stages">
        {stages.map((stage, i) => (
          <div key={stage.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => select(stage)}
              className={clsx(
                'rounded-md border px-3 py-2 text-sm font-medium transition-colors',
                selectedId === stage.id ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-surface2',
              )}
            >
              {stage.label}
            </button>
            {i < stages.length - 1 && <span className="text-muted">→</span>}
          </div>
        ))}
      </div>
      {selected && (
        <Card className="mt-3">
          <div className="mb-1 text-sm font-semibold">{selected.label}</div>
          <p className="text-sm text-text/90">{selected.description}</p>
          {selected.canFail && (
            <p className="mt-2 text-xs text-warning">
              <span className="font-medium">{t('lifecycle.canFail')}: </span>
              {selected.canFail}
            </p>
          )}
        </Card>
      )}
    </div>
  )
}
