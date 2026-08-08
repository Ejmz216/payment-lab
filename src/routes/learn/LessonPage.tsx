import { useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getLessons, getScenarios } from '@/lib/i18nContent'
import { useProgressStore } from '@/store/progressStore'
import { Card, CardTitle } from '@/components/ui/Card'
import { BookmarkButton } from '@/components/ui/BookmarkButton'
import { ScenarioCard } from '@/components/practice/ScenarioCard'
import { LessonBlockRenderer } from '@/components/learning/LessonBlockRenderer'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'

export function LessonPage() {
  const { lessonId } = useParams()
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const lessons = getLessons(lang)
  const lesson = lessons.find((l) => l.id === lessonId)
  const completed = useProgressStore((s) => s.completedLessons)
  const completeLesson = useProgressStore((s) => s.completeLesson)
  const isDone = lesson ? completed.includes(lesson.id) : false

  const orderedLessons = lessons.slice().sort((a, b) => a.order - b.order)
  const idx = lesson ? orderedLessons.findIndex((l) => l.id === lesson.id) : -1
  const prev = idx > 0 ? orderedLessons[idx - 1] : undefined
  const next = idx >= 0 && idx < orderedLessons.length - 1 ? orderedLessons[idx + 1] : undefined

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [lessonId])

  if (!lesson) return <Navigate to="/learn/fast-payments" replace />

  const scenario = lesson.scenarioId ? getScenarios(lang).find((s) => s.id === lesson.scenarioId) : undefined

  return (
    <div className="flex flex-col gap-6">
      <div className="text-xs text-muted">
        <Link to="/learn/fast-payments" className="hover:text-text">{t('fp.title')}</Link>
        <span className="mx-1.5">/</span>
        {lesson.title}
      </div>

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
              {s.sourceName} ({s.sourceType}) — {t('lesson.lastReviewed')} {s.lastReviewed}
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

      <div className="flex items-center justify-between border-t border-border pt-4">
        {prev ? (
          <Link to={`/learn/fast-payments/${prev.id}`} className="flex items-center gap-1.5 text-sm text-muted hover:text-text">
            <ArrowLeft size={15} /> {prev.title}
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`/learn/fast-payments/${next.id}`} className="flex items-center gap-1.5 text-sm text-primary hover:underline">
            {next.title} <ArrowRight size={15} />
          </Link>
        ) : <span />}
      </div>
    </div>
  )
}
