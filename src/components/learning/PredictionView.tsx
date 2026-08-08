import { useState } from 'react'
import clsx from 'clsx'
import { Card, CardTitle } from '@/components/ui/Card'
import { useT } from '@/i18n/strings'
import type { ChoiceOption } from '@/types/blocks'

interface PredictionViewProps {
  label: string
  question: string
  context?: string
  options: ChoiceOption[]
  explanation: string
}

export function PredictionView({ label, question, context, options, explanation }: PredictionViewProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const t = useT()

  function choose(id: string) {
    if (revealed) return
    setSelected(id)
    setRevealed(true)
  }

  return (
    <Card className="border-primary/30">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-primary">{label}</div>
      {context && <div className="mb-2 rounded-md border border-border bg-surface2 px-3 py-1.5 font-mono text-xs">{context}</div>}
      <CardTitle>{question}</CardTitle>
      <div className="mt-2 flex flex-col gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => choose(o.id)}
            disabled={revealed}
            className={clsx(
              'rounded-md border px-3 py-2 text-left text-sm',
              revealed && o.correct && 'border-success bg-success/10',
              revealed && selected === o.id && !o.correct && 'border-danger bg-danger/10',
              !revealed && 'border-border hover:bg-surface2',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      {revealed && (
        <div className="mt-3 rounded-md border border-border bg-surface2 p-3 text-sm">
          <div className="mb-1 font-semibold">
            {selected && options.find((o) => o.id === selected)?.correct ? t('practice.correct') : t('practice.incorrect')}
          </div>
          <p className="text-text/90">{explanation}</p>
        </div>
      )}
    </Card>
  )
}
