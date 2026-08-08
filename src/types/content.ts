// Core content types for Payment Lab. Content is data, kept separate from UI components.

export type CoverageLevel = 'full-lesson' | 'detailed-reference' | 'basic-reference' | 'catalog-only'
export type FastPaymentsRelevance = 'critical' | 'high' | 'medium' | 'low' | 'not-covered'
export type ContentBadge = 'reference' | 'simplified-model' | 'simulation' | 'scheme-dependent'
export type Perspective = 'business' | 'ba-bsa' | 'developer' | 'qa' | 'operations'

export interface SourceMetadata {
  sourceName: string
  sourceType: 'ISO' | 'central-bank' | 'payment-scheme' | 'official-documentation' | 'educational-synthesis'
  sourceReference?: string
  lastReviewed: string
  notes?: string
}

export interface LessonSection {
  heading: string
  body: string
  badge?: ContentBadge
}

export interface Lesson {
  id: string
  pathId: string
  order: number
  title: string
  subtitle?: string
  whyItMatters: string
  objectives: string[]
  mentalModel?: string
  sections: LessonSection[]
  keyTerms: string[]
  commonConfusion?: { title: string; explanation: string }[]
  scenarioId?: string
  relatedLessons?: string[]
  relatedMessages?: string[]
  relatedConcepts?: string[]
  sources: SourceMetadata[]
  estimatedMinutes: number
}

export interface LearningPath {
  id: string
  title: string
  description: string
  lessonIds: string[]
}

export interface MessageFieldNode {
  id: string
  name: string
  xmlTag: string
  businessMeaning: string
  cardinality: string
  dataType?: string
  whyItMatters?: string
  commonMistakes?: string
  relatedFields?: string[]
  exampleValue?: string
  children?: MessageFieldNode[]
}

export interface MessageVersion {
  version: string
  fullIdentifier: string
  lastReviewed: string
  cardinalityNotes?: string
  tree: MessageFieldNode
}

export interface RelatedMessageLink {
  messageId: string
  relation: 'commonly-precedes' | 'commonly-follows' | 'status-of' | 'returns' | 'cancels' | 'references' | 'related'
}

export interface MessageDefinition {
  id: string
  family: 'pain' | 'pacs' | 'camt' | 'admi' | 'head' | 'remt'
  number: string
  name: string
  shortDescription: string
  businessArea: string
  domain: string
  purpose: string
  actors: string[]
  lifecycleStage: string[]
  whatComesBefore: string
  whatComesAfter: string
  relatedMessages: RelatedMessageLink[]
  tags: string[]
  fastPaymentsRelevance: FastPaymentsRelevance
  coverage: CoverageLevel
  versions: MessageVersion[]
  commonMistakes?: { title: string; explanation: string }[]
  sources: SourceMetadata[]
}

export interface ConceptEntry {
  id: string
  term: string
  oneLine: string
  simple?: string
  business?: string
  technical?: string
  example?: string
  whyCare?: string
  relatedConcepts?: string[]
  relatedMessages?: string[]
  commonConfusion?: string
  badge?: ContentBadge
}

export interface GlossaryEntry {
  id: string
  term: string
  oneLine: string
  fullExplanation: string
  example?: string
  relatedConcepts?: string[]
  relatedMessages?: string[]
  commonConfusion?: string
}

export interface ScenarioChoice {
  id: string
  label: string
  correct: boolean
}

export interface Scenario {
  id: string
  title: string
  prompt: string
  choices: ScenarioChoice[]
  explanation: {
    reasoning: string
    lifecycleImpact?: string
    relatedMessages?: string[]
    businessPerspective?: string
    technicalPerspective?: string
    dependsOnScheme?: boolean
  }
  tags: string[]
}

export interface QuizQuestion {
  id: string
  type: 'multiple-choice' | 'true-false'
  prompt: string
  choices: { id: string; label: string; correct: boolean }[]
  explanation: string
  conceptIds?: string[]
}
