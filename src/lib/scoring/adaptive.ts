// Elo-based adaptive difficulty engine
// Used for SJT scenario selection

const K_FACTOR = 32
const DEFAULT_RATING = 1200

export interface EloState {
  candidateRating: number
  history: Array<{
    scenarioId: string
    scenarioDifficulty: number
    score: number // 0-1 normalized
    newRating: number
  }>
}

export function createEloState(): EloState {
  return {
    candidateRating: DEFAULT_RATING,
    history: [],
  }
}

function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
}

export function updateElo(
  state: EloState,
  scenarioId: string,
  scenarioDifficulty: number,
  normalizedScore: number, // 0-1
): EloState {
  const expected = expectedScore(state.candidateRating, scenarioDifficulty)
  const newRating = state.candidateRating + K_FACTOR * (normalizedScore - expected)

  return {
    candidateRating: Math.round(newRating),
    history: [
      ...state.history,
      {
        scenarioId,
        scenarioDifficulty,
        score: normalizedScore,
        newRating: Math.round(newRating),
      },
    ],
  }
}

export function selectNextScenario<T extends { id: string; difficulty: number }>(
  scenarios: T[],
  state: EloState,
): T {
  const usedIds = new Set(state.history.map(h => h.scenarioId))
  const available = scenarios.filter(s => !usedIds.has(s.id))

  if (available.length === 0) {
    return scenarios[0] // fallback: repeat if exhausted
  }

  // Select scenario closest to candidate's current rating
  return available.reduce((best, s) =>
    Math.abs(s.difficulty - state.candidateRating) < Math.abs(best.difficulty - state.candidateRating) ? s : best,
  )
}
