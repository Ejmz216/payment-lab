import { useState } from 'react'
import { Link } from 'react-router-dom'
import { simulatorScenarios } from '@/content/simulatorScenarios'
import { Card, CardTitle } from '@/components/ui/Card'
import clsx from 'clsx'
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react'

const outcomeColor: Record<string, string> = {
  completed: 'text-success',
  rejected: 'text-danger',
  returned: 'text-danger',
  timeout: 'text-warning',
  duplicate: 'text-warning',
}

export function Simulator() {
  const [scenarioId, setScenarioId] = useState(simulatorScenarios[0].id)
  const [debtor] = useState('Alice Example')
  const [creditor] = useState('Bob Example')
  const [amount] = useState('100')
  const [currency] = useState('XXX')
  const [ran, setRan] = useState(false)

  const scenario = simulatorScenarios.find((s) => s.id === scenarioId)!

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Payment Simulator</h1>
        <p className="mt-1 text-sm text-muted">All data below is synthetic. This does not represent a real payment or institution.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardTitle>Configuration</CardTitle>
          <div className="mt-3 flex flex-col gap-3 text-sm">
            <Field label="Debtor" value={debtor} />
            <Field label="Debtor Agent" value="BANK_A" />
            <Field label="Creditor" value={creditor} />
            <Field label="Creditor Agent" value="BANK_B" />
            <Field label="Amount" value={`${amount} ${currency}`} />
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">Scenario</label>
              <select
                value={scenarioId}
                onChange={(e) => { setScenarioId(e.target.value); setRan(false) }}
                className="w-full rounded-md border border-border bg-surface2 px-2 py-1.5 text-sm"
              >
                {simulatorScenarios.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
              <p className="mt-1 text-xs text-muted">{scenario.description}</p>
            </div>
            <button
              onClick={() => setRan(true)}
              className="mt-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Run simulation
            </button>
          </div>
        </Card>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardTitle>Flow</CardTitle>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              {['Customer', 'Debtor Agent', 'Infrastructure', 'Creditor Agent', 'Beneficiary'].map((step, i, arr) => (
                <div key={step} className="flex items-center gap-2">
                  <span className={clsx('rounded-md border px-2.5 py-1.5', ran ? 'border-primary/50 bg-primary/10' : 'border-border')}>{step}</span>
                  {i < arr.length - 1 && <ArrowRight size={13} className="text-muted" />}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle>Timeline</CardTitle>
            {!ran ? (
              <p className="text-sm text-muted">Run the simulation to see a synthetic timeline of events.</p>
            ) : (
              <ol className="mt-2 flex flex-col gap-2">
                {scenario.events.map((ev, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    {ev.outcome === 'failure' ? (
                      <XCircle size={16} className="mt-0.5 shrink-0 text-danger" />
                    ) : ev.outcome === 'success' ? (
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" />
                    ) : (
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span>{ev.label}</span>
                        <span className="shrink-0 font-mono text-xs text-muted">+{(ev.offsetMs / 1000).toFixed(3)}s</span>
                      </div>
                      {ev.messageId && (
                        <Link to={`/atlas/messages/${ev.messageId}`} className="text-xs text-primary hover:underline">
                          View message: {ev.messageId}
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Card>

          {ran && (
            <Card>
              <CardTitle>Outcome</CardTitle>
              <p className={clsx('text-sm font-semibold capitalize', outcomeColor[scenario.finalOutcome])}>{scenario.finalOutcome}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-0.5 rounded-md border border-border bg-surface2 px-2 py-1.5 text-sm">{value}</div>
    </div>
  )
}
