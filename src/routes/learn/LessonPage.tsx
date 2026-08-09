import { Link, useParams, Navigate } from 'react-router-dom'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getFastPaymentsPath, getLessons, getScenarios } from '@/lib/i18nContent'
import { useProgressStore } from '@/store/progressStore'
import { Card, CardTitle } from '@/components/ui/Card'
import { BookmarkButton } from '@/components/ui/BookmarkButton'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ScenarioCard } from '@/components/practice/ScenarioCard'
import { LessonBlockRenderer } from '@/components/learning/LessonBlockRenderer'
import { LessonContextHeader } from '@/components/learning/LessonContextHeader'
import { StudyRail } from '@/components/learning/StudyRail'
import { CheckCircle2, ExternalLink, Map } from 'lucide-react'

export function LessonPage() {
  const { lessonId } = useParams()
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const lessons = getLessons(lang)
  const path = getFastPaymentsPath(lang)
  const lesson = lessons.find((l) => l.id === lessonId)
  const completed = useProgressStore((s) => s.completedLessons)
  const completeLesson = useProgressStore((s) => s.completeLesson)
  const isDone = lesson ? completed.includes(lesson.id) : false

  if (!lesson) return <Navigate to="/learn/fast-payments" replace />

  const scenario = lesson.scenarioId ? getScenarios(lang).find((s) => s.id === lesson.scenarioId) : undefined

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: t('nav.dashboard'), to: '/' }, { label: t('fp.title'), to: '/learn/fast-payments' }, { label: lesson.title }]} />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <Link to="/learn/fast-payments" className="flex min-h-11 items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2 text-sm lg:hidden">
          <span className="flex min-w-0 items-center gap-2"><Map size={15} className="shrink-0 text-primary" /><span className="truncate">{t('study.learningMap')}</span></span>
          <span className="shrink-0 text-xs text-muted">{t('study.lesson')} {lesson.order}</span>
        </Link>
        <div className="hidden lg:sticky lg:top-6 lg:block">
          <StudyRail path={path} lessons={lessons} activeItemId={lesson.id} />
        </div>

        <article className="flex min-w-0 flex-col gap-6">
          <LessonContextHeader path={path} lessons={lessons} lesson={lesson} />

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">{lesson.title}</h1>
              {lesson.subtitle && <p className="mt-1 text-sm text-muted">{lesson.subtitle}</p>}
            </div>
            <BookmarkButton id={`lesson:${lesson.id}`} />
          </div>

          <Card className="border-primary/30 bg-primary/5">
        <CardTitle>{t('lesson.whyMatters')}</CardTitle>
        <p className="text-sm text-text/90">{lesson.whyItMatters}</p>
          </Card>

          <Card>
        <CardTitle>{t('lesson.objectives')}</CardTitle>
        <ul className="mt-2 flex flex-col gap-1.5 text-sm">
          {lesson.objectives.map((o) => (
            <li key={o} className="flex items-start gap-2">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-success" />
              <span>{o}</span>
            </li>
          ))}
        </ul>
          </Card>

          {lesson.mentalModel && (
        <Card>
          <CardTitle>{t('lesson.mentalModel')}</CardTitle>
          <p className="text-sm italic text-text/90">{lesson.mentalModel}</p>
        </Card>
          )}

          {lesson.blocks && lesson.blocks.length > 0 ? (
        <div className="flex flex-col gap-4">
          {lesson.blocks.map((block, i) => (
            <LessonBlockRenderer key={i} block={block} />
          ))}
        </div>
          ) : (
        <div className="flex flex-col gap-4">
          {lesson.sections.map((section) => (
            <Card key={section.heading}>
              <CardTitle>{section.heading}</CardTitle>
              <p className="text-sm leading-relaxed text-text/90">{section.body}</p>
            </Card>
          ))}
        </div>
          )}

          {lesson.keyTerms.length > 0 && (
        <Card>
          <CardTitle>{t('lesson.keyTerms')}</CardTitle>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {lesson.keyTerms.map((term) => (
              <span key={term} className="rounded-full border border-border bg-surface2 px-2.5 py-1 text-xs">{term}</span>
            ))}
          </div>
        </Card>
          )}

          {lesson.commonConfusion && lesson.commonConfusion.length > 0 && (
        <Card className="border-warning/30">
          <CardTitle>{t('lesson.commonMistake')}</CardTitle>
          {lesson.commonConfusion.map((c) => (
            <div key={c.title} className="mt-1 text-sm">
              <div className="font-medium">{c.title}</div>
              <p className="text-text/90">{c.explanation}</p>
            </div>
          ))}
        </Card>
          )}

          {scenario && (
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">{t('lesson.checkYourself')}</h2>
          <ScenarioCard scenario={scenario} />
        </div>
          )}

          <Card>
        <CardTitle>{t('lesson.sources')}</CardTitle>
        <ul className="mt-1 flex flex-col gap-1 text-xs text-muted">
          {lesson.sources.map((s) => (
            <li key={s.sourceName}>
              {s.sourceReference ? (
                <a className="inline-flex items-center gap-1 text-primary hover:underline" href={s.sourceReference} target="_blank" rel="noreferrer">
                  {s.sourceName} <ExternalLink size={11} />
                </a>
              ) : s.sourceName}{' '}
              ({s.sourceType}) — {t('lesson.lastReviewed')} {s.lastReviewed}
              {s.notes ? ` — ${s.notes}` : ''}
            </li>
          ))}
        </ul>
          </Card>

          {!isDone && (
        <button
          onClick={() => completeLesson(lesson.id)}
          className="self-start rounded-md bg-success px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          {t('lesson.markComplete')}
        </button>
          )}
        </article>
      </div>
    </div>
  )
}
