import { Link } from 'react-router-dom'
import { useProgressStore } from '@/store/progressStore'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getLessons } from '@/lib/i18nContent'
import { Card } from '@/components/ui/Card'
import { Check } from 'lucide-react'

const phases = [
  { title: 'Phase 1 / Foundations', range: [1, 6], variant: 'study' as const },
  { title: 'Phase 2 / ISO 20022', range: [7, 13], variant: 'reference' as const },
  { title: 'Phase 3 / Exceptions', range: [14, 16], variant: 'warning' as const },
  { title: 'Phase 4 / SGPI Public Case Study', range: [17, 24], variant: 'public-scheme' as const },
  { title: 'Phase 5 / Operations', range: [25, 29], variant: 'investigation' as const },
  { title: 'Phase 6 / Capstone', range: [30, 32], variant: 'simulation' as const },
]

export function FastPaymentsHome() {
  const completed = useProgressStore((s) => s.completedLessons)
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const lessons = getLessons(lang).slice().sort((a, b) => a.order - b.order)
  const visiblePhases = phases
    .map((phase) => ({
      ...phase,
      lessons: lessons.filter((lesson) => lesson.order >= phase.range[0] && lesson.order <= phase.range[1]),
    }))
    .filter((phase) => phase.lessons.length > 0)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('fp.title')}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{t('fp.description')}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[16rem_1fr]">
        <div className="flex flex-col gap-2">
          {visiblePhases.map((phase) => {
            const phaseDone = phase.lessons.every((lesson) => completed.includes(lesson.id))
            return (
              <Card key={phase.title} variant={phase.variant} className="py-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                  <span className={`h-2 w-2 rounded-full ${phaseDone ? 'bg-success' : 'bg-muted'}`} />
                  {phase.title}
                </div>
                <div className="mt-1 text-xs text-muted">
                  {phase.lessons.filter((lesson) => completed.includes(lesson.id)).length} / {phase.lessons.length}
                </div>
              </Card>
            )
          })}
        </div>

        <div className="flex flex-col gap-3">
          {lessons.map((lesson, idx) => {
            const done = completed.includes(lesson.id)
            const phase = phases.find((item) => lesson.order >= item.range[0] && lesson.order <= item.range[1]) ?? phases[0]
            return (
              <Link key={lesson.id} to={`/learn/fast-payments/${lesson.id}`}>
                <Card variant={phase.variant} className="flex items-center gap-4 transition-colors hover:border-primary/50">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      done ? 'bg-success text-white' : 'border border-border text-muted'
                    }`}
                  >
                    {done ? <Check size={15} strokeWidth={3} /> : idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{lesson.title}</div>
                    <div className="truncate text-sm text-muted">{lesson.subtitle}</div>
                  </div>
                  <div className="shrink-0 text-xs text-muted">{lesson.estimatedMinutes} {t('dashboard.min')}</div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
