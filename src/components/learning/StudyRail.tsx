import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ChevronDown, Circle, Clock3, LockKeyhole } from 'lucide-react'
import clsx from 'clsx'
import type { LearningPath, Lesson } from '@/types/content'
import { useProgressStore } from '@/store/progressStore'
import { useT } from '@/i18n/strings'
import { buildStudyPathState } from '@/lib/studyPath'

const toneStyles = {
  study: 'border-primary/45 bg-primary/10 text-primary',
  reference: 'border-iso/45 bg-iso/10 text-iso',
  warning: 'border-return/45 bg-return/10 text-return',
  'public-scheme': 'border-scheme/45 bg-scheme/10 text-scheme',
  investigation: 'border-warning/45 bg-warning/10 text-warning',
  simulation: 'border-camt/45 bg-camt/10 text-camt',
}

export function StudyRail({ path, lessons, activeItemId }: { path: LearningPath; lessons: Lesson[]; activeItemId?: string }) {
  const completedLessons = useProgressStore((state) => state.completedLessons)
  const completedModules = useProgressStore((state) => state.completedModules ?? [])
  const t = useT()
  const state = useMemo(
    () => buildStudyPathState(path, lessons, completedLessons, completedModules),
    [path, lessons, completedLessons, completedModules],
  )
  const activePhaseId = state.items.find((item) => item.id === activeItemId)?.phaseId ?? state.currentPhase?.phase.id
  const [openPhaseId, setOpenPhaseId] = useState(activePhaseId ?? path.phases[0]?.id)

  useEffect(() => {
    if (activePhaseId) setOpenPhaseId(activePhaseId)
  }, [activePhaseId])

  return (
    <aside className="overflow-hidden rounded-lg border border-border bg-surface/95" aria-label={t('study.learningMap')}>
      <div className="border-b border-border px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted">{t('study.learningMap')}</div>
        <div className="mt-1 text-sm font-medium">{state.completedCount} / {state.availableCount} {t('study.availableComplete')}</div>
      </div>

      <div className="divide-y divide-border">
        {state.phases.map((phaseState) => {
          const { phase } = phaseState
          const open = openPhaseId === phase.id
          return (
            <section key={phase.id}>
              <button
                type="button"
                onClick={() => setOpenPhaseId(open ? '' : phase.id)}
                className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-surface2/70"
                aria-expanded={open}
              >
                <span className={clsx('flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs font-semibold', toneStyles[phase.tone])}>
                  {phaseState.complete ? <Check size={14} strokeWidth={3} /> : phase.order}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                    <span className="truncate">{phase.shortTitle}</span>
                    {phaseState.current && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" title={t('study.currentPhase')} />}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-muted">
                    {phaseState.availableCount > 0 ? `${phaseState.completedCount}/${phaseState.availableCount} ${t('study.available')}` : t('study.planned')}
                  </span>
                </span>
                <ChevronDown size={15} className={clsx('shrink-0 text-muted transition-transform', open && 'rotate-180')} />
              </button>

              {open && (
                <div className="border-t border-border/70 bg-bg/35 px-2 py-2">
                  {phaseState.items.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {phaseState.items.map((item) => (
                        <Link
                          key={item.id}
                          to={item.route}
                          className={clsx(
                            'group flex min-h-10 items-start gap-2 rounded-md px-2 py-2 text-xs hover:bg-surface2',
                            activeItemId === item.id && 'bg-surface2 text-text',
                          )}
                        >
                          {item.complete ? (
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success text-white"><Check size={10} strokeWidth={3} /></span>
                          ) : (
                            <Circle size={15} className={clsx('mt-0.5 shrink-0', item.id === state.nextItem?.id ? 'fill-primary/20 text-primary' : 'text-muted')} />
                          )}
                          <span className="min-w-0 flex-1">
                            <span className={clsx('block leading-4', item.complete && 'text-muted')}>{item.title}</span>
                            <span className="mt-0.5 flex items-center gap-1 text-[10px] text-muted"><Clock3 size={10} /> {item.estimatedMinutes} {t('dashboard.min')}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-2 py-2 text-xs text-muted"><LockKeyhole size={13} /> {t('study.plannedPhase')}</div>
                  )}
                  {phaseState.plannedCount > 0 && (
                    <div className="mt-1 border-t border-border/60 px-2 pt-2 text-[10px] text-muted">
                      {phaseState.plannedCount} {t('study.morePlanned')}
                    </div>
                  )}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </aside>
  )
}
