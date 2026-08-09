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
    tags: ['reject-vs-return', 'pacs-004'],
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

scenarios.push({
  id: 'pacs008-choose-message',
  title: 'Choosing the right interbank message',
  prompt:
    'A customer at BANK_A wants to send 250 XXX to a customer at BANK_B via a fast payment. BANK_A needs to instruct BANK_B (via the payment network) to credit the beneficiary. Which message would BANK_A typically generate for this interbank leg?',
  choices: [
    { id: 'a', label: 'pain.001', correct: false },
    { id: 'b', label: 'pacs.008', correct: true },
    { id: 'c', label: 'pacs.002', correct: false },
    { id: 'd', label: 'camt.053', correct: false },
  ],
  explanation: {
    reasoning:
      'pain.001 (if used at all) is the customer-facing initiation message. The interbank leg — instructing BANK_B to credit the beneficiary — is carried by pacs.008, a FIToFICustomerCreditTransfer. pacs.002 reports status afterward, and camt.053 is an account statement, not an instruction.',
    relatedMessages: ['pacs.008', 'pain.001'],
  },
  tags: ['pacs-008-deep-dive'],
})

scenarios.push({
  id: 'pain001-customer-request',
  title: 'Customer request reaches BANK_A',
  prompt:
    'CUSTOMER_A sends BANK_A a structured instruction asking it to initiate three credit transfers. Which message concept best fits this customer-to-institution step?',
  choices: [
    { id: 'a', label: 'pain.001', correct: true },
    { id: 'b', label: 'pacs.008', correct: false },
    { id: 'c', label: 'pacs.002', correct: false },
    { id: 'd', label: 'pacs.004', correct: false },
  ],
  explanation: {
    reasoning:
      'pain.001 is the CustomerCreditTransferInitiation message. It carries a customer request to a financial institution; it is not the later interbank instruction, status report or return.',
    relatedMessages: ['pain.001', 'pacs.008'],
  },
  tags: ['pain-001'],
})

scenarios.push({
  id: 'pacs002-status-correlation',
  title: 'Which payment does this status describe?',
  prompt:
    'BANK_A receives a pacs.002 with MsgId MSG-STATUS-002 and OrgnlEndToEndId E2E-001. Which value should it use first to correlate the report to the original customer transaction?',
  choices: [
    { id: 'a', label: 'MSG-STATUS-002', correct: false },
    { id: 'b', label: 'E2E-001', correct: true },
    { id: 'c', label: 'The creation timestamp only', correct: false },
    { id: 'd', label: 'The message family name', correct: false },
  ],
  explanation: {
    reasoning:
      'The report MsgId identifies the pacs.002 envelope. OrgnlEndToEndId carries the EndToEndId of the original transaction and is the relevant correlation value in this synthetic example.',
    relatedMessages: ['pacs.002', 'pacs.008'],
  },
  tags: ['pacs-002'],
})

scenarios.push({
  id: 'status-not-money',
  title: 'Message received, money unknown',
  prompt:
    'Operations can prove that BANK_B received a payment message, but has no settlement confirmation and no beneficiary posting evidence. What can it safely conclude?',
  choices: [
    { id: 'a', label: 'The beneficiary was credited', correct: false },
    { id: 'b', label: 'The payment settled', correct: false },
    { id: 'c', label: 'Only that the message was received; money state remains unproven', correct: true },
    { id: 'd', label: 'A pacs.004 must already exist', correct: false },
  ],
  explanation: {
    reasoning:
      'Message receipt is communication evidence. Without settlement or posting evidence, operations should keep the money state uncertain and investigate rather than infer completion.',
    relatedMessages: ['pacs.008', 'pacs.002'],
    dependsOnScheme: true,
  },
  tags: ['payment-status'],
})

scenarios.push({
  id: 'spi-rd-message-triage',
  title: 'SPI RD: message triage',
  prompt:
    'In a Dominican SPI/SGPI study session, BANK_A needs to check account/balance information with the transaction administrator before investigating a payment. Which ISO 20022 message concept is the best fit for that query?',
  choices: [
    { id: 'a', label: 'pacs.008', correct: false },
    { id: 'b', label: 'pacs.004', correct: false },
    { id: 'c', label: 'camt.003', correct: true },
    { id: 'd', label: 'pain.001', correct: false },
  ],
  explanation: {
    reasoning:
      'camt.003 GetAccount is the account-information query. pacs.008 is for an interbank customer credit transfer, while pacs.004 is a payment return. For the public Dominican SPI/SGPI case study, the exact scheme use of camt.003 remains TO VERIFY unless an authorized implementation guide says so.',
    relatedMessages: ['camt.003', 'camt.004', 'pacs.008', 'pacs.004'],
    dependsOnScheme: true,
  },
  tags: ['spi-rd', 'camt-003', 'message-triage'],
})

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
