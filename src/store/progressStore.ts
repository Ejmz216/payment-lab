import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface QuizResult {
  questionId: string
  correct: boolean
  confidence?: Confidence
  timestamp: string
}

export type Confidence = 'guess' | 'unsure' | 'confident' | 'very-confident'

export interface ScenarioResult {
  scenarioId: string
  correct: boolean
  confidence?: Confidence
  timestamp: string
}

interface ProgressState {
  completedLessons: string[]
  quizResults: QuizResult[]
  scenarioHistory: ScenarioResult[]
  messageViewed: string[]
  bookmarks: string[]
  privateSession: boolean
  completeLesson: (id: string) => void
  recordQuiz: (result: QuizResult) => void
  recordScenario: (result: ScenarioResult) => void
  viewMessage: (id: string) => void
  toggleBookmark: (id: string) => void
  setPrivateSession: (v: boolean) => void
  resetProgress: () => void
}

const initial = {
  completedLessons: [] as string[],
  quizResults: [] as QuizResult[],
  scenarioHistory: [] as ScenarioResult[],
  messageViewed: [] as string[],
  bookmarks: [] as string[],
  privateSession: false,
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initial,
      completeLesson: (id) => {
        if (get().privateSession) return
        if (get().completedLessons.includes(id)) return
        set({ completedLessons: [...get().completedLessons, id] })
      },
      recordQuiz: (result) => {
        if (get().privateSession) return
        set({ quizResults: [...get().quizResults, result] })
      },
      recordScenario: (result) => {
        if (get().privateSession) return
        set({ scenarioHistory: [...get().scenarioHistory, result] })
      },
      viewMessage: (id) => {
        if (get().privateSession) return
        if (get().messageViewed.includes(id)) return
        set({ messageViewed: [...get().messageViewed, id] })
      },
      toggleBookmark: (id) => {
        const has = get().bookmarks.includes(id)
        set({ bookmarks: has ? get().bookmarks.filter((b) => b !== id) : [...get().bookmarks, id] })
      },
      setPrivateSession: (v) => set({ privateSession: v }),
      resetProgress: () => set({ ...initial, privateSession: get().privateSession }),
    }),
    { name: 'payment-lab-progress' },
  ),
)
