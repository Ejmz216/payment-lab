import { Link } from 'react-router-dom'
import { fastPaymentsLessons, fastPaymentsPath } from '@/content/lessons/fastPaymentsPath'
import { useProgressStore } from '@/store/progressStore'
import { Card, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { confusions } from '@/content/confusions'
import { ArrowRight } from 'lucide-react'

export function Dashboard() {
  const completed = useProgressStore((s) => s.completedLessons)
  const orderedLessons = fastPaymentsLessons.slice().sort((a, b) => a.order - b.order)
  const nextLesson = orderedLessons.find((l) => !completed.includes(l.id)) ?? orderedLessons[0]
  const overallMastery = Math.round((completed.length / orderedLessons.length) * 100)
  const featuredConfusion = confusions[0]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Payment Lab</h1>
        <p className="mt-1 text-sm text-muted">ISO 20022 & Payments Learning Environment</p>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted">Continue Learning</div>
            <div className="mt-1 text-lg font-semibold">Fast Payments → {nextLesson.title}</div>
            <p className="mt-1 max-w-xl text-sm text-muted">{nextLesson.whyItMatters}</p>
          </div>
          <Link
            to={`/learn/fast-payments/${nextLesson.id}`}
            className="flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Continue <ArrowRight size={15} />
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardTitle>Overall Mastery</CardTitle>
          <div className="mt-2 text-2xl font-semibold">{overallMastery}%</div>
          <div className="mt-2"><ProgressBar value={overallMastery} /></div>
          <div className="mt-2 text-xs text-muted">{completed.length} of {orderedLessons.length} Tier 1 lessons complete</div>
        </Card>
        <Card>
          <CardTitle>Recommended Next</CardTitle>
          <div className="mt-2 text-sm">{nextLesson.title}</div>
          <div className="mt-1 text-xs text-muted">{nextLesson.estimatedMinutes} min</div>
        </Card>
        <Card>
          <CardTitle>Common Confusion</CardTitle>
          <div className="mt-2 text-sm">{featuredConfusion.title}</div>
          <Link to="/confusions" className="mt-1 inline-block text-xs text-primary hover:underline">See all confusions →</Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardTitle>Practice</CardTitle>
          <p className="mt-1 text-sm text-muted">Scenarios and quiz questions ready for you.</p>
          <Link to="/practice" className="mt-3 inline-block rounded-md border border-border px-3 py-1.5 text-sm hover:bg-surface2">Open Practice Center</Link>
        </Card>
        <Card>
          <CardTitle>Explore ISO 20022 Atlas</CardTitle>
          <p className="mt-1 text-sm text-muted">Browse message families and deep dives at your own pace.</p>
          <Link to="/atlas" className="mt-3 inline-block rounded-md border border-border px-3 py-1.5 text-sm hover:bg-surface2">Open Atlas</Link>
        </Card>
      </div>

      <Card>
        <CardTitle>{fastPaymentsPath.title}</CardTitle>
        <p className="mt-1 text-sm text-muted">{fastPaymentsPath.description}</p>
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
