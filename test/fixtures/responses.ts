import { ResponseTelemetry, BARTResult, DigitSpanResult, VoiceResult } from '@/lib/assessment/types'

export const MOCK_TELEMETRY_AUTHENTIC: ResponseTelemetry = {
  questionId: 'q_001',
  startTime: 1711000000000,
  firstKeystrokeTime: 1711000005000, // 5s think time
  submitTime: 1711000120000, // 2 min total
  totalTimeMs: 120000,
  thinkTimeMs: 5000,
  typingTimeMs: 115000,
  charCount: 450,
  wordCount: 65,
  charsPerSecond: 3.91,
  pasteEvents: 0,
  tabSwitches: 0,
  editCount: 45,
  finalText: 'В нашем районе самая большая проблема — это отсутствие доступных спортивных площадок для молодёжи...',
}

export const MOCK_TELEMETRY_SUSPICIOUS: ResponseTelemetry = {
  questionId: 'q_001',
  startTime: 1711000000000,
  firstKeystrokeTime: 1711000000500, // 0.5s think time
  submitTime: 1711000015000, // 15s total
  totalTimeMs: 15000,
  thinkTimeMs: 500,
  typingTimeMs: 14500,
  charCount: 800,
  wordCount: 120,
  charsPerSecond: 55.17,
  pasteEvents: 3,
  tabSwitches: 5,
  editCount: 1,
  finalText: 'The most significant challenge facing our community is the digital divide...',
}

export const MOCK_BART_RESULT: BARTResult = {
  rounds: [
    { pumps: 12, popped: false, earned: 12, reactionTimes: [450, 380, 420, 350, 400, 370, 390, 410, 430, 360, 380, 400] },
    { pumps: 18, popped: true, earned: 0, reactionTimes: [400, 350, 380, 320, 360, 340, 350, 370, 390, 330, 340, 360, 380, 310, 300, 290, 280, 270] },
    { pumps: 8, popped: false, earned: 8, reactionTimes: [500, 450, 420, 400, 380, 360, 350, 340] },
    { pumps: 15, popped: false, earned: 15, reactionTimes: [420, 380, 360, 340, 330, 320, 310, 300, 310, 320, 330, 340, 350, 360, 370] },
    { pumps: 22, popped: true, earned: 0, reactionTimes: [380, 350, 330, 310, 290, 280, 270, 260, 250, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360] },
  ],
  totalEarned: 35,
  averagePumps: 15,
  popCount: 2,
  cashOutCount: 3,
  riskToleranceScore: 0.65,
}

export const MOCK_DIGIT_SPAN: DigitSpanResult = {
  trials: [
    { sequence: [3, 7, 2], userInput: [3, 7, 2], correct: true, reactionTimeMs: 2100 },
    { sequence: [5, 1, 8, 4], userInput: [5, 1, 8, 4], correct: true, reactionTimeMs: 2800 },
    { sequence: [9, 2, 6, 3, 7], userInput: [9, 2, 6, 3, 7], correct: true, reactionTimeMs: 3500 },
    { sequence: [4, 8, 1, 5, 9, 2], userInput: [4, 8, 1, 5, 9, 2], correct: true, reactionTimeMs: 4200 },
    { sequence: [7, 3, 6, 1, 8, 4, 2], userInput: [7, 3, 6, 1, 8, 2, 4], correct: false, reactionTimeMs: 5100 },
    { sequence: [2, 5, 9, 4, 7, 1], userInput: [2, 5, 9, 4, 7, 1], correct: true, reactionTimeMs: 4500 },
    { sequence: [8, 1, 4, 7, 2, 6, 3], userInput: [8, 1, 4, 7, 2, 6, 3], correct: true, reactionTimeMs: 5800 },
  ],
  maxSpan: 7,
  accuracy: 0.857,
  averageReactionTime: 4000,
}

export const MOCK_VOICE_RESULT: VoiceResult = {
  transcript: 'Я бы изменила подход к оценке знаний. Сейчас в Казахстане всё построено вокруг ЕНТ — одного теста который решает всё. Но один тест не может показать кто ты как человек, как ты думаешь, как решаешь проблемы. Я бы добавила проектную работу, портфолио, может быть что-то вроде того что мы сейчас проходим — интерактивные задания которые показывают как ты мыслишь а не что ты запомнил.',
  durationMs: 45000,
  wordCount: 68,
  wordsPerMinute: 90.7,
}
