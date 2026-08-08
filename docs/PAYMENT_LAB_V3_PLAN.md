# Payment Lab V3 — Codex Start Plan

## What changes now
Do not rebuild Payment Lab.

The V3 priorities are:
1. clearer step-by-step study navigation;
2. stronger visual identity;
3. reusable visual/interactive learning components;
4. SGPI as a public case study layered over generic ISO learning;
5. broader Atlas reference coverage.

## Current strengths to preserve
- Vite + React + TypeScript
- GitHub Pages
- Learn / Atlas / Lab / Practice separation
- bilingual content
- local progress
- message tree
- Simulator
- Investigation Workbench
- synthetic examples
- privacy rules

## Main current issues
### Navigation
The user still has to decide manually when to move between Learn, Atlas, Lab, Practice, and message pages.

### Visual identity
The dark base is good, but most surfaces use the same navy cards and primary blue. Existing family colors need to become a semantic system across the whole product.

### Learning
Lessons still rely too much on text sections. Visuals should become reusable blocks rather than lesson-specific code.

### SGPI
The public SGPI flow should become a case study, not replace the generic curriculum.

---

# 1. Visual direction

Keep the dark foundation.

Use semantic accents:
- ISO: violet
- pacs: cyan/blue
- pain: purple
- camt: teal
- SGPI public case study: gold/bronze
- parties: orange
- agents: blue
- infrastructure: violet
- success: green
- uncertain: amber
- reject: red
- return: orange-red

Create role-based card variants:
- reference
- study
- public-scheme
- simulation
- investigation
- warning

Add subtle:
- dot grids
- connector rails
- timelines
- message chips
- phase color bars
- node shapes

Avoid excessive gradients/glow.

---

# 2. New navigation

Global sidebar:

STUDY
- Continue Learning
- Learning Map

REFERENCE
- ISO 20022 Atlas
- Message Catalog
- Glossary

LAB
- Simulator
- Debugger
- XML Lab
- Identifier Lab

PRACTICE
- Practice Session
- Common Confusions

PROGRESS
- Progress
- Saved

Inside STUDY, add a separate phase rail with current phase expanded.

Every lesson should show:
- phase
- lesson number
- progress
- estimated time
- previous
- next
- lesson checklist

---

# 3. SGPI case-study module

Use three layers:

STANDARD
ISO 20022

PUBLIC SCHEME
SGPI

IMPLEMENTATION
Questions to verify

Never store or claim private implementation information.

## Public happy path
Visualize:
1. Customer initiates.
2. Originating participant sends instruction.
3. Funds blocked/reserved.
4. SGPI routes operation.
5. Receiving participant approves/rejects.
6. Settlement.
7. Status to originator.
8. Status to receiver.
9. Beneficiary account credited.

Label the view:
`PUBLIC SGPI FLOW`

## Four-layer explorer
Synchronize:
- ACTORS
- MESSAGES
- MONEY STATE
- PAYMENT STATE

Example money track:
Available → Blocked/Reserved → Settled → Credited

Important:
Do not invent the exact ISO message used in each SGPI arrow.
Use:
- CONFIRMED PUBLIC SCHEME
- ISO CONCEPTUAL MAPPING
- TO VERIFY

---

# 4. SGPI lessons

1. SGPI in the payment ecosystem
2. SGPI public happy path
3. State of the money
4. “Accepted by whom?”
5. Approval/rejection before settlement
6. Settlement → status → beneficiary credit
7. ISO mapping: known vs unknown
8. Questions to verify

The final lesson should contain checklists, not free-text notes.

Questions:
- What marks scheme acceptance?
- Technical vs business acceptance?
- Where is the hold created?
- When does the hold become a definitive debit?
- What releases the hold?
- What exact event marks settlement?
- What happens before/after settlement failure?
- Which message carries status?
- Is pacs.002 used and where?
- What rejection codes apply?
- Which flows are synchronous/asynchronous?
- When is pacs.004 used?
- What separates reject from return?
- What happens on timeout?
- How is uncertain state queried?
- How are retries kept idempotent?
- How is reconciliation performed?

---

# 5. SGPI synthetic scenarios

SGPI-001 Happy Path  
Goal: identify the 1–9 public sequence.

SGPI-002 Rejection Before Settlement  
Goal: reject vs return.

SGPI-003 Timeout Before Approval  
Label outcome as TO VERIFY; teach uncertain state/idempotency.

SGPI-004 Problem After Settlement  
Teach why post-settlement handling differs from pre-settlement rejection.

SGPI-005 Message vs Money  
A message exists without settlement evidence; learner must not conclude money moved.

SGPI-006 Accepted By Whom?  
Classify acceptance layers.

Reuse the current Simulator, Practice engine, and Investigation Workbench.

---

# 6. Core ISO study integration

Put directly in the guided path:
pain.001 → pacs.008 → Identifiers → pacs.002 → Payment Status → Reject/Return → pacs.004

Reuse Atlas data rather than duplicating message definitions.

Core message pages should evolve toward:
Overview / Flow / Structure / Identifiers / XML / Scenarios / Versions / Sources

---

# 7. Simulator next step

Refactor all-at-once run into:
Reset / Previous / Next / Play-Pause

Add:
- Watch Mode
- Challenge Mode
- clickable message objects
- SGPI public-flow scenario

Do not replace the simulator with a separate SGPI simulator.

---

# 8. Static architecture

No backend required.

Recommended content layout:

src/content/
  catalog/
  messages/
  concepts/
  lessons/
  scenarios/
  schemes/
    sgpi/
      metadata.ts
      publicFlow.ts
      lessons.ts
      scenarios.ts
      questions.ts

If Atlas becomes large, introduce route-level lazy loading and/or static JSON chunks.

---

# 9. Migration to Codex

There is no code migration. Git remains the source of truth.

Recommended:
1. Commit current stable work.
2. Push to GitHub.
3. Clone/open the repository on the development machine.
4. Create branch:
   `feat/payment-lab-v3`
5. Put `AGENTS.md` at repo root.
6. Put this plan at:
   `docs/PAYMENT_LAB_V3_PLAN.md`
7. Put public-only SGPI notes at:
   `docs/SGPI_PUBLIC_STUDY_NOTES.md`
8. Open the repository in Codex.
9. Start with an audit task before editing.

CLI option:
```bash
npm i -g @openai/codex
git clone https://github.com/Ejmz216/payment-lab.git
cd payment-lab
git checkout -b feat/payment-lab-v3
npm install
npm run build
codex
```

---

# 10. First Codex tasks

## Task 0 — Audit only
Read AGENTS.md, README.md, CONTENT_GUIDE.md, V3 plan, and source tree. Do not modify files. Identify reusable components, hardcoded lesson behavior, and the smallest V3 implementation sequence.

## Task 1 — Visual system
Implement semantic design tokens, role-based card variants, phase/family accents, and update Dashboard/Sidebar/Atlas/Lab home. Preserve accessibility. Run build.

## Task 2 — Study navigation
Make STUDY first-class. Add curriculum phases, study rail, lesson context header, Continue Studying, and previous/next flow. Do not rewrite lessons yet. Run build.

## Task 3 — LessonBlock foundation
Create a data-driven LessonBlock model with backward compatibility. Add initial reusable blocks and migrate one lesson as proof of concept. Run build.

## Task 4 — SGPI case-study content
Implement the three knowledge layers, public 1–9 flow, and first SGPI lessons using only public material. Do not guess message usage. Run build.

## Task 5 — Four-layer explorer
Build ACTORS / MESSAGES / MONEY STATE / PAYMENT STATE synchronized explorer. Integrate it into SGPI happy path. Run build.

## Task 6 — SGPI scenarios
Add SGPI-001 through SGPI-006 using existing engines. Run build.

## Task 7 — Core ISO journey
Integrate pain.001, pacs.008, identifiers, pacs.002, status, reject/return, pacs.004 into STUDY. Run build.

## Task 8 — Simulator step mode
Add step controls, Watch/Challenge modes, clickable messages, and SGPI public-flow scenario. Run build.

---

# Definition of success

Opening Payment Lab should produce:

Continue Studying
→ Current Phase
→ Current Lesson
→ Visual explanation
→ Interaction
→ Message reference
→ Scenario
→ Next lesson

The SGPI relationship should be:

GENERAL PAYMENTS
→ ISO 20022
→ PUBLIC SGPI CASE STUDY
→ QUESTIONS TO VERIFY LATER

without presenting institution-specific implementation as public fact.
