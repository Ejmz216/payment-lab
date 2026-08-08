import { Link } from 'react-router-dom'
import { Card, CardTitle } from '@/components/ui/Card'
import { useT, type StringKey } from '@/i18n/strings'

const tools: { to: string; titleKey: StringKey; descKey: StringKey }[] = [
  { to: '/lab/simulator', titleKey: 'lab.simulatorTitle', descKey: 'lab.simulatorDesc' },
  { to: '/lab/debugger', titleKey: 'lab.debuggerTitle', descKey: 'lab.debuggerDesc' },
  { to: '/lab/identifiers', titleKey: 'lab.identifierTitle', descKey: 'lab.identifierDesc' },
  { to: '/lab/reject-return', titleKey: 'lab.rejectReturnTitle', descKey: 'lab.rejectReturnDesc' },
]

export function LabHome() {
  const t = useT()
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('lab.title')}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{t('lab.description')}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link key={tool.to} to={tool.to}>
            <Card className="h-full hover:border-primary/50">
              <CardTitle>{t(tool.titleKey)}</CardTitle>
              <p className="text-sm text-muted">{t(tool.descKey)}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
