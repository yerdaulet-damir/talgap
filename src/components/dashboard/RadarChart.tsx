'use client'

import { motion } from 'framer-motion'
import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Score } from '@/lib/supabase/types'
import { Dimension } from '@/lib/scoring/types'

interface RadarChartProps {
  scores: Score[]
  compareScores?: Score[]
  size?: number
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

export function RadarChartComponent({ scores, compareScores, size }: RadarChartProps) {
  const data = Object.entries(DIMENSION_LABELS).map(([key, label]) => {
    const primary = scores.find(s => s.dimension === key)
    const compare = compareScores?.find(s => s.dimension === key)
    return {
      dimension: label,
      score: primary?.score ?? 0,
      ...(compare ? { compare: compare.score } : {}),
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <ResponsiveContainer width="100%" height={size || 300}>
        <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: '#6b7280', fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            tickCount={6}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#010042"
            fill="#010042"
            fillOpacity={0.1}
            strokeWidth={2}
            animationDuration={800}
          />
          {compareScores && (
            <Radar
              name="Compare"
              dataKey="compare"
              stroke="#16a34a"
              fill="#16a34a"
              fillOpacity={0.05}
              strokeWidth={2}
              animationDuration={800}
            />
          )}
          <Tooltip
            contentStyle={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#010042',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
