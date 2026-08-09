import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  CircleHelp,
  Eye,
  Info,
  Landmark,
  ListChecks,
  RotateCcw,
  Scale,
  XCircle,
} from 'lucide-react'
import clsx from 'clsx'
import type { SettlementDiagramBlock } from '@/types/blocks'
import { Badge } from '@/components/ui/Badge'
import { Card, CardTitle } from '@/components/ui/Card'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'

type DiagramPhase = 'gross' | 'cleared' | 'settled'
type SettlementAnswer = 'yes' | 'no' | null

const phaseOrder: DiagramPhase[] = ['gross', 'cleared', 'settled']

export function SettlementDiagram({ block }: { block: SettlementDiagramBlock }) {
  const [phase, setPhase] = useState<DiagramPhase>('gross')
  const [answer, setAnswer] = useState<SettlementAnswer>(null)
  const lang = useUIStore((state) => state.lang)
  const t = useT()
  const phaseIndex = phaseOrder.indexOf(phase)
  const [firstParty, secondParty] = block.parties

  const net = useMemo(() => {
    const balance = block.obligations.reduce((total, obligation) => {
      if (obligation.from === firstParty.id && obligation.to === secondParty.id) return total + obligation.amount
      if (obligation.from === secondParty.id && obligation.to === firstParty.id) return total - obligation.amount
      return total
    }, 0)

    return {
      from: balance >= 0 ? firstParty : secondParty,
      to: balance >= 0 ? secondParty : firstParty,
      amount: Math.abs(balance),
    }
  }, [block.obligations, firstParty, secondParty])

  const amountFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'es' ? 'es-DO' : 'en-US', { maximumFractionDigits: 2 }),
    [lang],
  )

  function reset() {
    setPhase('gross')
    setAnswer(null)
  }

  function clearObligations() {
    setPhase('cleared')
    setAnswer(null)
  }

  function settle() {
    if (answer === null) return
    setPhase('settled')
  }

  const phases = [
    { id: 'gross' as const, label: t('settlement.instructions'), icon: ListChecks },
    { id: 'cleared' as const, label: t('settlement.netObligation'), icon: Calculator },
    { id: 'settled' as const, label: t('settlement.settlement'), icon: Landmark },
  ]

  return (
    <Card variant="study" className="technical-surface overflow-hidden p-0">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="mb-0 text-base">{block.heading}</CardTitle>
            {block.badge && <Badge type={block.badge} />}
          </div>
          {block.intro && <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text/85">{block.intro}</p>}
        </div>
        <button
          type="button"
          onClick={reset}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-bg/60 text-muted hover:text-text"
          aria-label={t('settlement.reset')}
          title={t('settlement.reset')}
        >
          <RotateCcw size={15} />
        </button>
      </div>

      <div className="grid grid-cols-3 border-b border-border bg-bg/45" aria-label={t('settlement.progress')}>
        {phases.map(({ id, label, icon: Icon }, index) => {
          const complete = index < phaseIndex
          const active = id === phase
          return (
            <div
              key={id}
              className={clsx(
                'flex min-h-16 items-center justify-center gap-2 border-r border-border px-2 py-3 text-center text-xs last:border-r-0 sm:text-sm',
                active && 'bg-primary/10 font-semibold text-primary',
                complete && 'text-success',
                !active && !complete && 'text-muted',
              )}
              aria-current={active ? 'step' : undefined}
            >
              {complete ? <CheckCircle2 size={16} className="shrink-0" /> : <Icon size={16} className="shrink-0" />}
              <span>{label}</span>
            </div>
          )
        })}
      </div>

      <div className="px-4 py-5 sm:px-5">
        {phase === 'gross' && (
          <section aria-label={t('settlement.grossObligations')}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="text-sm font-semibold">{t('settlement.grossObligations')}</h4>
              <span className="rounded border border-warning/35 bg-warning/10 px-2 py-1 text-[11px] font-semibold text-warning">
                {t('settlement.moneyNotMoved')}
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {block.obligations.map((obligation, index) => {
                const from = block.parties.find((party) => party.id === obligation.from)
                const to = block.parties.find((party) => party.id === obligation.to)
                return (
                  <div key={`${obligation.from}-${obligation.to}-${index}`} className="flex min-h-20 items-center gap-2 rounded-md border border-border bg-bg/65 px-3 py-3">
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-agent">{from?.label ?? obligation.from}</span>
                    <span className="flex shrink-0 items-center gap-1.5 text-muted">
                      <span className="rounded border border-pacs/30 bg-pacs/10 px-2 py-1 font-mono text-xs font-semibold text-pacs">
                        {amountFormatter.format(obligation.amount)} {block.currency}
                      </span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-right text-sm font-semibold text-agent">{to?.label ?? obligation.to}</span>
                  </div>
                )
              })}
            </div>
            <button
              type="button"
              onClick={clearObligations}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              <Calculator size={16} />
              {t('settlement.clearAction')}
            </button>
          </section>
        )}

        {phase === 'cleared' && (
          <section aria-label={t('settlement.netObligation')}>
            <div className="rounded-md border border-primary/35 bg-bg/70 p-4">
              <div className="text-center text-xs font-semibold uppercase tracking-wide text-primary">{t('settlement.netObligation')}</div>
              <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
                <div className="truncate text-right text-sm font-semibold text-agent sm:text-base">{net.from.label}</div>
                <div className="flex flex-col items-center gap-1">
                  <span className="rounded border border-pacs/35 bg-pacs/10 px-3 py-1.5 font-mono text-lg font-bold text-pacs">
                    {amountFormatter.format(net.amount)} {block.currency}
                  </span>
                  <ArrowRight size={22} className="text-primary" aria-hidden="true" />
                </div>
                <div className="truncate text-sm font-semibold text-agent sm:text-base">{net.to.label}</div>
              </div>
            </div>

            <div className="mt-4 border-l-2 border-warning pl-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CircleHelp size={17} className="text-warning" />
                {t('settlement.hasHappened')}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setAnswer('yes')}
                  className={clsx(
                    'min-h-10 rounded-md border px-4 py-2 text-sm font-medium',
                    answer === 'yes' ? 'border-danger bg-danger/10 text-danger' : 'border-border bg-bg/60 hover:bg-surface2',
                  )}
                >
                  {t('settlement.yes')}
                </button>
                <button
                  type="button"
                  onClick={() => setAnswer('no')}
                  className={clsx(
                    'min-h-10 rounded-md border px-4 py-2 text-sm font-medium',
                    answer === 'no' ? 'border-success bg-success/10 text-success' : 'border-border bg-bg/60 hover:bg-surface2',
                  )}
                >
                  {t('settlement.no')}
                </button>
              </div>
              {answer && (
                <div
                  className={clsx('mt-3 flex items-start gap-2 text-sm leading-relaxed', answer === 'no' ? 'text-success' : 'text-danger')}
                  role="status"
                  aria-live="polite"
                >
                  {answer === 'no' ? <CheckCircle2 size={17} className="mt-0.5 shrink-0" /> : <XCircle size={17} className="mt-0.5 shrink-0" />}
                  <span>{answer === 'no' ? t('settlement.correctNotYet') : t('settlement.incorrectNotYet')}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={settle}
              disabled={answer === null}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md bg-success px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              title={answer === null ? t('settlement.answerFirst') : undefined}
            >
              <Landmark size={16} />
              {t('settlement.settleAction')}
            </button>
          </section>
        )}

        {phase === 'settled' && (
          <section aria-label={t('settlement.settlementComplete')}>
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-success">
              <CheckCircle2 size={18} />
              {t('settlement.settlementComplete')}
            </div>
            <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
              <div className="rounded-md border border-agent/35 bg-agent/10 p-3 text-center">
                <div className="truncate text-xs font-semibold text-agent">{net.from.label}</div>
                <div className="mt-2 font-mono text-lg font-bold text-danger">-{amountFormatter.format(net.amount)}</div>
                <div className="text-[11px] text-muted">{t('settlement.positionChange')}</div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-md border border-infra/40 bg-infra/10 text-infra">
                <Landmark size={22} />
              </div>
              <div className="rounded-md border border-agent/35 bg-agent/10 p-3 text-center">
                <div className="truncate text-xs font-semibold text-agent">{net.to.label}</div>
                <div className="mt-2 font-mono text-lg font-bold text-success">+{amountFormatter.format(net.amount)}</div>
                <div className="text-[11px] text-muted">{t('settlement.positionChange')}</div>
              </div>
            </div>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-text/85">{block.settledExplanation}</p>
          </section>
        )}
      </div>

      <div className="grid border-t border-border bg-bg/35 md:grid-cols-2">
        <div className="border-b border-border p-4 md:border-b-0 md:border-r">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
            <Info size={14} /> {t('settlement.whatHappened')}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-text/80">
            {phase === 'gross' ? t('settlement.instructionsOnly') : phase === 'cleared' ? block.clearedExplanation : block.settledExplanation}
          </p>
        </div>
        <div className="border-b border-border p-4 md:border-b-0">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-camt">
            <Scale size={14} /> {t('settlement.whyMatters')}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-text/80">{block.notice}</p>
        </div>
        <div className="border-t border-border p-4 md:border-r">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-warning">
            <Eye size={14} /> {t('settlement.notice')}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-text/80">{t('settlement.noticeCopy')}</p>
        </div>
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-scheme">
            <Landmark size={14} /> {t('settlement.schemeDependent')}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-text/80">{block.schemeDependent}</p>
        </div>
      </div>
    </Card>
  )
}
