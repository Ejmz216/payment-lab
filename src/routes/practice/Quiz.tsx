import { useState } from 'react'
import clsx from 'clsx'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getQuizQuestions } from '@/lib/i18nContent'
import { Card } from '@/components/ui/Card'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { useProgressStore } from '@/store/progressStore'

type Confidence = 'guess' | 'unsure' | 'confident' | 'very-confident'
const confidenceKeys: { c: Confidence; key: 'confidence.guess' | 'confidence.unsure' | 'confidence.confident' | 'confidence.veryConfident' }[] = [
  { c: 'guess', key: 'confidence.guess' },
  { c: 'unsure', key: 'confidence.unsure' },
  { c: 'confident', key: 'confidence.confident' },
  { c: 'very-confident', key: 'confidence.veryConfident' },
]

export function Quiz() {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [confidence, setConfidence] = useState<Confidence | null>(null)
  const recordQuiz = useProgressStore((s) => s.recordQuiz)
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const quizQuestions = getQuizQuestions(lang)
  const q = quizQuestions[idx]

  function choose(choiceId: string) {
    if (revealed) return
    setSelected(choiceId)
    setRevealed(true)
  }

  function submitConfidence(c: Confidence) {
    setConfidence(c)
    const choice = q.choices.find((ch) => ch.id === selected)
    recordQuiz({ questionId: q.id, correct: !!choice?.correct, confidence: c, timestamp: new Date().toISOString() })
  }

  function next() {
    setIdx((i) => (i + 1) % quizQuestions.length)
    setSelected(null)
    setRevealed(false)
    setConfidence(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: t('nav.dashboard'), to: '/' }, { label: t('nav.practice'), to: '/practice' }, { label: t('practice.quiz') }]} />
      <div>
        <h1 className="text-2xl font-semibold">{t('practice.quiz')}</h1>
        <p className="mt-1 text-sm text-muted">{t('practice.questionOf')} {idx + 1} {t('practice.of')} {quizQuestions.length}</p>
      </div>

      <Card>
        <div className="mb-3 text-sm font-medium">{q.prompt}</div>
        <div className="flex flex-col gap-2">
          {q.choices.map((c) => (
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
            <p className="text-text/90">{q.explanation}</p>
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

        {confidence && (
          <button onClick={next} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            {t('practice.nextQuestion')}
          </button>
        )}
      </Card>
    </div>
  )
}
