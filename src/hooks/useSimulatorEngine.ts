import { useEffect, useState } from 'react'
import type { SimEvent } from '@/content/simulatorScenarios'

const STEP_INTERVAL_MS = 1400

// Step-by-step playback engine for the Simulator, kept independent of any
// rendering concerns. Auto-pauses at decision points until answered.
export function useSimulatorEngine(events: SimEvent[]) {
  const [index, setIndex] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [decisionAnswers, setDecisionAnswers] = useState<Record<number, string>>({})

  const currentEvent = index >= 0 ? events[index] : null
  const pendingDecision = currentEvent?.isDecisionPoint && decisionAnswers[index] === undefined ? currentEvent : null
  const atEnd = index >= events.length - 1

  function next() {
    if (pendingDecision) return
    setIndex((i) => Math.min(i + 1, events.length - 1))
  }

  function previous() {
    setPlaying(false)
    setIndex((i) => Math.max(i - 1, -1))
  }

  function reset() {
    setPlaying(false)
    setIndex(-1)
    setDecisionAnswers({})
  }

  function togglePlay() {
    if (atEnd) return
    setPlaying((p) => !p)
  }

  function answerDecision(eventIndex: number, optionId: string) {
    setDecisionAnswers((prev) => ({ ...prev, [eventIndex]: optionId }))
  }

  useEffect(() => {
    if (!playing) return
    if (pendingDecision) {
      setPlaying(false)
      return
    }
    if (atEnd) {
      setPlaying(false)
      return
    }
    const timer = setTimeout(() => setIndex((i) => Math.min(i + 1, events.length - 1)), STEP_INTERVAL_MS)
    return () => clearTimeout(timer)
  }, [playing, index, pendingDecision, atEnd, events.length])

  return {
    index,
    currentEvent,
    playing,
    atEnd,
    pendingDecision,
    decisionAnswers,
    next,
    previous,
    reset,
    togglePlay,
    answerDecision,
    total: events.length,
  }
}
