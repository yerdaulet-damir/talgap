import { mockStorage } from './mock-storage'
import { DEMO_CANDIDATES } from '../../../test/fixtures/candidates'

let seeded = false

export function seedDemoData() {
  if (seeded) return
  seeded = true

  for (const { candidate, scores, authenticityScore, status } of DEMO_CANDIDATES) {
    mockStorage.seedCandidate(candidate, scores, authenticityScore, status)
  }
}
