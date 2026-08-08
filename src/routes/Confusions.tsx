import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getConfusions } from '@/lib/i18nContent'
import { Card } from '@/components/ui/Card'
import { Link } from 'react-router-dom'

export function Confusions() {
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const confusions = getConfusions(lang)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('confusions.title')}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{t('confusions.description')}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {confusions.map((c) => (
          <Card key={c.id}>
            <div className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold">
              <span className="rounded-md bg-primary/15 px-2 py-1 text-primary">{c.left}</span>
              <span className="text-muted">{t('confusions.vs')}</span>
              <span className="rounded-md bg-danger/15 px-2 py-1 text-danger">{c.right}</span>
            </div>
            <p className="text-sm text-text/90">{c.explanation}</p>
            {c.relatedLessons && c.relatedLessons.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {c.relatedLessons.map((l) => (
                  <Link key={l} to={`/learn/fast-payments/${l}`} className="rounded-full border border-border bg-surface2 px-2 py-0.5 text-xs hover:bg-bg">
                    {t('confusions.relatedLesson')}
                  </Link>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
