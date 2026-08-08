import { useState } from 'react'
import clsx from 'clsx'
import { Card, CardTitle } from '@/components/ui/Card'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getDebugCases } from '@/lib/i18nContent'
import type { DebugCase } from '@/content/debugCases'

const difficultyColor: Record<string, string> = {
  beginner: 'border-success/50 bg-success/10 text-success',
  intermediate: 'border-warning/50 bg-warning/10 text-warning',
  advanced: 'border-danger/50 bg-danger/10 text-danger',
}

const difficultyKey = {
  beginner: 'dbg.difficulty.beginner',
  intermediate: 'dbg.difficulty.intermediate',
  advanced: 'dbg.difficulty.advanced',
} as const

type Tab = 'timeline' | 'messages' | 'identifiers' | 'participants'

export function Debugger() {
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const cases = getDebugCases(lang)
  const [caseId, setCaseId] = useState(cases[0].id)
  const c = cases.find((x) => x.id === caseId)!

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: t('nav.dashboard'), to: '/' }, { label: t('nav.lab'), to: '/lab' }, { label: t('dbg.title') }]} />
      <div>
        <h1 className="text-2xl font-semibold">{t('dbg.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('dbg.workbenchSubtitle')}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {cases.map((x) => (
          <button
            key={x.id}
            onClick={() => setCaseId(x.id)}
            className={clsx(
              'flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium',
              caseId === x.id ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted hover:text-text',
            )}
          >
            {x.caseNumber}
            <span className={clsx('rounded-full border px-1.5 py-0.5 text-[10px]', difficultyColor[x.difficulty])}>{t(difficultyKey[x.difficulty])}</span>
          </button>
        ))}
      </div>

      <InvestigationWorkbench key={c.id} debugCase={c} />
    </div>
  )
}

function InvestigationWorkbench({ debugCase }: { debugCase: DebugCase }) {
  const t = useT()
  const [tab, setTab] = useState<Tab>('timeline')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [viewIndex, setViewIndex] = useState(0)
  const [showDiagnosis, setShowDiagnosis] = useState(false)

  const currentQuestion = debugCase.questions[viewIndex]
  const isLastQuestion = viewIndex === debugCase.questions.length - 1
  const currentAnswered = currentQuestion && answers[currentQuestion.id] !== undefined

  function choose(questionId: string, optionId: string) {
    if (answers[questionId] !== undefined) return
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  function advance() {
    if (isLastQuestion) {
      setShowDiagnosis(true)
    } else {
      setViewIndex((i) => i + 1)
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'timeline', label: t('dbg.tabTimeline') },
    { id: 'messages', label: t('dbg.tabMessages') },
    { id: 'identifiers', label: t('dbg.tabIdentifiers') },
    { id: 'participants', label: t('dbg.tabParticipants') },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <div className="flex flex-col gap-3 lg:col-span-3">
        <Card>
          <div className="mb-1 font-mono text-xs text-muted">{debugCase.caseNumber}</div>
          <CardTitle>{debugCase.title}</CardTitle>
          <p className="text-sm text-text/90">{debugCase.brief}</p>
        </Card>

        <div className="flex flex-wrap gap-1.5">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={clsx(
                'rounded-md border px-3 py-1.5 text-xs font-medium',
                tab === tb.id ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted hover:text-text',
              )}
            >
              {tb.label}
            </button>
          ))}
        </div>

        <Card>
          {tab === 'timeline' && (
            <ol className="flex flex-col gap-1.5 font-mono text-sm">
              {debugCase.timeline.map((entry, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 text-muted">{entry.time}</span>
                  <span>{entry.text}</span>
                </li>
              ))}
            </ol>
          )}

          {tab === 'messages' && (
            <div className="flex flex-col gap-3">
              {debugCase.messages.map((m) => (
                <div key={m.id} className="rounded-md border border-border p-3">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-mono font-semibold text-primary">{m.id}</span>
                    <span className="rounded-full border border-border bg-surface2 px-2 py-0.5 font-mono text-[10px]">{m.kind}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted">{m.from} → {m.to}</div>
                  <p className="mt-1 text-sm text-text/90">{m.note}</p>
                </div>
              ))}
            </div>
          )}

          {tab === 'identifiers' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-muted">
                    <th className="pb-2 pr-3">{t('dbg.colMessage')}</th>
                    <th className="pb-2 pr-3">MsgId</th>
                    <th className="pb-2 pr-3">EndToEndId</th>
                    <th className="pb-2 pr-3">OrgnlEndToEndId</th>
                    <th className="pb-2 pr-3">TxId</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {debugCase.identifiers.map((row) => (
                    <tr key={row.message} className="border-t border-border">
                      <td className="py-2 pr-3">{row.message}</td>
                      <td className="py-2 pr-3">{row.msgId ?? '—'}</td>
                      <td className="py-2 pr-3">{row.endToEndId ?? '—'}</td>
                      <td className="py-2 pr-3">{row.orgnlEndToEndId ?? '—'}</td>
                      <td className="py-2 pr-3">{row.txId ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'participants' && (
            <div className="flex flex-col gap-3">
              {debugCase.participants.map((p) => (
                <div key={p.id} className="rounded-md border border-border p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono font-semibold">{p.id}</span>
                    <span className="text-xs text-muted">{p.role}</span>
                  </div>
                  <p className="mt-1 text-sm text-text/90">{p.note}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="flex flex-col gap-3 lg:col-span-2">
        <Card>
          <CardTitle>{t('dbg.investigation')}</CardTitle>
          <p className="mb-2 text-xs text-muted">{viewIndex + (currentAnswered ? 1 : 0)} / {debugCase.questions.length}</p>

          {!showDiagnosis && currentQuestion && (
            <div>
              <p className="mb-2 text-sm font-medium">{currentQuestion.prompt}</p>
              <div className="flex flex-col gap-2">
                {currentQuestion.options.map((opt) => {
                  const answered = answers[currentQuestion.id]
                  const revealed = answered !== undefined
                  return (
                    <button
                      key={opt.id}
                      disabled={revealed}
                      onClick={() => choose(currentQuestion.id, opt.id)}
                      className={clsx(
                        'rounded-md border px-3 py-2 text-left text-sm',
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
              {currentAnswered && (
                <div className="mt-3 rounded-md border border-border bg-surface2 p-3 text-sm">
                  <p className="text-text/90">{currentQuestion.explanation}</p>
                  <button
                    onClick={advance}
                    className="mt-3 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
                  >
                    {isLastQuestion ? t('dbg.seeDiagnosis') : t('dbg.nextQuestion')}
                  </button>
                </div>
              )}
            </div>
          )}

          {showDiagnosis && (
            <div className="rounded-md border border-primary/40 bg-primary/10 p-3">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">{t('dbg.diagnosis')}</div>
              <p className="text-sm text-text/90">{debugCase.finalDiagnosis}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
