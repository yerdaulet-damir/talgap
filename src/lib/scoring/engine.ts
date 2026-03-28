import { getLLM } from '../llm'
import { Message } from '../llm/types'
import { Dimension, DimensionScore, CandidateScore, DIMENSIONS, dimensionScoreSchema } from './types'
import { RUBRICS, getRubricPrompt } from './rubrics'

const SCORING_PASSES = 3

export async function scoreDimension(
  dimension: Dimension,
  candidateResponse: string,
  questionContext: string,
): Promise<DimensionScore> {
  const llm = getLLM()
  const rubricPrompt = getRubricPrompt(dimension)

  const scores: Array<{ score: number; reasoning: string; evidence: string[]; confidence: number }> = []

  for (let pass = 0; pass < SCORING_PASSES; pass++) {
    const messages: Message[] = [
      {
        role: 'system',
        content: `You are an expert assessment evaluator for inVision U, an innovative university in Kazakhstan. You evaluate candidate responses using rigorous, research-backed rubrics. Be fair, consistent, and evidence-based.\n\n${rubricPrompt}`,
      },
      {
        role: 'user',
        content: `Question/Context: ${questionContext}\n\nCandidate's Response: ${candidateResponse}\n\nEvaluate this response for the dimension "${dimension}" using the rubric above. Return JSON with: score (1-5), reasoning (string), evidence (array of strings), confidence (0-1).`,
      },
    ]

    try {
      const result = await llm.chatJSON(messages, dimensionScoreSchema, { temperature: 0.3 + pass * 0.1 })
      scores.push(result)
    } catch {
      scores.push({ score: 3, reasoning: 'Scoring pass failed, using default.', evidence: [], confidence: 0.3 })
    }
  }

  const avgScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length
  const avgConfidence = scores.reduce((sum, s) => sum + s.confidence, 0) / scores.length
  const allEvidence = [...new Set(scores.flatMap(s => s.evidence))]
  const bestReasoning = scores.reduce((best, s) => s.reasoning.length > best.length ? s.reasoning : best, '')

  return {
    dimension,
    score: Math.round(avgScore * 10) / 10,
    reasoning: bestReasoning,
    evidence: allEvidence.slice(0, 5),
    confidence: Math.round(avgConfidence * 100) / 100,
  }
}

export async function scoreCandidate(
  candidateId: string,
  sessionId: string,
  responses: Array<{ questionContext: string; response: string; dimensions: Dimension[] }>,
  authenticityScore: number,
): Promise<CandidateScore> {
  const dimensionScores: DimensionScore[] = []

  // Group responses by dimension
  const dimensionResponses = new Map<Dimension, Array<{ questionContext: string; response: string }>>()

  for (const resp of responses) {
    for (const dim of resp.dimensions) {
      if (!dimensionResponses.has(dim)) {
        dimensionResponses.set(dim, [])
      }
      dimensionResponses.get(dim)!.push({ questionContext: resp.questionContext, response: resp.response })
    }
  }

  // Score each dimension
  for (const dimension of DIMENSIONS) {
    const relevantResponses = dimensionResponses.get(dimension)
    if (relevantResponses && relevantResponses.length > 0) {
      const combinedContext = relevantResponses.map(r => r.questionContext).join('\n---\n')
      const combinedResponse = relevantResponses.map(r => r.response).join('\n---\n')
      const score = await scoreDimension(dimension, combinedResponse, combinedContext)
      dimensionScores.push(score)
    } else {
      dimensionScores.push({
        dimension,
        score: 3,
        reasoning: 'No relevant response data for this dimension.',
        evidence: [],
        confidence: 0.2,
      })
    }
  }

  // Calculate weighted overall score (0-100)
  const overallScore = dimensionScores.reduce((sum, ds) => {
    const weight = RUBRICS[ds.dimension].weight
    return sum + (ds.score / 5) * 100 * weight
  }, 0)

  return {
    candidateId,
    sessionId,
    dimensions: dimensionScores,
    overallScore: Math.round(overallScore),
    authenticityScore,
    timestamp: new Date().toISOString(),
  }
}
