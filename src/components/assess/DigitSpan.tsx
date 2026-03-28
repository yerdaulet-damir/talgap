'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { DigitSpanResult } from '@/lib/assessment/types'

interface DigitSpanProps {
  onComplete: (result: DigitSpanResult) => void
}

type Phase = 'showing' | 'recalling' | 'feedback' | 'done'

export function DigitSpan({ onComplete }: DigitSpanProps) {
  const [phase, setPhase] = useState<Phase>('showing')
  const [currentDigitIdx, setCurrentDigitIdx] = useState(0)
  const [sequence, setSequence] = useState<number[]>([])
  const [userInput, setUserInput] = useState<number[]>([])
  const [spanLength, setSpanLength] = useState(3)
  const [trials, setTrials] = useState<DigitSpanResult['trials']>([])
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null)
  const [trialCount, setTrialCount] = useState(0)
  const recallStartRef = useRef(0)
  const maxTrials = 7
  const consecutiveFailsRef = useRef(0)

  const generateSequence = useCallback((length: number) => {
    const digits: number[] = []
    for (let i = 0; i < length; i++) {
      let d: number
      do { d = Math.floor(Math.random() * 10) } while (digits[digits.length - 1] === d)
      digits.push(d)
    }
    return digits
  }, [])

  // Start a new trial
  const startTrial = useCallback(() => {
    const seq = generateSequence(spanLength)
    setSequence(seq)
    setUserInput([])
    setCurrentDigitIdx(0)
    setPhase('showing')
    setLastCorrect(null)
  }, [spanLength, generateSequence])

  useEffect(() => {
    startTrial()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Show digits one by one
  useEffect(() => {
    if (phase !== 'showing') return
    if (currentDigitIdx >= sequence.length) {
      setTimeout(() => {
        setPhase('recalling')
        recallStartRef.current = Date.now()
      }, 500)
      return
    }
    const timer = setTimeout(() => {
      setCurrentDigitIdx(prev => prev + 1)
    }, 800)
    return () => clearTimeout(timer)
  }, [phase, currentDigitIdx, sequence.length])

  const handleDigitInput = (digit: number) => {
    if (phase !== 'recalling') return
    const newInput = [...userInput, digit]
    setUserInput(newInput)

    if (newInput.length === sequence.length) {
      const reactionTime = Date.now() - recallStartRef.current
      const correct = newInput.every((d, i) => d === sequence[i])

      const trial = {
        sequence: [...sequence],
        userInput: newInput,
        correct,
        reactionTimeMs: reactionTime,
      }

      const newTrials = [...trials, trial]
      setTrials(newTrials)
      setLastCorrect(correct)
      setPhase('feedback')

      if (correct) {
        consecutiveFailsRef.current = 0
        setSpanLength(prev => prev + 1)
      } else {
        consecutiveFailsRef.current++
        setSpanLength(prev => Math.max(3, prev - 1))
      }

      const newTrialCount = trialCount + 1

      setTimeout(() => {
        if (newTrialCount >= maxTrials || consecutiveFailsRef.current >= 2) {
          const maxSpan = Math.max(...newTrials.filter(t => t.correct).map(t => t.sequence.length), 0)
          const accuracy = newTrials.filter(t => t.correct).length / newTrials.length
          const avgReaction = newTrials.reduce((sum, t) => sum + t.reactionTimeMs, 0) / newTrials.length

          onComplete({
            trials: newTrials,
            maxSpan,
            accuracy: Math.round(accuracy * 1000) / 1000,
            averageReactionTime: Math.round(avgReaction),
          })
        } else {
          setTrialCount(newTrialCount)
          startTrial()
        }
      }, 1000)
    }
  }

  return (
    <div className="space-y-6 text-center">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 font-mono bg-gray-50 px-2.5 py-0.5 rounded-full">
          Попытка {trialCount + 1} / {maxTrials}
        </span>
        <span className="text-sm font-mono text-gray-500 bg-gray-50 px-2.5 py-0.5 rounded-full">
          Длина: {spanLength} цифр
        </span>
      </div>

      {/* Display area */}
      <div className="min-h-[200px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === 'showing' && currentDigitIdx < sequence.length && (
            <motion.div
              key={`digit-${currentDigitIdx}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="text-7xl font-mono font-bold text-[#010042]"
            >
              {sequence[currentDigitIdx]}
            </motion.div>
          )}

          {phase === 'showing' && currentDigitIdx >= sequence.length && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg text-gray-400"
            >
              Запоминайте...
            </motion.p>
          )}

          {phase === 'recalling' && (
            <motion.div
              key="recall"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <p className="text-base text-gray-600">Введите цифры по порядку</p>

              {/* User input display */}
              <div className="flex items-center justify-center gap-3">
                {sequence.map((_, i) => (
                  <div
                    key={i}
                    className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-mono font-bold transition-all ${
                      userInput[i] !== undefined
                        ? 'border-[#010042] bg-[#010042]/5 text-[#010042]'
                        : 'border-gray-200 bg-gray-50 text-gray-300'
                    }`}
                  >
                    {userInput[i] !== undefined ? userInput[i] : '\u00b7'}
                  </div>
                ))}
              </div>

              {/* Digit pad */}
              <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(d => (
                  <Button
                    key={d}
                    onClick={() => handleDigitInput(d)}
                    variant="outline"
                    className="h-12 text-lg font-mono border-gray-200 bg-white text-[#010042] hover:bg-gray-50 hover:border-gray-300 rounded-xl"
                  >
                    {d}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {phase === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`text-4xl font-display font-bold ${lastCorrect ? 'text-emerald-600' : 'text-red-500'}`}
            >
              {lastCorrect ? 'Верно!' : 'Не совсем'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
        Цифры появляются по одной. Запомните последовательность и введите её в том же порядке.
        Сложность растёт с каждой верной попыткой.
      </p>
    </div>
  )
}
