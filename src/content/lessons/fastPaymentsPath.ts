import type { Lesson, LearningPath } from '@/types/content'

export const fastPaymentsPath: LearningPath = {
  id: 'fast-payments',
  title: 'Fast Payments Path',
  description:
    'The recommended route through Payment Lab. Learn how a payment actually works before treating ISO 20022 messages as isolated XML files.',
  lessonIds: [
    'payment-fundamentals',
    'payment-actors',
    'payment-lifecycle',
    'clearing-vs-settlement',
    'fast-payments',
    'iso20022-fundamentals',
    'message-families',
    'identifiers',
    'reject-vs-return',
    'cancellation-recall-reversal',
    'camt-cash-management',
    'reconciliation-investigations',
    'payment-architecture',
  ],
}

export const fastPaymentsLessons: Lesson[] = [
  {
    id: 'payment-fundamentals',
    pathId: 'fast-payments',
    order: 1,
    title: 'Payment Fundamentals',
    subtitle: 'What actually happens when money moves',
    whyItMatters:
      'Every ISO 20022 message exists to support a real business process: moving money (or an instruction to move money) between parties. If you understand the process first, the messages stop looking arbitrary.',
    objectives: [
      'Explain the difference between a payment instruction and an actual movement of funds.',
      'Name the core institutions involved in a simple payment.',
      'Define payment rail, payment scheme, and payment network in your own words.',
      'Recognize clearing and settlement as distinct concepts you will study in depth later.',
    ],
    mentalModel:
      'A payment is a business process, not a file. A message is just how participants communicate during that process.',
    sections: [
      {
        heading: 'What is a payment?',
        body:
          'A payment is the process of moving economic value from one party (the payer) to another (the payee). That process usually involves at least two financial institutions and one or more infrastructures that connect them. The instruction to pay and the actual movement of funds are two different things — the instruction can exist before the money truly moves.',
      },
      {
        heading: 'Instruction vs. movement',
        body:
          'When a customer authorizes a payment, they create a payment instruction. That instruction travels through banks and infrastructures as messages. The actual discharge of the financial obligation (the movement of value between institutions) happens later, during settlement. Confusing "the instruction was sent" with "the money moved" is one of the most common beginner mistakes in payments.',
      },
      {
        heading: 'Who is involved',
        body:
          'A simple domestic payment usually involves: the payer, the payer\'s bank, a payment system (clearing/settlement infrastructure), the payee\'s bank, and the payee. Cross-border or more complex payments can add intermediaries.',
      },
      {
        heading: 'Payment rail, scheme, and network',
        body:
          'A payment rail is the underlying infrastructure that moves payment instructions and value (for example, an instant payment system or an RTGS system). A payment scheme is the set of rules, roles and obligations that participants agree to follow when using a rail (for example, message usage rules, timing rules, liability rules). A payment network is the set of participants connected through that rail and scheme. These terms are often used loosely in the industry — treat this as a working model, not a strict taxonomy.',
      },
    ],
    keyTerms: ['payment', 'payment rail', 'payment scheme', 'payment network', 'clearing system', 'settlement system'],
    commonConfusion: [
      {
        title: 'Sending a payment instruction is not the same as the funds arriving',
        explanation:
          'A payment can be accepted by every system involved and still fail to credit the beneficiary later. The instruction and the value movement are related but distinct events.',
      },
    ],
    relatedLessons: ['payment-actors', 'payment-lifecycle'],
    relatedConcepts: ['clearing', 'settlement', 'payment-scheme'],
    sources: [
      {
        sourceName: 'Payment Lab educational synthesis',
        sourceType: 'educational-synthesis',
        lastReviewed: '2026-01-01',
        notes: 'General payments terminology synthesized for teaching purposes; not a normative source.',
      },
    ],
    estimatedMinutes: 6,
  },
  {
    id: 'payment-actors',
    pathId: 'fast-payments',
    order: 2,
    title: 'Payment Actors',
    subtitle: 'Who is who in a payment message',
    whyItMatters:
      'ISO 20022 messages are built around roles: Debtor, Creditor, Debtor Agent, Creditor Agent and more. Knowing exactly what each role means — and does not mean — prevents most beginner confusion when reading a message.',
    objectives: [
      'Distinguish a party (Debtor/Creditor) from an agent (Debtor Agent/Creditor Agent).',
      'Explain what an Ultimate Debtor/Creditor represents.',
      'Explain the difference between Instructing Agent and Instructed Agent.',
      'Identify where clearing systems and settlement systems fit relative to agents.',
    ],
    mentalModel: 'Parties own the money. Agents service the parties. Infrastructures connect the agents.',
    sections: [
      {
        heading: 'Parties vs. agents',
        body:
          'The Debtor is the party that owes or sends funds. The Debtor Agent is the financial institution that services the Debtor (typically where the Debtor holds an account). The same pattern applies on the receiving side: the Creditor is the party that receives funds, and the Creditor Agent is the institution servicing the Creditor. A very common beginner mistake is treating "Debtor" and "Debtor Agent" as interchangeable — they are not.',
      },
      {
        heading: 'Ultimate Debtor / Ultimate Creditor',
        body:
          'These roles represent the party ultimately owing or ultimately benefiting from a payment when it differs from the Debtor/Creditor named on the transaction (for example, a payment made on behalf of a third party). They are optional in many contexts and depend on the business scenario.',
      },
      {
        heading: 'Instructing Agent / Instructed Agent',
        body:
          'In a chain of institutions, the Instructing Agent is the institution sending an instruction to the next institution in the chain (the Instructed Agent). These roles describe a relationship between two adjacent institutions in a processing chain — they are relative, not fixed global roles.',
      },
      {
        heading: 'Infrastructures',
        body:
          'Clearing systems and settlement systems are not agents that own money — they are infrastructures that allow agents to exchange instructions and discharge obligations. A central bank may operate settlement infrastructure and/or hold settlement accounts for participants.',
      },
    ],
    keyTerms: ['Debtor', 'Creditor', 'Debtor Agent', 'Creditor Agent', 'Ultimate Debtor', 'Ultimate Creditor', 'Instructing Agent', 'Instructed Agent', 'Intermediary Agent'],
    commonConfusion: [
      {
        title: 'Debtor vs. Debtor Agent',
        explanation: 'Debtor = the party that owes/sends funds. Debtor Agent = the institution servicing that party. Do not treat them as the same role.',
      },
    ],
    relatedLessons: ['payment-fundamentals', 'payment-lifecycle'],
    relatedMessages: ['pacs.008'],
    sources: [
      { sourceName: 'Payment Lab educational synthesis', sourceType: 'educational-synthesis', lastReviewed: '2026-01-01' },
    ],
    estimatedMinutes: 7,
  },
  {
    id: 'payment-lifecycle',
    pathId: 'fast-payments',
    order: 3,
    title: 'Payment Lifecycle',
    subtitle: 'An educational model of the stages a payment moves through',
    whyItMatters:
      'When something goes wrong with a payment, the first question is always "at which stage did it fail?" Having a shared mental model of the lifecycle lets you reason about that quickly.',
    objectives: [
      'List a plausible sequence of stages a payment can move through.',
      'Explain that real systems may use different terminology or fewer/more states.',
      'Identify what could plausibly fail at each stage.',
    ],
    mentalModel: 'This is a simplified educational model, not a universal ISO 20022 state machine.',
    sections: [
      {
        heading: 'A simplified lifecycle',
        body:
          'Initiated → Received → Validated → Accepted → Cleared → Settled → Credited → Completed. Each stage represents a plausible checkpoint in a payment\'s life. Different payment schemes define their own actual state models — this sequence is a teaching tool to help you reason about "before vs. after," not a standard.',
      },
      {
        heading: 'What can fail at each stage',
        body:
          'Initiated: the customer request itself may be invalid. Received: the message may not reach the next participant. Validated: syntax, schema, or business rules may fail. Accepted: after acceptance, later failures usually require a different kind of message (such as a return) rather than a simple rejection. Cleared/Settled: obligations may not be discharged due to liquidity, timing or technical issues. Credited: the receiving institution may be unable to credit the beneficiary account (e.g., closed account) even though settlement succeeded.',
      },
    ],
    keyTerms: ['initiated', 'validated', 'accepted', 'cleared', 'settled', 'credited'],
    commonConfusion: [
      {
        title: 'This lifecycle is educational, not a standard',
        explanation: 'Real payment schemes define their own specific status models. Use this sequence to reason, not to cite as fact.',
      },
    ],
    relatedLessons: ['clearing-vs-settlement', 'reject-vs-return'],
    sources: [{ sourceName: 'Payment Lab educational synthesis', sourceType: 'educational-synthesis', lastReviewed: '2026-01-01' }],
    estimatedMinutes: 6,
  },
  {
    id: 'clearing-vs-settlement',
    pathId: 'fast-payments',
    order: 4,
    title: 'Clearing vs. Settlement',
    subtitle: 'Two of the most confused terms in payments',
    whyItMatters:
      'Almost every payments conversation eventually depends on this distinction. Getting it wrong makes it hard to reason about risk, timing, and finality.',
    objectives: [
      'Define clearing as determining what is owed to whom.',
      'Define settlement as the actual discharge of that obligation.',
      'Differentiate gross, net, deferred and real-time settlement conceptually.',
    ],
    mentalModel: 'Clearing answers "who owes what to whom?" Settlement is the actual discharge of that obligation.',
    sections: [
      {
        heading: 'Clearing',
        body:
          'Clearing is the process of exchanging and validating payment instructions and determining the resulting obligations between participants — essentially calculating who owes what to whom before any final transfer of value occurs.',
      },
      {
        heading: 'Settlement',
        body:
          'Settlement is the actual discharge of those obligations — the point where value truly moves between institutions (often via accounts at a central bank or a settlement agent). Settlement is what gives a payment finality.',
      },
      {
        heading: 'A simple two-way example',
        body:
          'Suppose BANK_A owes BANK_B 100, and BANK_B owes BANK_A 60 (gross obligations). Depending on the settlement mechanism used by a given system, these obligations might each be settled individually (gross), or offset against each other and settled as a single net amount, or settled at defined intervals (deferred), or settled continuously in real time. Which mechanism applies depends entirely on the system in question — there is no single universal approach.',
      },
      {
        heading: 'Settlement models',
        body:
          'Gross settlement: each obligation is settled individually and in full. Net settlement: obligations between participants are offset and only the net difference settles. Deferred settlement: settlement happens at scheduled points rather than immediately. Real-time settlement: settlement happens continuously, close to the time of the transaction.',
      },
    ],
    keyTerms: ['clearing', 'settlement', 'gross settlement', 'net settlement', 'deferred settlement', 'real-time settlement', 'finality'],
    commonConfusion: [
      { title: 'Clearing vs. Settlement', explanation: 'Clearing determines the obligation. Settlement discharges it. A payment can be cleared without yet being settled.' },
    ],
    relatedLessons: ['payment-lifecycle', 'payment-systems'.replace('payment-systems', 'fast-payments')],
    relatedConcepts: ['clearing', 'settlement'],
    sources: [{ sourceName: 'Payment Lab educational synthesis', sourceType: 'educational-synthesis', lastReviewed: '2026-01-01' }],
    estimatedMinutes: 8,
  },
  {
    id: 'fast-payments',
    pathId: 'fast-payments',
    order: 5,
    title: 'Fast Payments',
    subtitle: 'Near real-time processing, end to end',
    whyItMatters:
      'Fast (instant) payment systems are one of the most important developments in modern payments, and they introduce constraints — speed, availability, irrevocability — that shape how ISO 20022 messages are used in that context.',
    objectives: [
      'Explain what "fast payment" typically means in terms of processing time and availability.',
      'List the checks a payment typically passes through before infrastructure processing.',
      'Explain why finality/irrevocability, duplicate detection and idempotency matter for fast payments.',
    ],
    mentalModel: 'Fast payments compress the entire lifecycle into seconds — which means validation, fraud checks, and status reporting all have to happen almost instantly.',
    sections: [
      {
        heading: 'What "fast" means',
        body:
          'A fast (or instant) payment system typically processes payments in near real-time — often within seconds — and is commonly available 24 hours a day, 7 days a week, 365 days a year. The exact guarantees depend on the specific scheme.',
      },
      {
        heading: 'The flow',
        body:
          'Customer → Channel → Originating Institution → Validation → Fraud/Compliance checks → Fast Payment Infrastructure → Receiving Institution → Beneficiary Account. Each step must complete quickly enough that the end-to-end experience still feels instant to the customer.',
      },
      {
        heading: 'Key concerns unique to fast payments',
        body:
          'Alias/proxy services (resolving a phone number or ID to an account), participant and account validation, fraud and sanctions checks under time pressure, transaction limits, liquidity available to settle instantly, timeouts when a receiving participant does not respond in time, duplicate detection and idempotency (ensuring the same instruction is not processed twice), and exception handling when something fails after the customer has already been told "sent."',
      },
      {
        heading: 'Finality',
        body:
          'Many fast payment schemes are designed so that once a payment is confirmed, it is treated as final and generally not reversible by simple cancellation — which is exactly why understanding return, recall and reversal as distinct concepts (covered later) matters so much in this context.',
      },
    ],
    keyTerms: ['fast payment', 'instant payment', 'finality', 'proxy service', 'idempotency', 'duplicate detection'],
    commonConfusion: [
      { title: 'Fast does not mean simple', explanation: 'Compressing the lifecycle into seconds increases the operational and technical complexity behind the scenes, even though the customer experience looks simple.' },
    ],
    relatedLessons: ['payment-lifecycle', 'clearing-vs-settlement', 'iso20022-fundamentals'],
    relatedMessages: ['pacs.008', 'pacs.002'],
    sources: [{ sourceName: 'Payment Lab educational synthesis', sourceType: 'educational-synthesis', lastReviewed: '2026-01-01' }],
    estimatedMinutes: 9,
  },
  {
    id: 'iso20022-fundamentals',
    pathId: 'fast-payments',
    order: 6,
    title: 'ISO 20022 Fundamentals',
    subtitle: 'ISO 20022 is not XML',
    whyItMatters:
      'Treating ISO 20022 as "just an XML format" is the single biggest misconception that blocks real understanding. ISO 20022 is a modeling methodology; XML is one possible syntax used to represent it.',
    objectives: [
      'Explain the layers from business process down to XML instance.',
      'State clearly why ISO 20022 is not equivalent to XML.',
      'Identify the parts of a message identifier (family, number, variant, version).',
    ],
    mentalModel: 'Business Process → Business Transaction → Message Flow → Message Definition → Components → Data Types → Syntax → XML instance.',
    sections: [
      {
        heading: 'From business process to XML',
        body:
          'ISO 20022 starts from modeling real business processes and transactions (e.g., "a customer credit transfer"). From that model, message definitions are derived, made of reusable components and data types. Those definitions are then expressed in a concrete syntax — most commonly XML today, though the standard itself is syntax-independent.',
      },
      {
        heading: 'Why "ISO 20022 is not XML" matters',
        body:
          'If you only think in terms of XML tags, you miss the business model behind them and you risk assuming a tag\'s presence in a schema means it is required or meaningful in every context. Understanding the underlying business model helps you reason about a field even when you have not memorized it.',
      },
      {
        heading: 'Reading a message identifier',
        body:
          'A message identifier such as pacs.008.001.10 breaks down into: business area (pacs), message number (008), variant (001), and version (10). Multiple versions of the same message can coexist; never assume there is only one version of a given message.',
      },
    ],
    keyTerms: ['ISO 20022', 'message definition', 'business process', 'business transaction', 'message identifier', 'version'],
    commonConfusion: [
      { title: 'ISO 20022 vs. XML', explanation: 'XML is a possible representation of an ISO 20022 message. ISO 20022 itself is a broader modeling methodology covering business processes, not just a markup format.' },
      { title: 'Valid XML vs. valid payment', explanation: 'A message can be syntactically valid (well-formed, schema-valid) and still violate business or scheme rules, or fail to represent a payment that can actually be processed.' },
    ],
    relatedLessons: ['message-families'],
    relatedMessages: ['pacs.008'],
    sources: [{ sourceName: 'ISO 20022 official catalogue', sourceType: 'ISO', lastReviewed: '2026-01-01', notes: 'General structure described from publicly available ISO 20022 documentation summaries.' }],
    estimatedMinutes: 8,
  },
  {
    id: 'message-families',
    pathId: 'fast-payments',
    order: 7,
    title: 'Message Families',
    subtitle: 'pain, pacs, camt and friends',
    whyItMatters:
      'Recognizing a message family instantly tells you roughly who is talking to whom and why — a huge shortcut when reading unfamiliar documentation.',
    objectives: [
      'Identify the typical purpose of pain, pacs, and camt messages.',
      'Explain that these are common patterns, not universal rules for every message in the family.',
    ],
    sections: [
      {
        heading: 'pain — Payments Initiation',
        body:
          'Typically used between a customer and their financial institution, for messages related to initiating a payment. Example: pain.001 (Customer Credit Transfer Initiation).',
      },
      {
        heading: 'pacs — Payments Clearing and Settlement',
        body:
          'Typically used between financial institutions, for messages related to clearing and settlement of payments. Example: pacs.008 (FIToFICustomerCreditTransfer), pacs.002 (FIToFIPaymentStatusReport), pacs.004 (PaymentReturn).',
      },
      {
        heading: 'camt — Cash Management',
        body:
          'Covers cash management activities: account reporting, statements, debit/credit notifications, and investigations. camt is broader than "bank statements" — it also covers cash management processes relevant to payments.',
      },
      {
        heading: 'Other families',
        body:
          'admi (administration messages), head (business application header), remt (remittance advice) also exist. Payment Lab will expand coverage of these over time.',
      },
    ],
    keyTerms: ['pain', 'pacs', 'camt', 'admi', 'head', 'remt'],
    commonConfusion: [
      { title: 'These descriptions are patterns, not absolute rules', explanation: 'Not every message in a family strictly follows the "typical" participant pattern described here — always check the specific message definition.' },
    ],
    relatedLessons: ['iso20022-fundamentals'],
    relatedMessages: ['pain.001', 'pacs.008', 'pacs.002', 'pacs.004'],
    sources: [{ sourceName: 'ISO 20022 official catalogue', sourceType: 'ISO', lastReviewed: '2026-01-01' }],
    estimatedMinutes: 6,
  },
  {
    id: 'identifiers',
    pathId: 'fast-payments',
    order: 8,
    title: 'Identifiers',
    subtitle: 'MsgId, InstrId, EndToEndId, TxId — and why they are not interchangeable',
    whyItMatters:
      'Almost every investigation, reconciliation, or troubleshooting task starts with correlating identifiers across messages. Confusing them is one of the fastest ways to trace the wrong transaction.',
    objectives: [
      'Distinguish message-level identifiers from transaction-level identifiers.',
      'Explain the typical purpose of MsgId, InstrId, EndToEndId, and TxId.',
      'Reason about which identifier to use when tracing a payment across systems.',
    ],
    mentalModel: 'A single message can carry multiple transactions. Message-level identifiers describe the envelope; transaction-level identifiers describe each individual payment inside it.',
    sections: [
      {
        heading: 'Levels of identification',
        body:
          'Message-level: identifies the message itself (e.g., MsgId). Transaction-level: identifies an individual transaction within the message (e.g., InstrId, EndToEndId, TxId). Network-level and institution-level references may also be added by infrastructures or institutions as the payment travels.',
      },
      {
        heading: 'Typical roles',
        body:
          'MsgId: identifies the message envelope, assigned by the message sender. InstrId: an instruction identifier, often assigned by the instructing party for its own tracking. EndToEndId: intended to travel unchanged with the payment from the original debtor to the final creditor, which makes it particularly valuable for end-to-end tracing. TxId: a transaction identifier, often assigned within the clearing/settlement chain. Depending on the scheme, additional references (such as a clearing system reference or a universal end-to-end transaction reference) may also exist.',
      },
      {
        heading: 'Why this matters for reconciliation',
        body:
          'Because a message can contain several transactions, and each transaction can carry several identifiers, tracing a single payment during an investigation requires knowing exactly which identifier is guaranteed to stay consistent across the messages you are comparing.',
      },
    ],
    keyTerms: ['MsgId', 'InstrId', 'EndToEndId', 'TxId', 'message-level', 'transaction-level'],
    commonConfusion: [
      { title: 'MsgId vs. TxId', explanation: 'MsgId identifies the envelope containing potentially many transactions. TxId identifies one specific transaction inside it. They answer different questions.' },
    ],
    relatedLessons: ['message-families'],
    relatedMessages: ['pacs.008', 'pacs.002', 'pacs.004'],
    sources: [{ sourceName: 'Payment Lab educational synthesis', sourceType: 'educational-synthesis', lastReviewed: '2026-01-01' }],
    estimatedMinutes: 8,
  },
  {
    id: 'reject-vs-return',
    pathId: 'fast-payments',
    order: 9,
    title: 'Reject vs. Return',
    subtitle: 'One of the most important distinctions in payments',
    whyItMatters:
      'Choosing the wrong investigation path (reject vs. return vs. cancellation) wastes time and can mislead an entire troubleshooting effort. This distinction shows up constantly in real payment operations.',
    objectives: [
      'Explain reject as "not accepted / cannot continue" before/at validation.',
      'Explain return as "already processed/accepted, but later cannot be completed."',
      'Reason about which one applies given a failure point in the lifecycle.',
    ],
    mentalModel: 'Reject happens before acceptance. Return happens after acceptance. The exact boundary and messages used depend on the payment scheme.',
    sections: [
      {
        heading: 'Reject',
        body:
          'A payment instruction is received, a validation or business problem is found, and the payment is not accepted — it cannot continue through the normal flow. Conceptually: instruction → validation/problem → not accepted.',
      },
      {
        heading: 'Return',
        body:
          'A payment has already been processed and accepted, but later it cannot be completed (for example, the beneficiary account turns out to be closed). Funds or the payment itself are sent back. Conceptually: processed/accepted → later cannot be completed → sent back.',
      },
      {
        heading: 'The exact boundary depends on the scheme',
        body:
          'Where exactly "acceptance" occurs, and which messages are used for reject vs. return, depends on the specific payment scheme and the point in the lifecycle. Use this lesson\'s model to reason about the general shape of the problem, not as a universal rule for every scheme.',
      },
    ],
    keyTerms: ['reject', 'return', 'acceptance'],
    commonConfusion: [
      { title: 'Reject and Return are not the same thing', explanation: 'A reject means the payment never truly progressed. A return means it did progress and is now being unwound. Investigating the wrong one wastes time.' },
    ],
    scenarioId: 'reject-or-return-1',
    relatedLessons: ['payment-lifecycle'],
    relatedMessages: ['pacs.002', 'pacs.004'],
    sources: [{ sourceName: 'Payment Lab educational synthesis', sourceType: 'educational-synthesis', lastReviewed: '2026-01-01' }],
    estimatedMinutes: 9,
  },
  {
    id: 'cancellation-recall-reversal',
    pathId: 'fast-payments',
    order: 10,
    title: 'Cancellation, Recall & Reversal',
    subtitle: 'Not the same as a return — and not the same as each other',
    whyItMatters:
      'Teams often say "cancel it" when they mean very different things. Knowing which concept actually applies changes what you ask for and what outcome you can expect.',
    objectives: [
      'Distinguish a request to cancel from a recall, a reversal, a rejection, and a return.',
      'Explain why none of these outcomes are guaranteed once a payment has progressed far enough.',
      'Use a simple decision tree to reason about which concept applies to a given situation.',
    ],
    mentalModel: 'Cancellation-family concepts are all about undoing something after the fact — they differ in when they are used and whether the outcome is guaranteed.',
    sections: [
      {
        heading: 'Request to cancel',
        body:
          'A request, usually sent by the original sending side, asking that a payment not be processed further or be undone. Whether it succeeds depends on how far the payment has already progressed and on the rules of the scheme involved.',
      },
      {
        heading: 'Recall',
        body:
          'Similar in spirit to a cancellation request — the sending side asks for a payment to be brought back, generally after it has already been sent. A recall is a request, not a guarantee: the receiving side may or may not be able to honor it (for example, if funds have already been paid out to the beneficiary).',
      },
      {
        heading: 'Reversal',
        body:
          'Undoing the effect of a payment that has already settled, typically initiated on the processing/receiving side rather than as a customer-driven request (for example, correcting a technical duplicate). The exact mechanics depend heavily on the scheme.',
      },
      {
        heading: 'Rejection and Return, revisited',
        body:
          'As covered earlier: a rejection happens before/at acceptance (the payment never truly progressed). A return happens after acceptance, when a payment already progressed but later cannot be completed. Cancellation and recall requests are different again — they are attempts to undo something that may already be past the point where undoing it is guaranteed to work.',
      },
    ],
    keyTerms: ['cancellation', 'recall', 'reversal'],
    commonConfusion: [
      { title: 'Cancellation ≠ Return', explanation: 'A return means the payment already progressed and funds are being sent back through the normal exception flow. A cancellation/recall is a request that may or may not be honored — it is not a guaranteed outcome.' },
      { title: 'Recall ≠ guaranteed reversal', explanation: 'Asking for a payment to be recalled does not mean it will be undone. The receiving side may already have released the funds, especially in fast payment schemes designed for high finality.' },
    ],
    relatedLessons: ['reject-vs-return', 'fast-payments'],
    relatedMessages: ['pacs.004'],
    sources: [{ sourceName: 'Payment Lab educational synthesis', sourceType: 'educational-synthesis', lastReviewed: '2026-01-01' }],
    estimatedMinutes: 8,
  },
  {
    id: 'camt-cash-management',
    pathId: 'fast-payments',
    order: 11,
    title: 'camt & Cash Management',
    subtitle: 'More than "bank statements"',
    whyItMatters:
      'camt messages show up constantly in reconciliation and investigation work. Knowing what the family actually covers — not just statements — helps you recognize when a camt message is the right tool.',
    objectives: [
      'Explain what "cash management" covers beyond account statements.',
      'Recognize account reporting, notifications, and investigation messages as camt use cases.',
      'Identify where camt fits relative to pacs messages in a payment\'s life.',
    ],
    sections: [
      {
        heading: 'Beyond the bank statement',
        body:
          'camt is often introduced as "the bank statement family," which undersells it. It covers a broader set of cash management activities: periodic account statements, real-time debit/credit notifications, ad-hoc account reporting requests, and investigation-related messages used when something about a payment needs to be looked into after the fact.',
      },
      {
        heading: 'Where camt fits',
        body:
          'While pain messages initiate payments and pacs messages carry them between institutions, camt messages typically report on the resulting state of accounts and support looking back at what happened — which makes them central to reconciliation and investigation work, covered in the next lesson.',
      },
      {
        heading: 'Two representative examples',
        body:
          'A statement-style message reports the transactions and balances on an account over a period. An investigation-style message is used to request or report on the resolution of a question about a specific payment (for example, "where did this payment go?"). Payment Lab\'s Atlas includes catalog-level entries for both — see the camt family in the Message Catalog.',
      },
    ],
    keyTerms: ['camt', 'cash management', 'account statement', 'notification'],
    commonConfusion: [
      { title: 'camt is not just statements', explanation: 'Statements are one part of camt. Notifications, reporting requests, and investigation messages are also part of the family.' },
    ],
    relatedLessons: ['message-families', 'reconciliation-investigations'],
    relatedMessages: ['camt.053', 'camt.029'],
    sources: [{ sourceName: 'ISO 20022 official catalogue', sourceType: 'ISO', lastReviewed: '2026-01-01' }],
    estimatedMinutes: 6,
  },
  {
    id: 'reconciliation-investigations',
    pathId: 'fast-payments',
    order: 12,
    title: 'Reconciliation & Investigations',
    subtitle: 'Matching records and chasing down exceptions',
    whyItMatters:
      'When a customer asks "where is my payment?", reconciliation and investigation are the disciplines that answer it — and they lean entirely on the identifiers and message relationships covered earlier in this path.',
    objectives: [
      'Explain reconciliation as matching records across systems or institutions.',
      'Explain when an investigation is opened and what it typically tries to establish.',
      'Identify which identifiers and messages are most useful when starting an investigation.',
    ],
    mentalModel: 'Reconciliation asks "do our records agree?" Investigation asks "what actually happened to this specific payment?"',
    sections: [
      {
        heading: 'Reconciliation',
        body:
          'Reconciliation compares records held by different systems or institutions (for example, a core ledger and a payment system) to confirm they agree — same transactions, same amounts, same statuses. Discrepancies found during reconciliation are often what trigger an investigation.',
      },
      {
        heading: 'Investigation',
        body:
          'An investigation is opened when something about a specific payment needs to be established — for example, whether it was received, why it hasn\'t been credited, or where in the chain it currently sits. Investigations typically start from an identifier (most reliably EndToEndId) and trace forward or backward through related messages.',
      },
      {
        heading: 'What you reach for first',
        body:
          'In practice: start with the EndToEndId of the transaction in question, look for any status reports (pacs.002-style) referencing it, check whether a return (pacs.004-style) exists, and consult camt-style reporting/investigation messages for the account-level view. This is the same reasoning skill exercised in the Payment Debugger lab.',
      },
    ],
    keyTerms: ['reconciliation', 'investigation', 'EndToEndId'],
    commonConfusion: [
      { title: 'Reconciliation vs. Investigation', explanation: 'Reconciliation is a routine comparison process that can surface a discrepancy. Investigation is the focused follow-up on one specific payment once a discrepancy or question is identified.' },
    ],
    relatedLessons: ['identifiers', 'camt-cash-management'],
    relatedMessages: ['pacs.002', 'pacs.004', 'camt.029'],
    sources: [{ sourceName: 'Payment Lab educational synthesis', sourceType: 'educational-synthesis', lastReviewed: '2026-01-01' }],
    estimatedMinutes: 7,
  },
  {
    id: 'payment-architecture',
    pathId: 'fast-payments',
    order: 13,
    title: 'Payment Architecture',
    subtitle: 'A generic educational view of how the pieces fit together',
    whyItMatters:
      'Having one mental picture of how a channel, an orchestrator, validation, and a core ledger typically relate makes it much easier to guess where a problem lives when someone describes a payment issue.',
    objectives: [
      'Describe a generic technical flow from customer channel to core ledger.',
      'Identify where validation, fraud/compliance, and ISO mapping typically sit in that flow.',
      'Explain why this is a simplified educational model, not a universal architecture.',
    ],
    mentalModel: 'This is one plausible generic architecture, used to build intuition — real institutions structure this differently.',
    sections: [
      {
        heading: 'A generic flow',
        body:
          'Channel (where the customer or system initiates) → Payments API → Payment Orchestrator → Validation (including fraud, compliance, limits, and routing checks) → ISO Mapper (translating between internal data models and ISO 20022 messages) → Payment Network → Inbound Adapter (on the receiving side) → Core / Ledger (where the account is actually debited or credited).',
      },
      {
        heading: 'Why this matters for troubleshooting',
        body:
          'When someone reports "the payment failed," this generic model gives you questions to ask: did it fail at validation (before ever reaching the network), at the network/scheme level, or after being received, during core/ledger processing? Each layer tends to produce different symptoms and requires different people to investigate.',
      },
      {
        heading: 'This is not universal',
        body:
          'Real institutions combine, split, rename or reorder these components constantly. Use this diagram to build a habit of thinking in layers, not as a description of any specific system.',
      },
    ],
    keyTerms: ['orchestrator', 'ISO mapper', 'core / ledger', 'inbound adapter'],
    commonConfusion: [
      { title: 'This is a teaching model, not a real architecture', explanation: 'No institution is guaranteed to structure their systems exactly this way. Use it to reason about layers of responsibility, not as a spec.' },
    ],
    relatedLessons: ['payment-lifecycle', 'reconciliation-investigations'],
    sources: [{ sourceName: 'Payment Lab educational synthesis', sourceType: 'educational-synthesis', lastReviewed: '2026-01-01' }],
    estimatedMinutes: 6,
  },
]
