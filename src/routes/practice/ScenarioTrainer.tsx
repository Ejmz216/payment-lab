import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getScenarios } from '@/lib/i18nContent'
import { ScenarioCard } from '@/components/practice/ScenarioCard'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export function ScenarioTrainer() {
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const scenarios = getScenarios(lang)

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: t('nav.dashboard'), to: '/' }, { label: t('nav.practice'), to: '/practice' }, { label: t('practice.scenarioTrainer') }]} />
      <div>
        <h1 className="text-2xl font-semibold">{t('practice.scenarioTrainer')}</h1>
        <p className="mt-1 text-sm text-muted">{t('practice.subtitle')}</p>
      </div>
      <div className="flex flex-col gap-4">
        {scenarios.map((s) => <ScenarioCard key={s.id} scenario={s} />)}
      </div>
    </div>
  )
}
