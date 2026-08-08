import { Link } from 'react-router-dom'
import { Card, CardTitle } from '@/components/ui/Card'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getScenarios, getQuizQuestions } from '@/lib/i18nContent'

export function PracticeHome() {
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const scenarios = getScenarios(lang)
  const quizQuestions = getQuizQuestions(lang)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('practice.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('practice.subtitle')}</p>
      </div>
      <Link to="/practice/session">
        <Card className="border-primary/40 bg-primary/5 hover:border-primary/70">
          <CardTitle>{t('practice.session')}</CardTitle>
          <p className="text-sm text-muted">{t('practice.sessionDesc')}</p>
        </Card>
      </Link>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link to="/practice/scenarios">
          <Card className="h-full hover:border-primary/50">
            <CardTitle>{t('practice.scenarioTrainer')}</CardTitle>
            <p className="text-sm text-muted">{scenarios.length} {t('practice.scenariosReady')}</p>
          </Card>
        </Link>
        <Link to="/practice/quiz">
          <Card className="h-full hover:border-primary/50">
            <CardTitle>{t('practice.quiz')}</CardTitle>
            <p className="text-sm text-muted">{quizQuestions.length} {t('practice.quizQuestions')}</p>
          </Card>
        </Link>
      </div>
    </div>
  )
}
