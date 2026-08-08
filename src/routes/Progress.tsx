import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { useProgressStore } from '@/store/progressStore'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getLessons, getMessages } from '@/lib/i18nContent'
import { computeAllTopicMastery, type MasteryStatus } from '@/lib/mastery'
import { Card, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useState } from 'react'

const statusColor: Record<MasteryStatus, string> = {
  'not-started': 'border-border text-muted',
  learning: 'border-warning/50 bg-warning/10 text-warning',
  practicing: 'border-primary/50 bg-primary/10 text-primary',
  mastered: 'border-success/50 bg-success/10 text-success',
}

export function Progress() {
  const completedLessons = useProgressStore((s) => s.completedLessons)
  const quizResults = useProgressStore((s) => s.quizResults)
  const scenarioHistory = useProgressStore((s) => s.scenarioHistory)
  const messageViewed = useProgressStore((s) => s.messageViewed)
  const resetProgress = useProgressStore((s) => s.resetProgress)
  const [confirming, setConfirming] = useState(false)
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const lessons = getLessons(lang)
  const messages = getMessages(lang)
  const topics = computeAllTopicMastery(lessons, completedLessons, quizResults, scenarioHistory)

  const statusLabel: Record<MasteryStatus, string> = {
    'not-started': t('status.notStarted'),
    learning: t('status.learning'),
    practicing: t('status.practicing'),
    mastered: t('status.mastered'),
  }

  const lessonPct = Math.round((completedLessons.length / lessons.length) * 100)
  const quizCorrect = quizResults.filter((r) => r.correct).length
  const quizPct = quizResults.length ? Math.round((quizCorrect / quizResults.length) * 100) : 0
  const scenarioCorrect = scenarioHistory.filter((r) => r.correct).length
  const scenarioPct = scenarioHistory.length ? Math.round((scenarioCorrect / scenarioHistory.length) * 100) : 0
  const messagePct = Math.round((messageViewed.length / messages.length) * 100)

  function onReset() {
    if (!confirming) {
      setConfirming(true)
      return
    }
    resetProgress()
    setConfirming(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('progress.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('progress.description')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label={t('progress.lessons')} value={lessonPct} sub={`${completedLessons.length}/${lessons.length} ${t('progress.complete')}`} />
        <Metric label={t('progress.quizAccuracy')} value={quizPct} sub={`${quizResults.length} ${t('progress.answered')}`} />
        <Metric label={t('progress.scenarioAccuracy')} value={scenarioPct} sub={`${scenarioHistory.length} ${t('progress.answered')}`} />
        <Metric label={t('progress.messagesExplored')} value={messagePct} sub={`${messageViewed.length}/${messages.length} ${t('progress.viewed')}`} />
      </div>

      <Card>
        <CardTitle>{t('progress.topicMastery')}</CardTitle>
        <p className="mb-3 text-xs text-muted">{t('progress.topicMasteryNote')}</p>
        <div className="flex flex-col gap-3">
          {topics.map((topic) => (
            <div key={topic.id}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <Link to={`/learn/fast-payments/${topic.id}`} className="hover:text-primary hover:underline">{topic.label}</Link>
                <span className="text-xs text-muted">{topic.mastery}%</span>
              </div>
              <ProgressBar value={topic.mastery} />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>{t('progress.learningMap')}</CardTitle>
        <div className="mt-2 flex flex-col gap-1.5">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              to={`/learn/fast-payments/${topic.id}`}
              className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-surface2"
            >
              <span>{topic.label}</span>
              <span className={clsx('shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium', statusColor[topic.status])}>
                {statusLabel[topic.status]}
              </span>
            </Link>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>{t('progress.resetTitle')}</CardTitle>
        <p className="text-sm text-muted">{t('progress.resetDesc')}</p>
        <button
          onClick={onReset}
          className="mt-3 rounded-md border border-danger px-4 py-2 text-sm font-medium text-danger hover:bg-danger/10"
        >
          {confirming ? t('progress.resetConfirm') : t('progress.resetTitle')}
        </button>
      </Card>
    </div>
  )
}

function Metric({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <Card>
      <CardTitle>{label}</CardTitle>
      <div className="mt-1 text-2xl font-semibold">{value}%</div>
      <div className="mt-2"><ProgressBar value={value} /></div>
      <div className="mt-1.5 text-xs text-muted">{sub}</div>
    </Card>
  )
}
