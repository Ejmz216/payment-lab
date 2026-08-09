import { Link } from 'react-router-dom'
import { ArrowRight, Check, Circle, Clock3 } from 'lucide-react'
import clsx from 'clsx'
import { useProgressStore } from '@/store/progressStore'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getFastPaymentsPath, getLessons } from '@/lib/i18nContent'
import { buildStudyPathState } from '@/lib/studyPath'
import { StudyRail } from '@/components/learning/StudyRail'
import { ProgressBar } from '@/components/ui/ProgressBar'

const toneBorders = {
  study: 'border-primary/45',
  reference: 'border-iso/45',
  warning: 'border-return/45',
  'public-scheme': 'border-scheme/45',
  investigation: 'border-warning/45',
  simulation: 'border-camt/45',
}

export function FastPaymentsHome() {
  const completedLessons = useProgressStore((state) => state.completedLessons)
  const completedModules = useProgressStore((state) => state.completedModules ?? [])
  const lang = useUIStore((state) => state.lang)
  const t = useT()
  const lessons = getLessons(lang).slice().sort((a, b) => a.order - b.order)
  const path = getFastPaymentsPath(lang)
  const state = buildStudyPathState(path, lessons, completedLessons, completedModules)
  const nextItem = state.nextItem
  const currentPhase = state.currentPhase

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{path.title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{path.description}</p>
      </div>

      <section className="technical-surface overflow-hidden rounded-lg border border-primary/40 bg-primary/5">
        <div className="flex flex-col gap-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 max-w-3xl">
              <div className="text-xs font-semibold uppercase tracking-wide text-primary">{t('dashboard.continueLearning')}</div>
              {currentPhase && (
                <div className="mt-2 text-xs text-muted">{t('study.phase')} {currentPhase.phase.order} · {currentPhase.phase.title}</div>
              )}
              <h2 className="mt-1 text-xl font-semibold sm:text-2xl">{nextItem?.title ?? t('study.pathComplete')}</h2>
              {nextItem && <p className="mt-2 text-sm leading-relaxed text-text/80">{nextItem.description}</p>}
            </div>
            {nextItem && (
              <Link to={nextItem.route} className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90">
                {t('dashboard.continue')} <ArrowRight size={15} />
              </Link>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs text-muted">
                <span>{t('dashboard.courseProgress')}</span>
                <span className="font-mono text-text">{state.courseProgress}%</span>
              </div>
              <ProgressBar value={state.courseProgress} />
            </div>
            {nextItem && <div className="flex items-center gap-1.5 text-xs text-muted"><Clock3 size={13} /> {nextItem.estimatedMinutes} {t('dashboard.min')}</div>}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-6">
          <StudyRail path={path} lessons={lessons} activeItemId={nextItem?.id} />
        </div>

        {currentPhase && (
          <section className="min-w-0">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted">{t('study.currentPhase')}</div>
                <h2 className="mt-1 text-lg font-semibold">{currentPhase.phase.title}</h2>
                <p className="mt-1 max-w-2xl text-sm text-muted">{currentPhase.phase.description}</p>
              </div>
              <div className="text-xs text-muted">{currentPhase.completedCount} / {currentPhase.availableCount} {t('study.available')}</div>
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-surface/80">
              {currentPhase.items.map((item, index) => (
                <Link
                  key={item.id}
                  to={item.route}
                  className={clsx(
                    'flex min-h-20 items-center gap-4 border-l-4 px-4 py-3 hover:bg-surface2/80',
                    index > 0 && 'border-t border-t-border',
                    toneBorders[currentPhase.phase.tone],
                  )}
                >
                  <span className={clsx(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
                    item.complete ? 'border-success bg-success text-white' : item.id === nextItem?.id ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted',
                  )}>
                    {item.complete ? <Check size={14} strokeWidth={3} /> : <Circle size={13} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{item.title}</span>
                      {item.truthLabel && <span className="rounded border border-scheme/40 bg-scheme/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-scheme">{item.truthLabel}</span>}
                    </span>
                    <span className="mt-1 block text-sm text-muted">{item.description}</span>
                  </span>
                  <span className="hidden shrink-0 items-center gap-1 text-xs text-muted sm:flex"><Clock3 size={12} /> {item.estimatedMinutes} {t('dashboard.min')}</span>
                  <ArrowRight size={15} className="shrink-0 text-muted" />
                </Link>
              ))}
            </div>

            {currentPhase.plannedCount > 0 && (
              <p className="mt-3 text-xs text-muted">{currentPhase.plannedCount} {t('study.morePlanned')}. {t('study.plannedPhase')}.</p>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
