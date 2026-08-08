import { Link } from 'react-router-dom'
import { fastPaymentsLessons, fastPaymentsPath } from '@/content/lessons/fastPaymentsPath'
import { useProgressStore } from '@/store/progressStore'
import { Card } from '@/components/ui/Card'

export function FastPaymentsHome() {
  const completed = useProgressStore((s) => s.completedLessons)
  const lessons = fastPaymentsLessons.slice().sort((a, b) => a.order - b.order)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{fastPaymentsPath.title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{fastPaymentsPath.description}</p>
      </div>
      <div className="flex flex-col gap-3">
        {lessons.map((lesson, idx) => {
          const done = completed.includes(lesson.id)
          return (
            <Link key={lesson.id} to={`/learn/fast-payments/${lesson.id}`}>
              <Card className="flex items-center gap-4 transition-colors hover:border-primary/50">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    done ? 'bg-success text-white' : 'border border-border text-muted'
                  }`}
                >
                  {done ? '✓' : idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{lesson.title}</div>
                  <div className="truncate text-sm text-muted">{lesson.subtitle}</div>
                </div>
                <div className="shrink-0 text-xs text-muted">{lesson.estimatedMinutes} min</div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
