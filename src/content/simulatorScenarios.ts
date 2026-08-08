export type SimEventKind =
  | 'payment.created'
  | 'payment.received'
  | 'payment.validated'
  | 'payment.accepted'
  | 'payment.cleared'
  | 'payment.settled'
  | 'payment.credited'
  | 'payment.completed'
  | 'validation.failed'
  | 'participant.unavailable'
  | 'account.closed'
  | 'payment.timeout'
  | 'duplicate.detected'
  | 'credit.failed'
  | 'return.initiated'

export interface SimEvent {
  kind: SimEventKind
  label: string
  offsetMs: number
  messageId?: string
  outcome?: 'success' | 'failure' | 'neutral'
}

export interface SimScenario {
  id: string
  title: string
  description: string
  events: SimEvent[]
  finalOutcome: 'completed' | 'rejected' | 'returned' | 'timeout' | 'duplicate'
}

export const simulatorScenarios: SimScenario[] = [
  {
    id: 'successful',
    title: 'Successful credit transfer',
    description: 'A straightforward payment from Alice Example to Bob Example, processed end to end without issue.',
    finalOutcome: 'completed',
    events: [
      { kind: 'payment.created', label: 'Payment initiated by Alice Example', offsetMs: 0 },
      { kind: 'payment.received', label: 'pacs.008 generated and received by BANK_A', offsetMs: 120, messageId: 'pacs.008' },
      { kind: 'payment.validated', label: 'Validation passed', offsetMs: 250 },
      { kind: 'payment.accepted', label: 'Payment accepted by infrastructure', offsetMs: 340 },
      { kind: 'payment.cleared', label: 'Payment cleared', offsetMs: 480, messageId: 'pacs.002' },
      { kind: 'payment.settled', label: 'Settlement confirmed', offsetMs: 600 },
      { kind: 'payment.credited', label: 'Bob Example credited by BANK_B', offsetMs: 800 },
      { kind: 'payment.completed', label: 'Payment completed', offsetMs: 900, outcome: 'success' },
    ],
  },
  {
    id: 'rejected',
    title: 'Rejected — invalid account',
    description: 'Validation finds an invalid account number before the payment is accepted.',
    finalOutcome: 'rejected',
    events: [
      { kind: 'payment.created', label: 'Payment initiated by Alice Example', offsetMs: 0 },
      { kind: 'payment.received', label: 'pacs.008 generated and received by BANK_A', offsetMs: 120, messageId: 'pacs.008' },
      { kind: 'validation.failed', label: 'Validation failed: invalid creditor account format', offsetMs: 240, outcome: 'failure' },
      { kind: 'payment.completed', label: 'Payment rejected — status report sent', offsetMs: 340, messageId: 'pacs.002', outcome: 'failure' },
    ],
  },
  {
    id: 'returned',
    title: 'Returned — beneficiary account closed',
    description: 'The payment is accepted and settled, but the beneficiary account is later found to be closed.',
    finalOutcome: 'returned',
    events: [
      { kind: 'payment.created', label: 'Payment initiated by Alice Example', offsetMs: 0 },
      { kind: 'payment.received', label: 'pacs.008 generated and received by BANK_A', offsetMs: 120, messageId: 'pacs.008' },
      { kind: 'payment.validated', label: 'Validation passed', offsetMs: 250 },
      { kind: 'payment.accepted', label: 'Payment accepted by infrastructure', offsetMs: 340 },
      { kind: 'payment.settled', label: 'Settlement confirmed', offsetMs: 600 },
      { kind: 'account.closed', label: 'Beneficiary account found to be closed', offsetMs: 700, outcome: 'failure' },
      { kind: 'credit.failed', label: 'Credit to beneficiary failed', offsetMs: 720, outcome: 'failure' },
      { kind: 'return.initiated', label: 'Return initiated back to BANK_A', offsetMs: 900, messageId: 'pacs.004', outcome: 'failure' },
    ],
  },
  {
    id: 'timeout',
    title: 'Timeout — receiving participant unavailable',
    description: 'The receiving institution does not respond in time, and the payment times out.',
    finalOutcome: 'timeout',
    events: [
      { kind: 'payment.created', label: 'Payment initiated by Alice Example', offsetMs: 0 },
      { kind: 'payment.received', label: 'pacs.008 generated and received by BANK_A', offsetMs: 120, messageId: 'pacs.008' },
      { kind: 'payment.validated', label: 'Validation passed', offsetMs: 250 },
      { kind: 'participant.unavailable', label: 'BANK_B not responding', offsetMs: 400, outcome: 'failure' },
      { kind: 'payment.timeout', label: 'Payment timed out waiting for response', offsetMs: 3000, outcome: 'failure' },
    ],
  },
  {
    id: 'duplicate',
    title: 'Duplicate detected',
    description: 'An identical instruction is detected as a duplicate of one already processed.',
    finalOutcome: 'duplicate',
    events: [
      { kind: 'payment.created', label: 'Payment initiated by Alice Example', offsetMs: 0 },
      { kind: 'payment.received', label: 'pacs.008 generated and received by BANK_A', offsetMs: 120, messageId: 'pacs.008' },
      { kind: 'duplicate.detected', label: 'Duplicate EndToEndId detected — matches a previously processed payment', offsetMs: 200, outcome: 'failure' },
      { kind: 'payment.completed', label: 'Duplicate rejected — original payment unaffected', offsetMs: 300, messageId: 'pacs.002', outcome: 'failure' },
    ],
  },
]
