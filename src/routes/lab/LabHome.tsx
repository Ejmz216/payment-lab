import { Link } from 'react-router-dom'
import { Card, CardTitle, type CardVariant } from '@/components/ui/Card'
import { useT, type StringKey } from '@/i18n/strings'
import { Bug, Code2, FlaskConical, GitBranch, MessageSquareWarning, ScanSearch } from 'lucide-react'

const tools: { to: string; titleKey: StringKey; descKey: StringKey; icon: typeof FlaskConical; variant: CardVariant; accent: string }[] = [
  { to: '/lab/simulator', titleKey: 'lab.simulatorTitle', descKey: 'lab.simulatorDesc', icon: FlaskConical, variant: 'simulation', accent: 'text-camt' },
  { to: '/lab/debugger', titleKey: 'lab.debuggerTitle', descKey: 'lab.debuggerDesc', icon: ScanSearch, variant: 'investigation', accent: 'text-warning' },
  { to: '/lab/identifiers', titleKey: 'lab.identifierTitle', descKey: 'lab.identifierDesc', icon: GitBranch, variant: 'reference', accent: 'text-iso' },
  { to: '/lab/reject-return', titleKey: 'lab.rejectReturnTitle', descKey: 'lab.rejectReturnDesc', icon: MessageSquareWarning, variant: 'warning', accent: 'text-danger' },
  { to: '/lab/xml', titleKey: 'lab.xmlTitle', descKey: 'lab.xmlDesc', icon: Code2, variant: 'reference', accent: 'text-pacs' },
  { to: '/lab/break-message', titleKey: 'lab.breakTitle', descKey: 'lab.breakDesc', icon: Bug, variant: 'investigation', accent: 'text-warning' },
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
            <Card variant={tool.variant} className="h-full hover:border-primary/50">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface/60">
                <tool.icon size={18} className={tool.accent} />
              </div>
              <CardTitle>{t(tool.titleKey)}</CardTitle>
              <p className="text-sm text-muted">{t(tool.descKey)}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
