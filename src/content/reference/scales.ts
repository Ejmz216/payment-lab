import type { IconName } from '@/components/reference/iconNames'
import type { ReferenceTone } from '@/components/reference/ReferenceIdentity'
import { referenceEntries, type ReferenceEntry, type RefLang } from './entries'

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
  en: { title: string; scale: string; question: string }
}

export const scales: Scale[] = [
  { id: 'ecosystem', level: 1, title: 'Arquitecturas e integración', scale: 'El ecosistema', question: '¿Qué sistemas intervienen y cómo se conectan?', icon: 'building-construction', tone: 'violet', en: { title: 'Architectures and integration', scale: 'The ecosystem', question: 'Which systems are involved and how do they connect?' } },
  { id: 'journey', level: 2, title: 'Fast payments y liquidación', scale: 'El recorrido', question: '¿Cómo viaja, se compensa y se liquida un pago inmediato?', icon: 'high-voltage', tone: 'gold', en: { title: 'Fast payments and settlement', scale: 'The journey', question: 'How does an instant payment travel, clear and settle?' } },
  { id: 'operation', level: 3, title: 'Conceptos de la operación', scale: 'La operación', question: '¿Quién participa, con qué referencias y qué puede fallar?', icon: 'light-bulb', tone: 'coral', en: { title: 'Operation concepts', scale: 'The operation', question: 'Who takes part, with which references, and what can go wrong?' } },
  { id: 'messages', level: 4, title: 'Mensajes ISO 20022', scale: 'El mensaje', question: '¿Qué se están diciendo las instituciones en cada etapa?', icon: 'incoming-envelope', tone: 'cyan', en: { title: 'ISO 20022 messages', scale: 'The message', question: 'What are the institutions telling each other at each stage?' } },
  { id: 'xml', level: 5, title: 'Campos XML', scale: 'El dato', question: '¿Qué significa exactamente este campo del mensaje?', icon: 'page-facing-up', tone: 'mint', en: { title: 'XML fields', scale: 'The data', question: 'What exactly does this field of the message mean?' } },
]

const ecosystemIds = new Set(['payment-system', 'settlement-system', 'clearing-system', 'payment-network', 'payment-rail', 'ach', 'participant'])
const journeyIds = new Set(['fast-payments', 'payment-scheme', 'rtgs', 'clearing', 'settlement', 'gross-settlement', 'net-settlement', 'finality', 'settlement-account'])
const messageLanguageIds = new Set(['iso20022', 'bah', 'message'])
const xmlIds = new Set(['xml-basics', 'currency-code', 'iban'])

export function scaleOf(entry: ReferenceEntry): ScaleId {
  if (entry.category === 'architecture' || ecosystemIds.has(entry.id)) return 'ecosystem'
  if (entry.category === 'schemes' || journeyIds.has(entry.id)) return 'journey'
  if (entry.category === 'messages' || messageLanguageIds.has(entry.id)) return 'messages'
  if (xmlIds.has(entry.id)) return 'xml'
  return 'operation'
}

/** The scale's texts in the requested language. */
export function scaleText(scale: Scale, lang: RefLang) {
  return lang === 'en' ? scale.en : { title: scale.title, scale: scale.scale, question: scale.question }
}

export function entriesByScale(entries: ReferenceEntry[] = referenceEntries) {
  const groups = Object.fromEntries(scales.map((scale) => [scale.id, [] as ReferenceEntry[]])) as Record<ScaleId, ReferenceEntry[]>
  for (const entry of entries) groups[scaleOf(entry)].push(entry)
  return groups
}

// ISO 20022 business areas shown inside the messages scale.
export const messageFamilies = [
  { id: 'pain', title: 'pain · Iniciación de pagos', flow: 'Cliente → su institución', tone: 'purple' as ReferenceTone, en: { title: 'pain · Payments initiation', flow: 'Customer → its institution' } },
  { id: 'pacs', title: 'pacs · Compensación y liquidación', flow: 'Institución → institución', tone: 'cyan' as ReferenceTone, en: { title: 'pacs · Clearing and settlement', flow: 'Institution → institution' } },
  { id: 'camt', title: 'camt · Gestión de efectivo', flow: 'Reportes, consultas e investigaciones', tone: 'teal' as ReferenceTone, en: { title: 'camt · Cash management', flow: 'Reports, enquiries and investigations' } },
]

// Entry points into the annotated pacs.008.001.10 sample, by message block.
export const xmlBlocks: { group: string; title: string; detail: string; icon: IconName; en: { title: string; detail: string } }[] = [
  { group: 'header', title: 'AppHdr', detail: 'Cabecera de negocio: quién envía, a quién y qué mensaje es.', icon: 'label', en: { title: 'AppHdr', detail: 'Business header: who sends, to whom and which message it is.' } },
  { group: 'group', title: 'GrpHdr', detail: 'Datos del mensaje: MsgId, fecha y número de transacciones.', icon: 'package', en: { title: 'GrpHdr', detail: 'Message data: MsgId, date and number of transactions.' } },
  { group: 'ids', title: 'Identificadores', detail: 'EndToEndId, TxId y UETR: qué identifica cada uno.', icon: 'id-button', en: { title: 'Identifiers', detail: 'EndToEndId, TxId and UETR: what each one identifies.' } },
  { group: 'actors', title: 'Partes y cuentas', detail: 'Dbtr, Cdtr y sus agentes, con sus cuentas.', icon: 'busts-in-silhouette', en: { title: 'Parties and accounts', detail: 'Dbtr, Cdtr and their agents, with their accounts.' } },
  { group: 'amount', title: 'Importe y liquidación', detail: 'IntrBkSttlmAmt, fecha y método de liquidación.', icon: 'coin', en: { title: 'Amount and settlement', detail: 'IntrBkSttlmAmt, settlement date and method.' } },
  { group: 'purpose', title: 'Tipo y propósito', detail: 'Instrumento, propósito e información de remesa.', icon: 'memo', en: { title: 'Type and purpose', detail: 'Instrument, purpose and remittance information.' } },
]
export const xmlBlockLink = (group: string) => `/reference/pacs.008?tab=xml&group=${group}`
