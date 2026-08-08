import { lazy, Suspense, useMemo, useState } from 'react'
import { Card, CardTitle } from '@/components/ui/Card'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PaymentFlowVisualizer } from '@/components/learning/PaymentFlowVisualizer'
import { useSimulatorEngine } from '@/hooks/useSimulatorEngine'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getSimulatorScenarios, getSimActors } from '@/lib/i18nContent'
import type { SimEvent, SimScenario } from '@/content/simulatorScenarios'
import type { FlowStep } from '@/types/blocks'
import clsx from 'clsx'
import { RotateCcw, ChevronLeft, ChevronRight, Play, Pause, CheckCircle2, XCircle } from 'lucide-react'

const MessageDetailPanel = lazy(() => import('@/components/learning/MessageDetailPanel').then((m) => ({ default: m.MessageDetailPanel })))

const outcomeColor: Record<string, string> = {
  completed: 'text-success',
  rejected: 'text-danger',
  returned: 'text-danger',
  timeout: 'text-warning',
  duplicate: 'text-warning',
}

type Mode = 'watch' | 'challenge'

export function Simulator() {
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const scenarios = getSimulatorScenarios(lang)
  const actors = getSimActors(lang)
  const [scenarioId, setScenarioId] = useState(scenarios[0].id)
  const [mode, setMode] = useState<Mode>('watch')
  const scenario = scenarios.find((s) => s.id === scenarioId)!

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: t('nav.dashboard'), to: '/' }, { label: t('nav.lab'), to: '/lab' }, { label: t('lab.simulatorTitle') }]} />
      <div>
        <h1 className="text-2xl font-semibold">{t('lab.simulatorTitle')}</h1>
        <p className="mt-1 text-sm text-muted">{t('sim.syntheticNote')}</p>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">{t('sim.scenario')}</label>
            <select
              value={scenarioId}
              onChange={(e) => setScenarioId(e.target.value)}
              className="w-full max-w-xs rounded-md border border-border bg-surface2 px-2 py-1.5 text-sm"
            >
              {scenarios.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
            <p className="mt-1 text-xs text-muted">{scenario.description}</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">{t('sim.mode')}</label>
            <div className="flex overflow-hidden rounded-md border border-border">
              <button
                onClick={() => setMode('watch')}
                title={t('sim.watchModeDesc')}
                className={clsx('px-3 py-1.5 text-xs font-medium', mode === 'watch' ? 'bg-primary text-white' : 'bg-surface2 text-muted hover:text-text')}
              >
                {t('sim.watchMode')}
              </button>
              <button
                onClick={() => setMode('challenge')}
                title={t('sim.challengeModeDesc')}
                className={clsx('px-3 py-1.5 text-xs font-medium', mode === 'challenge' ? 'bg-primary text-white' : 'bg-surface2 text-muted hover:text-text')}
              >
                {t('sim.challengeMode')}
              </button>
            </div>
          </div>
        </div>
      </Card>

      <SimulatorRun key={scenarioId + mode} scenario={scenario} mode={mode} actors={actors} />
    </div>
  )
}

function SimulatorRun({ scenario, mode, actors }: { scenario: SimScenario; mode: Mode; actors: { id: string; label: string }[] }) {
  const t = useT()
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)

  const effectiveEvents = useMemo<SimEvent[]>(
    () => (mode === 'challenge' ? scenario.events : scenario.events.map((e) => ({ ...e, isDecisionPoint: false }))),
    [scenario, mode],
  )

  const engine = useSimulatorEngine(effectiveEvents)

  const segmentCount = actors.length - 1
  const steps: FlowStep[] = useMemo(() => {
    const result: FlowStep[] = []
    for (let seg = 0; seg < segmentCount; seg++) {
      let found: { event: SimEvent; isCurrent: boolean } | null = null
      for (let i = 0; i <= engine.index; i++) {
        if (effectiveEvents[i].segment === seg) found = { event: effectiveEvents[i], isCurrent: i === engine.index }
      }
      result.push({
        from: actors[seg].id,
        to: actors[seg + 1].id,
        label: found?.event.messageId,
        messageId: found?.event.messageId,
        status: !found ? 'inactive' : found.isCurrent ? 'active' : found.event.outcome === 'failure' ? 'failure' : 'success',
      })
    }
    return result
  }, [engine.index, effectiveEvents, actors, segmentCount])

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle>{t('sim.flow')}</CardTitle>
        <PaymentFlowVisualizer actors={actors} steps={steps} onStepClick={(step) => step.messageId && setSelectedMessage(step.messageId)} selectedIndex={null} />
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={engine.reset} className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted hover:text-text" aria-label={t('sim.reset')} title={t('sim.reset')}>
              <RotateCcw size={15} />
            </button>
            <button onClick={engine.previous} disabled={engine.index < 0} className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted hover:text-text disabled:opacity-30" aria-label={t('sim.previous')} title={t('sim.previous')}>
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={engine.togglePlay}
              disabled={engine.atEnd || !!engine.pendingDecision}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted hover:text-text disabled:opacity-30"
              aria-label={engine.playing ? t('sim.pause') : t('sim.play')}
              title={engine.playing ? t('sim.pause') : t('sim.play')}
            >
              {engine.playing ? <Pause size={15} /> : <Play size={15} />}
            </button>
            <button
              onClick={engine.next}
              disabled={engine.atEnd || !!engine.pendingDecision}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted hover:text-text disabled:opacity-30"
              aria-label={t('sim.next')}
              title={t('sim.next')}
            >
              <ChevronRight size={15} />
            </button>
          </div>
          <div className="font-mono text-xs text-muted">
            {t('sim.step')} {Math.max(engine.index + 1, 0)} {t('sim.of')} {engine.total}
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle>{t('sim.timeline')}</CardTitle>
        {engine.index < 0 ? (
          <p className="text-sm text-muted">{t('sim.notStarted')}</p>
        ) : (
          <ol className="mt-2 flex flex-col gap-2">
            {effectiveEvents.slice(0, engine.index + 1).map((ev, i) => (
              <li key={i} className={clsx('flex items-start gap-2 text-sm', i === engine.index && 'font-medium')}>
                {ev.outcome === 'failure' ? (
                  <XCircle size={16} className="mt-0.5 shrink-0 text-danger" />
                ) : ev.outcome === 'success' ? (
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" />
                ) : (
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted" />
                )}
                <span>{ev.label}</span>
              </li>
            ))}
          </ol>
        )}

        {engine.currentEvent?.isDecisionPoint && (
          <div className="mt-3 rounded-md border border-warning/40 bg-warning/10 p-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-warning">{engine.currentEvent.decisionQuestion ?? t('sim.whatNow')}</div>
            <div className="flex flex-wrap gap-2">
              {engine.currentEvent.decisionOptions?.map((opt) => {
                const answered = engine.decisionAnswers[engine.index]
                const revealed = answered !== undefined
                return (
                  <button
                    key={opt.id}
                    disabled={revealed}
                    onClick={() => engine.answerDecision(engine.index, opt.id)}
                    className={clsx(
                      'rounded-md border px-3 py-1.5 text-sm',
                      revealed && opt.correct && 'border-success bg-success/10',
                      revealed && answered === opt.id && !opt.correct && 'border-danger bg-danger/10',
                      !revealed && 'border-border hover:bg-surface2',
                    )}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
            {engine.decisionAnswers[engine.index] !== undefined && (
              <p className="mt-2 text-sm text-text/90">{engine.currentEvent.decisionExplanation}</p>
            )}
          </div>
        )}

        {engine.atEnd && engine.index >= 0 && (
          <div className="mt-3">
            <CardTitle>{t('sim.outcome')}</CardTitle>
            <p className={clsx('text-sm font-semibold capitalize', outcomeColor[scenario.finalOutcome])}>{scenario.finalOutcome}</p>
          </div>
        )}
      </Card>

      {selectedMessage ? (
        <Suspense fallback={<Card className="text-sm text-muted">…</Card>}>
          <MessageDetailPanel messageId={selectedMessage} onClose={() => setSelectedMessage(null)} />
        </Suspense>
      ) : (
        <p className="text-xs text-muted">{t('sim.clickMessage')}</p>
      )}
    </div>
  )
}
