import { ArrowDown } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface ArchitectureDiagramProps {
  steps: string[]
  branches?: { after: string; items: string[] }
  label: string
}

export function ArchitectureDiagram({ steps, branches, label }: ArchitectureDiagramProps) {
  return (
    <Card>
      <div className="mb-3 text-center text-[10px] font-semibold uppercase tracking-wide text-warning">{label}</div>
      <div className="flex flex-col items-center gap-1">
        {steps.map((step, i) => (
          <div key={step} className="flex flex-col items-center gap-1">
            <div className="rounded-md border border-border bg-surface2 px-4 py-2 text-sm">{step}</div>
            {branches && branches.after === step ? (
              <div className="my-1 flex flex-wrap items-start justify-center gap-2">
                {branches.items.map((b) => (
                  <div key={b} className="flex flex-col items-center gap-1">
                    <ArrowDown size={14} className="text-muted" />
                    <div className="rounded-md border border-border bg-bg px-3 py-1.5 text-xs">{b}</div>
                  </div>
                ))}
              </div>
            ) : (
              i < steps.length - 1 && <ArrowDown size={14} className="text-muted" />
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
