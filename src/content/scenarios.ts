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
  id: 'clearing-not-settlement',
  title: 'Net obligation calculated, value not moved',
  prompt:
    'A clearing system calculates that BANK_A owes BANK_B a net 40 XXX. Operations cannot find any posting to the participants\' settlement positions. What is the strongest conclusion?',
  choices: [
    { id: 'a', label: 'The obligations were cleared, but settlement is not yet proven', correct: true },
    { id: 'b', label: 'BANK_B and its customer were both credited', correct: false },
    { id: 'c', label: 'Settlement must have happened because the net amount is known', correct: false },
    { id: 'd', label: 'The original payment instructions never existed', correct: false },
  ],
  explanation: {
    reasoning:
      'The net amount proves that clearing determined the resulting obligation. Without evidence that participant settlement positions changed, the discharge of that obligation remains unproven.',
    lifecycleImpact: 'Cleared → settlement evidence still required.',
    businessPerspective: 'Do not report that value moved or that a beneficiary was credited from a clearing result alone.',
    technicalPerspective: 'Correlate the clearing result to an authoritative settlement event or posting before advancing the money state.',
    dependsOnScheme: true,
  },
  tags: ['clearing-vs-settlement', 'payment-lifecycle'],
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

scenarios.push({
  id: 'sgpi-001-happy-path',
  title: 'SGPI-001: Happy path evidence',
  prompt:
    'BANK_A has a successful scheme status and final settlement evidence. BANK_B has also posted 500 XXX to CUSTOMER_B. Which statement is fully supported?',
  choices: [
    { id: 'a', label: 'The instruction was only received', correct: false },
    { id: 'b', label: 'The payment settled and the beneficiary was credited', correct: true },
    { id: 'c', label: 'A return is pending', correct: false },
    { id: 'd', label: 'The exact SGPI ISO profile is now known', correct: false },
  ],
  explanation: {
    reasoning:
      'Settlement evidence proves the interparticipant money event, and BANK_B posting evidence separately proves beneficiary credit. Neither fact, however, reveals the exact ISO message profile used by SGPI.',
    lifecycleImpact: 'Settled → Credited.',
    businessPerspective: 'The customer outcome can be reported as completed because both settlement and beneficiary credit have evidence.',
    technicalPerspective: 'Keep the settlement event and beneficiary posting event correlated through synthetic identifiers such as E2E-001 and TX-001.',
    dependsOnScheme: true,
  },
  tags: ['sgpi', 'happy-path', 'settlement', 'credit'],
})

scenarios.push({
  id: 'sgpi-002-reject-before-settlement',
  title: 'SGPI-002: Reject before settlement',
  prompt:
    'BANK_B rejects an operation before settlement. BANK_A had reserved the payer funds. What is the safest diagnosis?',
  choices: [
    { id: 'a', label: 'A post-settlement return must be created', correct: false },
    { id: 'b', label: 'An early rejection; settlement did not occur and the reservation outcome must be verified', correct: true },
    { id: 'c', label: 'The beneficiary was credited and then reversed', correct: false },
    { id: 'd', label: 'A camt.003 moved the funds back', correct: false },
  ],
  explanation: {
    reasoning:
      'The receiving decision stopped the payment before settlement, so this has the shape of a rejection, not a return. The exact event that releases reserved funds belongs to the authorized scheme and institution implementation.',
    lifecycleImpact: 'Reserved → Rejected before settlement → release outcome TO VERIFY.',
    businessPerspective: 'Do not tell CUSTOMER_A that money was returned from BANK_B; no interparticipant settlement was proven.',
    technicalPerspective: 'Correlate the rejection to the original instruction and verify the authoritative reservation-release event.',
    dependsOnScheme: true,
  },
  tags: ['sgpi', 'reject', 'pre-settlement'],
})

scenarios.push({
  id: 'sgpi-003-timeout-before-approval',
  title: 'SGPI-003: Timeout before approval',
  prompt:
    'BANK_A can prove submission and funds reservation, but receives no approval or rejection before its local timer expires. What payment state is justified?',
  choices: [
    { id: 'a', label: 'Rejected', correct: false },
    { id: 'b', label: 'Settled', correct: false },
    { id: 'c', label: 'Uncertain; obtain authoritative scheme status before deciding the outcome', correct: true },
    { id: 'd', label: 'Automatically retry with a new EndToEndId', correct: false },
  ],
  explanation: {
    reasoning:
      'A local timeout proves only that timely evidence is missing. It does not reveal whether the receiving side approved, rejected or continued processing the operation.',
    lifecycleImpact: 'Submitted / reserved → outcome uncertain.',
    businessPerspective: 'Customer communication should acknowledge the pending investigation rather than claim failure or success.',
    technicalPerspective: 'Query or reconcile using the original identifiers. Retry and idempotency behavior must come from authorized rules, not inference.',
    dependsOnScheme: true,
  },
  tags: ['sgpi', 'timeout', 'uncertain-state'],
})

scenarios.push({
  id: 'sgpi-004-problem-after-settlement',
  title: 'SGPI-004: Problem after settlement',
  prompt:
    'Final settlement is proven, but BANK_B reports that CUSTOMER_B could not be credited. What should operations investigate first?',
  choices: [
    { id: 'a', label: 'An early rejection before acceptance', correct: false },
    { id: 'b', label: 'A post-settlement exception and possible return flow under SGPI rules', correct: true },
    { id: 'c', label: 'A new customer initiation only', correct: false },
    { id: 'd', label: 'Whether the original message was ever submitted', correct: false },
  ],
  explanation: {
    reasoning:
      'Settlement already occurred, so the investigation starts after the early-rejection boundary. pacs.004 is conceptually relevant to returning a progressed payment, but exact SGPI usage, timing and reason codes remain TO VERIFY.',
    lifecycleImpact: 'Settled → beneficiary credit failed → post-settlement exception.',
    businessPerspective: 'The originating side needs evidence of how the settled value will be handled before updating CUSTOMER_A.',
    technicalPerspective: 'Trace the original EndToEndId and settlement evidence, then look for an authorized return or exception record.',
    dependsOnScheme: true,
  },
  tags: ['sgpi', 'post-settlement', 'return'],
})

scenarios.push({
  id: 'sgpi-005-message-vs-money',
  title: 'SGPI-005: Message versus money',
  prompt:
    'The SGPI-facing component records that a payment instruction was delivered to the next actor. There is no settlement event and no beneficiary posting. What is proven?',
  choices: [
    { id: 'a', label: 'Only message delivery; money and final payment state remain unproven', correct: true },
    { id: 'b', label: 'The participant obligation was settled', correct: false },
    { id: 'c', label: 'CUSTOMER_B can use the funds', correct: false },
    { id: 'd', label: 'A pacs.004 is required', correct: false },
  ],
  explanation: {
    reasoning:
      'Communication evidence cannot substitute for settlement or posting evidence. Keep the money state and final payment state explicitly unknown until the corresponding events are proven.',
    lifecycleImpact: 'Message delivered; later money events unproven.',
    businessPerspective: 'Avoid telling either customer that the transfer completed.',
    technicalPerspective: 'Continue the trace using stable identifiers and event-specific evidence.',
    dependsOnScheme: true,
  },
  tags: ['sgpi', 'message-state', 'money-state'],
})

scenarios.push({
  id: 'sgpi-006-accepted-by-whom',
  title: 'SGPI-006: Accepted by whom?',
  prompt:
    'A dashboard shows ACCEPTED but does not identify the actor, event or timestamp. What is the best next question?',
  choices: [
    { id: 'a', label: 'Which actor accepted what event, and does separate settlement evidence exist?', correct: true },
    { id: 'b', label: 'Which color should the status badge use?', correct: false },
    { id: 'c', label: 'Can we assume CUSTOMER_B was credited?', correct: false },
    { id: 'd', label: 'Should we replace the EndToEndId?', correct: false },
  ],
  explanation: {
    reasoning:
      'Accepted is meaningful only with a subject and boundary: received by SGPI, validated by the scheme, approved by BANK_B, or accepted for another event. Settlement and credit remain separate.',
    lifecycleImpact: 'Ambiguous acceptance → identify actor and event → evaluate later evidence.',
    businessPerspective: 'A generic accepted flag is not enough for a final customer outcome.',
    technicalPerspective: 'Capture actor, status source, correlated identifier and event timestamp as separate evidence fields.',
    dependsOnScheme: true,
  },
  tags: ['sgpi', 'acceptance', 'status'],
})

scenarios.push({
  id: 'actor-role-investigation',
  title: 'Which actor services the payer?',
  prompt:
    'A synthetic payment trace names CUSTOMER_A as Debtor, BANK_A as Debtor Agent, BANK_B as Creditor Agent and CUSTOMER_B as Creditor. Operations needs the institution that services the payer account. Which actor should it investigate?',
  choices: [
    { id: 'a', label: 'CUSTOMER_A — the Debtor', correct: false },
    { id: 'b', label: 'BANK_A — the Debtor Agent', correct: true },
    { id: 'c', label: 'BANK_B — the Creditor Agent', correct: false },
    { id: 'd', label: 'CUSTOMER_B — the Creditor', correct: false },
  ],
  explanation: {
    reasoning:
      'The Debtor is the party that owes or sends the funds. The Debtor Agent is the financial institution that services that party and its account in this synthetic example.',
    lifecycleImpact: 'Identify the actor boundary before investigating account-side evidence.',
    relatedMessages: ['pacs.008'],
    businessPerspective: 'Contacting the correct role avoids confusing the customer with the institution that acts for the customer.',
    technicalPerspective: 'Inspect the Debtor Agent role and correlate it with the account-servicing participant in the authorized scheme context.',
    dependsOnScheme: true,
  },
  tags: ['payment-actors', 'pacs-008'],
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
