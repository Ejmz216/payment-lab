import type { LearningPath, LearningPhase, Lesson, StudyModule } from '@/types/content'

export interface ResolvedStudyItem {
  id: string
  kind: 'lesson' | 'module'
  title: string
  description: string
  route: string
  estimatedMinutes: number
  complete: boolean
  truthLabel?: string
  phaseId: string
}

export interface StudyPhaseState {
  phase: LearningPhase
  items: ResolvedStudyItem[]
  completedCount: number
  availableCount: number
  plannedCount: number
  progress: number
  complete: boolean
  current: boolean
}

export interface StudyPathState {
  phases: StudyPhaseState[]
  items: ResolvedStudyItem[]
  nextItem?: ResolvedStudyItem
  currentPhase?: StudyPhaseState
  completedCount: number
  availableCount: number
  courseProgress: number
}

function resolveModule(module: StudyModule, phaseId: string, completedModules: string[]): ResolvedStudyItem {
  return {
    id: module.id,
    kind: 'module',
    title: module.title,
    description: module.description,
    route: module.route,
    estimatedMinutes: module.estimatedMinutes,
    complete: completedModules.includes(module.id),
    truthLabel: module.truthLabel,
    phaseId,
  }
}

export function buildStudyPathState(
  path: LearningPath,
  lessons: Lesson[],
  completedLessons: string[],
  completedModules: string[],
): StudyPathState {
  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]))
  const phases = path.phases.map<StudyPhaseState>((phase) => {
    const lessonItems = phase.lessonIds.flatMap<ResolvedStudyItem>((lessonId) => {
      const lesson = lessonById.get(lessonId)
      if (!lesson) return []
      return [{
        id: lesson.id,
        kind: 'lesson',
        title: lesson.title,
        description: lesson.subtitle ?? lesson.whyItMatters,
        route: `/learn/fast-payments/${lesson.id}`,
        estimatedMinutes: lesson.estimatedMinutes,
        complete: completedLessons.includes(lesson.id),
        phaseId: phase.id,
      }]
    })
    const moduleItems = (phase.modules ?? []).map((module) => resolveModule(module, phase.id, completedModules))
    const items = phase.modulesFirst ? [...moduleItems, ...lessonItems] : [...lessonItems, ...moduleItems]
    const completedCount = items.filter((item) => item.complete).length
    const availableCount = items.length

    return {
      phase,
      items,
      completedCount,
      availableCount,
      plannedCount: Math.max(phase.plannedItemCount - availableCount, 0),
      progress: availableCount ? Math.round((completedCount / availableCount) * 100) : 0,
      complete: availableCount > 0 && completedCount === availableCount,
      current: false,
    }
  })

  const items = phases.flatMap((phase) => phase.items)
  const nextItem = items.find((item) => !item.complete)
  const currentPhase = nextItem
    ? phases.find((phase) => phase.phase.id === nextItem.phaseId)
    : [...phases].reverse().find((phase) => phase.availableCount > 0)

  if (currentPhase) currentPhase.current = true

  const completedCount = items.filter((item) => item.complete).length
  const availableCount = items.length

  return {
    phases,
    items,
    nextItem,
    currentPhase,
    completedCount,
    availableCount,
    courseProgress: availableCount ? Math.round((completedCount / availableCount) * 100) : 0,
  }
}

export function getAdjacentStudyItems(state: StudyPathState, itemId: string) {
  const index = state.items.findIndex((item) => item.id === itemId)
  return {
    previous: index > 0 ? state.items[index - 1] : undefined,
    next: index >= 0 && index < state.items.length - 1 ? state.items[index + 1] : undefined,
  }
}
