import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getGlossary } from '@/lib/i18nContent'
import { Card } from '@/components/ui/Card'

export function Glossary() {
  const [query, setQuery] = useState('')
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const glossary = getGlossary(lang)
  const filtered = glossary.filter((g) => (g.term + ' ' + g.oneLine).toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('glossary.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('glossary.description')}</p>
      </div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('glossary.search')}
        className="rounded-md border border-border bg-surface2 px-3 py-2 text-sm outline-none focus-ring"
      />
      <div className="flex flex-col gap-3">
        {filtered.map((g) => (
          <Card key={g.id} className="scroll-mt-4" id={g.id}>
            <div className="flex items-baseline justify-between gap-2">
              <div className="text-sm font-semibold">{g.term}</div>
            </div>
            <p className="mt-0.5 text-sm text-text/90">{g.oneLine}</p>
            <p className="mt-2 text-sm text-muted">{g.fullExplanation}</p>
            {g.commonConfusion && (
              <p className="mt-2 text-xs text-warning"><span className="font-medium">{t('glossary.commonConfusion')} </span>{g.commonConfusion}</p>
            )}
            {(g.relatedMessages?.length || g.relatedConcepts?.length) && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {g.relatedMessages?.map((m) => (
                  <Link key={m} to={`/atlas/messages/${m}`} className="rounded-full border border-border bg-surface2 px-2 py-0.5 text-xs hover:bg-bg">{m}</Link>
                ))}
                {g.relatedConcepts?.map((c) => {
                  const target = glossary.find((x) => x.id === c)
                  if (!target) return null
                  return <a key={c} href={`#${c}`} className="rounded-full border border-border bg-surface2 px-2 py-0.5 text-xs hover:bg-bg">{target.term}</a>
                })}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
