'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RadarChartComponent } from '@/components/dashboard/RadarChart'
import { SuspicionBadge } from '@/components/dashboard/SuspicionBadge'
import { CandidateWithScores } from '@/lib/supabase/types'
import { seedDemoData } from '@/lib/supabase/seed'
import { getAllCandidatesWithScores } from '@/lib/supabase/queries'
import { Card } from '@/components/ui/card'
import { Dimension, DIMENSIONS } from '@/lib/scoring/types'

const DIMENSION_LABELS: Record<Dimension, string> = {
  resourcefulness: 'Resourcefulness',
  growth_trajectory: 'Growth',
  social_leadership: 'Leadership',
  creative_problem_solving: 'Creativity',
  authentic_voice: 'Authenticity',
  community_commitment: 'Community',
  cognitive_capacity: 'Cognitive',
}

export default function ComparePage() {
  const [candidates, setCandidates] = useState<CandidateWithScores[]>([])
  const [selectedA, setSelectedA] = useState<string>('')
  const [selectedB, setSelectedB] = useState<string>('')

  useEffect(() => {
    seedDemoData()
    getAllCandidatesWithScores().then(data => {
      setCandidates(data)
      if (data.length >= 2) {
        setSelectedA(data[0].id)
        setSelectedB(data[1].id)
      }
    })
  }, [])

  const candidateA = candidates.find(c => c.id === selectedA)
  const candidateB = candidates.find(c => c.id === selectedB)

  return (
    <div className="p-8 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl font-medium text-[#010042]">Сравнение кандидатов</h1>
        <p className="text-sm text-gray-400 mt-1">Side-by-side анализ по всем измерениям</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <select
          value={selectedA}
          onChange={(e) => setSelectedA(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#010042] focus:border-[#010042] outline-none shadow-sm"
        >
          {candidates.map(c => (
            <option key={c.id} value={c.id}>{c.name} — {c.overallScore}</option>
          ))}
        </select>
        <select
          value={selectedB}
          onChange={(e) => setSelectedB(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#010042] focus:border-[#010042] outline-none shadow-sm"
        >
          {candidates.map(c => (
            <option key={c.id} value={c.id}>{c.name} — {c.overallScore}</option>
          ))}
        </select>
      </div>

      {candidateA && candidateB && (
        <div className="space-y-6">
          <Card className="bg-white border-t border-gray-100 p-6 rounded-2xl">
            <div className="flex items-center justify-center gap-8 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#010042]" />
                <span className="text-sm text-gray-500">{candidateA.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600" />
                <span className="text-sm text-gray-500">{candidateB.name}</span>
              </div>
            </div>
            <RadarChartComponent
              scores={candidateA.dimensions}
              compareScores={candidateB.dimensions}
              size={400}
            />
          </Card>

          <Card className="bg-white border-t border-gray-100 p-6 rounded-2xl">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-4 font-semibold">Сравнение по измерениям</p>
            <div className="space-y-3">
              {DIMENSIONS.map(dim => {
                const scoreA = candidateA.dimensions.find(d => d.dimension === dim)?.score ?? 0
                const scoreB = candidateB.dimensions.find(d => d.dimension === dim)?.score ?? 0
                const delta = scoreA - scoreB

                return (
                  <div key={dim} className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 w-28 text-right">{DIMENSION_LABELS[dim]}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-[#010042] rounded-full" style={{ width: `${(scoreA / 5) * 100}%` }} />
                      </div>
                      <span className="text-xs font-mono text-[#010042] w-6">{scoreA}</span>
                    </div>
                    <div className="w-12 text-center">
                      <span className={`text-xs font-mono font-bold ${delta > 0 ? 'text-[#010042]' : delta < 0 ? 'text-green-600' : 'text-gray-300'}`}>
                        {delta > 0 ? `+${delta}` : delta === 0 ? '=' : delta}
                      </span>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-xs font-mono text-green-600 w-6 text-right">{scoreB}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-green-600 rounded-full" style={{ width: `${(scoreB / 5) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-3xl font-mono font-bold text-[#010042]">{candidateA.overallScore}</p>
                <p className="text-xs text-gray-400 mt-1">Общий балл</p>
                <SuspicionBadge score={candidateA.authenticityScore} showLabel={false} />
              </div>
              <div className="text-center">
                <p className="text-3xl font-mono font-bold text-green-600">{candidateB.overallScore}</p>
                <p className="text-xs text-gray-400 mt-1">Общий балл</p>
                <SuspicionBadge score={candidateB.authenticityScore} showLabel={false} />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
