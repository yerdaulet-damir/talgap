import { describe, it, expect } from 'vitest'
import { createEloState, updateElo, selectNextScenario } from '@/lib/scoring/adaptive'

describe('Elo Adaptive Engine', () => {
  it('should create initial state with default rating 1200', () => {
    const state = createEloState()
    expect(state.candidateRating).toBe(1200)
    expect(state.history).toHaveLength(0)
  })

  it('should increase rating on good performance against equal difficulty', () => {
    const state = createEloState()
    const updated = updateElo(state, 'scenario_1', 1200, 0.8)
    expect(updated.candidateRating).toBeGreaterThan(1200)
  })

  it('should decrease rating on poor performance against equal difficulty', () => {
    const state = createEloState()
    const updated = updateElo(state, 'scenario_1', 1200, 0.2)
    expect(updated.candidateRating).toBeLessThan(1200)
  })

  it('should increase rating more for beating a harder scenario', () => {
    const state = createEloState()
    const easyWin = updateElo(state, 'easy', 1000, 0.8)
    const hardWin = updateElo(state, 'hard', 1500, 0.8)
    expect(hardWin.candidateRating).toBeGreaterThan(easyWin.candidateRating)
  })

  it('should record history correctly', () => {
    let state = createEloState()
    state = updateElo(state, 's1', 1200, 0.6)
    state = updateElo(state, 's2', 1300, 0.4)
    expect(state.history).toHaveLength(2)
    expect(state.history[0].scenarioId).toBe('s1')
    expect(state.history[1].scenarioId).toBe('s2')
  })

  it('should select scenario closest to candidate rating', () => {
    const scenarios = [
      { id: 'easy', difficulty: 900 },
      { id: 'medium', difficulty: 1200 },
      { id: 'hard', difficulty: 1500 },
    ]
    const state = createEloState() // rating 1200
    const selected = selectNextScenario(scenarios, state)
    expect(selected.id).toBe('medium')
  })

  it('should not select already-used scenarios', () => {
    const scenarios = [
      { id: 'a', difficulty: 1200 },
      { id: 'b', difficulty: 1100 },
      { id: 'c', difficulty: 1300 },
    ]
    let state = createEloState()
    state = updateElo(state, 'a', 1200, 0.5) // marks 'a' as used
    const selected = selectNextScenario(scenarios, state)
    expect(selected.id).not.toBe('a')
  })
})
