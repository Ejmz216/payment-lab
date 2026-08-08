import { useState } from 'react'
import { Card, CardTitle } from '@/components/ui/Card'
import { useT } from '@/i18n/strings'
import clsx from 'clsx'

interface Case {
  id: string
  title: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  timeline: { time: string; label: string; suspicious?: boolean }[]
  question: string
  options: { id: string; label: string; correct: boolean }[]
  explanation: string
  investigate: string
}

const cases: Case[] = [
  {
    id: 'case-1',
    title: 'Credit failed after settlement',
    difficulty: 'Beginner',
    timeline: [
      { time: '10:32:01', label: 'Payment received' },
      { time: '10:32:01', label: 'Validation passed' },
      { time: '10:32:02', label: 'Accepted' },
      { time: '10:32:02', label: 'Settlement confirmed' },
      { time: '10:32:03', label: 'Credit failed', suspicious: true },
      { time: '10:32:04', label: 'Return initiated' },
    ],
    question: 'At which stage did the problem occur?',
    options: [
      { id: 'a', label: 'Before acceptance', correct: false },
      { id: 'b', label: 'After settlement, during credit', correct: true },
      { id: 'c', label: 'During validation', correct: false },
    ],
    explanation: 'Settlement succeeded, but crediting the beneficiary failed afterward — this is a post-acceptance failure, handled as a return.',
    investigate: 'pacs.004 (Payment Return) — look at the return reason information.',
  },
  {
    id: 'case-2',
    title: 'Duplicate EndToEndId, delayed status',
    difficulty: 'Intermediate',
    timeline: [
      { time: '09:14:00', label: 'Payment A received, EndToEndId=E2E-777' },
      { time: '09:14:02', label: 'Payment A accepted' },
      { time: '09:15:40', label: 'Payment B received, EndToEndId=E2E-777', suspicious: true },
      { time: '09:15:41', label: 'Payment B flagged as possible duplicate' },
      { time: '09:16:10', label: 'Status report for Payment A finally arrives (delayed)' },
    ],
    question: 'Which action is most likely for Payment B?',
    options: [
      { id: 'a', label: 'It proceeds normally, since it arrived later', correct: false },
      { id: 'b', label: 'It gets rejected as a likely duplicate of Payment A', correct: true },
      { id: 'c', label: 'It automatically becomes a return of Payment A', correct: false },
    ],
    explanation: 'Reusing the same EndToEndId is a strong duplicate signal. The delayed status report for Payment A is a red herring — it does not change the duplicate determination for Payment B.',
    investigate: 'pacs.002 for Payment B — check the reason code for duplicate detection.',
  },
]

export function Debugger() {
  const [caseId, setCaseId] = useState(cases[0].id)
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const c = cases.find((x) => x.id === caseId)!
  const t = useT()

  function choose(id: string) {
    setSelected(id)
    setRevealed(true)
  }

  function reset(id: string) {
    setCaseId(id)
    setSelected(null)
    setRevealed(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('dbg.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('dbg.subtitle')}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {cases.map((x) => (
          <button
            key={x.id}
            onClick={() => reset(x.id)}
            className={clsx(
              'rounded-md border px-3 py-1.5 text-xs font-medium',
              caseId === x.id ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted hover:text-text',
            )}
          >
            {x.title} · {x.difficulty}
          </button>
        ))}
      </div>

      <Card>
        <CardTitle>{t('dbg.timeline')}</CardTitle>
        <ol className="mt-2 flex flex-col gap-1.5 font-mono text-sm">
          {c.timeline.map((t, i) => (
            <li key={i} className={clsx('flex gap-3', t.suspicious && 'text-warning')}>
              <span className="text-muted">{t.time}</span>
              <span>{t.label}</span>
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <CardTitle>{c.question}</CardTitle>
        <div className="mt-2 flex flex-col gap-2">
          {c.options.map((o) => (
            <button
              key={o.id}
              disabled={revealed}
              onClick={() => choose(o.id)}
              className={clsx(
                'rounded-md border px-3 py-2 text-left text-sm',
                revealed && o.correct && 'border-success bg-success/10',
                revealed && selected === o.id && !o.correct && 'border-danger bg-danger/10',
                !revealed && 'border-border hover:bg-surface2',
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
        {revealed && (
          <div className="mt-3 rounded-md border border-border bg-surface2 p-3 text-sm">
            <p>{c.explanation}</p>
            <p className="mt-2 text-xs text-muted"><span className="font-medium text-text">{t('dbg.whichMessage')}</span> {c.investigate}</p>
          </div>
        )}
      </Card>
    </div>
  )
}
