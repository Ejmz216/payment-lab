import { Link } from 'react-router-dom'
import { Card, CardTitle } from '@/components/ui/Card'
import { familyInfo, messages } from '@/content/messages'

const domains = [
  { name: 'Payments', status: 'Deep coverage', href: '/atlas/messages?domain=Payments' },
  { name: 'Securities', status: 'Catalog only (coming soon)', href: undefined },
  { name: 'Trade Finance', status: 'Catalog only (coming soon)', href: undefined },
  { name: 'Cards', status: 'Catalog only (coming soon)', href: undefined },
  { name: 'FX', status: 'Catalog only (coming soon)', href: undefined },
  { name: 'Authorities', status: 'Catalog only (coming soon)', href: undefined },
]

export function AtlasHome() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">ISO 20022 Atlas</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Explore ISO 20022 like a map, not a spreadsheet. Payment Lab currently offers deep educational coverage for
          Payments, and catalog-level discovery for other business domains.
        </p>
      </div>

      <Card>
        <CardTitle>Business domains</CardTitle>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {domains.map((d) => (
            <div key={d.name} className={`rounded-md border border-border p-3 ${d.href ? '' : 'opacity-60'}`}>
              {d.href ? (
                <Link to={d.href} className="text-sm font-medium text-primary hover:underline">{d.name}</Link>
              ) : (
                <div className="text-sm font-medium">{d.name}</div>
              )}
              <div className="mt-0.5 text-xs text-muted">{d.status}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>Message families</CardTitle>
        <div className="mt-3 flex flex-col gap-2">
          {Object.entries(familyInfo).map(([key, info]) => {
            const count = messages.filter((m) => m.family === key).length
            return (
              <div key={key} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <div>
                  <div className="text-sm font-medium">{info.label}</div>
                  <div className="text-xs text-muted">{info.description}</div>
                </div>
                <div className="shrink-0 text-xs text-muted">{count} message{count === 1 ? '' : 's'}</div>
              </div>
            )
          })}
        </div>
      </Card>

      <Link to="/atlas/messages" className="self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
        Browse message catalog →
      </Link>
    </div>
  )
}
