'use client'

import { motion } from 'framer-motion'
import { Score } from '@/lib/supabase/types'
import { RUBRICS } from '@/lib/scoring/rubrics'
import { Dimension } from '@/lib/scoring/types'

interface WaterfallChartProps {
  scores: Score[]
  overallScore: number
}

const DIMENSION_LABELS: Record<Dimension, string> = {
  resourcefulness: 'Resourcefulness',
  growth_trajectory: 'Growth',
  social_leadership: 'Leadership',
  creative_problem_solving: 'Creativity',
  authentic_voice: 'Authenticity',
  community_commitment: 'Community',
  cognitive_capacity: 'Cognitive',
}

export function WaterfallChart({ scores, overallScore }: WaterfallChartProps) {
  let cumulative = 0
  const bars = scores.map(s => {
    const dim = s.dimension as Dimension
    const weight = RUBRICS[dim]?.weight || 0.14
    const contribution = (s.score / 5) * 100 * weight
    const start = cumulative
    cumulative += contribution
    return {
      dimension: DIMENSION_LABELS[dim] || dim,
      contribution: Math.round(contribution * 10) / 10,
      start,
      end: cumulative,
      score: s.score,
      reasoning: s.reasoning,
      isPositive: s.score >= 3,
    }
  })

  const maxValue = Math.max(cumulative + 10, 100)

  return (
    <div className="space-y-2">
      {bars.map((bar, i) => (
        <motion.div
          key={bar.dimension}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="group relative"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-24 text-right shrink-0">{bar.dimension}</span>
            <div className="flex-1 h-7 bg-gray-100 rounded relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(bar.contribution / maxValue) * 100}%` }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
                className="h-full rounded"
                style={{
                  marginLeft: `${(bar.start / maxValue) * 100}%`,
                  backgroundColor: bar.isPositive ? '#010042' : '#dc2626',
                  opacity: bar.isPositive ? 0.7 : 0.5,
                }}
              />
            </div>
            <span className="text-xs font-mono text-gray-500 w-14 text-right shrink-0">
              +{bar.contribution}
            </span>
          </div>

          {/* Hover tooltip */}
          <div className="absolute left-28 top-8 z-10 hidden group-hover:block bg-white border border-gray-100 rounded-xl p-3 max-w-xs shadow-lg">
            <p className="text-xs text-[#010042] font-medium mb-1">{bar.dimension}: {bar.score}/5</p>
            <p className="text-xs text-gray-500 leading-relaxed">{bar.reasoning}</p>
          </div>
        </motion.div>
      ))}

      {/* Total */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        <span className="text-xs font-medium text-[#010042] w-24 text-right">Total</span>
        <div className="flex-1" />
        <span className="text-sm font-mono font-bold text-[#010042] w-14 text-right">{overallScore}</span>
      </div>
    </div>
  )
}
