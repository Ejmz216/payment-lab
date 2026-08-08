import { Link } from 'react-router-dom'
import { Card, CardTitle } from '@/components/ui/Card'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getDomains } from '@/lib/i18nContent'
import clsx from 'clsx'

const familyStyles: Record<string, string> = {
  pain: 'border-pain/45 bg-pain/10 text-pain',
  pacs: 'border-pacs/45 bg-pacs/10 text-pacs',
  camt: 'border-camt/45 bg-camt/10 text-camt',
  admi: 'border-infra/45 bg-infra/10 text-infra',
  head: 'border-iso/45 bg-iso/10 text-iso',
  remt: 'border-party/45 bg-party/10 text-party',
}

function getFamilyStyle(code: string) {
  return familyStyles[code] ?? 'border-border bg-surface2 text-muted'
}

export function AtlasHome() {
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const domainList = getDomains(lang)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('atlas.title')}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{t('atlas.description')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {domainList.map((d) => (
          <Link key={d.id} to={`/atlas/domains/${d.id}`}>
            <Card variant={d.coverage === 'deep' ? 'reference' : 'default'} className="flex h-full flex-col gap-2 hover:border-primary/50">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="mb-0">{d.name}</CardTitle>
                <span
                  className={clsx(
                    'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium',
                    d.coverage === 'deep' ? 'border-success/50 bg-success/10 text-success' : 'border-warning/50 bg-warning/10 text-warning',
                  )}
                >
                  {d.coverage === 'deep' ? t('atlas.deepCoverage') : t('atlas.comingSoon')}
                </span>
              </div>
              <p className="text-sm text-muted">{d.description}</p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                {d.families.map((f) => (
                  <span key={f.code} className={clsx('rounded-full border px-2 py-0.5 font-mono text-[10px]', getFamilyStyle(f.code))}>{f.code}</span>
                ))}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Link to="/atlas/messages" className="self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
        {t('atlas.browseCatalog')}
      </Link>
    </div>
  )
}
