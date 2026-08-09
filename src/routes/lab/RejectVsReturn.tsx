import { useState } from 'react'
import clsx from 'clsx'
import { Card, CardTitle } from '@/components/ui/Card'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'

const stagesEn = ['Initiated', 'Received', 'Validated', 'Accepted', 'Settled', 'Credited']
const stagesEs = ['Iniciado', 'Recibido', 'Validado', 'Aceptado', 'Liquidado', 'Acreditado']

const answersEn: Record<number, { correct: string; explanation: string }> = {
  0: { correct: 'Reject', explanation: 'A failure before the payment is even received/validated is investigated as a reject — the payment never truly progressed.' },
  1: { correct: 'Reject', explanation: 'A failure at Received (e.g. malformed message) is still pre-validation — investigate as a reject.' },
  2: { correct: 'Reject', explanation: 'A validation failure prevents the payment from being accepted — this is the classic shape of a reject.' },
  3: { correct: 'Reject or Return (depends on scheme)', explanation: 'Right at Accepted the boundary can be scheme-dependent — some schemes may still allow a rejection-style response very close to acceptance, others treat acceptance as final. Investigate both possibilities.' },
  4: { correct: 'Return', explanation: 'Once settled, the obligation has been discharged. A later failure requires unwinding via a return, not a reject.' },
  5: { correct: 'Return', explanation: 'A failure at Credited (e.g. closed account) happens after the payment already progressed — this is a return scenario.' },
}

const answersEs: Record<number, { correct: string; explanation: string }> = {
  0: { correct: 'Rechazo (Reject)', explanation: 'Un fallo antes de que el pago siquiera sea recibido/validado se investiga como un rechazo — el pago nunca progresó realmente.' },
  1: { correct: 'Rechazo (Reject)', explanation: 'Un fallo en Recibido (por ejemplo, mensaje malformado) sigue siendo previo a la validación — investígalo como un rechazo.' },
  2: { correct: 'Rechazo (Reject)', explanation: 'Un fallo de validación impide que el pago sea aceptado — esta es la forma clásica de un rechazo.' },
  3: { correct: 'Rechazo o Devolución (depende del esquema)', explanation: 'Justo en Aceptado el límite puede depender del esquema — algunos esquemas aún permiten una respuesta tipo rechazo muy cerca de la aceptación, otros tratan la aceptación como final. Investiga ambas posibilidades.' },
  4: { correct: 'Devolución (Return)', explanation: 'Una vez liquidado, la obligación ya fue saldada. Un fallo posterior requiere revertirse mediante una devolución, no un rechazo.' },
  5: { correct: 'Devolución (Return)', explanation: 'Un fallo en Acreditado (por ejemplo, cuenta cerrada) ocurre después de que el pago ya progresó — este es un escenario de devolución.' },
}

const options = ['Reject', 'Return', 'Cancellation', 'Status', 'Other']
const optionsEs = ['Rechazo', 'Devolución', 'Cancelación', 'Estado', 'Otro']

export function RejectVsReturn() {
  const [stageIdx, setStageIdx] = useState<number | null>(null)
  const [choice, setChoice] = useState<string | null>(null)
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const stages = lang === 'es' ? stagesEs : stagesEn
  const answers = lang === 'es' ? answersEs : answersEn
  const opts = lang === 'es' ? optionsEs : options

  const answer = stageIdx !== null ? answers[stageIdx] : null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('rvr.title')}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{t('rvr.description')}</p>
      </div>

      <Card>
        <CardTitle>{t('rvr.lifecycle')}</CardTitle>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {stages.map((s, i) => (
            <button
              key={s}
              onClick={() => { setStageIdx(i); setChoice(null) }}
              className={clsx(
                'rounded-md border px-3 py-2 text-sm',
                stageIdx === i ? 'border-danger bg-danger/10 text-danger' : 'border-border hover:bg-surface2',
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </Card>

      {stageIdx !== null && (
        <Card>
          <CardTitle>{t('rvr.wouldYouInvestigate')} "{stages[stageIdx]}"?</CardTitle>
          <div className="mt-2 flex flex-wrap gap-2">
            {opts.map((opt) => (
              <button
                key={opt}
                onClick={() => setChoice(opt)}
                className={clsx(
                  'rounded-md border px-3 py-1.5 text-sm',
                  choice === opt ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-surface2',
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          {choice && answer && (
            <div className="mt-3 rounded-md border border-border bg-surface2 p-3 text-sm">
              <div className="mb-1 font-semibold">{t('rvr.mostLikely')}: {answer.correct}</div>
              <p className="text-text/90">{answer.explanation}</p>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
