// Data-driven pedagogical block system. A lesson's `blocks` array is
// rendered by LessonBlockRenderer with no per-lesson-id special-casing —
// every visualization/interaction is driven entirely by this data.
import type { ContentBadge } from './content'

export type ActorKind = 'party' | 'agent' | 'infrastructure'

export interface FlowActor {
  id: string
  label: string
  role?: string
  kind?: ActorKind
}

export type FlowStatus = 'inactive' | 'active' | 'success' | 'failure' | 'warning'

export interface FlowStep {
  from: string
  to: string
  label?: string
  messageId?: string
  status?: FlowStatus
}

export interface ExplanationBlock {
  type: 'explanation'
  heading: string
  body: string
  badge?: ContentBadge
}

export interface PaymentFlowBlock {
  type: 'payment-flow'
  heading?: string
  actors: FlowActor[]
  steps: FlowStep[]
  badge?: ContentBadge
}

export type ComparisonTone = ActorKind | 'iso' | 'pacs' | 'camt' | 'scheme' | 'implementation' | 'neutral'

export interface ComparisonItem {
  id: string
  label: string
  keyQuestion: string
  summary: string
  examples: string[]
  notThis: string
  tone: ComparisonTone
}

export interface ComparisonBlock {
  type: 'comparison'
  heading: string
  intro?: string
  keyQuestionLabel?: string
  examplesLabel?: string
  notThisLabel?: string
  items: ComparisonItem[]
  badge?: ContentBadge
}

export interface MessageSequenceStep {
  id: string
  from: string
  to: string
  label: string
  messageId?: string
  description: string
  tone?: 'pain' | 'pacs' | 'camt' | 'scheme' | 'neutral'
}

export interface MessageSequenceBlock {
  type: 'message-sequence'
  heading: string
  steps: MessageSequenceStep[]
  badge?: ContentBadge
}

export interface ChoiceOption {
  id: string
  label: string
  correct: boolean
}

export interface PredictionBlock {
  type: 'prediction'
  question: string
  context?: string
  options: ChoiceOption[]
  explanation: string
}

export interface QuickCheckBlock {
  type: 'quick-check'
  question: string
  options: ChoiceOption[]
  explanation: string
}

export interface LifecycleStageInfo {
  id: string
  label: string
  description: string
  canFail?: string
}

export interface LifecycleBlock {
  type: 'lifecycle'
  stages: LifecycleStageInfo[]
  badge?: ContentBadge
}

export type MoneyZoneKind = ActorKind
export type MoneyStateTone = 'available' | 'reserved' | 'settled' | 'credited' | 'uncertain'

export interface MoneyStateZone {
  id: string
  label: string
  kind: MoneyZoneKind
}

export interface MoneyStateStage {
  id: string
  label: string
  summary: string
  position: string
  evidence: string
  notProven: string
  activeZoneIds: string[]
  tone: MoneyStateTone
}

export interface MoneyStateBlock {
  type: 'money-state'
  heading: string
  intro?: string
  zones: MoneyStateZone[]
  states: MoneyStateStage[]
  schemeNote?: string
  badge?: ContentBadge
}

export interface SettlementObligation {
  from: string
  to: string
  amount: number
}

export interface SettlementDiagramBlock {
  type: 'settlement-diagram'
  heading: string
  intro?: string
  parties: [FlowActor, FlowActor]
  obligations: SettlementObligation[]
  currency: string
  clearedExplanation: string
  settledExplanation: string
  notice: string
  schemeDependent: string
  badge?: ContentBadge
}

export interface MessageInspectorBlock {
  type: 'message-inspector'
  messageId: string
  versionIndex?: number
  intro?: string
}

export interface ScenarioBlockData {
  type: 'scenario'
  scenarioId: string
}

export interface IdentifierTraceMessage {
  messageId: string
  msgIdFieldId?: string
  linkFieldId: string
  linkFieldLabel: string
}

export interface IdentifierTraceBlock {
  type: 'identifier-trace'
  messages: IdentifierTraceMessage[]
}

export interface TraceOriginalPaymentBlock {
  type: 'trace-original-payment'
  originalMessageId: string
  returnMessageId: string
}

export interface DecisionTreeAnswer {
  label: string
  result?: string
  next?: DecisionTreeQuestion
}

export interface DecisionTreeQuestion {
  question: string
  answers: DecisionTreeAnswer[]
}

export interface DecisionTreeBlock {
  type: 'decision-tree'
  root: DecisionTreeQuestion
}

export interface ArchitectureBlock {
  type: 'architecture'
  label: string
  steps: string[]
  branchAfterStep?: string
  branchItems?: string[]
}

export interface CalloutBlock {
  type: 'callout'
  title: string
  body: string
  tone?: 'info' | 'warning'
}

export interface FourLayerValue {
  label: string
  detail: string
  badge?: ContentBadge
}

export interface FourLayerStep {
  id: string
  title: string
  actor: FourLayerValue
  message: FourLayerValue
  money: FourLayerValue
  payment: FourLayerValue
}

export interface FourLayerExplorerBlock {
  type: 'four-layer-explorer'
  heading: string
  intro?: string
  steps: FourLayerStep[]
  badge?: ContentBadge
}

export interface EvidenceMatrixRow {
  id: string
  topic: string
  publicEvidence: string
  isoRelevance: string
  implementationQuestion: string
  badge: ContentBadge
}

export interface EvidenceMatrixBlock {
  type: 'evidence-matrix'
  heading: string
  intro?: string
  rows: EvidenceMatrixRow[]
}

export interface InvestigationChecklistGroup {
  title: string
  items: string[]
}

export interface InvestigationChecklistBlock {
  type: 'investigation-checklist'
  heading: string
  intro?: string
  groups: InvestigationChecklistGroup[]
}

export type LessonBlock =
  | ExplanationBlock
  | PaymentFlowBlock
  | ComparisonBlock
  | MessageSequenceBlock
  | PredictionBlock
  | QuickCheckBlock
  | LifecycleBlock
  | MoneyStateBlock
  | SettlementDiagramBlock
  | MessageInspectorBlock
  | ScenarioBlockData
  | IdentifierTraceBlock
  | TraceOriginalPaymentBlock
  | DecisionTreeBlock
  | ArchitectureBlock
  | CalloutBlock
  | FourLayerExplorerBlock
  | EvidenceMatrixBlock
  | InvestigationChecklistBlock
