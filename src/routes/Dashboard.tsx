import { Link } from 'react-router-dom'
import { ArrowRight, Bug, Code2, FlaskConical, Map, Search } from 'lucide-react'
import clsx from 'clsx'
import { useProgressStore } from '@/store/progressStore'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getConfusions, getFastPaymentsPath, getLessons } from '@/lib/i18nContent'
import { computeAllTopicMastery } from '@/lib/mastery'
import { buildStudyPathState } from '@/lib/studyPath'
import { Card, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'

const phaseTone = {
  study: 'bg-primary',
  reference: 'bg-iso',
  warning: 'bg-return',
  'public-scheme': 'bg-scheme',
  investigation: 'bg-warning',
  simulation: 'bg-camt',
}

export function Dashboard() {
  const completedLessons = useProgressStore((state) => state.completedLessons)
  const completedModules = useProgressStore((state) => state.completedModules ?? [])
  const quizResults = useProgressStore((state) => state.quizResults)
  const scenarioHistory = useProgressStore((state) => state.scenarioHistory)
  const lang = useUIStore((state) => state.lang)
  const t = useT()
  const lessons = getLessons(lang).slice().sort((a, b) => a.order - b.order)
  const path = getFastPaymentsPath(lang)
  const studyState = buildStudyPathState(path, lessons, completedLessons, completedModules)
  const nextItem = studyState.nextItem
  const currentPhase = studyState.currentPhase
  const featuredConfusion = getConfusions(lang)[0]

  const topics = computeAllTopicMastery(lessons, completedLessons, quizResults, scenarioHistory)
  const practicedTopics = topics.filter((topic) => topic.hasPractice)
  const avgMastery = practicedTopics.length
    ? Math.round(practicedTopics.reduce((sum, topic) => sum + topic.mastery, 0) / practicedTopics.length)
    : null
  const totalAnswers = quizResults.length + scenarioHistory.length
  const totalCorrect = quizResults.filter((result) => result.correct).length + scenarioHistory.filter((result) => result.correct).length
  const practiceAccuracy = totalAnswers ? Math.round((totalCorrect / totalAnswers) * 100) : null
  const weakestTopic = practicedTopics.length
    ? practicedTopics.slice().sort((a, b) => a.mastery - b.mastery)[0]
    : null

  const quickAccess = [
    { to: '/atlas/messages', label: t('nav.messageCatalog'), icon: Search, color: 'text-iso' },
    { to: '/lab/simulator', label: t('lab.simulatorTitle'), icon: FlaskConical, color: 'text-camt' },
    { to: '/lab/xml', label: 'XML Lab', icon: Code2, color: 'text-pacs' },
    { to: '/lab/debugger', label: t('lab.debuggerTitle'), icon: Bug, color: 'text-warning' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('dashboard.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('dashboard.subtitle')}</p>
      </div>

      <section className="technical-surface overflow-hidden rounded-lg border border-primary/40 bg-primary/5">
        <div className="flex flex-col gap-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 max-w-3xl">
              <div className="text-xs font-semibold uppercase tracking-wide text-primary">{t('dashboard.continueLearning')}</div>
              {currentPhase && <div className="mt-2 text-xs text-muted">{t('study.phase')} {currentPhase.phase.order} · {currentPhase.phase.title}</div>}
              <h2 className="mt-1 text-xl font-semibold sm:text-2xl">{nextItem?.title ?? t('study.pathComplete')}</h2>
              {nextItem && <p className="mt-2 text-sm leading-relaxed text-text/80">{nextItem.description}</p>}
            </div>
            {nextItem && (
              <Link to={nextItem.route} className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90">
                {t('dashboard.continue')} <ArrowRight size={15} />
              </Link>
            )}
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-xs text-muted">
              <span>{t('dashboard.courseProgress')}</span>
              <span className="font-mono text-text">{studyState.courseProgress}%</span>
            </div>
            <ProgressBar value={studyState.courseProgress} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card variant="study">
          <CardTitle>{t('dashboard.courseProgress')}</CardTitle>
          <div className="mt-2 text-2xl font-semibold">{studyState.courseProgress}%</div>
          <div className="mt-2"><ProgressBar value={studyState.courseProgress} /></div>
          <div className="mt-2 text-xs text-muted">{studyState.completedCount} / {studyState.availableCount} {t('study.availableComplete')}</div>
        </Card>
        <Card variant="simulation">
          <CardTitle>{t('dashboard.mastery')}</CardTitle>
          {avgMastery === null ? <div className="mt-2 text-sm text-muted">{t('dashboard.masteryNoData')}</div> : (
            <><div className="mt-2 text-2xl font-semibold">{avgMastery}%</div><div className="mt-2"><ProgressBar value={avgMastery} tone="success" /></div><div className="mt-2 text-xs text-muted">{practicedTopics.length} {t('dashboard.masteryDesc')}</div></>
          )}
        </Card>
        <Card variant="investigation">
          <CardTitle>{t('dashboard.practiceAccuracy')}</CardTitle>
          {practiceAccuracy === null ? <div className="mt-2 text-sm text-muted">{t('dashboard.noPracticeYet')}</div> : (
            <><div className="mt-2 text-2xl font-semibold">{practiceAccuracy}%</div><div className="mt-2"><ProgressBar value={practiceAccuracy} tone="warning" /></div><div className="mt-2 text-xs text-muted">{totalCorrect} / {totalAnswers} {t('dashboard.practiceAccuracyDesc')}</div></>
          )}
        </Card>
        <Card variant="warning">
          <CardTitle>{t('dashboard.weakestArea')}</CardTitle>
          {weakestTopic === null ? <div className="mt-2 text-sm text-muted">{t('dashboard.noPracticeYet')}</div> : (
            <><Link to={`/learn/fast-payments/${weakestTopic.id}`} className="mt-2 block text-sm hover:text-primary hover:underline">{weakestTopic.label}</Link><div className="mt-2"><ProgressBar value={weakestTopic.mastery} tone="warning" /></div><div className="mt-2 text-xs text-muted">{weakestTopic.mastery}% {t('dashboard.weakestAreaDesc')}</div></>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted">{t('study.learningMap')}</div>
              <h2 className="mt-1 text-lg font-semibold">{path.title}</h2>
            </div>
            <Link to="/learn/fast-payments" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">{t('nav.learningMap')} <ArrowRight size={14} /></Link>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-surface/80">
            {studyState.phases.map((phase, index) => (
              <div key={phase.phase.id} className={clsx('grid grid-cols-[0.3rem_minmax(0,1fr)_auto] items-center gap-3 pr-4', index > 0 && 'border-t border-border')}>
                <span className={clsx('h-full min-h-14', phaseTone[phase.phase.tone])} />
                <div className="min-w-0 py-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span>{phase.phase.order}. {phase.phase.shortTitle}</span>
                    {phase.current && <span className="rounded-full border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary">{t('study.currentPhase')}</span>}
                  </div>
                  <div className="mt-0.5 text-xs text-muted">
                    {phase.availableCount > 0 ? `${phase.completedCount}/${phase.availableCount} ${t('study.available')}` : t('study.planned')}
                    {phase.plannedCount > 0 && ` · ${phase.plannedCount} ${t('study.morePlanned')}`}
                  </div>
                </div>
                <div className="w-16"><ProgressBar value={phase.progress} tone={phase.phase.tone === 'public-scheme' ? 'scheme' : phase.phase.tone === 'reference' ? 'iso' : 'primary'} /></div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Quick access</div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {quickAccess.map((item) => (
              <Link key={item.to} to={item.to} className="flex min-h-11 items-center gap-3 rounded-md border border-border bg-surface px-3 py-2 text-sm hover:bg-surface2">
                <item.icon size={16} className={item.color} />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <ArrowRight size={13} className="text-muted" />
              </Link>
            ))}
          </div>
          <Link to="/confusions" className="mt-3 block rounded-md border border-warning/35 bg-warning/5 px-3 py-2 text-xs hover:bg-warning/10">
            <span className="font-semibold text-warning">{t('dashboard.commonConfusion')}</span>
            <span className="mt-1 block text-text/80">{featuredConfusion.title}</span>
          </Link>
        </section>
      </div>
    </div>
  )
}
