import { useState } from 'react'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getQuizQuestions } from '@/lib/i18nContent'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { QuizQuestionCard } from '@/components/practice/QuizQuestionCard'

export function Quiz() {
  const [idx, setIdx] = useState(0)
  const [answered, setAnswered] = useState(false)
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const quizQuestions = getQuizQuestions(lang)
  const q = quizQuestions[idx]

  function next() {
    setIdx((i) => (i + 1) % quizQuestions.length)
    setAnswered(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: t('nav.dashboard'), to: '/' }, { label: t('nav.practice'), to: '/practice' }, { label: t('practice.quiz') }]} />
      <div>
        <h1 className="text-2xl font-semibold">{t('practice.quiz')}</h1>
        <p className="mt-1 text-sm text-muted">{t('practice.questionOf')} {idx + 1} {t('practice.of')} {quizQuestions.length}</p>
      </div>

      <QuizQuestionCard key={q.id} question={q} onAnswered={() => setAnswered(true)} />

      {answered && (
        <button onClick={next} className="self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          {t('practice.nextQuestion')}
        </button>
      )}
    </div>
  )
}
