import { Link } from 'react-router-dom'
import { fastPaymentsPath } from '@/content/lessons/fastPaymentsPath'
import { useProgressStore } from '@/store/progressStore'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getLessons, getConfusions } from '@/lib/i18nContent'
import { Card, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ArrowRight } from 'lucide-react'

export function Dashboard() {
  const completed = useProgressStore((s) => s.completedLessons)
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const orderedLessons = getLessons(lang).slice().sort((a, b) => a.order - b.order)
  const nextLesson = orderedLessons.find((l) => !completed.includes(l.id)) ?? orderedLessons[0]
  const overallMastery = Math.round((completed.length / orderedLessons.length) * 100)
  const featuredConfusion = getConfusions(lang)[0]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('dashboard.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('dashboard.subtitle')}</p>
      </div>

      <Card>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardTitle>{t('dashboard.overallMastery')}</CardTitle>
          <div className="mt-2 text-2xl font-semibold">{overallMastery}%</div>
          <div className="mt-2"><ProgressBar value={overallMastery} /></div>
          <div className="mt-2 text-xs text-muted">{completed.length} / {orderedLessons.length} {t('dashboard.lessonsComplete')}</div>
        </Card>
        <Card>
          <CardTitle>{t('dashboard.recommendedNext')}</CardTitle>
          <div className="mt-2 text-sm">{nextLesson.title}</div>
          <div className="mt-1 text-xs text-muted">{nextLesson.estimatedMinutes} {t('dashboard.min')}</div>
        </Card>
        <Card>
          <CardTitle>{t('dashboard.commonConfusion')}</CardTitle>
          <div className="mt-2 text-sm">{featuredConfusion.title}</div>
          <Link to="/confusions" className="mt-1 inline-block text-xs text-primary hover:underline">{t('dashboard.seeAllConfusions')}</Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardTitle>{t('dashboard.practice')}</CardTitle>
          <p className="mt-1 text-sm text-muted">{t('dashboard.practiceDesc')}</p>
          <Link to="/practice" className="mt-3 inline-block rounded-md border border-border px-3 py-1.5 text-sm hover:bg-surface2">{t('dashboard.openPractice')}</Link>
        </Card>
        <Card>
          <CardTitle>{t('dashboard.exploreAtlas')}</CardTitle>
          <p className="mt-1 text-sm text-muted">{t('dashboard.exploreAtlasDesc')}</p>
          <Link to="/atlas" className="mt-3 inline-block rounded-md border border-border px-3 py-1.5 text-sm hover:bg-surface2">{t('dashboard.openAtlas')}</Link>
        </Card>
      </div>

      <Card>
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
                    {done ? '✓' : l.order}
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
