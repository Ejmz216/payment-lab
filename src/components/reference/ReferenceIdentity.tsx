import type { IconName } from './iconNames'

export type { IconName }
export type ReferenceTone = 'mint' | 'coral' | 'blue' | 'violet' | 'gold' | 'cyan' | 'teal' | 'purple' | 'orange' | 'red'

const identities: Record<string, { icon: IconName; tone: ReferenceTone }> = {
  concepts: { icon: 'light-bulb', tone: 'coral' },
  messages: { icon: 'incoming-envelope', tone: 'cyan' },
  architecture: { icon: 'building-construction', tone: 'violet' },
  schemes: { icon: 'globe-showing-americas', tone: 'gold' },
  xml: { icon: 'label', tone: 'mint' },
}
// ISO 20022 family colors (AGENTS.md): pacs cyan/blue, pain purple, camt teal.
export const familyTones: Record<string, ReferenceTone> = { pacs: 'cyan', pain: 'purple', camt: 'teal', head: 'violet' }

const entrySymbols: Record<string, IconName> = {
  // systems
  'fast-payments': 'high-voltage', 'payment-system': 'satellite-antenna', 'settlement-system': 'classical-building', 'clearing-system': 'gear',
  'payment-network': 'link', 'payment-rail': 'world-map', 'payment-scheme': 'scroll', ach: 'card-file-box', rtgs: 'stopwatch', participant: 'bank',
  'host-to-host': 'electric-plug', 'payment-web-app': 'mobile-phone',
  // settlement
  settlement: 'balance-scale', clearing: 'abacus', 'gross-settlement': 'coin', 'net-settlement': 'balance-scale', finality: 'locked', 'settlement-account': 'coin',
  // operation
  actors: 'busts-in-silhouette', agent: 'bank', 'debtor-agent': 'bank', 'creditor-agent': 'bank', debtor: 'bust-in-silhouette', creditor: 'bust-in-silhouette', beneficiary: 'bust-in-silhouette',
  identifiers: 'id-button', msgid: 'id-button', endtoendid: 'id-button', txid: 'id-button', uetr: 'key',
  timeouts: 'hourglass-not-done', reconciliation: 'bar-chart', investigation: 'magnifying-glass-tilted-left', validation: 'check-mark-button',
  instruction: 'memo', reject: 'no-entry', return: 'right-arrow-curving-left', recall: 'counterclockwise-arrows-button', reversal: 'repeat-button',
  'cash-management': 'ledger',
  // language of messages
  iso20022: 'triangular-ruler', 'currency-code': 'coin', iban: 'card-index-dividers', bah: 'label', message: 'e-mail', 'xml-basics': 'page-facing-up',
  // messages
  'pain.001': 'memo', 'pain.002': 'clipboard', 'pacs.008': 'money-with-wings', 'pacs.002': 'check-mark-button', 'pacs.004': 'right-arrow-curving-left',
  'pacs.003': 'inbox-tray', 'pacs.028': 'magnifying-glass-tilted-left', 'camt.053': 'ledger', 'camt.054': 'bell', 'camt.056': 'stop-sign',
  'camt.029': 'scroll', 'camt.003': 'card-index-dividers', 'camt.004': 'card-file-box',
}

export function referenceIdentity(category: string, id = ''): { icon: IconName; tone: ReferenceTone } {
  const identity = identities[category] ?? { icon: 'compass' as const, tone: 'mint' as const }
  const icon = entrySymbols[id] ?? identity.icon
  if (category === 'messages') return { icon, tone: familyTones[id.split('.')[0]] ?? identity.tone }
  return { ...identity, icon }
}

export function iconUrl(name: IconName) {
  return `${import.meta.env.BASE_URL}icons/fluent/${name}.svg`
}

/** A Fluent Emoji (3D-style) icon. Decorative: always pair it with visible text. */
export function Icon3D({ name, size = 24, className = '' }: { name: IconName; size?: number; className?: string }) {
  return <img src={iconUrl(name)} width={size} height={size} alt="" aria-hidden="true" loading="lazy" decoding="async" draggable={false} className={`icon-3d ${className}`} />
}

export function ColorIcon({ icon, tone = 'mint', small = false }: { icon: IconName; tone?: ReferenceTone; small?: boolean }) {
  return <span className={`color-icon tone-${tone} ${small ? 'color-icon-small' : ''}`} aria-hidden="true">
    <Icon3D name={icon} size={small ? 20 : 28} />
  </span>
}

export function ReferenceIcon({ category, id, small = false }: { category: string; id?: string; small?: boolean }) {
  return <ColorIcon {...referenceIdentity(category, id)} small={small} />
}
