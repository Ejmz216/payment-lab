import type { Scenario, QuizQuestion } from '@/types/content'

export const scenarios: Scenario[] = [
  {
    id: 'reject-or-return-1',
    title: 'Beneficiary account closed',
    prompt:
      'A receiving institution accepts a payment. The beneficiary account is subsequently determined to be closed, and the credit cannot be completed. What should you investigate first?',
    choices: [
      { id: 'a', label: 'A new pacs.008 needs to be sent', correct: false },
      { id: 'b', label: 'The return flow (the payment already progressed and now needs to be sent back)', correct: true },
      { id: 'c', label: 'Customer initiation (pain.001)', correct: false },
      { id: 'd', label: 'Nothing — no action needed', correct: false },
    ],
    explanation: {
      reasoning:
        'The payment was already accepted — it progressed past validation. A failure discovered afterward, when funds cannot be credited, is a return scenario, not a rejection.',
      lifecycleImpact: 'Accepted → later failure at the credit step.',
      relatedMessages: ['pacs.004'],
      businessPerspective: 'The originating side needs to be informed the funds are coming back so they can inform their customer.',
      technicalPerspective: 'Look for a return-style message referencing the original EndToEndId.',
      dependsOnScheme: true,
    },
    tags: ['reject-vs-return'],
  },
  {
    id: 'reject-or-return-2',
    title: 'Invalid account number at validation',
    prompt:
      'A payment instruction is received. During initial validation, the account number format is found to be invalid. The payment never proceeds further. What is this most likely?',
    choices: [
      { id: 'a', label: 'A reject', correct: true },
      { id: 'b', label: 'A return', correct: false },
      { id: 'c', label: 'A recall', correct: false },
      { id: 'd', label: 'A completed payment', correct: false },
    ],
    explanation: {
      reasoning: 'The problem was found before acceptance — the payment never progressed. This is the shape of a reject, not a return.',
      lifecycleImpact: 'Received → Validation failed → not accepted.',
      relatedMessages: ['pacs.002'],
      dependsOnScheme: true,
    },
    tags: ['reject-vs-return'],
  },
  {
    id: 'identifier-trace-1',
    title: 'Tracing across a status report',
    prompt:
      'You receive a pacs.002 status report and need to find which original payment it refers to. Which field is most reliable for this?',
    choices: [
      { id: 'a', label: 'MsgId of the status report', correct: false },
      { id: 'b', label: 'OrgnlEndToEndId (Original End To End Identification)', correct: true },
      { id: 'c', label: 'CreDtTm of the status report', correct: false },
      { id: 'd', label: 'NbOfTxs', correct: false },
    ],
    explanation: {
      reasoning:
        'OrgnlEndToEndId explicitly carries the EndToEndId of the original transaction being reported on, which is designed to travel unchanged end to end.',
      relatedMessages: ['pacs.002', 'pacs.008'],
    },
    tags: ['identifiers'],
  },
]

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q-clearing-settlement-1',
    type: 'multiple-choice',
    prompt: 'Which statement best describes settlement?',
    choices: [
      { id: 'a', label: 'Determining who owes what to whom', correct: false },
      { id: 'b', label: 'The actual discharge of a financial obligation', correct: true },
      { id: 'c', label: 'Validating message syntax', correct: false },
      { id: 'd', label: 'Sending a customer initiation message', correct: false },
    ],
    explanation: 'Settlement is the actual movement/discharge of value. Clearing is what determines the obligation beforehand.',
    conceptIds: ['clearing-vs-settlement'],
  },
  {
    id: 'q-actors-1',
    type: 'true-false',
    prompt: 'True or false: Debtor and Debtor Agent refer to the same role.',
    choices: [
      { id: 'a', label: 'True', correct: false },
      { id: 'b', label: 'False', correct: true },
    ],
    explanation: 'Debtor = the party that owes/sends funds. Debtor Agent = the institution servicing that party. They are different roles.',
    conceptIds: ['payment-actors'],
  },
  {
    id: 'q-identifiers-1',
    type: 'multiple-choice',
    prompt: 'Which identifier is designed to travel unchanged with a payment end to end?',
    choices: [
      { id: 'a', label: 'MsgId', correct: false },
      { id: 'b', label: 'TxId', correct: false },
      { id: 'c', label: 'EndToEndId', correct: true },
      { id: 'd', label: 'InstrId', correct: false },
    ],
    explanation: 'EndToEndId is intended to remain unchanged from the original debtor to the final creditor, making it valuable for tracing.',
    conceptIds: ['identifiers'],
  },
  {
    id: 'q-iso-1',
    type: 'true-false',
    prompt: 'True or false: ISO 20022 is fundamentally an XML format.',
    choices: [
      { id: 'a', label: 'True', correct: false },
      { id: 'b', label: 'False', correct: true },
    ],
    explanation: 'ISO 20022 is a modeling methodology covering business processes and message definitions. XML is one possible syntax used to represent messages.',
    conceptIds: ['iso20022-fundamentals'],
  },
  {
    id: 'q-rejectreturn-1',
    type: 'multiple-choice',
    prompt: 'A payment was already settled, but the beneficiary account turned out to be closed. What is this?',
    choices: [
      { id: 'a', label: 'A reject', correct: false },
      { id: 'b', label: 'A return', correct: true },
      { id: 'c', label: 'A duplicate', correct: false },
      { id: 'd', label: 'An initiation', correct: false },
    ],
    explanation: 'Because the payment already progressed past acceptance/settlement, a later failure is handled as a return, not a reject.',
    conceptIds: ['reject-vs-return'],
  },
]
