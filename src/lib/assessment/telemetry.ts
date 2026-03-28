import { ResponseTelemetry } from './types'

export function calculateAuthenticityScore(telemetry: ResponseTelemetry[]): number {
  if (telemetry.length === 0) return 0.5

  let suspicionPoints = 0
  let maxPoints = 0

  for (const t of telemetry) {
    // High CPS on long responses → suspicious
    if (t.charCount > 50) {
      maxPoints += 2
      if (t.charsPerSecond > 10) suspicionPoints += 2
      else if (t.charsPerSecond > 7) suspicionPoints += 1
    }

    // Zero think time → suspicious (copy-paste)
    maxPoints += 1
    if (t.thinkTimeMs < 500 && t.charCount > 50) suspicionPoints += 1

    // Paste events → suspicious
    maxPoints += 2
    if (t.pasteEvents > 0) suspicionPoints += Math.min(t.pasteEvents, 2)

    // Tab switches during response → suspicious
    maxPoints += 1
    if (t.tabSwitches > 2) suspicionPoints += 1

    // Very low edit count on long text → suspicious (no revision = pasted)
    if (t.charCount > 200) {
      maxPoints += 1
      if (t.editCount < 3) suspicionPoints += 1
    }
  }

  // Consistency check: very similar timing across all questions → suspicious
  if (telemetry.length >= 3) {
    const times = telemetry.map(t => t.totalTimeMs)
    const mean = times.reduce((a, b) => a + b, 0) / times.length
    const variance = times.reduce((sum, t) => sum + Math.pow(t - mean, 2), 0) / times.length
    const cv = Math.sqrt(variance) / mean // coefficient of variation

    maxPoints += 2
    if (cv < 0.1) suspicionPoints += 2 // extremely uniform timing
  }

  if (maxPoints === 0) return 0.9

  // Convert suspicion to authenticity (invert)
  const suspicionRatio = suspicionPoints / maxPoints
  return Math.round((1 - suspicionRatio) * 100) / 100
}

export function createTelemetryTracker(questionId: string) {
  let startTime = 0
  let firstKeystrokeTime = 0
  let pasteEvents = 0
  let tabSwitches = 0
  let editCount = 0

  return {
    start() {
      startTime = Date.now()
    },

    onKeystroke() {
      if (firstKeystrokeTime === 0) {
        firstKeystrokeTime = Date.now()
      }
      editCount++
    },

    onPaste() {
      pasteEvents++
    },

    onTabSwitch() {
      tabSwitches++
    },

    finish(finalText: string): ResponseTelemetry {
      const submitTime = Date.now()
      const totalTimeMs = submitTime - startTime
      const thinkTimeMs = firstKeystrokeTime > 0 ? firstKeystrokeTime - startTime : totalTimeMs
      const typingTimeMs = firstKeystrokeTime > 0 ? submitTime - firstKeystrokeTime : 0
      const charCount = finalText.length
      const wordCount = finalText.trim().split(/\s+/).filter(Boolean).length
      const charsPerSecond = typingTimeMs > 0 ? charCount / (typingTimeMs / 1000) : 0

      return {
        questionId,
        startTime,
        firstKeystrokeTime: firstKeystrokeTime || startTime,
        submitTime,
        totalTimeMs,
        thinkTimeMs,
        typingTimeMs,
        charCount,
        wordCount,
        charsPerSecond: Math.round(charsPerSecond * 100) / 100,
        pasteEvents,
        tabSwitches,
        editCount,
        finalText,
      }
    },
  }
}
