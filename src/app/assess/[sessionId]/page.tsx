'use client'

import { useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { AssessmentShell } from '@/components/assess/AssessmentShell'
import { QuestionCard } from '@/components/assess/QuestionCard'
import { SJTScenarioCard } from '@/components/assess/SJTScenario'
import { BARTGame } from '@/components/assess/BARTGame'
import { DigitSpan } from '@/components/assess/DigitSpan'
import { VoiceRecorder } from '@/components/assess/VoiceRecorder'
import { CompletionScreen } from '@/components/assess/CompletionScreen'
import { STRUCTURED_QUESTIONS, SJT_SCENARIOS, VOICE_QUESTION } from '@/lib/assessment/scenarios'
import { ResponseTelemetry, BARTResult, DigitSpanResult, VoiceResult } from '@/lib/assessment/types'
import { Dimension } from '@/lib/scoring/types'

type StepType = 'question' | 'sjt' | 'bart' | 'digit_span' | 'voice' | 'complete'

interface Step {
  type: StepType
  id: string
}

// Build the assessment steps
const STEPS: Step[] = [
  ...STRUCTURED_QUESTIONS.map(q => ({ type: 'question' as const, id: q.id })),
  { type: 'sjt', id: 'sjt_phase' },
  { type: 'sjt', id: 'sjt_phase_2' },
  { type: 'bart', id: 'bart' },
  { type: 'digit_span', id: 'digit_span' },
  { type: 'voice', id: 'voice' },
  { type: 'complete', id: 'complete' },
]

export default function AssessmentPage() {
  const params = useParams()
  const sessionId = params.sessionId as string

  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [responses, setResponses] = useState<Array<{ stepId: string; type: string; data: Record<string, unknown>; telemetry?: ResponseTelemetry }>>([])
  const [sjtScenarioIdx, setSjtScenarioIdx] = useState(0)
  const [scores, setScores] = useState<Record<Dimension, number> | undefined>()
  const [overallScore, setOverallScore] = useState<number | undefined>()

  const currentStep = STEPS[currentStepIdx]
  const totalSteps = STEPS.length - 1 // Don't count completion as a step

  const advanceStep = useCallback(() => {
    setCurrentStepIdx(prev => prev + 1)
  }, [])

  const handleQuestionSubmit = useCallback((answer: string, telemetry: ResponseTelemetry) => {
    const question = STRUCTURED_QUESTIONS[currentStepIdx]
    setResponses(prev => [...prev, {
      stepId: question.id,
      type: 'question',
      data: { answer, questionPrompt: question.prompt },
      telemetry,
    }])
    advanceStep()
  }, [currentStepIdx, advanceStep])

  const handleSJTSubmit = useCallback((selectedOption: string, explanation: string, telemetry: ResponseTelemetry) => {
    const scenario = SJT_SCENARIOS[sjtScenarioIdx]
    setResponses(prev => [...prev, {
      stepId: scenario.id,
      type: 'sjt',
      data: { selectedOption, explanation, scenarioId: scenario.id },
      telemetry,
    }])
    setSjtScenarioIdx(prev => prev + 1)
    advanceStep()
  }, [sjtScenarioIdx, advanceStep])

  const handleBARTComplete = useCallback((result: BARTResult) => {
    setResponses(prev => [...prev, {
      stepId: 'bart',
      type: 'bart',
      data: result as unknown as Record<string, unknown>,
    }])
    advanceStep()
  }, [advanceStep])

  const handleDigitSpanComplete = useCallback((result: DigitSpanResult) => {
    setResponses(prev => [...prev, {
      stepId: 'digit_span',
      type: 'digit_span',
      data: result as unknown as Record<string, unknown>,
    }])
    advanceStep()
  }, [advanceStep])

  const handleVoiceComplete = useCallback((result: VoiceResult) => {
    setResponses(prev => [...prev, {
      stepId: 'voice',
      type: 'voice',
      data: result as unknown as Record<string, unknown>,
    }])

    // Submit all responses for scoring
    submitForScoring([...responses, {
      stepId: 'voice',
      type: 'voice',
      data: result as unknown as Record<string, unknown>,
    }])

    advanceStep()
  }, [advanceStep, responses])

  const submitForScoring = async (allResponses: typeof responses) => {
    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, responses: allResponses }),
      })
      if (res.ok) {
        const data = await res.json()
        setScores(data.dimensions)
        setOverallScore(data.overallScore)
      }
    } catch {
      // Scoring failed silently, completion screen will show demo scores
    }
  }

  if (!currentStep) return null

  if (currentStep.type === 'complete') {
    return (
      <AssessmentShell currentStep={totalSteps} totalSteps={totalSteps} stepKey="complete">
        <CompletionScreen scores={scores} overallScore={overallScore} />
      </AssessmentShell>
    )
  }

  return (
    <AssessmentShell
      currentStep={Math.min(currentStepIdx, totalSteps - 1)}
      totalSteps={totalSteps}
      stepKey={currentStep.id + currentStepIdx}
    >
      {currentStep.type === 'question' && (() => {
        const q = STRUCTURED_QUESTIONS[currentStepIdx]
        return (
          <QuestionCard
            key={q.id}
            questionId={q.id}
            prompt={q.prompt}
            placeholder={q.placeholder}
            minLength={q.minLength}
            maxLength={q.maxLength}
            onSubmit={handleQuestionSubmit}
          />
        )
      })()}

      {currentStep.type === 'sjt' && (
        <SJTScenarioCard
          key={SJT_SCENARIOS[sjtScenarioIdx]?.id}
          scenario={SJT_SCENARIOS[sjtScenarioIdx] || SJT_SCENARIOS[0]}
          onSubmit={handleSJTSubmit}
        />
      )}

      {currentStep.type === 'bart' && (
        <BARTGame onComplete={handleBARTComplete} />
      )}

      {currentStep.type === 'digit_span' && (
        <DigitSpan onComplete={handleDigitSpanComplete} />
      )}

      {currentStep.type === 'voice' && (
        <VoiceRecorder
          prompt={VOICE_QUESTION.prompt}
          onComplete={handleVoiceComplete}
        />
      )}
    </AssessmentShell>
  )
}
