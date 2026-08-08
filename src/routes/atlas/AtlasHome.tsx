import { Link } from 'react-router-dom'
import { Card, CardTitle } from '@/components/ui/Card'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getFamilyInfo, getMessages } from '@/lib/i18nContent'

const domains = [
  { name: 'Payments', hasHref: true },
  { name: 'Securities', hasHref: false },
  { name: 'Trade Finance', hasHref: false },
  { name: 'Cards', hasHref: false },
  { name: 'FX', hasHref: false },
  { name: 'Authorities', hasHref: false },
]

export function AtlasHome() {
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const familyInfo = getFamilyInfo(lang)
  const messages = getMessages(lang)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('atlas.title')}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{t('atlas.description')}</p>
      </div>

      <Card>
        <CardTitle>{t('atlas.domains')}</CardTitle>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {domains.map((d) => (
            <div key={d.name} className={`rounded-md border border-border p-3 ${d.hasHref ? '' : 'opacity-60'}`}>
              {d.hasHref ? (
                <Link to="/atlas/messages" className="text-sm font-medium text-primary hover:underline">{d.name}</Link>
              ) : (
                <div className="text-sm font-medium">{d.name}</div>
              )}
              <div className="mt-0.5 text-xs text-muted">{d.hasHref ? t('atlas.deepCoverage') : t('atlas.comingSoon')}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>{t('atlas.families')}</CardTitle>
        <div className="mt-3 flex flex-col gap-2">
          {Object.entries(familyInfo).map(([key, info]) => {
            const count = messages.filter((m) => m.family === key).length
            return (
              <div key={key} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <div>
                  <div className="text-sm font-medium">{info.label}</div>
                  <div className="text-xs text-muted">{info.description}</div>
                </div>
                <div className="shrink-0 text-xs text-muted">{count} {count === 1 ? t('atlas.message') : t('atlas.messages')}</div>
              </div>
            )
          })}
        </div>
      </Card>

      <Link to="/atlas/messages" className="self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
        {t('atlas.browseCatalog')}
      </Link>
    </div>
  )
}
