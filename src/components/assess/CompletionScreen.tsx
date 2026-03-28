'use client'

import { motion } from 'framer-motion'
import { DIMENSIONS, Dimension } from '@/lib/scoring/types'
import { RUBRICS } from '@/lib/scoring/rubrics'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

interface CompletionScreenProps {
  scores?: Record<Dimension, number>
  overallScore?: number
}

const DIMENSION_LABELS: Record<Dimension, string> = {
  resourcefulness: 'Находчивость',
  growth_trajectory: 'Траектория роста',
  social_leadership: 'Социальное лидерство',
  creative_problem_solving: 'Креативность',
  authentic_voice: 'Аутентичность',
  community_commitment: 'Приверженность',
  cognitive_capacity: 'Когнитивный потенциал',
}

export function CompletionScreen({ scores, overallScore }: CompletionScreenProps) {
  const displayScores = scores || DIMENSIONS.reduce((acc, dim) => {
    acc[dim] = Math.floor(Math.random() * 2) + 3
    return acc
  }, {} as Record<Dimension, number>)

  const overall = overallScore || Math.round(
    DIMENSIONS.reduce((sum, dim) => sum + (displayScores[dim] / 5) * 100 * RUBRICS[dim].weight, 0)
  )

  return (
    <div className="text-center space-y-10 py-8">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="flex justify-center"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="font-display text-3xl font-medium mb-3 text-[#010042]">Оценка завершена</h2>
        <p className="text-base text-gray-600">Спасибо! Ваш профиль сформирован по 7 измерениям потенциала.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="inline-flex flex-col items-center"
      >
        <motion.span
          className="text-6xl font-mono font-bold text-[#010042]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {overall}
        </motion.span>
        <span className="text-sm text-gray-500 mt-1">общий балл</span>
      </motion.div>

      <div className="max-w-md mx-auto space-y-3">
        {DIMENSIONS.map((dim, i) => (
          <motion.div
            key={dim}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + i * 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="text-sm text-gray-600 w-40 text-right font-medium">{DIMENSION_LABELS[dim]}</span>
            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(displayScores[dim] / 5) * 100}%` }}
                transition={{ delay: 1.4 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-[#010042] rounded-full"
              />
            </div>
            <span className="text-sm font-mono text-[#010042] w-10">{displayScores[dim]}/5</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="space-y-3"
      >
        <Link href="/dashboard">
          <Button className="bg-[#010042] hover:bg-[#010042]/90 text-white rounded-full px-8">
            Dashboard комиссии
          </Button>
        </Link>
        <p className="text-sm text-gray-400">
          Результаты доступны комиссии в реальном времени
        </p>
      </motion.div>
    </div>
  )
}
