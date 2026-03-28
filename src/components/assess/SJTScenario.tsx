'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Check } from 'lucide-react'
import { SJTScenario as SJTScenarioType } from '@/lib/assessment/types'
import { createTelemetryTracker } from '@/lib/assessment/telemetry'
import { ResponseTelemetry } from '@/lib/assessment/types'

interface SJTScenarioProps {
  scenario: SJTScenarioType
  onSubmit: (selectedOption: string, explanation: string, telemetry: ResponseTelemetry) => void
}

export function SJTScenarioCard({ scenario, onSubmit }: SJTScenarioProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [explanation, setExplanation] = useState('')
  const [showFollowUp, setShowFollowUp] = useState(false)
  const trackerRef = useRef(createTelemetryTracker(scenario.id))
  const startedRef = useRef(false)

  useEffect(() => {
    if (!startedRef.current) {
      trackerRef.current = createTelemetryTracker(scenario.id)
      trackerRef.current.start()
      startedRef.current = true
    }
  }, [scenario.id])

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId)
    trackerRef.current.onKeystroke()
    setShowFollowUp(true)
  }

  const handleSubmit = () => {
    if (!selectedOption || explanation.length < 20) return
    const telemetry = trackerRef.current.finish(`Option: ${selectedOption}. ${explanation}`)
    onSubmit(selectedOption, explanation, telemetry)
  }

  const isValid = selectedOption && explanation.length >= 20

  return (
    <div className="flex flex-col">
      {/* Situation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-6"
      >
        <p className="text-sm text-[#010042] uppercase tracking-wider mb-3 font-semibold">Ситуация</p>
        <p className="text-base leading-relaxed text-[#010042]">{scenario.situation}</p>
      </motion.div>

      {/* Options */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-3 mb-6"
      >
        <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Что бы вы сделали?</p>
        {scenario.options.map((option, i) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            onClick={() => handleOptionSelect(option.id)}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 ${
              selectedOption === option.id
                ? 'border-[#010042] bg-[#010042]/5 text-[#010042] shadow-sm'
                : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:text-[#010042]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-semibold mt-0.5 ${
                selectedOption === option.id
                  ? 'border-[#010042] bg-[#010042] text-white'
                  : 'border-gray-200 text-gray-400'
              }`}>
                {selectedOption === option.id ? <Check className="w-3.5 h-3.5" /> : option.id.toUpperCase()}
              </div>
              <span className={`text-sm leading-relaxed ${selectedOption === option.id ? 'font-medium' : ''}`}>
                {option.text}
              </span>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Follow-up explanation */}
      {showFollowUp && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="space-y-3 mb-3"
        >
          <p className="text-base text-gray-600">{scenario.followUp}</p>
          <Textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            onKeyDown={() => trackerRef.current.onKeystroke()}
            onPaste={() => trackerRef.current.onPaste()}
            placeholder="Объясните ваш выбор..."
            className="min-h-[100px] max-h-[30vh] bg-white border-gray-200 focus:border-[#010042] text-[#010042] placeholder:text-gray-300 resize-none text-base leading-relaxed p-4 rounded-2xl shadow-sm"
          />
          <p className="text-sm text-gray-400">
            {explanation.length < 20
              ? `Ещё ${20 - explanation.length} символов`
              : 'Готово'}
          </p>
        </motion.div>
      )}

      {/* Sticky submit button */}
      {showFollowUp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end py-3 sticky bottom-0 bg-white"
        >
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="bg-[#010042] hover:bg-[#010042]/90 text-white rounded-full gap-2 px-6 disabled:opacity-30"
          >
            Продолжить
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </div>
  )
}
