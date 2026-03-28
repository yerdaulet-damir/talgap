import { NextResponse } from 'next/server'
import { saveResponse } from '@/lib/supabase/queries'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionId, candidateId, stepId, stepType, data, telemetry } = body

    const response = await saveResponse({
      sessionId,
      candidateId: candidateId || `candidate_${sessionId}`,
      stepId,
      stepType,
      data,
      telemetry,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Save response error:', error)
    return NextResponse.json({ error: 'Failed to save response' }, { status: 500 })
  }
}
