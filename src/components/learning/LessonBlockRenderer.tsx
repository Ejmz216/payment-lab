import type { LessonBlock } from '@/types/blocks'
import { Card, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PaymentFlowVisualizer } from '@/components/learning/PaymentFlowVisualizer'
import { LifecycleVisualizer } from '@/components/learning/LifecycleVisualizer'
import { PredictionView } from '@/components/learning/PredictionView'
import { MessageInspectorView } from '@/components/learning/MessageInspectorView'
import { DecisionTreeView } from '@/components/learning/DecisionTreeView'
import { IdentifierTracer } from '@/components/learning/IdentifierTracer'
import { ArchitectureDiagram } from '@/components/learning/ArchitectureDiagram'
import { MessageSequenceView } from '@/components/learning/MessageSequenceView'
import { TraceOriginalPayment } from '@/components/learning/TraceOriginalPayment'
import { FourLayerExplorer } from '@/components/learning/FourLayerExplorer'
import { EvidenceMatrix } from '@/components/learning/EvidenceMatrix'
import { InvestigationChecklist } from '@/components/learning/InvestigationChecklist'
import { MoneyStateDiagram } from '@/components/learning/MoneyStateDiagram'
import { SettlementDiagram } from '@/components/learning/SettlementDiagram'
import { ComparisonView } from '@/components/learning/ComparisonView'
import { TimingComparisonView } from '@/components/learning/TimingComparisonView'
import { ScenarioCard } from '@/components/practice/ScenarioCard'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getScenarios } from '@/lib/i18nContent'

// Renders any LessonBlock purely from its data — no lesson-id branching.
// Adding a new lesson that reuses these visualizations never requires
// touching this file.
export function LessonBlockRenderer({ block }: { block: LessonBlock }) {
  const lang = useUIStore((s) => s.lang)
  const t = useT()

  switch (block.type) {
    case 'explanation':
      return (
        <Card>
          <div className="mb-1 flex items-center gap-2">
            <CardTitle className="mb-0">{block.heading}</CardTitle>
            {block.badge && <Badge type={block.badge} />}
          </div>
          <p className="text-sm leading-relaxed text-text/90">{block.body}</p>
        </Card>
      )

    case 'payment-flow':
      return (
        <Card>
          {(block.heading || block.badge) && (
            <div className="mb-2 flex items-center gap-2">
              {block.heading && <CardTitle className="mb-0">{block.heading}</CardTitle>}
              {block.badge && <Badge type={block.badge} />}
            </div>
          )}
          <PaymentFlowVisualizer actors={block.actors} steps={block.steps} />
        </Card>
      )

    case 'comparison':
      return <ComparisonView block={block} />

    case 'timing-comparison':
      return <TimingComparisonView block={block} />

    case 'message-sequence':
      return (
        <Card className="technical-surface">
          <div className="mb-3 flex items-center gap-2">
            <CardTitle className="mb-0">{block.heading}</CardTitle>
            {block.badge && <Badge type={block.badge} />}
          </div>
          <MessageSequenceView steps={block.steps} />
        </Card>
      )

    case 'prediction':
      return (
        <PredictionView
          label={t('block.predict')}
          question={block.question}
          context={block.context}
          options={block.options}
          explanation={block.explanation}
        />
      )

    case 'quick-check':
      return (
        <PredictionView
          label={t('block.quickCheck')}
          question={block.question}
          options={block.options}
          explanation={block.explanation}
        />
      )

    case 'lifecycle':
      return (
        <Card>
          <div className="mb-2 flex items-center gap-2">
            <CardTitle className="mb-0">{t('block.lifecycle')}</CardTitle>
            {block.badge && <Badge type={block.badge} />}
          </div>
          <LifecycleVisualizer stages={block.stages} />
        </Card>
      )

    case 'money-state':
      return <MoneyStateDiagram block={block} />

    case 'settlement-diagram':
      return <SettlementDiagram block={block} />

    case 'message-inspector':
      return <MessageInspectorView messageId={block.messageId} versionIndex={block.versionIndex} intro={block.intro} />

    case 'scenario': {
      const scenario = getScenarios(lang).find((s) => s.id === block.scenarioId)
      if (!scenario) return null
      return <ScenarioCard scenario={scenario} />
    }

    case 'identifier-trace':
      return <IdentifierTracer messages={block.messages} />

    case 'trace-original-payment':
      return <TraceOriginalPayment originalMessageId={block.originalMessageId} returnMessageId={block.returnMessageId} />

    case 'decision-tree':
      return <DecisionTreeView root={block.root} label={t('dtree.label')} />

    case 'architecture':
      return (
        <ArchitectureDiagram
          label={block.label}
          steps={block.steps}
          branches={block.branchAfterStep ? { after: block.branchAfterStep, items: block.branchItems ?? [] } : undefined}
        />
      )

    case 'callout':
      return (
        <Card className={block.tone === 'warning' ? 'border-warning/30' : 'border-primary/30'}>
          <CardTitle>{block.title}</CardTitle>
          <p className="text-sm text-text/90">{block.body}</p>
        </Card>
      )

    case 'four-layer-explorer':
      return (
        <Card variant="public-scheme" className="technical-surface">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <CardTitle className="mb-0">{block.heading}</CardTitle>
            {block.badge && <Badge type={block.badge} />}
          </div>
          {block.intro && <p className="mb-4 text-sm leading-relaxed text-text/85">{block.intro}</p>}
          <FourLayerExplorer steps={block.steps} />
        </Card>
      )

    case 'evidence-matrix':
      return (
        <Card variant="reference" className="technical-surface">
          <CardTitle>{block.heading}</CardTitle>
          {block.intro && <p className="mb-4 text-sm leading-relaxed text-text/85">{block.intro}</p>}
          <EvidenceMatrix rows={block.rows} />
        </Card>
      )

    case 'investigation-checklist':
      return (
        <Card variant="investigation" className="technical-surface">
          <CardTitle>{block.heading}</CardTitle>
          {block.intro && <p className="mb-4 text-sm leading-relaxed text-text/85">{block.intro}</p>}
          <InvestigationChecklist groups={block.groups} />
        </Card>
      )

    default:
      return null
  }
}
