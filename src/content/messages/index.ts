import type { MessageDefinition } from '@/types/content'
import { pacs008 } from './pacs008'
import { pacs002 } from './pacs002'
import { pacs004 } from './pacs004'
import { pain001 } from './pain001'
import { camt053 } from './camt053'
import { camt029 } from './camt029'
import { pacs003 } from './pacs003'
import { pain002 } from './pain002'
import { pacs028 } from './pacs028'
import { camt054 } from './camt054'
import { camt056 } from './camt056'

export const messages: MessageDefinition[] = [
  pain001,
  pacs008,
  pacs002,
  pacs004,
  camt053,
  camt029,
  pacs003,
  pain002,
  pacs028,
  camt054,
  camt056,
]

export function getMessage(id: string): MessageDefinition | undefined {
  return messages.find((m) => m.id === id)
}

export const familyInfo: Record<string, { label: string; description: string; color: string }> = {
  pain: { label: 'pain — Payments Initiation', description: 'Customer to financial institution. Payment initiation related messages.', color: 'pain' },
  pacs: { label: 'pacs — Payments Clearing & Settlement', description: 'Financial institution to financial institution. Clearing and settlement related messages.', color: 'pacs' },
  camt: { label: 'camt — Cash Management', description: 'Cash management related messages: reporting, statements, notifications, investigations.', color: 'camt' },
  admi: { label: 'admi — Administration', description: 'Administrative messages exchanged between systems and participants.', color: 'pacs' },
  head: { label: 'head — Business Application Header', description: 'Header information carried alongside a business message.', color: 'pacs' },
  remt: { label: 'remt — Remittance Advice', description: 'Detailed remittance information related to a payment.', color: 'pain' },
}
