import { useMemo, useState } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import type { InvestigationChecklistGroup } from '@/types/blocks'
import { useUIStore } from '@/store/uiStore'

export function InvestigationChecklist({ groups }: { groups: InvestigationChecklistGroup[] }) {
  const [checked, setChecked] = useState<Set<string>>(() => new Set())
  const isEs = useUIStore((state) => state.lang) === 'es'
  const total = useMemo(() => groups.reduce((sum, group) => sum + group.items.length, 0), [groups])
  const progress = total ? Math.round((checked.size / total) * 100) : 0

  function toggle(id: string) {
    setChecked((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="min-w-[12rem] flex-1">
          <div className="mb-1.5 flex justify-between text-xs text-muted">
            <span>{isEs ? 'Preguntas revisadas' : 'Questions reviewed'}</span>
            <span>{checked.size}/{total}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface2">
            <div className="h-full bg-warning transition-[width]" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setChecked(new Set())}
          disabled={checked.size === 0}
          title={isEs ? 'Reiniciar checklist' : 'Reset checklist'}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted hover:bg-surface2 disabled:opacity-40"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {groups.map((group, groupIndex) => (
          <section key={group.title}>
            <h4 className="mb-2 text-sm font-semibold text-warning">{group.title}</h4>
            <div className="flex flex-col gap-2">
              {group.items.map((item, itemIndex) => {
                const id = `${groupIndex}-${itemIndex}`
                const active = checked.has(id)
                return (
                  <label key={id} className="flex cursor-pointer items-start gap-2.5 rounded-md border border-border bg-bg/30 p-3 text-sm hover:bg-surface2/60">
                    <input className="sr-only" type="checkbox" checked={active} onChange={() => toggle(id)} />
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${active ? 'border-success bg-success text-white' : 'border-border bg-surface'}`}>
                      {active && <Check size={13} />}
                    </span>
                    <span className={active ? 'text-muted line-through' : 'text-text/90'}>{item}</span>
                  </label>
                )
              })}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted">
        {isEs
          ? 'Este checklist vive solo en esta sesión y no almacena respuestas ni datos de implementación.'
          : 'This checklist lives only in this session and stores no answers or implementation data.'}
      </p>
    </div>
  )
}
