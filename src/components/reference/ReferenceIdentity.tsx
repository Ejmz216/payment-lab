import { Blocks, Clock3, Compass, FileCode2, Fingerprint, Globe2, Landmark, Lightbulb, ListChecks, MailOpen, Mails, Scale, Shapes, UsersRound, WalletCards, Zap, type LucideIcon } from 'lucide-react'

export type ReferenceTone = 'mint' | 'coral' | 'blue' | 'violet' | 'gold'
const identities: Record<string, { icon: LucideIcon; tone: ReferenceTone }> = {
  concepts: { icon: Lightbulb, tone: 'coral' },
  messages: { icon: Mails, tone: 'blue' },
  architecture: { icon: Blocks, tone: 'violet' },
  schemes: { icon: Globe2, tone: 'gold' },
  xml: { icon: FileCode2, tone: 'mint' },
}
const conceptSymbols: Record<string, LucideIcon> = {
  'fast-payments': Zap, settlement: Scale, clearing: ListChecks, iso20022: Shapes,
  actors: UsersRound, identifiers: Fingerprint, bah: MailOpen, 'xml-basics': FileCode2,
  timeouts: Clock3, 'settlement-system': Landmark, 'payment-system': Blocks,
  'settlement-account': WalletCards, reconciliation: ListChecks, participant: Landmark,
  msgid: Mails, endtoendid: Fingerprint, txid: Fingerprint, uetr: Fingerprint,
}

export function referenceIdentity(category: string, id = '') {
  const identity = identities[category] ?? { icon: Compass, tone: 'mint' as const }
  if (category === 'concepts' && conceptSymbols[id]) return { ...identity, icon: conceptSymbols[id] }
  if (category === 'messages' && id.startsWith('pain.')) return { ...identity, tone: 'violet' as const }
  if (category === 'messages' && id.startsWith('camt.')) return { ...identity, tone: 'mint' as const }
  return identity
}

export function ColorIcon({ icon: Icon, tone = 'mint', small = false }: { icon: LucideIcon; tone?: ReferenceTone; small?: boolean }) {
  return <span className={`color-icon tone-${tone} ${small ? 'color-icon-small' : ''}`} aria-hidden="true">
    <Icon size={small ? 18 : 23} strokeWidth={1.65} fill="currentColor" fillOpacity={0.12} />
  </span>
}

export function ReferenceIcon({ category, id, small = false }: { category: string; id?: string; small?: boolean }) {
  return <ColorIcon {...referenceIdentity(category, id)} small={small} />
}
