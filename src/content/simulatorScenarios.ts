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

export interface DecisionOption {
  id: string
  label: string
  correct: boolean
}

export interface SimEvent {
  kind: SimEventKind
  label: string
  offsetMs: number
  messageId?: string
  outcome?: 'success' | 'failure' | 'neutral'
  /** Which flow segment (0-3, between simActors[i] and simActors[i+1]) this event belongs to. Omit for customer-side events with no interbank arrow. */
  segment?: number
  isDecisionPoint?: boolean
  decisionQuestion?: string
  decisionOptions?: DecisionOption[]
  decisionExplanation?: string
}

export interface SimScenario {
  id: string
  title: string
  description: string
  events: SimEvent[]
  finalOutcome: 'completed' | 'rejected' | 'returned' | 'timeout' | 'duplicate'
}

// Shared actor list used by the flow visualizer. Segment N connects
// simActors[N] to simActors[N+1].
export const simActors = [
  { id: 'customer', label: 'Customer' },
  { id: 'debtoragt', label: 'BANK_A' },
  { id: 'infra', label: 'Infrastructure' },
  { id: 'creditoragt', label: 'BANK_B' },
  { id: 'beneficiary', label: 'Beneficiary' },
]

export const simulatorScenarios: SimScenario[] = [
  {
    id: 'successful',
    title: 'Successful credit transfer',
    description: 'A straightforward payment from Alice Example to Bob Example, processed end to end without issue.',
    finalOutcome: 'completed',
    events: [
      { kind: 'payment.created', label: 'Payment initiated by Alice Example', offsetMs: 0 },
      { kind: 'payment.received', label: 'pacs.008 sent to BANK_A', offsetMs: 120, messageId: 'pacs.008', segment: 0, outcome: 'success' },
      { kind: 'payment.validated', label: 'pacs.008 forwarded to infrastructure, validation passed', offsetMs: 250, messageId: 'pacs.008', segment: 1, outcome: 'success' },
      { kind: 'payment.accepted', label: 'Payment accepted by infrastructure', offsetMs: 340, segment: 1, outcome: 'success' },
      { kind: 'payment.cleared', label: 'Cleared, status forwarded to BANK_B', offsetMs: 480, messageId: 'pacs.002', segment: 2, outcome: 'success' },
      { kind: 'payment.settled', label: 'Settlement confirmed', offsetMs: 600, segment: 2, outcome: 'success' },
      { kind: 'payment.credited', label: 'Bob Example credited by BANK_B', offsetMs: 800, segment: 3, outcome: 'success' },
      { kind: 'payment.completed', label: 'Payment completed', offsetMs: 900, segment: 3, outcome: 'success' },
    ],
  },
  {
    id: 'rejected',
    title: 'Rejected — invalid account',
    description: 'Validation finds an invalid account number before the payment is accepted.',
    finalOutcome: 'rejected',
    events: [
      { kind: 'payment.created', label: 'Payment initiated by Alice Example', offsetMs: 0 },
      { kind: 'payment.received', label: 'pacs.008 sent to BANK_A', offsetMs: 120, messageId: 'pacs.008', segment: 0, outcome: 'success' },
      {
        kind: 'validation.failed',
        label: 'Validation failed: invalid creditor account format',
        offsetMs: 240,
        segment: 1,
        outcome: 'failure',
        isDecisionPoint: true,
        decisionQuestion: 'WHAT NOW? The payment never made it past validation at the infrastructure.',
        decisionOptions: [
          { id: 'reject', label: 'Reject', correct: true },
          { id: 'return', label: 'Return', correct: false },
          { id: 'cancel', label: 'Cancellation', correct: false },
          { id: 'retry', label: 'Retry pacs.008', correct: false },
          { id: 'investigate', label: 'Depends / investigate', correct: false },
        ],
        decisionExplanation: 'The payment never progressed past validation — it was never accepted. This is the shape of a reject, not a return.',
      },
      { kind: 'payment.completed', label: 'Payment rejected — pacs.002 status report sent to BANK_A', offsetMs: 340, messageId: 'pacs.002', segment: 1, outcome: 'failure' },
    ],
  },
  {
    id: 'returned',
    title: 'Returned — beneficiary account closed',
    description: 'The payment is accepted and settled, but the beneficiary account is later found to be closed.',
    finalOutcome: 'returned',
    events: [
      { kind: 'payment.created', label: 'Payment initiated by Alice Example', offsetMs: 0 },
      { kind: 'payment.received', label: 'pacs.008 sent to BANK_A', offsetMs: 120, messageId: 'pacs.008', segment: 0, outcome: 'success' },
      { kind: 'payment.validated', label: 'pacs.008 forwarded to infrastructure, validation passed', offsetMs: 250, messageId: 'pacs.008', segment: 1, outcome: 'success' },
      { kind: 'payment.accepted', label: 'Payment accepted by infrastructure', offsetMs: 340, segment: 1, outcome: 'success' },
      { kind: 'payment.settled', label: 'Settlement confirmed, forwarded to BANK_B', offsetMs: 600, messageId: 'pacs.002', segment: 2, outcome: 'success' },
      {
        kind: 'credit.failed',
        label: 'Beneficiary account found to be closed — credit to Bob Example failed',
        offsetMs: 720,
        segment: 3,
        outcome: 'failure',
        isDecisionPoint: true,
        decisionQuestion: 'WHAT NOW? Settlement already completed, but the beneficiary could not be credited.',
        decisionOptions: [
          { id: 'reject', label: 'Reject', correct: false },
          { id: 'return', label: 'Return', correct: true },
          { id: 'cancel', label: 'Cancellation', correct: false },
          { id: 'retry', label: 'Retry pacs.008', correct: false },
          { id: 'investigate', label: 'Depends / investigate', correct: false },
        ],
        decisionExplanation: 'The payment already progressed through acceptance and settlement. A failure discovered afterward is handled as a return, not a reject.',
      },
      { kind: 'return.initiated', label: 'Return initiated back to BANK_A', offsetMs: 900, messageId: 'pacs.004', segment: 3, outcome: 'failure' },
    ],
  },
  {
    id: 'timeout',
    title: 'Timeout — receiving participant unavailable',
    description: 'The receiving institution does not respond in time, and the payment times out.',
    finalOutcome: 'timeout',
    events: [
      { kind: 'payment.created', label: 'Payment initiated by Alice Example', offsetMs: 0 },
      { kind: 'payment.received', label: 'pacs.008 sent to BANK_A', offsetMs: 120, messageId: 'pacs.008', segment: 0, outcome: 'success' },
      { kind: 'payment.validated', label: 'pacs.008 forwarded to infrastructure, validation passed', offsetMs: 250, messageId: 'pacs.008', segment: 1, outcome: 'success' },
      { kind: 'participant.unavailable', label: 'BANK_B not responding', offsetMs: 400, segment: 2, outcome: 'failure' },
      { kind: 'payment.timeout', label: 'Payment timed out waiting for response', offsetMs: 3000, segment: 2, outcome: 'failure' },
    ],
  },
  {
    id: 'duplicate',
    title: 'Duplicate detected',
    description: 'An identical instruction is detected as a duplicate of one already processed.',
    finalOutcome: 'duplicate',
    events: [
      { kind: 'payment.created', label: 'Payment initiated by Alice Example', offsetMs: 0 },
      { kind: 'payment.received', label: 'pacs.008 sent to BANK_A', offsetMs: 120, messageId: 'pacs.008', segment: 0, outcome: 'success' },
      { kind: 'duplicate.detected', label: 'Duplicate EndToEndId detected — matches a previously processed payment', offsetMs: 200, segment: 1, outcome: 'failure' },
      { kind: 'payment.completed', label: 'Duplicate rejected — pacs.002 sent, original payment unaffected', offsetMs: 300, messageId: 'pacs.002', segment: 1, outcome: 'failure' },
    ],
  },
]
