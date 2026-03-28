import { z } from 'zod'

export const DIMENSIONS = [
  'resourcefulness',
  'growth_trajectory',
  'social_leadership',
  'creative_problem_solving',
  'authentic_voice',
  'community_commitment',
  'cognitive_capacity',
] as const

export type Dimension = (typeof DIMENSIONS)[number]

export interface RubricLevel {
  score: number
  description: string
}

export interface Rubric {
  dimension: Dimension
  description: string
  levels: Record<1 | 2 | 3 | 4 | 5, string>
  weight: number
}

export interface DimensionScore {
  dimension: Dimension
  score: number          // 1-5
  reasoning: string
  evidence: string[]
  confidence: number     // 0-1
}

export interface CandidateScore {
  candidateId: string
  sessionId: string
  dimensions: DimensionScore[]
  overallScore: number   // weighted 0-100
  authenticityScore: number // 0-1
  timestamp: string
}

// Zod schemas for LLM structured output
export const dimensionScoreSchema = z.object({
  score: z.number().min(1).max(5),
  reasoning: z.string(),
  evidence: z.array(z.string()),
  confidence: z.number().min(0).max(1),
})

export type DimensionScoreOutput = z.infer<typeof dimensionScoreSchema>
