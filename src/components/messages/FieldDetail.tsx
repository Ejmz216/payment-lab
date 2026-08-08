import type { MessageFieldNode } from '@/types/content'
import { Card } from '@/components/ui/Card'
import { useT } from '@/i18n/strings'

export function FieldDetail({ node, parentName }: { node: MessageFieldNode; parentName?: string }) {
  const t = useT()
  return (
    <Card>
      <div className="mb-2 flex items-baseline gap-2">
        <span className="font-mono text-sm font-semibold text-primary">{node.xmlTag}</span>
        <span className="text-xs text-muted">{node.name}</span>
      </div>
      <dl className="flex flex-col gap-2 text-sm">
        <Row label={t('msg.businessMeaning')} value={node.businessMeaning} />
        <Row label={t('msg.cardinality')} value={node.cardinality} />
        {node.dataType && <Row label={t('msg.type')} value={node.dataType} />}
        {parentName && <Row label={t('msg.parent')} value={parentName} />}
        {node.exampleValue && <Row label={t('msg.example')} value={node.exampleValue} mono />}
        {node.whyItMatters && <Row label={t('msg.whyMatters')} value={node.whyItMatters} />}
        {node.commonMistakes && <Row label={t('msg.mistakes')} value={node.commonMistakes} warn />}
        {node.relatedFields && node.relatedFields.length > 0 && <Row label={t('msg.relatedFields')} value={node.relatedFields.join(', ')} mono />}
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
