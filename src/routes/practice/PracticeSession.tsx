import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getLessons, getScenarios, getQuizQuestions } from '@/lib/i18nContent'
import { Card, CardTitle } from '@/components/ui/Card'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ScenarioCard } from '@/components/practice/ScenarioCard'
import { QuizQuestionCard } from '@/components/practice/QuizQuestionCard'
import type { Confidence } from '@/store/progressStore'
import type { Scenario, QuizQuestion } from '@/types/content'

type PracticeItem = { kind: 'scenario'; data: Scenario; topic: string } | { kind: 'quiz'; data: QuizQuestion; topic: string }

interface SessionAnswer {
  topic: string
  correct: boolean
  confidence?: Confidence
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const SESSION_SIZE = 5

export function PracticeSession() {
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const lessons = getLessons(lang)
  const scenarios = getScenarios(lang)
  const quizQuestions = getQuizQuestions(lang)

  const allItems: PracticeItem[] = useMemo(() => {
    const s: PracticeItem[] = scenarios.map((sc) => ({ kind: 'scenario', data: sc, topic: sc.tags[0] }))
    const q: PracticeItem[] = quizQuestions.filter((qq) => qq.conceptIds?.length).map((qq) => ({ kind: 'quiz', data: qq, topic: qq.conceptIds![0] }))
    return [...s, ...q]
  }, [scenarios, quizQuestions])

  const focusOptions = useMemo(() => {
    const topics = Array.from(new Set(allItems.map((i) => i.topic)))
    return topics.map((topic) => {
      const lesson = lessons.find((l) => l.id === topic)
      return { id: topic, label: lesson?.title ?? topic, count: allItems.filter((i) => i.topic === topic).length }
    })
  }, [allItems, lessons])

  const [focus, setFocus] = useState<string>('mixed')
  const [items, setItems] = useState<PracticeItem[] | null>(null)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<SessionAnswer[]>([])

  const pool = focus === 'mixed' ? allItems : allItems.filter((i) => i.topic === focus)

  function start() {
    setItems(shuffle(pool).slice(0, SESSION_SIZE))
    setIndex(0)
    setAnswers([])
  }

  function handleAnswered(topic: string, result: { correct: boolean; confidence?: Confidence }) {
    setAnswers((prev) => [...prev, { topic, correct: result.correct, confidence: result.confidence }])
  }

  function next() {
    setIndex((i) => i + 1)
  }

  function restart() {
    setItems(null)
    setAnswers([])
    setIndex(0)
  }

  // Session review
  if (items && index >= items.length) {
    const byTopic = new Map<string, { correct: number; total: number }>()
    for (const a of answers) {
      const entry = byTopic.get(a.topic) ?? { correct: 0, total: 0 }
      entry.total += 1
      if (a.correct) entry.correct += 1
      byTopic.set(a.topic, entry)
    }
    const rows = Array.from(byTopic.entries()).map(([topic, stat]) => {
      const pct = Math.round((stat.correct / stat.total) * 100)
      const status: 'strong' | 'review' | 'weak' = pct >= 80 ? 'strong' : pct >= 50 ? 'review' : 'weak'
      const lesson = lessons.find((l) => l.id === topic)
      return { topic, label: lesson?.title ?? topic, pct, status, lessonId: lesson?.id }
    })
    const weakest = rows.slice().sort((a, b) => a.pct - b.pct)[0]
    const totalCorrect = answers.filter((a) => a.correct).length
    const statusColor: Record<string, string> = {
      strong: 'border-success/50 bg-success/10 text-success',
      review: 'border-warning/50 bg-warning/10 text-warning',
      weak: 'border-danger/50 bg-danger/10 text-danger',
    }
    const statusLabel: Record<string, string> = { strong: t('practice.strong'), review: t('practice.needsReview'), weak: t('practice.weak') }

    return (
      <div className="flex flex-col gap-6">
        <Breadcrumbs items={[{ label: t('nav.dashboard'), to: '/' }, { label: t('nav.practice'), to: '/practice' }, { label: t('practice.sessionReview') }]} />
        <div>
          <h1 className="text-2xl font-semibold">{t('practice.sessionReview')}</h1>
          <p className="mt-1 text-sm text-muted">{t('practice.sessionComplete')} {t('practice.scoreLabel')}: {totalCorrect} / {answers.length}</p>
        </div>

        <Card>
          <div className="flex flex-col gap-2">
            {rows.map((r) => (
              <div key={r.topic} className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2">
                <span className="text-sm">{r.label}</span>
                <span className={clsx('rounded-full border px-2 py-0.5 text-[10px] font-medium', statusColor[r.status])}>{statusLabel[r.status]}</span>
              </div>
            ))}
          </div>
        </Card>

        {weakest && (
          <Card>
            <CardTitle>{t('practice.recommendedNext')}</CardTitle>
            {weakest.lessonId ? (
              <Link to={`/learn/fast-payments/${weakest.lessonId}`} className="text-sm text-primary hover:underline">{weakest.label} →</Link>
            ) : (
              <p className="text-sm text-text/90">{weakest.label}</p>
            )}
          </Card>
        )}

        <div className="flex gap-2">
          <button onClick={restart} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">{t('practice.startNewSession')}</button>
          <Link to="/practice" className="rounded-md border border-border px-4 py-2 text-sm hover:bg-surface2">{t('practice.backToPractice')}</Link>
        </div>
      </div>
    )
  }

  // Running
  if (items) {
    const current = items[index]
    return (
      <div className="flex flex-col gap-6">
        <Breadcrumbs items={[{ label: t('nav.dashboard'), to: '/' }, { label: t('nav.practice'), to: '/practice' }, { label: t('practice.session') }]} />
        <div>
          <h1 className="text-2xl font-semibold">{t('practice.session')}</h1>
          <p className="mt-1 text-sm text-muted">{t('practice.focus')}: {focusOptions.find((f) => f.id === focus)?.label ?? t('practice.mixedReview')}</p>
          <div className="mt-2">
            <ProgressBar value={(index / items.length) * 100} />
            <div className="mt-1 text-xs text-muted">{index + 1} / {items.length}</div>
          </div>
        </div>

        {current.kind === 'scenario' ? (
          <ScenarioCard key={current.data.id} scenario={current.data} onAnswered={(r) => handleAnswered(current.topic, r)} />
        ) : (
          <QuizQuestionCard key={current.data.id} question={current.data} onAnswered={(r) => handleAnswered(current.topic, r)} />
        )}

        {answers.length === index + 1 && (
          <button onClick={next} className="self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            {index + 1 < items.length ? t('practice.nextQuestion') : t('practice.sessionReview')}
          </button>
        )}
      </div>
    )
  }

  // Config
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: t('nav.dashboard'), to: '/' }, { label: t('nav.practice'), to: '/practice' }, { label: t('practice.session') }]} />
      <div>
        <h1 className="text-2xl font-semibold">{t('practice.session')}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{t('practice.sessionDesc')}</p>
      </div>

      <Card>
        <CardTitle>{t('practice.focus')}</CardTitle>
        <div className="mt-2 flex flex-col gap-2">
          <button
            onClick={() => setFocus('mixed')}
            className={clsx('flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm', focus === 'mixed' ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-surface2')}
          >
            <span>{t('practice.mixedReview')}</span>
            <span className="text-xs text-muted">{allItems.length} {t('practice.itemsAvailable')}</span>
          </button>
          {focusOptions.map((f) => (
            <button
              key={f.id}
              onClick={() => setFocus(f.id)}
              className={clsx('flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm', focus === f.id ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-surface2')}
            >
              <span>{f.label}</span>
              <span className="text-xs text-muted">{f.count} {t('practice.itemsAvailable')}</span>
            </button>
          ))}
        </div>
      </Card>

      {pool.length === 0 ? (
        <p className="text-sm text-warning">{t('practice.notEnoughItems')}</p>
      ) : (
        <button onClick={start} className="self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          {t('practice.startSession')} ({Math.min(SESSION_SIZE, pool.length)})
        </button>
      )}
    </div>
  )
}
