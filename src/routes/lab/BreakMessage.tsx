import { useState } from 'react'
import clsx from 'clsx'
import { AlertTriangle } from 'lucide-react'
import { Card, CardTitle } from '@/components/ui/Card'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { XmlEditor } from '@/components/xml/XmlEditor'
import { brokenSamples } from '@/content/xmlSamples'
import { useT } from '@/i18n/strings'

const layerColor: Record<string, string> = {
  Syntax: 'text-danger border-danger/40 bg-danger/10',
  Schema: 'text-warning border-warning/40 bg-warning/10',
  Business: 'text-pacs border-pacs/40 bg-pacs/10',
  Scheme: 'text-pain border-pain/40 bg-pain/10',
  Implementation: 'text-camt border-camt/40 bg-camt/10',
}

export function BreakMessage() {
  const [caseId, setCaseId] = useState(brokenSamples[0].id)
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const t = useT()
  const c = brokenSamples.find((x) => x.id === caseId)!

  function choose(id: string) {
    if (revealed) return
    setSelected(id)
    setRevealed(true)
  }

  function pick(id: string) {
    setCaseId(id)
    setSelected(null)
    setRevealed(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: t('nav.dashboard'), to: '/' }, { label: t('nav.lab'), to: '/lab' }, { label: t('breakmsg.title') }]} />
      <div>
        <h1 className="text-2xl font-semibold">{t('breakmsg.title')}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{t('breakmsg.description')}</p>
      </div>

      <div className="flex items-start gap-2 rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning">
        <AlertTriangle size={15} className="mt-0.5 shrink-0" />
        <span>{t('xmllab.safety')}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {brokenSamples.map((x) => (
          <button
            key={x.id}
            onClick={() => pick(x.id)}
            className={clsx(
              'rounded-md border px-3 py-1.5 text-xs font-medium',
              caseId === x.id ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted hover:text-text',
            )}
          >
            {x.title}
          </button>
        ))}
      </div>

      <XmlEditor value={c.xml} height="20rem" />

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
            <p className="text-text/90">{c.explanation}</p>
            <div className="mt-3 flex items-start gap-2">
              <span className={clsx('shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-semibold', layerColor[c.layer])}>{c.layer.toUpperCase()}</span>
              <p className="text-xs text-muted">{c.layerNote}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
