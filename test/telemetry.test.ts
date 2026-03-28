import { describe, it, expect } from 'vitest'
import { calculateAuthenticityScore } from '@/lib/assessment/telemetry'
import { MOCK_TELEMETRY_AUTHENTIC, MOCK_TELEMETRY_SUSPICIOUS } from './fixtures/responses'

describe('Authenticity Score', () => {
  it('should return high score for authentic responses', () => {
    const score = calculateAuthenticityScore([MOCK_TELEMETRY_AUTHENTIC])
    expect(score).toBeGreaterThan(0.7)
  })

  it('should return low score for suspicious responses', () => {
    const score = calculateAuthenticityScore([MOCK_TELEMETRY_SUSPICIOUS])
    expect(score).toBeLessThan(0.5)
  })

  it('should handle empty telemetry', () => {
    const score = calculateAuthenticityScore([])
    expect(score).toBe(0.5)
  })

  it('should detect paste events as suspicious', () => {
    const noPaste = calculateAuthenticityScore([{ ...MOCK_TELEMETRY_AUTHENTIC, pasteEvents: 0 }])
    const withPaste = calculateAuthenticityScore([{ ...MOCK_TELEMETRY_AUTHENTIC, pasteEvents: 3 }])
    expect(withPaste).toBeLessThan(noPaste)
  })

  it('should detect high CPS as suspicious', () => {
    const normalCPS = calculateAuthenticityScore([{ ...MOCK_TELEMETRY_AUTHENTIC, charsPerSecond: 4 }])
    const highCPS = calculateAuthenticityScore([{ ...MOCK_TELEMETRY_AUTHENTIC, charsPerSecond: 15 }])
    expect(highCPS).toBeLessThan(normalCPS)
  })
})
