import { useState } from 'react'
import clsx from 'clsx'
import { Card, CardTitle } from '@/components/ui/Card'

const stages = ['Initiated', 'Received', 'Validated', 'Accepted', 'Settled', 'Credited']

const answers: Record<number, { correct: string; explanation: string }> = {
  0: { correct: 'Reject', explanation: 'A failure before the payment is even received/validated is investigated as a reject — the payment never truly progressed.' },
  1: { correct: 'Reject', explanation: 'A failure at Received (e.g. malformed message) is still pre-validation — investigate as a reject.' },
  2: { correct: 'Reject', explanation: 'A validation failure prevents the payment from being accepted — this is the classic shape of a reject.' },
  3: { correct: 'Reject or Return (depends on scheme)', explanation: 'Right at Accepted the boundary can be scheme-dependent — some schemes may still allow a rejection-style response very close to acceptance, others treat acceptance as final. Investigate both possibilities.' },
  4: { correct: 'Return', explanation: 'Once settled, the obligation has been discharged. A later failure requires unwinding via a return, not a reject.' },
  5: { correct: 'Return', explanation: 'A failure at Credited (e.g. closed account) happens after the payment already progressed — this is a return scenario.' },
}

export function RejectVsReturn() {
  const [stageIdx, setStageIdx] = useState<number | null>(null)
  const [choice, setChoice] = useState<string | null>(null)

  const answer = stageIdx !== null ? answers[stageIdx] : null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Reject vs. Return Trainer</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Click a stage on the lifecycle to place a failure there, then decide what you would investigate. The exact boundary
          and messages used depend on the payment scheme — use this to build intuition, not as a fixed rule.
        </p>
      </div>

      <Card>
        <CardTitle>Lifecycle</CardTitle>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {stages.map((s, i) => (
            <button
              key={s}
              onClick={() => { setStageIdx(i); setChoice(null) }}
              className={clsx(
                'rounded-md border px-3 py-2 text-sm',
                stageIdx === i ? 'border-danger bg-danger/10 text-danger' : 'border-border hover:bg-surface2',
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </Card>

      {stageIdx !== null && (
        <Card>
          <CardTitle>A failure occurs at "{stages[stageIdx]}". Would you investigate:</CardTitle>
          <div className="mt-2 flex flex-wrap gap-2">
            {['Reject', 'Return', 'Cancellation', 'Status', 'Other'].map((opt) => (
              <button
                key={opt}
                onClick={() => setChoice(opt)}
                className={clsx(
                  'rounded-md border px-3 py-1.5 text-sm',
                  choice === opt ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-surface2',
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          {choice && answer && (
            <div className="mt-3 rounded-md border border-border bg-surface2 p-3 text-sm">
              <div className="mb-1 font-semibold">Most likely: {answer.correct}</div>
              <p className="text-text/90">{answer.explanation}</p>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
