import { useProgressStore } from '@/store/progressStore'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getLessons, getMessages } from '@/lib/i18nContent'
import { Card, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useState } from 'react'

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
