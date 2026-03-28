import { Dimension } from '../scoring/types'

export type AssessmentStepType = 'question' | 'sjt' | 'bart' | 'digit_span' | 'voice'

export interface AssessmentStep {
  id: string
  type: AssessmentStepType
  title: string
  description?: string
  estimatedMinutes: number
  dimensions: Dimension[]
}

export interface QuestionStep extends AssessmentStep {
  type: 'question'
  prompt: string
  placeholder?: string
  minLength?: number
  maxLength?: number
}

export interface SJTOption {
  id: string
  text: string
  expertScore: number // 1-5
}

export interface SJTScenario {
  id: string
  difficulty: number // Elo rating
  language: 'ru' | 'kz' | 'en'
  situation: string
  options: SJTOption[]
  followUp: string
  scoringDimensions: Dimension[]
}

export interface SJTStep extends AssessmentStep {
  type: 'sjt'
  scenario: SJTScenario
}

export interface BARTResult {
  rounds: Array<{
    pumps: number
    popped: boolean
    earned: number
    reactionTimes: number[]
  }>
  totalEarned: number
  averagePumps: number
  popCount: number
  cashOutCount: number
  riskToleranceScore: number
}

export interface DigitSpanResult {
  trials: Array<{
    sequence: number[]
    userInput: number[]
    correct: boolean
    reactionTimeMs: number
  }>
  maxSpan: number
  accuracy: number
  averageReactionTime: number
}

export interface VoiceResult {
  audioUrl?: string
  transcript: string
  durationMs: number
  wordCount: number
  wordsPerMinute: number
}

export interface ResponseTelemetry {
  questionId: string
  startTime: number
  firstKeystrokeTime: number
  submitTime: number
  totalTimeMs: number
  thinkTimeMs: number
  typingTimeMs: number
  charCount: number
  wordCount: number
  charsPerSecond: number
  pasteEvents: number
  tabSwitches: number
  editCount: number
  finalText: string
}

export interface AssessmentSession {
  id: string
  candidateId: string
  status: 'in_progress' | 'completed' | 'abandoned'
  currentStepIndex: number
  startedAt: string
  completedAt?: string
  responses: AssessmentResponse[]
}

export interface AssessmentResponse {
  stepId: string
  stepType: AssessmentStepType
  data: Record<string, unknown>
  telemetry?: ResponseTelemetry
  timestamp: string
}
