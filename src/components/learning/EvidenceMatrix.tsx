import { Badge } from '@/components/ui/Badge'
import type { EvidenceMatrixRow } from '@/types/blocks'
import { useUIStore } from '@/store/uiStore'

export function EvidenceMatrix({ rows }: { rows: EvidenceMatrixRow[] }) {
  const isEs = useUIStore((state) => state.lang) === 'es'

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="hidden grid-cols-[0.75fr_1.1fr_1.1fr_1.2fr] gap-px bg-border text-[11px] font-semibold tracking-wide text-muted lg:grid">
        <div className="bg-surface2 p-3">{isEs ? 'EVENTO' : 'EVENT'}</div>
        <div className="bg-surface2 p-3">{isEs ? 'EVIDENCIA PÚBLICA' : 'PUBLIC EVIDENCE'}</div>
        <div className="bg-surface2 p-3">{isEs ? 'RELEVANCIA ISO' : 'ISO RELEVANCE'}</div>
        <div className="bg-surface2 p-3">{isEs ? 'PREGUNTA DE IMPLEMENTACIÓN' : 'IMPLEMENTATION QUESTION'}</div>
      </div>
      <div className="divide-y divide-border">
        {rows.map((row) => (
          <article key={row.id} className="grid gap-3 bg-bg/30 p-3 lg:grid-cols-[0.75fr_1.1fr_1.1fr_1.2fr] lg:gap-4">
            <div>
              <div className="mb-2"><Badge type={row.badge} /></div>
              <div className="text-sm font-semibold">{row.topic}</div>
            </div>
            <div>
              <div className="mb-1 text-[10px] font-semibold tracking-wide text-muted lg:hidden">{isEs ? 'EVIDENCIA PÚBLICA' : 'PUBLIC EVIDENCE'}</div>
              <p className="text-sm leading-relaxed text-text/85">{row.publicEvidence}</p>
            </div>
            <div>
              <div className="mb-1 text-[10px] font-semibold tracking-wide text-muted lg:hidden">{isEs ? 'RELEVANCIA ISO' : 'ISO RELEVANCE'}</div>
              <p className="text-sm leading-relaxed text-text/85">{row.isoRelevance}</p>
            </div>
            <div>
              <div className="mb-1 text-[10px] font-semibold tracking-wide text-muted lg:hidden">{isEs ? 'PREGUNTA DE IMPLEMENTACIÓN' : 'IMPLEMENTATION QUESTION'}</div>
              <p className="text-sm leading-relaxed text-warning">{row.implementationQuestion}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
