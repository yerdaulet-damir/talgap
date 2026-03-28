'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Shield, Keyboard } from 'lucide-react'
import { createTelemetryTracker } from '@/lib/assessment/telemetry'
import { ResponseTelemetry } from '@/lib/assessment/types'

interface QuestionCardProps {
  questionId: string
  prompt: string
  placeholder?: string
  minLength?: number
  maxLength?: number
  onSubmit: (answer: string, telemetry: ResponseTelemetry) => void
}

const EXAMPLE_HINTS: Record<string, string> = {
  q_001: 'Например: «В нашем дворе нет детской площадки. На 50,000 тенге я бы купил материалы и организовал субботник с соседями...»',
  q_002: 'Например: «На олимпиаде по физике мы с командой неправильно распределили время. Я взял на себя координацию и...»',
  q_003: 'Например: «Я выбрал inVision U потому что хочу не просто получить диплом, а научиться запускать проекты...»',
}

export function QuestionCard({
  questionId,
  prompt,
  placeholder = 'Напишите ваш ответ...',
  minLength = 50,
  maxLength = 1500,
  onSubmit,
}: QuestionCardProps) {
  const [answer, setAnswer] = useState('')
  const trackerRef = useRef(createTelemetryTracker(questionId))
  const startedRef = useRef(false)

  useEffect(() => {
    if (!startedRef.current) {
      trackerRef.current = createTelemetryTracker(questionId)
      trackerRef.current.start()
      startedRef.current = true
    }
  }, [questionId])

  // Tab visibility tracking
  useEffect(() => {
    const handler = () => {
      if (document.hidden) {
        trackerRef.current.onTabSwitch()
      }
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [])

  const handleKeyDown = useCallback(() => {
    trackerRef.current.onKeystroke()
  }, [])

  const handlePaste = useCallback(() => {
    trackerRef.current.onPaste()
  }, [])

  const handleSubmit = () => {
    if (answer.length < minLength) return
    const telemetry = trackerRef.current.finish(answer)
    onSubmit(answer, telemetry)
  }

  const charCount = answer.length
  const isValid = charCount >= minLength
  const hint = EXAMPLE_HINTS[questionId]

  return (
    <div className="flex flex-col">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-display text-2xl md:text-3xl font-medium leading-snug text-[#010042] mb-6"
      >
        {prompt}
      </motion.h2>

      {/* Example hint */}
      {hint && answer.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#010042]/[0.03] border border-[#010042]/10 rounded-xl px-4 py-3 mb-4"
        >
          <p className="text-sm text-gray-500 leading-relaxed">{hint}</p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-3"
      >
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          className="min-h-[160px] max-h-[40vh] bg-white border-gray-200 focus:border-[#010042] text-[#010042] placeholder:text-gray-300 resize-none text-base leading-relaxed p-5 rounded-2xl shadow-sm"
        />
      </motion.div>

      {/* Bottom bar: telemetry indicator + char count + button — always visible */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between gap-4 py-3 sticky bottom-0 bg-white"
      >
        <div className="flex items-center gap-4">
          <span className={`text-sm font-mono ${charCount < minLength ? 'text-gray-400' : 'text-emerald-600'}`}>
            {charCount} / {maxLength}
            {charCount < minLength && (
              <span className="text-gray-400 ml-1">(мин. {minLength})</span>
            )}
          </span>
          <span className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400">
            <Keyboard className="w-3.5 h-3.5" />
            <span>tracked</span>
          </span>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          className="bg-[#010042] hover:bg-[#010042]/90 text-white rounded-full gap-2 px-6 disabled:opacity-30 shrink-0"
        >
          Продолжить
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  )
}
