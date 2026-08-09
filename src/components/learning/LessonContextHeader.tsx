import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Clock3 } from 'lucide-react'
import type { LearningPath, Lesson } from '@/types/content'
import { useProgressStore } from '@/store/progressStore'
import { useT } from '@/i18n/strings'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { buildStudyPathState, getAdjacentStudyItems } from '@/lib/studyPath'

export function LessonContextHeader({ path, lessons, lesson }: { path: LearningPath; lessons: Lesson[]; lesson: Lesson }) {
  const completedLessons = useProgressStore((state) => state.completedLessons)
  const completedModules = useProgressStore((state) => state.completedModules ?? [])
  const t = useT()
  const state = buildStudyPathState(path, lessons, completedLessons, completedModules)
  const phaseState = state.phases.find((phase) => phase.phase.lessonIds.includes(lesson.id))
  const phaseItemIndex = phaseState?.items.findIndex((item) => item.id === lesson.id) ?? -1
  const adjacent = getAdjacentStudyItems(state, lesson.id)

  return (
    <section className="technical-surface overflow-hidden rounded-lg border border-primary/35 bg-primary/5">
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-primary">{path.title}</div>
            <div className="mt-1 text-sm font-medium">
              {phaseState ? `${t('study.phase')} ${phaseState.phase.order} · ${phaseState.phase.title}` : path.title}
            </div>
            {phaseState && phaseItemIndex >= 0 && (
              <div className="mt-1 text-xs text-muted">
                {t('study.lesson')} {phaseItemIndex + 1} {t('study.of')} {phaseState.availableCount}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted"><Clock3 size={14} /> {lesson.estimatedMinutes} {t('dashboard.min')}</div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-3 text-[11px] text-muted">
            <span>{t('dashboard.courseProgress')}</span>
            <span className="font-mono text-text">{state.courseProgress}%</span>
          </div>
          <ProgressBar value={state.courseProgress} />
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-border/80 bg-surface/60">
        {adjacent.previous ? (
          <Link to={adjacent.previous.route} className="flex min-w-0 items-center gap-2 border-r border-border px-3 py-2.5 text-xs text-muted hover:bg-surface2 hover:text-text">
            <ArrowLeft size={14} className="shrink-0" />
            <span className="truncate">{adjacent.previous.title}</span>
          </Link>
        ) : <span className="border-r border-border" />}
        {adjacent.next ? (
          <Link to={adjacent.next.route} className="flex min-w-0 items-center justify-end gap-2 px-3 py-2.5 text-right text-xs text-primary hover:bg-primary/10">
            <span className="truncate">{adjacent.next.title}</span>
            <ArrowRight size={14} className="shrink-0" />
          </Link>
        ) : <span />}
      </div>
    </section>
  )
}
