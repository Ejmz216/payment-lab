import { useState } from 'react'
import clsx from 'clsx'
import type { QuizQuestion } from '@/types/content'
import { Card } from '@/components/ui/Card'
import { useProgressStore, type Confidence } from '@/store/progressStore'
import { useT } from '@/i18n/strings'

const confidenceKeys: { c: Confidence; key: 'confidence.guess' | 'confidence.unsure' | 'confidence.confident' | 'confidence.veryConfident' }[] = [
  { c: 'guess', key: 'confidence.guess' },
  { c: 'unsure', key: 'confidence.unsure' },
  { c: 'confident', key: 'confidence.confident' },
  { c: 'very-confident', key: 'confidence.veryConfident' },
]

interface QuizQuestionCardProps {
  question: QuizQuestion
  onAnswered?: (result: { correct: boolean; confidence: Confidence }) => void
}

export function QuizQuestionCard({ question, onAnswered }: QuizQuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [confidence, setConfidence] = useState<Confidence | null>(null)
  const recordQuiz = useProgressStore((s) => s.recordQuiz)
  const t = useT()

  function choose(choiceId: string) {
    if (revealed) return
    setSelected(choiceId)
    setRevealed(true)
  }

  function submitConfidence(c: Confidence) {
    setConfidence(c)
    const choice = question.choices.find((ch) => ch.id === selected)
    const correct = !!choice?.correct
    recordQuiz({ questionId: question.id, correct, confidence: c, timestamp: new Date().toISOString() })
    onAnswered?.({ correct, confidence: c })
  }

  return (
    <Card>
      <div className="mb-3 text-sm font-medium">{question.prompt}</div>
      <div className="flex flex-col gap-2">
        {question.choices.map((c) => (
          <button
            key={c.id}
            onClick={() => choose(c.id)}
            disabled={revealed}
            className={clsx(
              'rounded-md border px-3 py-2 text-left text-sm',
              revealed && c.correct && 'border-success bg-success/10',
              revealed && selected === c.id && !c.correct && 'border-danger bg-danger/10',
              !revealed && 'border-border hover:bg-surface2',
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {revealed && (
        <div className="mt-3 rounded-md border border-border bg-surface2 p-3 text-sm">
          <p className="text-text/90">{question.explanation}</p>
        </div>
      )}

      {revealed && !confidence && (
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
    </Card>
  )
}
