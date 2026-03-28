import { describe, it, expect } from 'vitest'
import { RUBRICS, getRubricPrompt } from '@/lib/scoring/rubrics'
import { DIMENSIONS } from '@/lib/scoring/types'

describe('Scoring Rubrics', () => {
  it('should have rubrics for all 7 dimensions', () => {
    expect(Object.keys(RUBRICS)).toHaveLength(7)
    for (const dim of DIMENSIONS) {
      expect(RUBRICS[dim]).toBeDefined()
    }
  })

  it('should have 5 levels per rubric', () => {
    for (const dim of DIMENSIONS) {
      const rubric = RUBRICS[dim]
      expect(Object.keys(rubric.levels)).toHaveLength(5)
      for (let i = 1; i <= 5; i++) {
        expect(rubric.levels[i as 1 | 2 | 3 | 4 | 5]).toBeTruthy()
      }
    }
  })

  it('should have weights summing to 1.0', () => {
    const totalWeight = DIMENSIONS.reduce((sum, dim) => sum + RUBRICS[dim].weight, 0)
    expect(totalWeight).toBeCloseTo(1.0, 2)
  })

  it('should generate valid rubric prompts', () => {
    for (const dim of DIMENSIONS) {
      const prompt = getRubricPrompt(dim)
      expect(prompt).toContain(dim)
      expect(prompt).toContain('1:')
      expect(prompt).toContain('5:')
      expect(prompt).toContain('chain-of-thought')
    }
  })
})
