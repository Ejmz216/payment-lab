import { useState } from 'react'
import clsx from 'clsx'
import type { Scenario } from '@/types/content'
import { Card } from '@/components/ui/Card'
import { useProgressStore, type Confidence } from '@/store/progressStore'
import { useT } from '@/i18n/strings'
import { Link } from 'react-router-dom'

const confidenceKeys: { c: Confidence; key: 'confidence.guess' | 'confidence.unsure' | 'confidence.confident' | 'confidence.veryConfident' }[] = [
  { c: 'guess', key: 'confidence.guess' },
  { c: 'unsure', key: 'confidence.unsure' },
  { c: 'confident', key: 'confidence.confident' },
  { c: 'very-confident', key: 'confidence.veryConfident' },
]

interface ScenarioCardProps {
  scenario: Scenario
  onAnswered?: (result: { correct: boolean; confidence?: Confidence }) => void
}

export function ScenarioCard({ scenario, onAnswered }: ScenarioCardProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [confidence, setConfidence] = useState<Confidence | null>(null)
  const recordScenario = useProgressStore((s) => s.recordScenario)
  const t = useT()

  const correct = !!(selected && scenario.choices.find((c) => c.id === selected)?.correct)

  function choose(choiceId: string) {
    if (revealed) return
    setSelected(choiceId)
    setRevealed(true)
  }

  function submitConfidence(c: Confidence) {
    setConfidence(c)
    const choice = scenario.choices.find((ch) => ch.id === selected)
    const isCorrect = !!choice?.correct
    recordScenario({ scenarioId: scenario.id, correct: isCorrect, confidence: c, timestamp: new Date().toISOString() })
    onAnswered?.({ correct: isCorrect, confidence: c })
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
          <div className="mb-1 font-semibold">{correct ? t('practice.correct') : t('practice.incorrect')}</div>
          <p className="text-text/90">{scenario.explanation.reasoning}</p>
          {scenario.explanation.lifecycleImpact && (
            <p className="mt-1 text-xs text-muted"><span className="font-medium text-text">{t('practice.lifecycle')}:</span> {scenario.explanation.lifecycleImpact}</p>
          )}
          {scenario.explanation.relatedMessages && scenario.explanation.relatedMessages.length > 0 && (
            <p className="mt-1 text-xs text-muted">
              <span className="font-medium text-text">{t('practice.related')}: </span>
              {scenario.explanation.relatedMessages.map((m, i) => (
                <span key={m}>
                  {i > 0 && ', '}
                  <Link to={`/atlas/messages/${m}`} className="text-primary hover:underline">{m}</Link>
                </span>
              ))}
            </p>
          )}
          {scenario.explanation.dependsOnScheme && (
            <p className="mt-2 text-xs font-medium text-danger">{t('practice.dependsOnScheme')}</p>
          )}

          {!confidence && (
            <div className="mt-3">
              <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted">{t('practice.confidence')}</div>
              <div className="flex flex-wrap gap-2">
                {confidenceKeys.map(({ c, key }) => (
                  <button key={c} onClick={() => submitConfidence(c)} className="rounded-md border border-border px-2.5 py-1 text-xs capitalize hover:bg-surface2">
                    {t(key)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
