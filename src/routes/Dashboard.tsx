import { Link } from 'react-router-dom'
import { fastPaymentsPath } from '@/content/lessons/fastPaymentsPath'
import { useProgressStore } from '@/store/progressStore'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getLessons, getConfusions } from '@/lib/i18nContent'
import { computeAllTopicMastery } from '@/lib/mastery'
import { Card, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ArrowRight, Check } from 'lucide-react'

export function Dashboard() {
  const completed = useProgressStore((s) => s.completedLessons)
  const quizResults = useProgressStore((s) => s.quizResults)
  const scenarioHistory = useProgressStore((s) => s.scenarioHistory)
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const orderedLessons = getLessons(lang).slice().sort((a, b) => a.order - b.order)
  const nextLesson = orderedLessons.find((l) => !completed.includes(l.id)) ?? orderedLessons[0]
  const courseProgress = Math.round((completed.length / orderedLessons.length) * 100)
  const featuredConfusion = getConfusions(lang)[0]

  const topics = computeAllTopicMastery(orderedLessons, completed, quizResults, scenarioHistory)
  const practicedTopics = topics.filter((topic) => topic.hasPractice)
  const avgMastery = practicedTopics.length
    ? Math.round(practicedTopics.reduce((sum, topic) => sum + topic.mastery, 0) / practicedTopics.length)
    : null

  const totalAnswers = quizResults.length + scenarioHistory.length
  const totalCorrect = quizResults.filter((r) => r.correct).length + scenarioHistory.filter((r) => r.correct).length
  const practiceAccuracy = totalAnswers ? Math.round((totalCorrect / totalAnswers) * 100) : null

  const weakestTopic = practicedTopics.length
    ? practicedTopics.slice().sort((a, b) => a.mastery - b.mastery)[0]
    : null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('dashboard.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('dashboard.subtitle')}</p>
      </div>

      <Card variant="study" className="technical-surface">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted">{t('dashboard.continueLearning')}</div>
            <div className="mt-1 text-lg font-semibold">{t('nav.fastPayments')} → {nextLesson.title}</div>
            <p className="mt-1 max-w-xl text-sm text-muted">{nextLesson.whyItMatters}</p>
          </div>
          <Link
            to={`/learn/fast-payments/${nextLesson.id}`}
            className="flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            {t('dashboard.continue')} <ArrowRight size={15} />
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card variant="study">
          <CardTitle>{t('dashboard.courseProgress')}</CardTitle>
          <div className="mt-2 text-2xl font-semibold">{courseProgress}%</div>
          <div className="mt-2"><ProgressBar value={courseProgress} /></div>
          <div className="mt-2 text-xs text-muted">{completed.length} / {orderedLessons.length} {t('dashboard.courseProgressDesc')}</div>
        </Card>
        <Card variant="simulation">
          <CardTitle>{t('dashboard.mastery')}</CardTitle>
          {avgMastery === null ? (
            <div className="mt-2 text-sm text-muted">{t('dashboard.masteryNoData')}</div>
          ) : (
            <>
              <div className="mt-2 text-2xl font-semibold">{avgMastery}%</div>
              <div className="mt-2"><ProgressBar value={avgMastery} /></div>
              <div className="mt-2 text-xs text-muted">{practicedTopics.length} {t('dashboard.masteryDesc')}</div>
            </>
          )}
        </Card>
        <Card variant="investigation">
          <CardTitle>{t('dashboard.practiceAccuracy')}</CardTitle>
          {practiceAccuracy === null ? (
            <div className="mt-2 text-sm text-muted">{t('dashboard.noPracticeYet')}</div>
          ) : (
            <>
              <div className="mt-2 text-2xl font-semibold">{practiceAccuracy}%</div>
              <div className="mt-2"><ProgressBar value={practiceAccuracy} /></div>
              <div className="mt-2 text-xs text-muted">{totalCorrect} / {totalAnswers} {t('dashboard.practiceAccuracyDesc')}</div>
            </>
          )}
        </Card>
        <Card variant="warning">
          <CardTitle>{t('dashboard.weakestArea')}</CardTitle>
          {weakestTopic === null ? (
            <div className="mt-2 text-sm text-muted">{t('dashboard.noPracticeYet')}</div>
          ) : (
            <>
              <Link to={`/learn/fast-payments/${weakestTopic.id}`} className="mt-2 block text-sm hover:text-primary hover:underline">{weakestTopic.label}</Link>
              <div className="mt-2"><ProgressBar value={weakestTopic.mastery} /></div>
              <div className="mt-2 text-xs text-muted">{weakestTopic.mastery}% {t('dashboard.weakestAreaDesc')}</div>
            </>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card variant="study">
          <CardTitle>{t('dashboard.recommendedNext')}</CardTitle>
          <div className="mt-2 text-sm">{nextLesson.title}</div>
          <div className="mt-1 text-xs text-muted">{nextLesson.estimatedMinutes} {t('dashboard.min')}</div>
        </Card>
        <Card variant="investigation">
          <CardTitle>{t('dashboard.commonConfusion')}</CardTitle>
          <div className="mt-2 text-sm">{featuredConfusion.title}</div>
          <Link to="/confusions" className="mt-1 inline-block text-xs text-primary hover:underline">{t('dashboard.seeAllConfusions')}</Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card variant="simulation">
          <CardTitle>{t('dashboard.practice')}</CardTitle>
          <p className="mt-1 text-sm text-muted">{t('dashboard.practiceDesc')}</p>
          <Link to="/practice" className="mt-3 inline-block rounded-md border border-border px-3 py-1.5 text-sm hover:bg-surface2">{t('dashboard.openPractice')}</Link>
        </Card>
        <Card variant="reference">
          <CardTitle>{t('dashboard.exploreAtlas')}</CardTitle>
          <p className="mt-1 text-sm text-muted">{t('dashboard.exploreAtlasDesc')}</p>
          <Link to="/atlas" className="mt-3 inline-block rounded-md border border-border px-3 py-1.5 text-sm hover:bg-surface2">{t('dashboard.openAtlas')}</Link>
        </Card>
      </div>

      <Card variant="public-scheme">
        <CardTitle>SPI Republica Dominicana Study Pack</CardTitle>
        <p className="mt-1 text-sm text-muted">
          Estudia pacs.008, pacs.004 y camt.003 desde el caso publico dominicano, separando ISO, esquema publico y preguntas TO VERIFY.
        </p>
        <Link to="/learn/spi-dominicana" className="mt-3 inline-block rounded-md border border-scheme/40 px-3 py-1.5 text-sm text-scheme hover:bg-scheme/10">
          Abrir pack SPI
        </Link>
      </Card>

      <Card variant="study">
        <CardTitle>{fastPaymentsPath.title === 'Fast Payments Path' ? t('fp.title') : fastPaymentsPath.title}</CardTitle>
        <p className="mt-1 text-sm text-muted">{t('fp.description')}</p>
        <ol className="mt-4 flex flex-col gap-1.5">
          {orderedLessons.map((l) => {
            const done = completed.includes(l.id)
            return (
              <li key={l.id}>
                <Link
                  to={`/learn/fast-payments/${l.id}`}
                  className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-surface2"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${done ? 'bg-success text-white' : 'border border-border text-muted'}`}
                  >
                    {done ? <Check size={12} strokeWidth={3} /> : l.order}
                  </span>
                  <span className={done ? 'text-muted line-through' : ''}>{l.title}</span>
                </Link>
              </li>
            )
          })}
        </ol>
      </Card>
    </div>
  )
}
