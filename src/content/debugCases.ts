// Investigation Workbench case data. Timelines are deliberately terse and
// technical — the point is that the student has to cross-reference
// Messages/Identifiers/Participants to figure out what happened, not read
// an explanation that already gives away the diagnosis.

export type DebugDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface DebugTimelineEntry {
  time: string
  text: string
}

export interface DebugMessageSummary {
  id: string
  kind: string
  from: string
  to: string
  note: string
}

export interface DebugIdentifierRow {
  message: string
  msgId?: string
  endToEndId?: string
  txId?: string
  orgnlEndToEndId?: string
}

export interface DebugParticipant {
  id: string
  role: string
  note: string
}

export interface DebugQuestion {
  id: string
  prompt: string
  options: { id: string; label: string; correct: boolean }[]
  explanation: string
}

export interface DebugCase {
  id: string
  caseNumber: string
  title: string
  difficulty: DebugDifficulty
  brief: string
  timeline: DebugTimelineEntry[]
  messages: DebugMessageSummary[]
  identifiers: DebugIdentifierRow[]
  participants: DebugParticipant[]
  questions: DebugQuestion[]
  finalDiagnosis: string
}

export const debugCases: DebugCase[] = [
  {
    id: 'syn-1034',
    caseNumber: 'CASE #SYN-1034',
    title: 'Payment did not complete as expected',
    difficulty: 'beginner',
    brief: 'A customer is asking why their payment shows as sent but the beneficiary never received the funds. Investigate what happened.',
    timeline: [
      { time: '09:14:01', text: 'RX pacs.008 (MSG-3301)' },
      { time: '09:14:01', text: 'VALIDATION OK' },
      { time: '09:14:02', text: 'STATUS: ACCEPTED' },
      { time: '09:14:02', text: 'SETTLEMENT CONFIRMED' },
      { time: '09:14:03', text: 'CREDIT ERR (ACCT CLOSED)' },
      { time: '09:14:04', text: 'PMT RETURN CREATED' },
    ],
    messages: [
      { id: 'MSG-3301', kind: 'pacs.008', from: 'BANK_A', to: 'INFRA', note: 'Original credit transfer instruction.' },
      { id: 'MSG-3305', kind: 'pacs.004', from: 'BANK_B', to: 'BANK_A', note: 'Sent after the timeline entry "PMT RETURN CREATED".' },
    ],
    identifiers: [
      { message: 'MSG-3301 (pacs.008)', msgId: 'MSG-3301', endToEndId: 'E2E-7742', txId: 'TX-3301-01' },
      { message: 'MSG-3305 (pacs.004)', msgId: 'MSG-3305', orgnlEndToEndId: 'E2E-7742', txId: 'TX-3305-01' },
    ],
    participants: [
      { id: 'BANK_A', role: 'Debtor Agent', note: 'Originating institution.' },
      { id: 'INFRA', role: 'Clearing/Settlement Infrastructure', note: 'Processed the instruction and confirmed settlement.' },
      { id: 'BANK_B', role: 'Creditor Agent', note: 'Attempted to credit the beneficiary.' },
    ],
    questions: [
      {
        id: 'q1',
        prompt: 'Looking at the timeline, where did something go wrong?',
        options: [
          { id: 'a', label: 'Before validation', correct: false },
          { id: 'b', label: 'After settlement, during the credit step', correct: true },
          { id: 'c', label: 'During message transport to the infrastructure', correct: false },
          { id: 'd', label: 'Nothing went wrong — the payment completed', correct: false },
        ],
        explanation: 'SETTLEMENT CONFIRMED appears before CREDIT ERR — the payment settled successfully, and the failure happened afterward, at the credit step.',
      },
      {
        id: 'q2',
        prompt: 'Was settlement completed before the failure occurred?',
        options: [
          { id: 'a', label: 'Yes', correct: true },
          { id: 'b', label: 'No', correct: false },
        ],
        explanation: 'The timeline explicitly shows SETTLEMENT CONFIRMED one entry before CREDIT ERR.',
      },
      {
        id: 'q3',
        prompt: 'Which message would you check on the Messages tab for evidence of what happened next?',
        options: [
          { id: 'a', label: 'A second pacs.008', correct: false },
          { id: 'b', label: 'pacs.004', correct: true },
          { id: 'c', label: 'pain.001', correct: false },
          { id: 'd', label: 'camt.053', correct: false },
        ],
        explanation: 'MSG-3305 on the Messages tab is a pacs.004 — a return — sent from BANK_B back to BANK_A.',
      },
      {
        id: 'q4',
        prompt: 'On the Identifiers tab, which field would confirm MSG-3305 is a return of MSG-3301 specifically?',
        options: [
          { id: 'a', label: 'Its own MsgId (MSG-3305)', correct: false },
          { id: 'b', label: 'Its OrgnlEndToEndId matching MSG-3301\'s EndToEndId (E2E-7742)', correct: true },
          { id: 'c', label: 'The timeline timestamp alone', correct: false },
        ],
        explanation: 'OrgnlEndToEndId on MSG-3305 is E2E-7742 — the same EndToEndId carried by the original pacs.008 (MSG-3301). That match is what ties the return to the original payment.',
      },
    ],
    finalDiagnosis:
      'This is a return, not a reject. The payment was validated, accepted and settled successfully — but BANK_B could not credit the beneficiary because the account was closed, so it returned the funds via pacs.004 (MSG-3305), referencing the original transaction through OrgnlEndToEndId.',
  },
  {
    id: 'syn-2210',
    caseNumber: 'CASE #SYN-2210',
    title: 'Second instruction rejected — same customer, same amount',
    difficulty: 'intermediate',
    brief: 'Two nearly identical instructions were received minutes apart for the same customer. One was rejected. Figure out why, and whether the delayed status on the first instruction matters.',
    timeline: [
      { time: '14:02:00', text: 'RX pacs.008 (MSG-8801)' },
      { time: '14:02:02', text: 'STATUS: ACCEPTED (MSG-8801)' },
      { time: '14:03:40', text: 'RX pacs.008 (MSG-8809)' },
      { time: '14:03:41', text: 'FLAG: DUPLICATE SUSPECTED (MSG-8809)' },
      { time: '14:04:10', text: 'STATUS RPT DELAYED — ACCEPTED (MSG-8801)' },
      { time: '14:04:12', text: 'STATUS RPT — REJECTED, DUPLICATE (MSG-8809)' },
    ],
    messages: [
      { id: 'MSG-8801', kind: 'pacs.008', from: 'BANK_A', to: 'INFRA', note: 'First instruction received.' },
      { id: 'MSG-8809', kind: 'pacs.008', from: 'BANK_A', to: 'INFRA', note: 'Second instruction, received ~100 seconds later.' },
      { id: 'pacs.002 for MSG-8801', kind: 'pacs.002', from: 'INFRA', to: 'BANK_A', note: 'Its status report was delayed relative to when MSG-8801 was accepted.' },
      { id: 'pacs.002 for MSG-8809', kind: 'pacs.002', from: 'INFRA', to: 'BANK_A', note: 'Reports rejection, reason: duplicate.' },
    ],
    identifiers: [
      { message: 'MSG-8801 (pacs.008)', msgId: 'MSG-8801', endToEndId: 'E2E-A1', txId: 'TX-8801' },
      { message: 'MSG-8809 (pacs.008)', msgId: 'MSG-8809', endToEndId: 'E2E-A1', txId: 'TX-8809' },
    ],
    participants: [
      { id: 'BANK_A', role: 'Debtor Agent', note: 'Sent both instructions.' },
      { id: 'INFRA', role: 'Clearing/Settlement Infrastructure', note: 'Detected the duplicate and issued both status reports.' },
    ],
    questions: [
      {
        id: 'q1',
        prompt: 'On the Identifiers tab, how many distinct EndToEndIds were used across MSG-8801 and MSG-8809?',
        options: [
          { id: 'a', label: 'Two different EndToEndIds', correct: false },
          { id: 'b', label: 'One EndToEndId, reused across both messages', correct: true },
          { id: 'c', label: "Can't tell from the identifiers table", correct: false },
        ],
        explanation: 'Both MSG-8801 and MSG-8809 carry EndToEndId E2E-A1 — the same value, even though they have different MsgId and TxId.',
      },
      {
        id: 'q2',
        prompt: 'What is the strongest signal that MSG-8809 is a duplicate of MSG-8801?',
        options: [
          { id: 'a', label: 'It arrived about 100 seconds later', correct: false },
          { id: 'b', label: 'It reuses the same EndToEndId as MSG-8801', correct: true },
          { id: 'c', label: 'Its MsgId is numerically higher', correct: false },
        ],
        explanation: 'Timing and MsgId ordering are circumstantial. Reusing the same EndToEndId is the strongest duplicate signal here — it is meant to identify one payment end to end.',
      },
      {
        id: 'q3',
        prompt: 'Does the delayed status report for MSG-8801 change whether MSG-8809 is a duplicate?',
        options: [
          { id: 'a', label: 'Yes — it means MSG-8801 might not have actually been accepted', correct: false },
          { id: 'b', label: 'No — the delay is unrelated to the duplicate determination for MSG-8809', correct: true },
        ],
        explanation: 'The delayed status report is a separate, unrelated event (a timing quirk in reporting). It does not change the fact that MSG-8809 reused MSG-8801\'s EndToEndId.',
      },
      {
        id: 'q4',
        prompt: 'Which message on the Messages tab confirms MSG-8809 was rejected specifically for being a duplicate (not some other reason)?',
        options: [
          { id: 'a', label: 'MSG-8801 itself', correct: false },
          { id: 'b', label: 'The pacs.002 for MSG-8809', correct: true },
          { id: 'c', label: 'The pacs.002 for MSG-8801', correct: false },
        ],
        explanation: 'The pacs.002 issued for MSG-8809 explicitly reports the rejection reason as duplicate.',
      },
    ],
    finalDiagnosis:
      'MSG-8809 is a duplicate of MSG-8801 — both carry the same EndToEndId (E2E-A1). The infrastructure correctly rejected the second instruction. The delayed status report for MSG-8801 is a red herring: it does not affect the duplicate determination, which is based entirely on the reused EndToEndId.',
  },
  {
    id: 'syn-3387',
    caseNumber: 'CASE #SYN-3387',
    title: 'Timeout flagged, then a late acceptance arrives',
    difficulty: 'advanced',
    brief: 'A payment was forwarded through an intermediary and flagged as timed out at the receiving side — but a status report arrived two minutes later. Work out what the timeout actually meant and what to do next.',
    timeline: [
      { time: '08:00:00', text: 'RX pacs.008 (MSG-4410) at BANK_A' },
      { time: '08:00:01', text: 'FWD pacs.008 (MSG-4410) to INTERMEDIARY_BANK' },
      { time: '08:00:05', text: 'FWD pacs.008 (MSG-4410) to BANK_B' },
      { time: '08:00:35', text: 'NO RESPONSE FROM BANK_B (30s)' },
      { time: '08:00:36', text: 'TIMEOUT FLAG RAISED (MSG-4410)' },
      { time: '08:02:10', text: 'LATE STATUS RPT FROM BANK_B — ACCEPTED (MSG-4410)' },
    ],
    messages: [
      { id: 'MSG-4410', kind: 'pacs.008', from: 'BANK_A', to: 'BANK_B (via INTERMEDIARY_BANK)', note: 'Forwarded through an intermediary before reaching BANK_B.' },
      { id: 'pacs.002 for MSG-4410', kind: 'pacs.002', from: 'BANK_B', to: 'BANK_A', note: 'Arrived 1 minute 34 seconds after the timeout flag was raised, reporting ACCEPTED.' },
    ],
    identifiers: [
      { message: 'MSG-4410 (pacs.008)', msgId: 'MSG-4410', endToEndId: 'E2E-C9', txId: 'TX-4410' },
    ],
    participants: [
      { id: 'BANK_A', role: 'Debtor Agent', note: 'Originating institution.' },
      { id: 'INTERMEDIARY_BANK', role: 'Intermediary Agent', note: 'Forwarded the instruction in 4 seconds — not the source of the delay.' },
      { id: 'BANK_B', role: 'Creditor Agent', note: 'Took over a minute to respond after receiving the instruction.' },
    ],
    questions: [
      {
        id: 'q1',
        prompt: 'At the moment the timeout flag was raised (08:00:36), had BANK_B actually rejected the payment?',
        options: [
          { id: 'a', label: 'Yes, it had already rejected it', correct: false },
          { id: 'b', label: 'Unknown at that time — a timeout means no response was received, not that it failed', correct: true },
          { id: 'c', label: 'It had already accepted it', correct: false },
        ],
        explanation: 'A timeout only tells you that no response arrived within the expected window. It does not, by itself, tell you what BANK_B actually did with the payment.',
      },
      {
        id: 'q2',
        prompt: 'The late status report says ACCEPTED. What does this tell you about the timeout?',
        options: [
          { id: 'a', label: 'The timeout was effectively a false alarm — the payment was progressing at BANK_B the whole time', correct: true },
          { id: 'b', label: 'The payment must have failed and then been retried', correct: false },
          { id: 'c', label: 'BANK_B never actually received the payment', correct: false },
        ],
        explanation: 'The late pacs.002 shows the payment was in fact accepted — it just took longer than the timeout window to report it. The timeout flag did not mean failure.',
      },
      {
        id: 'q3',
        prompt: 'Looking at the timeline and Participants tab, which participant introduced most of the delay?',
        options: [
          { id: 'a', label: 'BANK_A', correct: false },
          { id: 'b', label: 'INTERMEDIARY_BANK', correct: false },
          { id: 'c', label: 'BANK_B', correct: true },
        ],
        explanation: 'INTERMEDIARY_BANK forwarded the message in 4 seconds (08:00:01 to 08:00:05). The gap is entirely on BANK_B\'s side, which took over a minute to respond at all, and over 2 minutes to send status.',
      },
      {
        id: 'q4',
        prompt: 'Given the late acceptance, what would you investigate or do next?',
        options: [
          { id: 'a', label: 'Immediately resend a new pacs.008 for the same payment', correct: false },
          { id: 'b', label: 'Reconcile using the EndToEndId to confirm the payment was not processed twice, since a timeout can trigger duplicate sends downstream', correct: true },
          { id: 'c', label: 'File a return immediately, since a timeout occurred', correct: false },
        ],
        explanation: 'Because the timeout was ambiguous and resolved later as an acceptance, the real risk is that some other process (manual or automatic) already resent the payment during the timeout window. Reconciling on EndToEndId (E2E-C9) confirms whether that happened before taking any further action.',
      },
    ],
    finalDiagnosis:
      'The timeout at 08:00:36 was a false alarm caused by BANK_B being slow to respond, not a failure. The late pacs.002 (received at 08:02:10) confirms the payment was accepted. This is a reminder that a timeout signals "no response yet," not "rejected" — the correct response is to reconcile before assuming failure and taking corrective action.',
  },
]
