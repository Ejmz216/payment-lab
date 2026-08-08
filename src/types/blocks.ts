// Data-driven pedagogical block system. A lesson's `blocks` array is
// rendered by LessonBlockRenderer with no per-lesson-id special-casing —
// every visualization/interaction is driven entirely by this data.
import type { ContentBadge } from './content'

export interface FlowActor {
  id: string
  label: string
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

export type LessonBlock =
  | ExplanationBlock
  | PaymentFlowBlock
  | PredictionBlock
  | QuickCheckBlock
  | LifecycleBlock
  | MessageInspectorBlock
  | ScenarioBlockData
  | DecisionTreeBlock
  | ArchitectureBlock
  | CalloutBlock
