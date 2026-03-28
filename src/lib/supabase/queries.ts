import { getSupabase } from './client'
import { Candidate, Session, Response, Score, CandidateWithScores } from './types'
import { mockStorage } from './mock-storage'

function useMock() {
  return getSupabase() === null
}

// --- Candidates ---

export async function createCandidate(candidate: Omit<Candidate, 'id' | 'createdAt'>): Promise<Candidate> {
  if (useMock()) return mockStorage.createCandidate(candidate)

  const sb = getSupabase()!
  const { data, error } = await sb.from('candidates').insert(candidate).select().single()
  if (error) throw error
  return data
}

export async function getCandidate(id: string): Promise<Candidate | null> {
  if (useMock()) return mockStorage.getCandidate(id)

  const sb = getSupabase()!
  const { data, error } = await sb.from('candidates').select('*').eq('id', id).single()
  if (error) return null
  return data
}

export async function getAllCandidatesWithScores(): Promise<CandidateWithScores[]> {
  if (useMock()) return mockStorage.getAllCandidatesWithScores()

  const sb = getSupabase()!
  const { data: candidates } = await sb.from('candidates').select('*')
  if (!candidates) return []

  const results: CandidateWithScores[] = []
  for (const c of candidates) {
    const { data: scores } = await sb.from('scores').select('*').eq('candidateId', c.id)
    const { data: sessions } = await sb.from('sessions').select('*').eq('candidateId', c.id).limit(1)

    const dims = scores || []
    const overallScore = dims.length > 0
      ? Math.round(dims.reduce((sum, d) => sum + d.score, 0) / dims.length * 20)
      : 0

    results.push({
      ...c,
      overallScore,
      authenticityScore: 0.85,
      status: 'new',
      dimensions: dims,
      session: sessions?.[0] || undefined,
    })
  }
  return results
}

// --- Sessions ---

export async function createSession(candidateId: string): Promise<Session> {
  if (useMock()) return mockStorage.createSession(candidateId)

  const sb = getSupabase()!
  const session = {
    candidateId,
    status: 'in_progress',
    currentStep: 0,
    startedAt: new Date().toISOString(),
  }
  const { data, error } = await sb.from('sessions').insert(session).select().single()
  if (error) throw error
  return data
}

export async function updateSession(id: string, updates: Partial<Session>): Promise<void> {
  if (useMock()) return mockStorage.updateSession(id, updates)

  const sb = getSupabase()!
  await sb.from('sessions').update(updates).eq('id', id)
}

// --- Responses ---

export async function saveResponse(response: Omit<Response, 'id' | 'createdAt'>): Promise<Response> {
  if (useMock()) return mockStorage.saveResponse(response)

  const sb = getSupabase()!
  const { data, error } = await sb.from('responses').insert(response).select().single()
  if (error) throw error
  return data
}

export async function getSessionResponses(sessionId: string): Promise<Response[]> {
  if (useMock()) return mockStorage.getSessionResponses(sessionId)

  const sb = getSupabase()!
  const { data } = await sb.from('responses').select('*').eq('sessionId', sessionId)
  return data || []
}

// --- Scores ---

export async function saveScores(scores: Omit<Score, 'id' | 'createdAt'>[]): Promise<void> {
  if (useMock()) return mockStorage.saveScores(scores)

  const sb = getSupabase()!
  await sb.from('scores').insert(scores)
}

export async function getCandidateScores(candidateId: string): Promise<Score[]> {
  if (useMock()) return mockStorage.getCandidateScores(candidateId)

  const sb = getSupabase()!
  const { data } = await sb.from('scores').select('*').eq('candidateId', candidateId)
  return data || []
}
