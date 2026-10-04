import type { IconName } from '@/components/reference/iconNames'
import type { ReferenceTone } from '@/components/reference/ReferenceIdentity'
import { referenceEntries, type ReferenceEntry } from './entries'

// The encyclopedia is read as a staircase: from the whole ecosystem down to a
// single XML field. Every entry belongs to exactly one scale.
export type ScaleId = 'ecosystem' | 'journey' | 'operation' | 'messages' | 'xml'
export interface Scale {
  id: ScaleId
  level: number
  title: string
  scale: string
  question: string
  icon: IconName
  tone: ReferenceTone
}

export const scales: Scale[] = [
  { id: 'ecosystem', level: 1, title: 'Arquitecturas e integración', scale: 'El ecosistema', question: '¿Qué sistemas intervienen y cómo se conectan?', icon: 'building-construction', tone: 'violet' },
  { id: 'journey', level: 2, title: 'Fast payments y liquidación', scale: 'El recorrido', question: '¿Cómo viaja, se compensa y se liquida un pago inmediato?', icon: 'high-voltage', tone: 'gold' },
  { id: 'operation', level: 3, title: 'Conceptos de la operación', scale: 'La operación', question: '¿Quién participa, con qué referencias y qué puede fallar?', icon: 'light-bulb', tone: 'coral' },
  { id: 'messages', level: 4, title: 'Mensajes ISO 20022', scale: 'El mensaje', question: '¿Qué se están diciendo las instituciones en cada etapa?', icon: 'incoming-envelope', tone: 'cyan' },
  { id: 'xml', level: 5, title: 'Campos XML', scale: 'El dato', question: '¿Qué significa exactamente este campo del mensaje?', icon: 'page-facing-up', tone: 'mint' },
]

const ecosystemIds = new Set(['payment-system', 'settlement-system', 'clearing-system', 'payment-network', 'payment-rail', 'ach', 'participant'])
const journeyIds = new Set(['fast-payments', 'payment-scheme', 'rtgs', 'clearing', 'settlement', 'gross-settlement', 'net-settlement', 'finality', 'settlement-account'])
const messageLanguageIds = new Set(['iso20022', 'bah', 'message'])
const xmlIds = new Set(['xml-basics', 'currency-code'])

export function scaleOf(entry: ReferenceEntry): ScaleId {
  if (entry.category === 'architecture' || ecosystemIds.has(entry.id)) return 'ecosystem'
  if (entry.category === 'schemes' || journeyIds.has(entry.id)) return 'journey'
  if (entry.category === 'messages' || messageLanguageIds.has(entry.id)) return 'messages'
  if (xmlIds.has(entry.id)) return 'xml'
  return 'operation'
}

export function entriesByScale(entries: ReferenceEntry[] = referenceEntries) {
  const groups = Object.fromEntries(scales.map((scale) => [scale.id, [] as ReferenceEntry[]])) as Record<ScaleId, ReferenceEntry[]>
  for (const entry of entries) groups[scaleOf(entry)].push(entry)
  return groups
}

// ISO 20022 business areas shown inside the messages scale.
export const messageFamilies = [
  { id: 'pain', title: 'pain · Iniciación de pagos', flow: 'Cliente → su institución', tone: 'purple' as ReferenceTone },
  { id: 'pacs', title: 'pacs · Compensación y liquidación', flow: 'Institución → institución', tone: 'cyan' as ReferenceTone },
  { id: 'camt', title: 'camt · Gestión de efectivo', flow: 'Reportes, consultas e investigaciones', tone: 'teal' as ReferenceTone },
]

// Entry points into the annotated pacs.008.001.10 sample, by message block.
export const xmlBlocks: { group: string; title: string; detail: string; icon: IconName }[] = [
  { group: 'header', title: 'AppHdr', detail: 'Cabecera de negocio: quién envía, a quién y qué mensaje es.', icon: 'label' },
  { group: 'group', title: 'GrpHdr', detail: 'Datos del mensaje: MsgId, fecha y número de transacciones.', icon: 'package' },
  { group: 'ids', title: 'Identificadores', detail: 'EndToEndId, TxId y UETR: qué identifica cada uno.', icon: 'id-button' },
  { group: 'actors', title: 'Partes y cuentas', detail: 'Dbtr, Cdtr y sus agentes, con sus cuentas.', icon: 'busts-in-silhouette' },
  { group: 'amount', title: 'Importe y liquidación', detail: 'IntrBkSttlmAmt, fecha y método de liquidación.', icon: 'coin' },
  { group: 'purpose', title: 'Tipo y propósito', detail: 'Instrumento, propósito e información de remesa.', icon: 'memo' },
]
export const xmlBlockLink = (group: string) => `/reference/pacs.008?tab=xml&group=${group}`
