import { useT } from '@/i18n/strings'
import { Card } from '@/components/ui/Card'

export function CancellationDecisionTree() {
  const t = useT()
  return (
    <Card>
      <div className="mb-3 text-center text-[10px] font-semibold uppercase tracking-wide text-warning">{t('dtree.label')}</div>
      <div className="flex flex-col items-center gap-2 text-sm">
        <div className="rounded-md border border-border bg-surface2 px-4 py-2 text-center">{t('dtree.q1')}</div>
        <div className="flex w-full items-start justify-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs text-muted">{t('dtree.no')}</div>
            <div className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-center text-xs">{t('dtree.a1')}</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-xs text-muted">{t('dtree.yes')}</div>
            <div className="rounded-md border border-border bg-surface2 px-4 py-2 text-center">{t('dtree.q2')}</div>
            <div className="flex items-start justify-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <div className="text-xs text-muted">{t('dtree.yes')}</div>
                <div className="rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-center text-xs">{t('dtree.a2')}</div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="text-xs text-muted">{t('dtree.no')}</div>
                <div className="rounded-md border border-border bg-bg px-3 py-2 text-center text-xs">{t('dtree.a3')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
