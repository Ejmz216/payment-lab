import { Link } from 'react-router-dom'
import { Card, CardTitle } from '@/components/ui/Card'
import { scenarios, quizQuestions } from '@/content/scenarios'

export function PracticeHome() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Practice Center</h1>
        <p className="mt-1 text-sm text-muted">Application and troubleshooting practice, not just recall.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link to="/practice/scenarios">
          <Card className="h-full hover:border-primary/50">
            <CardTitle>Scenario Trainer</CardTitle>
            <p className="text-sm text-muted">{scenarios.length} realistic reasoning scenarios ready.</p>
          </Card>
        </Link>
        <Link to="/practice/quiz">
          <Card className="h-full hover:border-primary/50">
            <CardTitle>Quiz</CardTitle>
            <p className="text-sm text-muted">{quizQuestions.length} questions covering Tier 1 concepts.</p>
          </Card>
        </Link>
      </div>
    </div>
  )
}
