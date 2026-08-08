import { useProgressStore } from '@/store/progressStore'
import { fastPaymentsLessons } from '@/content/lessons/fastPaymentsPath'
import { messages } from '@/content/messages'
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

  const lessonPct = Math.round((completedLessons.length / fastPaymentsLessons.length) * 100)
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
        <h1 className="text-2xl font-semibold">Progress</h1>
        <p className="mt-1 text-sm text-muted">Stored locally in your browser only. No account, no cloud.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Lessons" value={lessonPct} sub={`${completedLessons.length}/${fastPaymentsLessons.length} complete`} />
        <Metric label="Quiz accuracy" value={quizPct} sub={`${quizResults.length} answered`} />
        <Metric label="Scenario accuracy" value={scenarioPct} sub={`${scenarioHistory.length} answered`} />
        <Metric label="Messages explored" value={messagePct} sub={`${messageViewed.length}/${messages.length} viewed`} />
      </div>

      <Card>
        <CardTitle>Reset progress</CardTitle>
        <p className="text-sm text-muted">This clears completed lessons, quiz results, scenario history and viewed messages from this browser.</p>
        <button
          onClick={onReset}
          className="mt-3 rounded-md border border-danger px-4 py-2 text-sm font-medium text-danger hover:bg-danger/10"
        >
          {confirming ? 'Click again to confirm reset' : 'Reset progress'}
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
