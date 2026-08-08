import { useState } from 'react'
import clsx from 'clsx'
import type { Scenario } from '@/types/content'
import { Card } from '@/components/ui/Card'
import { useProgressStore } from '@/store/progressStore'
import { Link } from 'react-router-dom'

export function ScenarioCard({ scenario }: { scenario: Scenario }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const recordScenario = useProgressStore((s) => s.recordScenario)

  function choose(choiceId: string) {
    if (revealed) return
    setSelected(choiceId)
    setRevealed(true)
    const choice = scenario.choices.find((c) => c.id === choiceId)
    recordScenario({ scenarioId: scenario.id, correct: !!choice?.correct, timestamp: new Date().toISOString() })
  }

  return (
    <Card>
      <div className="mb-1 text-sm font-semibold">{scenario.title}</div>
      <p className="mb-3 text-sm text-text/90">{scenario.prompt}</p>
      <div className="flex flex-col gap-2">
        {scenario.choices.map((choice) => {
          const isSelected = selected === choice.id
          const showCorrect = revealed && choice.correct
          const showWrong = revealed && isSelected && !choice.correct
          return (
            <button
              key={choice.id}
              onClick={() => choose(choice.id)}
              disabled={revealed}
              className={clsx(
                'rounded-md border px-3 py-2 text-left text-sm transition-colors',
                showCorrect && 'border-success bg-success/10',
                showWrong && 'border-danger bg-danger/10',
                !revealed && 'border-border hover:bg-surface2',
                revealed && !showCorrect && !showWrong && 'border-border opacity-60',
              )}
            >
              {choice.label}
            </button>
          )
        })}
      </div>
      {revealed && (
        <div className="mt-3 rounded-md border border-border bg-surface2 p-3 text-sm">
          <div className="mb-1 font-semibold">{selected && scenario.choices.find((c) => c.id === selected)?.correct ? 'Correct' : 'Incorrect'}</div>
          <p className="text-text/90">{scenario.explanation.reasoning}</p>
          {scenario.explanation.lifecycleImpact && (
            <p className="mt-1 text-xs text-muted"><span className="font-medium text-text">Lifecycle:</span> {scenario.explanation.lifecycleImpact}</p>
          )}
          {scenario.explanation.relatedMessages && scenario.explanation.relatedMessages.length > 0 && (
            <p className="mt-1 text-xs text-muted">
              <span className="font-medium text-text">Related: </span>
              {scenario.explanation.relatedMessages.map((m, i) => (
                <span key={m}>
                  {i > 0 && ', '}
                  <Link to={`/atlas/messages/${m}`} className="text-primary hover:underline">{m}</Link>
                </span>
              ))}
            </p>
          )}
          {scenario.explanation.dependsOnScheme && (
            <p className="mt-2 text-xs font-medium text-danger">DEPENDS ON SCHEME — the exact messages/rules can vary by payment scheme.</p>
          )}
        </div>
      )}
    </Card>
  )
}
