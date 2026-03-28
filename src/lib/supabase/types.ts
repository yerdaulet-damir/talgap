export interface Candidate {
  id: string
  name: string
  email?: string
  phone?: string
  region: string
  city: string
  school: string
  schoolType: 'general' | 'lyceum' | 'gymnasium' | 'nazarbayev' | 'other'
  language: 'ru' | 'kz' | 'en'
  gender?: 'male' | 'female' | 'other'
  createdAt: string
}

export interface Session {
  id: string
  candidateId: string
  status: 'in_progress' | 'completed' | 'abandoned'
  currentStep: number
  startedAt: string
  completedAt?: string
}

export interface Response {
  id: string
  sessionId: string
  candidateId: string
  stepId: string
  stepType: string
  data: Record<string, unknown>
  telemetry?: Record<string, unknown>
  createdAt: string
}

export interface Score {
  id: string
  candidateId: string
  sessionId: string
  dimension: string
  score: number
  reasoning: string
  evidence: string[]
  confidence: number
  createdAt: string
}

export interface CandidateWithScores extends Candidate {
  overallScore: number
  authenticityScore: number
  status: 'new' | 'reviewed' | 'shortlisted' | 'flagged' | 'rejected'
  dimensions: Score[]
  session?: Session
}
