export interface Confusion {
  id: string
  title: string
  left: string
  right: string
  explanation: string
  relatedLessons?: string[]
}

export const confusions: Confusion[] = [
  {
    id: 'clearing-settlement',
    title: 'Clearing vs. Settlement',
    left: 'Clearing',
    right: 'Settlement',
    explanation: 'Clearing determines who owes what to whom. Settlement is the actual discharge of that obligation. A payment can be cleared without yet being settled.',
    relatedLessons: ['clearing-vs-settlement'],
  },
  {
    id: 'reject-return',
    title: 'Reject vs. Return',
    left: 'Reject',
    right: 'Return',
    explanation: 'A reject means the payment never progressed past validation/acceptance. A return means it did progress, and is now being sent back after the fact.',
    relatedLessons: ['reject-vs-return'],
  },
  {
    id: 'debtor-debtor-agent',
    title: 'Debtor vs. Debtor Agent',
    left: 'Debtor',
    right: 'Debtor Agent',
    explanation: 'The Debtor is the party that owes/sends funds. The Debtor Agent is the institution servicing that party. They are not interchangeable.',
    relatedLessons: ['payment-actors'],
  },
  {
    id: 'message-transaction',
    title: 'Message vs. Transaction',
    left: 'Message',
    right: 'Transaction',
    explanation: 'A single message (e.g. a pacs.008 instance) can carry multiple individual transactions. Message-level identifiers and transaction-level identifiers answer different questions.',
    relatedLessons: ['identifiers'],
  },
  {
    id: 'msgid-txid',
    title: 'MsgId vs. TxId',
    left: 'MsgId',
    right: 'TxId',
    explanation: 'MsgId identifies the message envelope. TxId identifies one specific transaction inside it, which may be one of several.',
    relatedLessons: ['identifiers'],
  },
  {
    id: 'iso-scheme',
    title: 'ISO requirement vs. Scheme requirement',
    left: 'ISO 20022',
    right: 'Payment Scheme',
    explanation: 'ISO 20022 defines the semantic/message model, often with optional elements. A specific payment scheme can require an element that ISO leaves optional. Compliance with the scheme, not just the base standard, determines what is actually required in that context.',
    relatedLessons: ['iso20022-fundamentals'],
  },
  {
    id: 'valid-xml-valid-payment',
    title: 'Valid XML vs. Valid Payment',
    left: 'Schema-valid XML',
    right: 'A processable payment',
    explanation: 'A message can be syntactically valid and schema-valid, yet still fail business rules, scheme rules, or simply not represent a payment that can actually be completed.',
    relatedLessons: ['iso20022-fundamentals'],
  },
  {
    id: 'pain001-pacs008',
    title: 'pain.001 vs. pacs.008',
    left: 'pain.001',
    right: 'pacs.008',
    explanation: 'pain.001 is a customer-to-institution initiation message. pacs.008 is an institution-to-institution interbank credit transfer. They serve different legs of the same broader process.',
    relatedLessons: ['message-families'],
  },
  {
    id: 'status-settlement',
    title: 'Status vs. Settlement',
    left: 'Status',
    right: 'Settlement',
    explanation: 'A reported status (e.g. "accepted") tells you a decision was made about the payment. It does not by itself confirm that value has actually settled.',
    relatedLessons: ['payment-lifecycle'],
  },
  {
    id: 'initiation-movement',
    title: 'Payment initiation vs. funds movement',
    left: 'Initiation',
    right: 'Funds movement',
    explanation: 'Initiating a payment creates an instruction. The actual movement of funds happens later, at settlement/credit. The two can be separated in time.',
    relatedLessons: ['payment-fundamentals'],
  },
]
