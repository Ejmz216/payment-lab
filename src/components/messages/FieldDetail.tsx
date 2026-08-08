import type { MessageFieldNode } from '@/types/content'
import { Card, CardTitle } from '@/components/ui/Card'

export function FieldDetail({ node, parentName }: { node: MessageFieldNode; parentName?: string }) {
  return (
    <Card>
      <div className="mb-2 flex items-baseline gap-2">
        <span className="font-mono text-sm font-semibold text-primary">{node.xmlTag}</span>
        <span className="text-xs text-muted">{node.name}</span>
      </div>
      <dl className="flex flex-col gap-2 text-sm">
        <Row label="Business meaning" value={node.businessMeaning} />
        <Row label="Cardinality" value={node.cardinality} />
        {node.dataType && <Row label="Type" value={node.dataType} />}
        {parentName && <Row label="Parent" value={parentName} />}
        {node.exampleValue && <Row label="Example value" value={node.exampleValue} mono />}
        {node.whyItMatters && <Row label="Why it matters" value={node.whyItMatters} />}
        {node.commonMistakes && <Row label="Common mistakes" value={node.commonMistakes} warn />}
        {node.relatedFields && node.relatedFields.length > 0 && <Row label="Related fields" value={node.relatedFields.join(', ')} mono />}
      </dl>
    </Card>
  )
}

function Row({ label, value, mono, warn }: { label: string; value: string; mono?: boolean; warn?: boolean }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">{label}</dt>
      <dd className={`mt-0.5 ${mono ? 'font-mono text-xs' : ''} ${warn ? 'text-warning' : 'text-text/90'}`}>{value}</dd>
    </div>
  )
}
