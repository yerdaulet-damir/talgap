import { Candidate, Session, Response, Score, CandidateWithScores } from './types'

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// In-memory storage
const candidates = new Map<string, Candidate>()
const sessions = new Map<string, Session>()
const responses = new Map<string, Response[]>()
const scores = new Map<string, Score[]>()
const candidateStatuses = new Map<string, CandidateWithScores['status']>()
const candidateAuthScores = new Map<string, number>()

export const mockStorage = {
  createCandidate(data: Omit<Candidate, 'id' | 'createdAt'>): Candidate {
    const candidate: Candidate = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    candidates.set(candidate.id, candidate)
    return candidate
  },

  getCandidate(id: string): Candidate | null {
    return candidates.get(id) || null
  },

  getAllCandidatesWithScores(): CandidateWithScores[] {
    const result: CandidateWithScores[] = []
    for (const [id, candidate] of candidates) {
      const dims = scores.get(id) || []
      const overallScore = dims.length > 0
        ? Math.round(dims.reduce((sum, d) => sum + d.score, 0) / dims.length * 20)
        : 0

      // Find session
      let session: Session | undefined
      for (const s of sessions.values()) {
        if (s.candidateId === id) { session = s; break }
      }

      result.push({
        ...candidate,
        overallScore,
        authenticityScore: candidateAuthScores.get(id) ?? 0.85,
        status: candidateStatuses.get(id) ?? 'new',
        dimensions: dims,
        session,
      })
    }
    return result.sort((a, b) => b.overallScore - a.overallScore)
  },

  createSession(candidateId: string): Session {
    const session: Session = {
      id: generateId(),
      candidateId,
      status: 'in_progress',
      currentStep: 0,
      startedAt: new Date().toISOString(),
    }
    sessions.set(session.id, session)
    return session
  },

  updateSession(id: string, updates: Partial<Session>): void {
    const session = sessions.get(id)
    if (session) {
      Object.assign(session, updates)
    }
  },

  saveResponse(data: Omit<Response, 'id' | 'createdAt'>): Response {
    const response: Response = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    const list = responses.get(data.sessionId) || []
    list.push(response)
    responses.set(data.sessionId, list)
    return response
  },

  getSessionResponses(sessionId: string): Response[] {
    return responses.get(sessionId) || []
  },

  saveScores(newScores: Omit<Score, 'id' | 'createdAt'>[]): void {
    for (const s of newScores) {
      const score: Score = {
        ...s,
        id: generateId(),
        createdAt: new Date().toISOString(),
      }
      const list = scores.get(s.candidateId) || []
      list.push(score)
      scores.set(s.candidateId, list)
    }
  },

  getCandidateScores(candidateId: string): Score[] {
    return scores.get(candidateId) || []
  },

  // Helper for seeding
  seedCandidate(candidate: Candidate, dims: Score[], authScore: number, status: CandidateWithScores['status']): void {
    candidates.set(candidate.id, candidate)
    scores.set(candidate.id, dims)
    candidateAuthScores.set(candidate.id, authScore)
    candidateStatuses.set(candidate.id, status)
  },
}
