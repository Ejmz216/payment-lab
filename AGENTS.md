# AGENTS.md — Payment Lab

## Mission
Payment Lab is a static, interactive learning environment for ISO 20022, fast payments, and public payment-scheme case studies.

Core learning question:
**What is happening to this payment, and why?**

Teach the learner to reason:
WHO → SENDS WHAT → TO WHOM → WHY → AT WHAT STAGE → WITH WHICH IDENTIFIERS → WHAT HAPPENS NEXT → WHAT CAN FAIL → HOW DO I INVESTIGATE IT?

## Product areas
- STUDY: guided curriculum; always tells the learner what to do next.
- ATLAS: ISO 20022 reference/catalog.
- LAB: Simulator, Debugger, XML Lab, Identifier Lab.
- PRACTICE: scenarios and review.

STUDY may embed/deep-link into ATLAS and LAB.

## Technical constraints
Preserve:
- Vite
- React
- TypeScript
- Tailwind
- HashRouter
- GitHub Pages
- client-side architecture
- localStorage for lightweight progress

Do not add unless explicitly requested:
- backend
- authentication
- cloud database
- Supabase/Firebase/PostgreSQL
- analytics
- runtime AI API
- document/XML uploads

Always run `npm run build` before completing a task.

## Privacy
All examples must be synthetic or public.

Use:
- BANK_A / BANK_B
- CUSTOMER_A / CUSTOMER_B
- PAYMENT_SYSTEM
- MSG-001 / E2E-001 / TX-001
- XXX when a real currency is unnecessary

Never create workflows encouraging confidential, customer, production, proprietary, or internal implementation data.

## SGPI case-study rules
SGPI is a PUBLIC SCHEME case study.

Always distinguish:
1. ISO 20022 — standard/message semantics.
2. SGPI — behavior supported by public official material.
3. Institution implementation — unknown; show only questions to verify.

Never infer:
- internal architecture
- middleware
- APIs
- queues
- core-system behavior
- retry rules
- SLAs
- internal reconciliation
- proprietary validations

If an exact ISO message for a public SGPI step is not established, show `TO VERIFY`, not a guess.

Use truth labels:
- REFERENCE
- PUBLIC SCHEME
- SIMPLIFIED MODEL
- SIMULATION
- SCHEME DEPENDENT
- TO VERIFY
- IMPLEMENTATION QUESTION

## Visual design
Keep the dark navy/charcoal foundation, but add semantic color.

Suggested semantics:
- brand/navigation: azure
- ISO: violet
- pacs.*: cyan/blue
- pain.*: purple
- camt.*: teal
- SGPI public case study: warm gold/bronze
- customer/party: orange
- institution/agent: blue
- infrastructure: violet
- success: green
- pending/uncertain: amber
- reject/failure: red
- return: orange-red

Color must always be paired with labels/icons/shapes.

Avoid:
- random gradients
- neon styling
- excessive glow
- cartoon/gamified visuals
- identical neutral cards everywhere

Prefer:
- flow diagrams
- timelines
- sequence diagrams
- message chips
- state tracks
- node shapes
- subtle technical/grid backgrounds

## Learning rules
Prefer:
EXPLAIN → VISUALIZE → PREDICT → EXPLORE → RUN → INSPECT → SCENARIO → REVIEW

Avoid long passive reading.

Do not hardcode visuals by lesson id. Avoid new branches such as:
`if (lesson.id === '...')`.

Move toward reusable `LessonBlock` data.

Recommended block types:
- ExplanationBlock
- PaymentFlowBlock
- MessageSequenceBlock
- LifecycleBlock
- MoneyStateBlock
- ArchitectureBlock
- ComparisonBlock
- PredictionBlock
- QuickCheckBlock
- MessageInspectorBlock
- IdentifierTraceBlock
- ScenarioBlock
- SchemeCaseStudyBlock
- InvestigationQuestionBlock

## Guided path
### Phase 1 — Foundations
1. Payment Fundamentals
2. Payment Actors
3. Payment Lifecycle
4. Clearing vs Settlement
5. Payment Systems
6. Fast Payments

### Phase 2 — ISO 20022
7. ISO 20022 Fundamentals
8. Message Families
9. pain.001
10. pacs.008
11. Identifiers
12. pacs.002
13. Payment Status

### Phase 3 — Exceptions
14. Reject vs Return
15. pacs.004
16. Cancellation / Recall / Reversal

### Phase 4 — SGPI Public Case Study
17. SGPI Actors & Role
18. SGPI Public Happy Path
19. Funds State
20. Approval / Rejection
21. Settlement / Status / Credit
22. ISO Mapping: Known vs To Verify
23. SGPI Exception Scenarios
24. Questions to Verify

### Phase 5 — Operations
25. Timeouts & Uncertain State
26. Idempotency
27. Reconciliation
28. Generic Architecture
29. Troubleshooting

### Phase 6 — Capstone
30. Complete Simulation
31. SGPI Public-Flow Investigation
32. Final Debugging Case

## SGPI public flow
Model:
1. Customer initiates payment.
2. Originating participant sends instruction.
3. Funds are blocked/reserved.
4. SGPI routes operation.
5. Receiving participant approves/rejects.
6. Settlement.
7. Payment status to originating participant.
8. Payment status to receiving participant.
9. Beneficiary account credited.

Teach explicitly:
- blocked ≠ definitive debit
- received ≠ accepted
- accepted ≠ settled
- settled ≠ credited
- message exchange ≠ settlement
- reject ≠ return
- ISO 20022 ≠ payment scheme
- payment scheme ≠ institution implementation

## Four-layer SGPI explorer
Synchronize:
1. ACTORS
2. MESSAGES
3. MONEY STATE
4. PAYMENT STATE

Do not assign an exact ISO message to an SGPI arrow without public support.

## Atlas
Coverage levels:
- FULL
- DETAILED
- REFERENCE
- CATALOG

Keep FULL for:
- pain.001
- pacs.008
- pacs.002
- pacs.004

Core message workspaces may use:
Overview / Flow / Structure / Identifiers / XML / Scenarios / Versions / Sources

## Versioning
Never treat a message as having one permanent version.
Show:
- current ISO
- archived ISO
- publicly known scheme-selected version when available
- implementation-selected only from authorized material

## Codex working style
For each task:
1. Inspect relevant files.
2. Summarize current architecture.
3. Propose a small plan.
4. Modify only necessary files.
5. Run `npm run build`.
6. Report files changed, build result, and follow-ups.

Do not implement the full roadmap in one task.
Prefer one coherent feature per commit/PR.
