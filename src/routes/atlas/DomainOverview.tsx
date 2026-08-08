import { Link, useParams, Navigate } from 'react-router-dom'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getDomain, getMessages } from '@/lib/i18nContent'
import { Card, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export function DomainOverview() {
  const { domainId } = useParams()
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const domain = domainId ? getDomain(domainId, lang) : undefined

  if (!domain) return <Navigate to="/atlas" replace />

  const messages = getMessages(lang).filter((m) => domain.families.some((f) => f.code === m.family))

  return (
    <div className="flex flex-col gap-6">
      <div className="text-xs text-muted">
        <Link to="/atlas" className="hover:text-text">{t('atlas.title')}</Link>
        <span className="mx-1.5">/</span>
        {domain.name}
      </div>

      <div>
        <h1 className="text-2xl font-semibold">{domain.name}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{domain.description}</p>
        <div className="mt-2">
          <Badge type={domain.coverage === 'deep' ? 'reference' : 'simplified-model'} title={domain.coverage === 'deep' ? undefined : t('domain.catalogBadgeTitle')} />
        </div>
      </div>

      <Card>
        <CardTitle>{t('domain.families')}</CardTitle>
        <div className="mt-2 flex flex-col gap-2">
          {domain.families.map((f) => (
            <div key={f.code} className="rounded-md border border-border px-3 py-2">
              <div className="font-mono text-sm font-medium">{f.label}</div>
              <div className="mt-0.5 text-xs text-muted">{f.description}</div>
            </div>
          ))}
        </div>
      </Card>

      {messages.length > 0 ? (
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">{t('domain.messagesInDomain')}</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {messages.map((m) => (
              <Link key={m.id} to={`/atlas/messages/${m.id}`}>
                <Card className="h-full hover:border-primary/50">
                  <div className="font-mono text-sm font-semibold">{m.id}</div>
                  <div className="mt-1 text-sm text-text/90">{m.name}</div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <Card className="flex min-h-[6rem] items-center justify-center text-center text-sm text-muted">
          {t('domain.comingSoon')}
        </Card>
      )}
    </div>
  )
}
