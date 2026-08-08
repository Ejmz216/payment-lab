import { scenarios } from '@/content/scenarios'
import { ScenarioCard } from '@/components/practice/ScenarioCard'

export function ScenarioTrainer() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Scenario Trainer</h1>
        <p className="mt-1 text-sm text-muted">Realistic reasoning scenarios, not just term recall.</p>
      </div>
      <div className="flex flex-col gap-4">
        {scenarios.map((s) => <ScenarioCard key={s.id} scenario={s} />)}
      </div>
    </div>
  )
}
