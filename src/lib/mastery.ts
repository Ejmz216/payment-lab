import { quizQuestions as quizEn, scenarios as scenariosEn } from '@/content/scenarios'
import type { Lesson } from '@/types/content'
import type { QuizResult, ScenarioResult } from '@/store/progressStore'

export type MasteryStatus = 'not-started' | 'learning' | 'practicing' | 'mastered'

export interface TopicMastery {
  id: string
  label: string
  mastery: number
  status: MasteryStatus
  hasPractice: boolean
}

// Mastery blends whichever signals actually exist for a topic (lesson
// completion, quiz accuracy, scenario accuracy) with equal weight, and never
// claims false precision — a topic with no practice data is either 0
// (not started) or 100 (lesson completed, nothing else known yet).
export function computeTopicMastery(
  lesson: Lesson,
  completedLessons: string[],
  quizResults: QuizResult[],
  scenarioHistory: ScenarioResult[],
): TopicMastery {
  const signals: number[] = []
  const completed = completedLessons.includes(lesson.id)
  signals.push(completed ? 100 : 0)

  const topicQuizIds = quizEn.filter((q) => q.conceptIds?.includes(lesson.id)).map((q) => q.id)
  const quizAnswers = quizResults.filter((r) => topicQuizIds.includes(r.questionId))
  let hasPractice = false
  if (quizAnswers.length > 0) {
    hasPractice = true
    const correct = quizAnswers.filter((r) => r.correct).length
    signals.push(Math.round((correct / quizAnswers.length) * 100))
  }

  const topicScenarioIds = scenariosEn.filter((s) => s.tags.includes(lesson.id)).map((s) => s.id)
  const scenarioAnswers = scenarioHistory.filter((r) => topicScenarioIds.includes(r.scenarioId))
  if (scenarioAnswers.length > 0) {
    hasPractice = true
    const correct = scenarioAnswers.filter((r) => r.correct).length
    signals.push(Math.round((correct / scenarioAnswers.length) * 100))
  }

  const mastery = Math.round(signals.reduce((a, b) => a + b, 0) / signals.length)

  let status: MasteryStatus
  if (!completed && !hasPractice) status = 'not-started'
  else if (mastery >= 80) status = 'mastered'
  else if (hasPractice) status = 'practicing'
  else status = 'learning'

  return { id: lesson.id, label: lesson.title, mastery, status, hasPractice }
}

export function computeAllTopicMastery(
  lessons: Lesson[],
  completedLessons: string[],
  quizResults: QuizResult[],
  scenarioHistory: ScenarioResult[],
): TopicMastery[] {
  return lessons
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((l) => computeTopicMastery(l, completedLessons, quizResults, scenarioHistory))
}
