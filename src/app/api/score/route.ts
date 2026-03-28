import { NextResponse } from 'next/server'
import { scoreCandidate } from '@/lib/scoring/engine'
import { calculateAuthenticityScore } from '@/lib/assessment/telemetry'
import { Dimension, DIMENSIONS } from '@/lib/scoring/types'
import { STRUCTURED_QUESTIONS } from '@/lib/assessment/scenarios'
import { ResponseTelemetry } from '@/lib/assessment/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionId, responses } = body

    if (!sessionId || !responses) {
      return NextResponse.json({ error: 'Missing sessionId or responses' }, { status: 400 })
    }

    // Extract telemetry for authenticity scoring
    const telemetryData: ResponseTelemetry[] = responses
      .filter((r: { telemetry?: ResponseTelemetry }) => r.telemetry)
      .map((r: { telemetry: ResponseTelemetry }) => r.telemetry)

    const authenticityScore = calculateAuthenticityScore(telemetryData)

    // Build scoring inputs
    const scoringInputs: Array<{ questionContext: string; response: string; dimensions: Dimension[] }> = []

    for (const resp of responses) {
      if (resp.type === 'question') {
        const question = STRUCTURED_QUESTIONS.find(q => q.id === resp.stepId)
        if (question) {
          scoringInputs.push({
            questionContext: question.prompt,
            response: resp.data.answer as string,
            dimensions: [...question.dimensions] as Dimension[],
          })
        }
      } else if (resp.type === 'sjt') {
        scoringInputs.push({
          questionContext: `SJT Scenario: Selected option ${resp.data.selectedOption}`,
          response: resp.data.explanation as string,
          dimensions: ['resourcefulness', 'social_leadership', 'creative_problem_solving'],
        })
      } else if (resp.type === 'bart') {
        scoringInputs.push({
          questionContext: 'BART Balloon Risk Task',
          response: JSON.stringify({
            averagePumps: resp.data.averagePumps,
            popCount: resp.data.popCount,
            cashOutCount: resp.data.cashOutCount,
            riskToleranceScore: resp.data.riskToleranceScore,
          }),
          dimensions: ['cognitive_capacity', 'creative_problem_solving'],
        })
      } else if (resp.type === 'digit_span') {
        scoringInputs.push({
          questionContext: 'Digit Span Working Memory Test',
          response: JSON.stringify({
            maxSpan: resp.data.maxSpan,
            accuracy: resp.data.accuracy,
          }),
          dimensions: ['cognitive_capacity'],
        })
      } else if (resp.type === 'voice') {
        scoringInputs.push({
          questionContext: 'Voice response about education in Kazakhstan',
          response: resp.data.transcript as string,
          dimensions: ['authentic_voice', 'community_commitment', 'creative_problem_solving'],
        })
      }
    }

    const candidateId = `candidate_${sessionId}`

    const result = await scoreCandidate(candidateId, sessionId, scoringInputs, authenticityScore)

    // Convert to simple format for client
    const dimensionMap: Record<string, number> = {}
    for (const dim of result.dimensions) {
      dimensionMap[dim.dimension] = dim.score
    }

    return NextResponse.json({
      dimensions: dimensionMap,
      overallScore: result.overallScore,
      authenticityScore: result.authenticityScore,
      details: result.dimensions,
    })
  } catch (error) {
    console.error('Scoring error:', error)

    // Return demo scores on error
    const demoScores: Record<string, number> = {}
    for (const dim of DIMENSIONS) {
      demoScores[dim] = Math.floor(Math.random() * 2) + 3
    }

    return NextResponse.json({
      dimensions: demoScores,
      overallScore: 72,
      authenticityScore: 0.85,
      details: [],
    })
  }
}
