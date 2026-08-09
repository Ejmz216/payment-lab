import type { Lesson, LearningPath } from '@/types/content'
import { sgpiLessons } from '@/content/schemes/sgpi/lessons'

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
    'pain-001',
    'pacs-008-deep-dive',
    'identifiers',
    'pacs-002',
    'payment-status',
    'reject-vs-return',
    'pacs-004',
    'cancellation-recall-reversal',
    'sgpi-public-happy-path',
    'sgpi-funds-state',
    'sgpi-approval-rejection',
    'sgpi-settlement-status-credit',
    'sgpi-iso-mapping',
    'sgpi-exception-scenarios',
    'sgpi-questions-to-verify',
    'camt-003-deep-dive',
    'camt-cash-management',
    'reconciliation-investigations',
    'payment-architecture',
  ],
  phases: [
    {
      id: 'foundations',
      order: 1,
      title: 'Foundations',
      shortTitle: 'Foundations',
      description: 'Understand the actors, lifecycle and movement of value before opening a message.',
      tone: 'study',
      lessonIds: [
        'payment-fundamentals',
        'payment-actors',
        'payment-lifecycle',
        'clearing-vs-settlement',
        'fast-payments',
      ],
      plannedItemCount: 6,
    },
    {
      id: 'iso-20022',
      order: 2,
      title: 'ISO 20022',
      shortTitle: 'ISO 20022',
      description: 'Connect message families, pacs.008 and identifiers to the payment process.',
      tone: 'reference',
      lessonIds: ['iso20022-fundamentals', 'message-families', 'pain-001', 'pacs-008-deep-dive', 'identifiers', 'pacs-002', 'payment-status'],
      plannedItemCount: 7,
    },
    {
      id: 'exceptions',
      order: 3,
      title: 'Exceptions',
      shortTitle: 'Exceptions',
      description: 'Reason about rejection, return, cancellation, recall and reversal.',
      tone: 'warning',
      lessonIds: ['reject-vs-return', 'pacs-004', 'cancellation-recall-reversal'],
      plannedItemCount: 3,
    },
    {
      id: 'sgpi-public-case',
      order: 4,
      title: 'SGPI Public Case Study',
      shortTitle: 'SGPI',
      description: 'Apply payment concepts to the Dominican public scheme while keeping implementation questions explicit.',
      tone: 'public-scheme',
      lessonIds: [
        'sgpi-public-happy-path',
        'sgpi-funds-state',
        'sgpi-approval-rejection',
        'sgpi-settlement-status-credit',
        'sgpi-iso-mapping',
        'sgpi-exception-scenarios',
        'sgpi-questions-to-verify',
      ],
      modules: [
        {
          id: 'spi-dominicana-overview',
          title: 'SGPI Actors & Role',
          description: 'Meet the customer, participants and BCRD-administered infrastructure before tracing a payment.',
          route: '/learn/spi-dominicana',
          estimatedMinutes: 18,
          truthLabel: 'PUBLIC SCHEME',
        },
      ],
      modulesFirst: true,
      plannedItemCount: 8,
    },
    {
      id: 'operations',
      order: 5,
      title: 'Operations',
      shortTitle: 'Operations',
      description: 'Investigate, reconcile and reason about the systems around a payment.',
      tone: 'investigation',
      lessonIds: ['camt-003-deep-dive', 'camt-cash-management', 'reconciliation-investigations', 'payment-architecture'],
      plannedItemCount: 5,
    },
    {
      id: 'capstone',
      order: 6,
      title: 'Capstone',
      shortTitle: 'Capstone',
      description: 'Bring messages, state and investigation together in complete cases.',
      tone: 'simulation',
      lessonIds: [],
      plannedItemCount: 3,
    },
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
    sections: [],
    blocks: [
      {
        type: 'payment-flow',
        heading: 'A simple payment',
        actors: [
          { id: 'alice', label: 'Alice' },
          { id: 'banka', label: 'BANK_A' },
          { id: 'net', label: 'PAYMENT NET' },
          { id: 'bankb', label: 'BANK_B' },
          { id: 'bob', label: 'Bob' },
        ],
        steps: [
          { from: 'alice', to: 'banka' },
          { from: 'banka', to: 'net' },
          { from: 'net', to: 'bankb' },
          { from: 'bankb', to: 'bob' },
        ],
      },
      {
        type: 'prediction',
        context: 'Alice → BANK_A',
        question: 'Did Alice directly transfer money to Bob at this moment?',
        options: [
          { id: 'a', label: 'Yes, the money moved directly to Bob', correct: false },
          { id: 'b', label: 'No — this step only involves Alice and her bank', correct: true },
        ],
        explanation:
          'At this point, only Alice and her bank are involved. Money has not moved to Bob yet — that requires further steps between institutions, and ultimately a settlement step.',
      },
      {
        type: 'prediction',
        context: 'BANK_A → PAYMENT NET',
        question: 'What is primarily being exchanged here?',
        options: [
          { id: 'a', label: 'Physical cash', correct: false },
          { id: 'b', label: 'A payment instruction/message', correct: true },
          { id: 'c', label: "The beneficiary's account", correct: false },
          { id: 'd', label: "A customer profile", correct: false },
        ],
        explanation:
          'Between institutions and infrastructure, what travels is a payment instruction/message (conceptually, a pacs.008-style message) — not physical cash and not the account itself.',
      },
      {
        type: 'explanation',
        heading: 'What is a payment?',
        body:
          'A payment is the process of moving economic value from one party (the payer) to another (the payee). That process usually involves at least two financial institutions and one or more infrastructures that connect them. The instruction to pay and the actual movement of funds are two different things — the instruction can exist before the money truly moves.',
      },
      {
        type: 'explanation',
        heading: 'Instruction vs. movement',
        body:
          'When a customer authorizes a payment, they create a payment instruction. That instruction travels through banks and infrastructures as messages. The actual discharge of the financial obligation (the movement of value between institutions) happens later, during settlement. Confusing "the instruction was sent" with "the money moved" is one of the most common beginner mistakes in payments.',
      },
      {
        type: 'explanation',
        heading: 'Who is involved',
        body:
          'A simple domestic payment usually involves: the payer, the payer\'s bank, a payment system (clearing/settlement infrastructure), the payee\'s bank, and the payee. Cross-border or more complex payments can add intermediaries.',
      },
      {
        type: 'explanation',
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
    blocks: [
      {
        type: 'explanation',
        heading: 'Read the business role before the institution name',
        body: 'ISO 20022 describes what an actor is doing in a business process. A customer can be the Debtor in one transaction and the Creditor in another. A bank can be a Debtor Agent on the customer side and an Instructing Agent on a specific interinstitution hop. Start with the role and the relationship it describes; do not infer the role from a brand or organization name.',
        badge: 'reference',
      },
      {
        type: 'payment-flow',
        heading: 'One payment, three actor categories',
        badge: 'simplified-model',
        actors: [
          { id: 'customer-a', label: 'CUSTOMER_A', role: 'Debtor', kind: 'party' },
          { id: 'bank-a', label: 'BANK_A', role: 'Debtor Agent', kind: 'agent' },
          { id: 'payment-system', label: 'PAYMENT_SYSTEM', role: 'Clearing / settlement infrastructure', kind: 'infrastructure' },
          { id: 'bank-b', label: 'BANK_B', role: 'Creditor Agent', kind: 'agent' },
          { id: 'customer-b', label: 'CUSTOMER_B', role: 'Creditor', kind: 'party' },
        ],
        steps: [
          { from: 'customer-a', to: 'bank-a', label: 'customer request', status: 'active' },
          { from: 'bank-a', to: 'payment-system', label: 'payment instruction', status: 'active' },
          { from: 'payment-system', to: 'bank-b', label: 'scheme exchange', status: 'active' },
          { from: 'bank-b', to: 'customer-b', label: 'account credit', status: 'success' },
        ],
      },
      {
        type: 'comparison',
        heading: 'Party, agent, or infrastructure?',
        intro: 'Use the question each category answers. The labels are about business responsibility, not about which box appears first in a technical architecture.',
        badge: 'reference',
        items: [
          {
            id: 'party',
            label: 'Party',
            keyQuestion: 'Whose obligation or economic benefit does the payment represent?',
            summary: 'A party owes, sends, receives or ultimately benefits from the value in the underlying business transaction.',
            examples: ['Debtor', 'Creditor', 'Ultimate Debtor', 'Ultimate Creditor'],
            notThis: 'The financial institution that services the party or the infrastructure connecting institutions.',
            tone: 'party',
          },
          {
            id: 'agent',
            label: 'Agent',
            keyQuestion: 'Which financial institution acts for a party or another institution?',
            summary: 'An agent services an account, sends or receives an instruction, and participates in the interinstitution chain.',
            examples: ['Debtor Agent', 'Creditor Agent', 'Instructing Agent', 'Instructed Agent'],
            notThis: 'The customer that owns the obligation or the payment system that connects participants.',
            tone: 'agent',
          },
          {
            id: 'infrastructure',
            label: 'Infrastructure',
            keyQuestion: 'What connects agents and supports clearing or settlement?',
            summary: 'Infrastructure transports instructions, applies scheme processes or supports discharge of obligations between participants.',
            examples: ['PAYMENT_SYSTEM', 'clearing system', 'settlement system'],
            notThis: 'A customer role or an account-servicing agent. Infrastructure does not become the Debtor or Creditor merely by routing a payment.',
            tone: 'infrastructure',
          },
        ],
      },
      {
        type: 'prediction',
        context: 'CUSTOMER_A holds an account at BANK_A and asks it to send funds.',
        question: 'Which role best describes BANK_A relative to CUSTOMER_A?',
        options: [
          { id: 'a', label: 'Debtor', correct: false },
          { id: 'b', label: 'Debtor Agent', correct: true },
          { id: 'c', label: 'Creditor', correct: false },
          { id: 'd', label: 'Payment infrastructure', correct: false },
        ],
        explanation: 'CUSTOMER_A is the Debtor because it owes or sends the funds. BANK_A services that party and account, so BANK_A is the Debtor Agent in this payment.',
      },
      {
        type: 'explanation',
        heading: 'Ultimate parties add a second business layer',
        body: 'Ultimate Debtor and Ultimate Creditor identify who ultimately owes or benefits when that party differs from the Debtor or Creditor named on the transaction. For example, CUSTOMER_A may submit a payment on behalf of another legal entity. These roles are optional in many contexts and should appear only when the business scenario and applicable usage rules require them.',
        badge: 'reference',
      },
      {
        type: 'message-sequence',
        heading: 'Instructing and Instructed Agent change by hop',
        badge: 'simplified-model',
        steps: [
          { id: 'hop-1', from: 'BANK_A', to: 'PAYMENT_SYSTEM', label: 'Instruction hop 1', description: 'BANK_A is the Instructing Agent; PAYMENT_SYSTEM is the Instructed Agent for this relationship.', tone: 'neutral' },
          { id: 'hop-2', from: 'PAYMENT_SYSTEM', to: 'BANK_B', label: 'Instruction hop 2', description: 'PAYMENT_SYSTEM now instructs BANK_B, so its relative role changes on the next hop.', tone: 'neutral' },
        ],
      },
      {
        type: 'quick-check',
        question: 'Can one institution be Instructed Agent on one hop and Instructing Agent on the next?',
        options: [
          { id: 'a', label: 'Yes — these roles are relative to each adjacent exchange', correct: true },
          { id: 'b', label: 'No — an institution has one permanent agent role', correct: false },
        ],
        explanation: 'Instructing and Instructed Agent describe the direction of a specific exchange between adjacent actors. They are not permanent global identities.',
      },
      { type: 'scenario', scenarioId: 'actor-role-investigation' },
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
    estimatedMinutes: 12,
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
    sections: [],
    blocks: [
      {
        type: 'explanation',
        heading: 'A simplified lifecycle',
        body:
          'Each stage below represents a plausible checkpoint in a payment\'s life. Different payment schemes define their own actual state models — this sequence is a teaching tool to help you reason about "before vs. after," not a standard. Click each stage to see what it means and what can fail there.',
        badge: 'simplified-model',
      },
      {
        type: 'lifecycle',
        stages: [
          { id: 'initiated', label: 'Initiated', description: 'The customer or system creates the payment request.', canFail: 'The customer request itself may be invalid.' },
          { id: 'received', label: 'Received', description: 'The next participant in the chain receives the instruction.', canFail: 'The message may not reach the next participant.' },
          { id: 'validated', label: 'Validated', description: 'Syntax, schema and business rules are checked.', canFail: 'Syntax, schema, or business rules may fail.' },
          { id: 'accepted', label: 'Accepted', description: 'The payment is accepted for further processing.', canFail: 'After acceptance, later failures usually require a different kind of message (such as a return) rather than a simple rejection.' },
          { id: 'cleared', label: 'Cleared', description: 'The obligation between participants is determined.', canFail: 'Obligations may not be discharged due to liquidity, timing or technical issues.' },
          { id: 'settled', label: 'Settled', description: 'Value actually moves between institutions.', canFail: 'Settlement itself may fail or be delayed due to liquidity or technical issues.' },
          { id: 'credited', label: 'Credited', description: 'The receiving institution credits the beneficiary account.', canFail: 'The receiving institution may be unable to credit the beneficiary account (e.g., closed account) even though settlement succeeded.' },
          { id: 'completed', label: 'Completed', description: 'The payment has reached its end state for this educational model.' },
        ],
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
    blocks: [
      {
        type: 'explanation',
        heading: 'Clearing determines the obligation',
        body: 'Clearing exchanges and validates payment instructions, then determines the obligations that result between participants. In the example below, BANK_A owes BANK_B 100 XXX while BANK_B owes BANK_A 60 XXX. Those are two gross obligations. Calculating their net result tells us who owes what, but it does not move value.',
        badge: 'reference',
      },
      {
        type: 'settlement-diagram',
        heading: 'Clear first. Settle second.',
        intro: 'Run the two events separately. After clearing, pause and decide whether value has actually moved before you trigger settlement.',
        parties: [
          { id: 'bank-a', label: 'BANK_A' },
          { id: 'bank-b', label: 'BANK_B' },
        ],
        obligations: [
          { from: 'bank-a', to: 'bank-b', amount: 100 },
          { from: 'bank-b', to: 'bank-a', amount: 60 },
        ],
        currency: 'XXX',
        clearedExplanation: 'Clearing offsets the two gross obligations and produces one net obligation: BANK_A owes BANK_B 40 XXX. The obligation is now known, but it has not yet been discharged.',
        settledExplanation: 'Settlement changes the participants\' settlement positions by 40 XXX and discharges the net obligation in this simplified model. This interparticipant event still does not, by itself, prove beneficiary-account credit.',
        notice: 'Clearing and settlement answer different questions. First determine the obligation; then seek separate evidence that value moved and the obligation was discharged.',
        schemeDependent: 'The applicable system or scheme defines whether obligations settle gross or net, in real time or at deferred intervals, and what event constitutes final settlement.',
        badge: 'simplified-model',
      },
      {
        type: 'explanation',
        heading: 'Settlement models use two different axes',
        body: 'Gross versus net describes how obligations are grouped: individually or after offsetting. Real-time versus deferred describes when settlement occurs: continuously or at scheduled points. These ideas can be combined. RTGS, for example, means real-time gross settlement. Do not treat gross, net, real-time and deferred as four mutually exclusive labels.',
        badge: 'reference',
      },
      { type: 'scenario', scenarioId: 'clearing-not-settlement' },
    ],
    keyTerms: ['clearing', 'settlement', 'gross settlement', 'net settlement', 'deferred settlement', 'real-time settlement', 'finality'],
    commonConfusion: [
      { title: 'Clearing vs. Settlement', explanation: 'Clearing determines the obligation. Settlement discharges it. A payment can be cleared without yet being settled.' },
    ],
    relatedLessons: ['payment-lifecycle', 'payment-systems'.replace('payment-systems', 'fast-payments')],
    relatedConcepts: ['clearing', 'settlement'],
    sources: [{ sourceName: 'Payment Lab educational synthesis', sourceType: 'educational-synthesis', lastReviewed: '2026-01-01' }],
    estimatedMinutes: 11,
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
    id: 'pain-001',
    pathId: 'fast-payments',
    order: 8,
    title: 'pain.001 Customer Initiation',
    subtitle: 'The customer-facing instruction before the interbank payment',
    whyItMatters:
      'pain.001 helps you separate the customer request from the interbank payment. That boundary matters when you investigate whether a problem happened in the channel, at the originating institution, or after an interbank instruction was created.',
    objectives: [
      'Explain the purpose of pain.001 in customer-to-institution initiation.',
      'Distinguish pain.001 from the pacs.008 interbank instruction.',
      'Recognize that receiving pain.001 does not prove an interbank payment was sent or settled.',
      'Inspect the Group Header, Payment Information and transaction structure.',
    ],
    mentalModel: 'pain.001 asks a financial institution to initiate a payment. pacs.008 carries a customer credit transfer between financial institutions.',
    sections: [],
    blocks: [
      {
        type: 'explanation',
        heading: 'Customer request, not interbank settlement',
        body:
          'pain.001 (CustomerCreditTransferInitiation) carries a customer instruction to a financial institution. The institution still has to validate that request and decide how to process it. A later interbank leg may use pacs.008, but the exact transformation and routing belong to the scheme and institution implementation.',
        badge: 'reference',
      },
      {
        type: 'message-sequence',
        heading: 'From customer initiation to an interbank instruction',
        badge: 'simplified-model',
        steps: [
          {
            id: 'customer-initiation',
            from: 'CUSTOMER_A',
            to: 'BANK_A',
            label: 'pain.001',
            messageId: 'pain.001',
            description: 'Requests one or more customer credit transfers.',
            tone: 'pain',
          },
          {
            id: 'interbank-instruction',
            from: 'BANK_A',
            to: 'PAYMENT_SYSTEM',
            label: 'pacs.008 concept',
            messageId: 'pacs.008',
            description: 'A possible interbank instruction after validation; exact scheme usage is separate.',
            tone: 'pacs',
          },
        ],
      },
      {
        type: 'prediction',
        context: 'CUSTOMER_A -> BANK_A [pain.001 received]',
        question: 'Can you conclude that the interbank payment has already been sent and settled?',
        options: [
          { id: 'a', label: 'Yes - pain.001 means the payment is complete', correct: false },
          { id: 'b', label: 'No - it only proves that an initiation instruction was received', correct: true },
        ],
        explanation:
          'Receiving a customer instruction is only the initiation stage. Validation, interbank messaging, acceptance, settlement and beneficiary credit are later events.',
      },
      {
        type: 'message-inspector',
        messageId: 'pain.001',
        intro: 'Open Payment Information and identify which data belongs to the debtor side versus each individual transaction.',
      },
      { type: 'scenario', scenarioId: 'pain001-customer-request' },
      {
        type: 'callout',
        title: 'Implementation boundary',
        body: 'How a bank receives pain.001, validates it, maps it to an internal model and creates an interbank instruction is implementation-specific. Treat this lesson as message semantics, not an internal architecture description.',
        tone: 'warning',
      },
    ],
    keyTerms: ['pain.001', 'CustomerCreditTransferInitiation', 'PmtInf', 'customer initiation'],
    commonConfusion: [
      { title: 'pain.001 is not pacs.008', explanation: 'pain.001 is customer-facing initiation. pacs.008 is a financial-institution-to-financial-institution customer credit transfer.' },
    ],
    relatedLessons: ['message-families', 'pacs-008-deep-dive'],
    relatedMessages: ['pain.001', 'pacs.008'],
    sources: [{ sourceName: 'ISO 20022 official catalogue', sourceType: 'ISO', lastReviewed: '2026-08-08' }],
    estimatedMinutes: 11,
  },
  {
    id: 'pacs-008-deep-dive',
    pathId: 'fast-payments',
    order: 9,
    title: 'pacs.008 Deep Dive',
    subtitle: 'FIToFICustomerCreditTransfer, up close',
    whyItMatters:
      'pacs.008 is the workhorse credit transfer message behind most fast payments. Understanding it well — not just its name, but its purpose, its place in the flow, and its structure — makes every later lesson in this path click into place.',
    objectives: [
      'Explain what pacs.008 is and why it exists.',
      'Place pacs.008 correctly between the originating and receiving institutions.',
      'Predict what kind of information pacs.008 carries before opening its structure.',
      'Open and inspect the actual field structure of a pacs.008 message.',
      'Explain what typically happens after a pacs.008 is sent.',
    ],
    mentalModel: 'pacs.008 is how one financial institution tells another "move this money" — everything else in this path builds on understanding this one message well.',
    sections: [],
    blocks: [
      {
        type: 'explanation',
        heading: 'What pacs.008 is, and why it exists',
        body:
          'pacs.008 (FIToFICustomerCreditTransfer) is a financial-institution-to-financial-institution message. It transports everything needed to process a customer credit transfer between institutions — who is paying, who is being paid, how much, and the identifiers needed to track the transaction end to end.',
      },
      {
        type: 'payment-flow',
        heading: 'Where pacs.008 travels',
        actors: [
          { id: 'banka', label: 'BANK_A' },
          { id: 'net', label: 'PAYMENT NETWORK' },
          { id: 'bankb', label: 'BANK_B' },
        ],
        steps: [
          { from: 'banka', to: 'net', label: 'pacs.008', messageId: 'pacs.008', status: 'active' },
          { from: 'net', to: 'bankb', label: 'pacs.008', messageId: 'pacs.008', status: 'active' },
        ],
      },
      {
        type: 'prediction',
        context: 'BANK_A ──[pacs.008]──▶ PAYMENT NETWORK',
        question: 'If pacs.008 fails schema validation at the network, has Bob already been credited?',
        options: [
          { id: 'a', label: 'Yes — crediting happens as soon as the message is sent', correct: false },
          { id: 'b', label: 'No — this is before acceptance, so nothing has been credited yet', correct: true },
        ],
        explanation:
          'A schema validation failure happens before the payment is accepted. Nothing has settled or been credited at this point — this is the shape of a reject, not a return.',
      },
      {
        type: 'message-inspector',
        messageId: 'pacs.008',
        intro: 'Explore the actual field structure below. Click any field to see its business meaning, cardinality and common mistakes.',
      },
      {
        type: 'scenario',
        scenarioId: 'pacs008-choose-message',
      },
      {
        type: 'callout',
        title: 'What typically comes after',
        body: 'A status report (commonly pacs.002-style) reports what happened to the instruction. If something fails later — after acceptance or settlement — a return (commonly pacs.004-style) may follow instead. Both are covered in upcoming lessons.',
        tone: 'info',
      },
    ],
    keyTerms: ['pacs.008', 'FIToFICustomerCreditTransfer', 'interbank leg'],
    commonConfusion: [
      { title: 'A valid pacs.008 is not the same as a completed payment', explanation: 'Passing schema/syntax validation only means the message is well-formed — the payment can still be rejected for business or scheme reasons, or fail later in the lifecycle.' },
    ],
    relatedLessons: ['message-families', 'identifiers'],
    relatedMessages: ['pacs.008', 'pacs.002', 'pacs.004'],
    sources: [{ sourceName: 'ISO 20022 official catalogue', sourceType: 'ISO', lastReviewed: '2026-08-08' }],
    estimatedMinutes: 10,
  },
  {
    id: 'identifiers',
    pathId: 'fast-payments',
    order: 10,
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
    sections: [],
    blocks: [
      {
        type: 'explanation',
        heading: 'Levels of identification',
        body:
          'Message-level: identifies the message itself (e.g., MsgId). Transaction-level: identifies an individual transaction within the message (e.g., InstrId, EndToEndId, TxId). Network-level and institution-level references may also be added by infrastructures or institutions as the payment travels.',
      },
      {
        type: 'explanation',
        heading: 'Typical roles',
        body:
          'MsgId: identifies the message envelope, assigned by the message sender. InstrId: an instruction identifier, often assigned by the instructing party for its own tracking. EndToEndId: intended to travel unchanged with the payment from the original debtor to the final creditor, which makes it particularly valuable for end-to-end tracing. TxId: a transaction identifier, often assigned within the clearing/settlement chain. Depending on the scheme, additional references (such as a clearing system reference or a universal end-to-end transaction reference) may also exist.',
      },
      {
        type: 'explanation',
        heading: 'Why this matters for reconciliation',
        body:
          'Because a message can contain several transactions, and each transaction can carry several identifiers, tracing a single payment during an investigation requires knowing exactly which identifier is guaranteed to stay consistent across the messages you are comparing.',
      },
      {
        type: 'identifier-trace',
        messages: [
          { messageId: 'pacs.008', linkFieldId: 'EndToEndId', linkFieldLabel: 'EndToEndId' },
          { messageId: 'pacs.002', linkFieldId: 'OrgnlEndToEndId', linkFieldLabel: 'OrgnlEndToEndId' },
          { messageId: 'pacs.004', linkFieldId: 'OrgnlEndToEndId', linkFieldLabel: 'OrgnlEndToEndId' },
        ],
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
    id: 'pacs-002',
    pathId: 'fast-payments',
    order: 11,
    title: 'pacs.002 Payment Status Report',
    subtitle: 'What happened to the original interbank instruction?',
    whyItMatters:
      'Operations teams rarely investigate a payment from the original instruction alone. pacs.002 provides status and correlation information that helps determine whether an instruction was accepted, rejected or remains unresolved.',
    objectives: [
      'Explain the purpose of pacs.002 as a status report.',
      'Correlate the report to an original pacs.008 using original identifiers.',
      'Distinguish the status report MsgId from identifiers of the original payment.',
      'Explain why a reported status does not automatically prove settlement or beneficiary credit.',
    ],
    mentalModel: 'pacs.008 asks for the transfer. pacs.002 reports a status about that earlier instruction.',
    sections: [],
    blocks: [
      {
        type: 'explanation',
        heading: 'A report about another message',
        body:
          'pacs.002 (FIToFIPaymentStatusReport) reports the status of a previously received payment instruction. Its own MsgId identifies the report envelope; original message and transaction identifiers identify what the report is about.',
        badge: 'reference',
      },
      {
        type: 'message-sequence',
        heading: 'Instruction and status response',
        steps: [
          {
            id: 'original-instruction',
            from: 'BANK_A',
            to: 'PAYMENT_SYSTEM',
            label: 'pacs.008',
            messageId: 'pacs.008',
            description: 'Original interbank customer credit transfer instruction.',
            tone: 'pacs',
          },
          {
            id: 'status-report',
            from: 'PAYMENT_SYSTEM',
            to: 'BANK_A',
            label: 'pacs.002',
            messageId: 'pacs.002',
            description: 'Reports a status and references the original instruction or transaction.',
            tone: 'pacs',
          },
        ],
      },
      {
        type: 'prediction',
        context: 'pacs.002 reports an accepted status',
        question: 'Can you conclude from that status alone that the beneficiary account was credited?',
        options: [
          { id: 'a', label: 'Yes - accepted always means credited', correct: false },
          { id: 'b', label: 'No - acceptance, settlement and credit are separate events', correct: true },
        ],
        explanation:
          'A status must be interpreted in its reporting context and scheme rules. Acceptance is evidence of a decision, not automatic evidence of settlement or beneficiary posting.',
      },
      {
        type: 'identifier-trace',
        messages: [
          { messageId: 'pacs.008', linkFieldId: 'EndToEndId', linkFieldLabel: 'EndToEndId' },
          { messageId: 'pacs.002', linkFieldId: 'OrgnlEndToEndId', linkFieldLabel: 'OrgnlEndToEndId' },
        ],
      },
      {
        type: 'message-inspector',
        messageId: 'pacs.002',
        intro: 'Compare the report MsgId with OrgnlEndToEndId, TxSts and Status Reason Information.',
      },
      { type: 'scenario', scenarioId: 'pacs002-status-correlation' },
      {
        type: 'callout',
        title: 'Status meaning is contextual',
        body: 'ISO defines the message and status-reporting semantics. A scheme defines which statuses it uses, when it sends them and what operational finality each status represents.',
        tone: 'warning',
      },
    ],
    keyTerms: ['pacs.002', 'FIToFIPaymentStatusReport', 'TxSts', 'StsRsnInf', 'OrgnlEndToEndId'],
    commonConfusion: [
      { title: 'Report MsgId vs. original payment identifiers', explanation: 'The pacs.002 MsgId identifies the status report itself. Original identifiers correlate it to the payment being reported.' },
    ],
    relatedLessons: ['pacs-008-deep-dive', 'identifiers', 'payment-status'],
    relatedMessages: ['pacs.008', 'pacs.002'],
    sources: [{ sourceName: 'ISO 20022 official catalogue', sourceType: 'ISO', lastReviewed: '2026-08-08' }],
    estimatedMinutes: 12,
  },
  {
    id: 'payment-status',
    pathId: 'fast-payments',
    order: 12,
    title: 'Payment Status',
    subtitle: 'Received is not accepted; accepted is not settled; settled is not credited',
    whyItMatters:
      'Most payment investigations become easier once you stop treating status words as interchangeable. Each status answers a different question about processing, money movement and certainty.',
    objectives: [
      'Distinguish received, validated, accepted, settled and credited.',
      'Ask who assigned a status and what event it represents.',
      'Avoid inferring money movement from message exchange alone.',
      'Identify what additional evidence is needed when the state is uncertain.',
    ],
    mentalModel: 'Always ask: status of what, assigned by whom, at which stage, and supported by what evidence?',
    sections: [],
    blocks: [
      {
        type: 'lifecycle',
        badge: 'simplified-model',
        stages: [
          { id: 'received', label: 'Received', description: 'A participant or infrastructure received the instruction.', canFail: 'Receipt does not prove business acceptance.' },
          { id: 'validated', label: 'Validated', description: 'The instruction passed a defined set of checks.', canFail: 'Other business or scheme checks may still reject it.' },
          { id: 'accepted', label: 'Accepted', description: 'A participant accepted the payment for further processing.', canFail: 'Acceptance does not by itself prove settlement.' },
          { id: 'settled', label: 'Settled', description: 'The obligation between institutions was discharged.', canFail: 'Beneficiary posting may still be pending or fail.' },
          { id: 'credited', label: 'Credited', description: 'The receiving institution posted funds to the beneficiary account.', canFail: 'Customer availability and notification can be separate concerns.' },
        ],
      },
      {
        type: 'quick-check',
        question: 'A message was received successfully, but there is no settlement evidence. Can you conclude that money moved?',
        options: [
          { id: 'a', label: 'Yes - message receipt proves settlement', correct: false },
          { id: 'b', label: 'No - message exchange and settlement are different events', correct: true },
        ],
        explanation: 'A received message is evidence about communication. Settlement requires evidence about the financial obligation and the relevant scheme or settlement system.',
      },
      {
        type: 'message-sequence',
        heading: 'Status evidence around an instruction',
        badge: 'simplified-model',
        steps: [
          { id: 'instruction', from: 'BANK_A', to: 'PAYMENT_SYSTEM', label: 'pacs.008', messageId: 'pacs.008', description: 'The instruction enters processing.', tone: 'pacs' },
          { id: 'status', from: 'PAYMENT_SYSTEM', to: 'BANK_A', label: 'pacs.002 concept', messageId: 'pacs.002', description: 'A status report provides evidence about processing, interpreted under scheme rules.', tone: 'pacs' },
          { id: 'money-evidence', from: 'SETTLEMENT', to: 'OPERATIONS', label: 'Settlement evidence', description: 'Separate evidence is needed before concluding that value moved.', tone: 'neutral' },
        ],
      },
      { type: 'scenario', scenarioId: 'status-not-money' },
      {
        type: 'callout',
        title: 'Accepted by whom?',
        body: 'A customer channel, originating institution, payment infrastructure and receiving institution can each make different decisions. Never use the word accepted without identifying the actor and stage.',
        tone: 'warning',
      },
    ],
    keyTerms: ['received', 'validated', 'accepted', 'settled', 'credited', 'uncertain state'],
    commonConfusion: [
      { title: 'Status is not money state', explanation: 'A processing status and the state of funds are related, but they are not the same evidence.' },
    ],
    relatedLessons: ['pacs-002', 'payment-lifecycle', 'clearing-vs-settlement'],
    relatedMessages: ['pacs.002', 'pacs.008'],
    sources: [
      { sourceName: 'ISO 20022 official catalogue', sourceType: 'ISO', lastReviewed: '2026-08-08' },
      { sourceName: 'Payment Lab educational synthesis', sourceType: 'educational-synthesis', lastReviewed: '2026-08-09', notes: 'Lifecycle distinctions are a generic teaching model, not a universal scheme state machine.' },
    ],
    estimatedMinutes: 10,
  },
  {
    id: 'reject-vs-return',
    pathId: 'fast-payments',
    order: 13,
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
    id: 'pacs-004',
    pathId: 'fast-payments',
    order: 14,
    title: 'pacs.004 Payment Return',
    subtitle: 'Returning a payment that already progressed',
    whyItMatters:
      'pacs.004 is central to exception handling because it describes a return, not an early rejection. To investigate it correctly, you must identify the original payment, determine how far it progressed and understand why value is being sent back.',
    objectives: [
      'Explain the purpose of pacs.004 as a PaymentReturn.',
      'Distinguish a return from a rejection before acceptance.',
      'Trace original identifiers from pacs.004 back to pacs.008.',
      'Explain why the exact return trigger and window are scheme-dependent.',
    ],
    mentalModel: 'pacs.004 points backward: this new return message must be understood in relation to an earlier payment.',
    sections: [],
    blocks: [
      {
        type: 'explanation',
        heading: 'A return after the payment progressed',
        body:
          'pacs.004 (PaymentReturn) carries a payment back toward the original debtor side and includes references to the original transaction, the amount being returned and reason information. ISO defines the message; the scheme determines when a return is allowed and which reasons apply.',
        badge: 'reference',
      },
      {
        type: 'lifecycle',
        badge: 'simplified-model',
        stages: [
          { id: 'original', label: 'Original payment', description: 'A pacs.008-style instruction begins the interbank payment.' },
          { id: 'progressed', label: 'Progressed', description: 'The payment passed the early rejection boundary and continued.', canFail: 'The exact boundary is defined by the scheme.' },
          { id: 'settlement', label: 'Settlement', description: 'Value may have settled between participants.', canFail: 'Settlement and beneficiary credit remain distinct.' },
          { id: 'later-problem', label: 'Later problem', description: 'A problem is discovered after the payment progressed.', canFail: 'The beneficiary may not be creditable, for example.' },
          { id: 'returned', label: 'Returned', description: 'A return sends value or the payment back toward the original side.' },
        ],
      },
      {
        type: 'prediction',
        context: 'Settlement completed; beneficiary posting later fails',
        question: 'Should this be investigated as an early reject or as a return?',
        options: [
          { id: 'a', label: 'Early reject', correct: false },
          { id: 'b', label: 'Return, because the payment already progressed', correct: true },
        ],
        explanation: 'A reject prevents the payment from progressing. A later problem after acceptance or settlement has the shape of a return; exact scheme handling still needs verification.',
      },
      {
        type: 'message-sequence',
        heading: 'Original payment and later return',
        steps: [
          { id: 'original-payment', from: 'BANK_A', to: 'BANK_B', label: 'pacs.008', messageId: 'pacs.008', description: 'Original customer credit transfer.', tone: 'pacs' },
          { id: 'later-event', from: 'BANK_B', to: 'OPERATIONS', label: 'Later problem', description: 'A post-acceptance issue requires exception handling.', tone: 'neutral' },
          { id: 'return-message', from: 'BANK_B', to: 'BANK_A', label: 'pacs.004', messageId: 'pacs.004', description: 'Returns the payment and references the original transaction.', tone: 'pacs' },
        ],
      },
      { type: 'trace-original-payment', originalMessageId: 'pacs.008', returnMessageId: 'pacs.004' },
      {
        type: 'message-inspector',
        messageId: 'pacs.004',
        intro: 'Inspect OrgnlEndToEndId, returned amount, return reason and original transaction reference.',
      },
      { type: 'scenario', scenarioId: 'reject-or-return-1' },
      {
        type: 'callout',
        title: 'Scheme-dependent handling',
        body: 'Do not infer return windows, mandatory reason codes, settlement finality or operational retry rules from ISO 20022 alone. Those belong to the selected payment scheme and institution implementation.',
        tone: 'warning',
      },
    ],
    keyTerms: ['pacs.004', 'PaymentReturn', 'OrgnlEndToEndId', 'RtrRsnInf', 'returned amount'],
    commonConfusion: [
      { title: 'pacs.004 does not mean accepted', explanation: 'pacs.004 is a return message. Acceptance or rejection status is a different concept commonly investigated through status reporting.' },
    ],
    relatedLessons: ['reject-vs-return', 'pacs-008-deep-dive', 'identifiers'],
    relatedMessages: ['pacs.008', 'pacs.004', 'pacs.002'],
    sources: [{ sourceName: 'ISO 20022 official catalogue', sourceType: 'ISO', lastReviewed: '2026-08-08' }],
    estimatedMinutes: 13,
  },
  {
    id: 'cancellation-recall-reversal',
    pathId: 'fast-payments',
    order: 15,
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
    sections: [],
    blocks: [
      {
        type: 'explanation',
        heading: 'Request to cancel',
        body:
          'A request, usually sent by the original sending side, asking that a payment not be processed further or be undone. Whether it succeeds depends on how far the payment has already progressed and on the rules of the scheme involved.',
      },
      {
        type: 'explanation',
        heading: 'Recall',
        body:
          'Similar in spirit to a cancellation request — the sending side asks for a payment to be brought back, generally after it has already been sent. A recall is a request, not a guarantee: the receiving side may or may not be able to honor it (for example, if funds have already been paid out to the beneficiary).',
      },
      {
        type: 'explanation',
        heading: 'Reversal',
        body:
          'Undoing the effect of a payment that has already settled, typically initiated on the processing/receiving side rather than as a customer-driven request (for example, correcting a technical duplicate). The exact mechanics depend heavily on the scheme.',
      },
      {
        type: 'explanation',
        heading: 'Rejection and Return, revisited',
        body:
          'As covered earlier: a rejection happens before/at acceptance (the payment never truly progressed). A return happens after acceptance, when a payment already progressed but later cannot be completed. Cancellation and recall requests are different again — they are attempts to undo something that may already be past the point where undoing it is guaranteed to work.',
        badge: 'simplified-model',
      },
      {
        type: 'decision-tree',
        root: {
          question: 'Has the payment already progressed (accepted / settled)?',
          answers: [
            { label: 'No', result: 'Investigate as a rejection or cancellation request' },
            {
              label: 'Yes',
              next: {
                question: 'Are funds explicitly being sent back?',
                answers: [
                  { label: 'Yes', result: 'Investigate as a return' },
                  { label: 'No', result: 'Investigate as a recall or reversal request (not guaranteed)' },
                ],
              },
            },
          ],
        },
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
    id: 'camt-003-deep-dive',
    pathId: 'fast-payments',
    order: 23,
    title: 'camt.003 GetAccount',
    subtitle: 'Ask about an account without moving value',
    whyItMatters:
      'Operations teams need to distinguish an account-information query from a payment instruction or return. camt.003 makes that boundary concrete: it asks an account servicer or transaction administrator for account data, commonly followed by a camt.004 response.',
    objectives: [
      'Explain the purpose of camt.003 GetAccount and who exchanges it.',
      'Distinguish the query camt.003 from the response camt.004 and the payment return pacs.004.',
      'Read MsgHdr, MsgId, ReqTp and the account search-criteria path in camt.003.001.08.',
      'Explain why sending camt.003 does not prove a balance, move funds or resolve a payment investigation.',
      'State what remains TO VERIFY before mapping camt.003 to the Dominican SPI/SGPI scheme.',
    ],
    mentalModel: 'camt.003 asks an account question. camt.004 may answer it. Neither message is a customer credit-transfer instruction.',
    sections: [],
    blocks: [
      {
        type: 'explanation',
        heading: 'A query about an account, not a payment order',
        body:
          'camt.003 (GetAccount) carries a request for account information selected by search criteria. Public payment-infrastructure profiles use this message concept for account, balance or liquidity-oriented queries. ISO defines the message semantics; the applicable service or scheme profile defines which request types and criteria are supported.',
        badge: 'reference',
      },
      {
        type: 'message-sequence',
        heading: 'Request and response are separate evidence',
        badge: 'simplified-model',
        steps: [
          {
            id: 'get-account-request',
            from: 'BANK_A',
            to: 'ACCOUNT_SERVICER',
            label: 'camt.003',
            messageId: 'camt.003',
            description: 'Requests account information using a message identifier, request type and account criteria.',
            tone: 'camt',
          },
          {
            id: 'return-account-response',
            from: 'ACCOUNT_SERVICER',
            to: 'BANK_A',
            label: 'camt.004',
            messageId: 'camt.004',
            description: 'May return the requested account data under the selected profile.',
            tone: 'camt',
          },
        ],
      },
      {
        type: 'comparison',
        heading: 'The 003/004 trap: always read the family and business verb',
        intro: 'The number alone is not enough. Get, ReturnAccount and PaymentReturn represent different business actions.',
        examplesLabel: 'Key fields / concepts',
        badge: 'reference',
        items: [
          {
            id: 'camt003',
            label: 'camt.003 GetAccount',
            keyQuestion: 'What account information do I need?',
            summary: 'Sends account search criteria to request supported account, balance or liquidity information.',
            examples: ['MsgHdr', 'MsgId', 'ReqTp', 'AcctQryDef'],
            notThis: 'It does not transfer customer funds and does not prove the requested balance.',
            tone: 'camt',
          },
          {
            id: 'camt004',
            label: 'camt.004 ReturnAccount',
            keyQuestion: 'What account information is being returned?',
            summary: 'Provides account information as a response or profile-defined notification.',
            examples: ['account details', 'balances', 'query response'],
            notThis: 'It is not a return of a customer credit-transfer payment.',
            tone: 'camt',
          },
          {
            id: 'pacs004',
            label: 'pacs.004 PaymentReturn',
            keyQuestion: 'Why is value from a progressed payment being sent back?',
            summary: 'Returns a payment and references the original payment transaction.',
            examples: ['OrgnlEndToEndId', 'RtrdIntrBkSttlmAmt', 'RtrRsnInf'],
            notThis: 'It does not answer an account-information query, despite sharing the number 004.',
            tone: 'pacs',
          },
        ],
      },
      {
        type: 'prediction',
        context: 'BANK_A sent camt.003 MSG-ACCT-QUERY-001; no response has arrived.',
        question: 'Can operations conclude that ACCOUNT-001 has a zero balance?',
        options: [
          { id: 'a', label: 'Yes - no response means the balance is zero', correct: false },
          { id: 'b', label: 'No - the request proves only that a query was sent', correct: true },
        ],
        explanation:
          'A camt.003 request contains a question and its search criteria. The requested account data requires response evidence, commonly a camt.004 under the applicable profile. Missing response means unknown, not zero.',
      },
      {
        type: 'message-inspector',
        messageId: 'camt.003',
        intro: 'Trace the selected V08 path from MsgHdr and MsgId into AcctQryDef, AcctCrit and the account search criteria.',
      },
      {
        type: 'quick-check',
        question: 'Which part tells the receiver what account information to search for?',
        options: [
          { id: 'a', label: 'MsgHdr / MsgId', correct: false },
          { id: 'b', label: 'AcctQryDef / AcctCrit', correct: true },
          { id: 'c', label: 'A pacs.008 EndToEndId', correct: false },
        ],
        explanation:
          'MsgId identifies the query message. AcctQryDef and its account criteria describe what to search for. A payment EndToEndId is not the account key for GetAccount.',
      },
      {
        type: 'investigation-checklist',
        heading: 'What to verify in a real camt.003 exchange',
        intro: 'Separate evidence in the request, evidence in the response and profile-specific rules.',
        groups: [
          {
            title: 'Request evidence',
            items: ['Sender and receiver', 'camt.003 version', 'MsgId', 'request type', 'account search criteria', 'send timestamp'],
          },
          {
            title: 'Response evidence',
            items: ['Whether camt.004 arrived', 'query correlation', 'matched account', 'returned balance or account state', 'error or rejection evidence'],
          },
          {
            title: 'Profile questions',
            items: ['Supported request types', 'mandatory criteria', 'authorization rules', 'timeout behavior', 'selected camt.004 version'],
          },
        ],
      },
      { type: 'scenario', scenarioId: 'spi-rd-message-triage' },
      {
        type: 'callout',
        title: 'Dominican SPI/SGPI boundary',
        body:
          'camt.003 is useful ISO knowledge, but public BCRD material reviewed for this lab does not establish that SGPI uses it. The exact service, message version, request types, actors and response profile remain TO VERIFY against authorized scheme or institution documentation.',
        tone: 'warning',
      },
    ],
    keyTerms: ['camt.003', 'GetAccount', 'MsgId', 'ReqTp', 'AcctQryDef', 'AcctCrit', 'camt.004'],
    commonConfusion: [
      { title: 'Request sent does not mean balance known', explanation: 'camt.003 proves a query was created or sent. Account data requires a response or other authoritative evidence.' },
      { title: 'camt.004 is not pacs.004', explanation: 'camt.004 returns account information. pacs.004 returns a progressed payment.' },
    ],
    relatedLessons: ['camt-cash-management', 'reconciliation-investigations', 'sgpi-iso-mapping'],
    relatedMessages: ['camt.003', 'camt.004', 'pacs.004', 'pacs.008'],
    sources: [
      {
        sourceName: 'ISO 20022 official catalogue - Cash Management',
        sourceType: 'ISO',
        sourceReference: 'https://www.iso20022.org/iso-20022-message-definitions?search=cash+management',
        lastReviewed: '2026-08-09',
      },
      {
        sourceName: 'Eurosystem ESMIG User Detailed Functional Specifications R2026.JUN',
        sourceType: 'official-documentation',
        sourceReference: 'https://www.bundesbank.de/resource/blob/914244/2316c2e2d1502875253c77b851f8b0f0/472B63F073F071307366337C94F8C870/udfs-esmig-r2026jun-data.pdf',
        lastReviewed: '2026-08-09',
      },
      {
        sourceName: 'Banco Central de la Republica Dominicana - SGPI public information',
        sourceType: 'central-bank',
        sourceReference: 'https://www.bancentral.gov.do/a/d/6142-sistema-de-gestion-de-pagos-instantaneos-sgpi',
        lastReviewed: '2026-08-09',
      },
    ],
    estimatedMinutes: 16,
  },
  {
    id: 'camt-cash-management',
    pathId: 'fast-payments',
    order: 24,
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
    relatedLessons: ['message-families', 'camt-003-deep-dive', 'reconciliation-investigations'],
    relatedMessages: ['camt.003', 'camt.004', 'camt.053', 'camt.029'],
    sources: [{ sourceName: 'ISO 20022 official catalogue', sourceType: 'ISO', lastReviewed: '2026-01-01' }],
    estimatedMinutes: 6,
  },
  {
    id: 'reconciliation-investigations',
    pathId: 'fast-payments',
    order: 25,
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
    order: 26,
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
    sections: [],
    blocks: [
      {
        type: 'explanation',
        heading: 'A generic flow',
        body:
          'Channel (where the customer or system initiates) → Payments API → Payment Orchestrator → Validation (including fraud, compliance, limits, and routing checks) → ISO Mapper (translating between internal data models and ISO 20022 messages) → Payment Network → Inbound Adapter (on the receiving side) → Core / Ledger (where the account is actually debited or credited).',
        badge: 'simplified-model',
      },
      {
        type: 'architecture',
        label: 'Generic educational architecture',
        steps: ['Channel', 'Payments API', 'Payment Orchestrator', 'Validation', 'ISO Mapper', 'Payment Network', 'Inbound Adapter', 'Core / Ledger'],
        branchAfterStep: 'Validation',
        branchItems: ['Fraud', 'Compliance', 'Limits', 'Routing'],
      },
      {
        type: 'explanation',
        heading: 'Why this matters for troubleshooting',
        body:
          'When someone reports "the payment failed," this generic model gives you questions to ask: did it fail at validation (before ever reaching the network), at the network/scheme level, or after being received, during core/ledger processing? Each layer tends to produce different symptoms and requires different people to investigate.',
      },
      {
        type: 'callout',
        title: 'This is not universal',
        body: 'Real institutions combine, split, rename or reorder these components constantly. Use this diagram to build a habit of thinking in layers, not as a description of any specific system.',
        tone: 'warning',
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
  ...sgpiLessons,
]
