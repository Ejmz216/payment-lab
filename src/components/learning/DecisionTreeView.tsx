import { Card } from '@/components/ui/Card'
import type { DecisionTreeQuestion } from '@/types/blocks'

function QuestionNode({ q }: { q: DecisionTreeQuestion }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-md border border-border bg-surface2 px-4 py-2 text-center text-sm">{q.question}</div>
      <div className="flex flex-wrap items-start justify-center gap-6">
        {q.answers.map((a) => (
          <div key={a.label} className="flex flex-col items-center gap-1">
            <div className="text-xs text-muted">{a.label}</div>
            {a.next ? (
              <QuestionNode q={a.next} />
            ) : (
              <div className="rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-center text-xs">{a.result}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function DecisionTreeView({ root, label }: { root: DecisionTreeQuestion; label: string }) {
  return (
    <Card>
      <div className="mb-3 text-center text-[10px] font-semibold uppercase tracking-wide text-warning">{label}</div>
      <QuestionNode q={root} />
    </Card>
  )
}
