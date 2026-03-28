'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { RadarChartComponent } from '@/components/dashboard/RadarChart'
import { WaterfallChart } from '@/components/dashboard/WaterfallChart'
import { SuspicionBadge } from '@/components/dashboard/SuspicionBadge'
import { CandidateWithScores } from '@/lib/supabase/types'
import { seedDemoData } from '@/lib/supabase/seed'
import { getAllCandidatesWithScores } from '@/lib/supabase/queries'
import { ArrowLeft, MapPin, School, Globe, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

const stagger = {
  animate: { transition: { staggerChildren: 0.05 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
}

const DIMENSION_SOURCE: Record<string, string> = {
  resourcefulness: 'SJT → effectuation SJT, Codreanu et al. 2025',
  growth_trajectory: 'анкета → Thiel Fellowship model',
  social_leadership: 'SJT → proactive personality ρ = .27',
  creative_problem_solving: 'BART + вопросы → Baron & Markman',
  authentic_voice: 'telemetry + voice → CodeSignal approach',
  community_commitment: 'анкета → inVision U core value',
  cognitive_capacity: 'Digit Span + BART → Pymetrics paradigm',
}

export default function CandidateProfilePage() {
  const params = useParams()
  const candidateId = params.id as string
  const [candidate, setCandidate] = useState<CandidateWithScores | null>(null)

  useEffect(() => {
    seedDemoData()
    getAllCandidatesWithScores().then(candidates => {
      const found = candidates.find(c => c.id === candidateId)
      setCandidate(found || null)
    })
  }, [candidateId])

  if (!candidate) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-400 text-sm">Загрузка профиля...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-[#010042] mb-4 transition-colors">
          <ArrowLeft className="w-3 h-3" />
          К списку кандидатов
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#010042]/5 flex items-center justify-center text-xl font-medium text-[#010042]">
              {candidate.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-display text-2xl font-medium text-[#010042]">{candidate.name}</h1>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{candidate.city}, {candidate.region}</span>
                <span className="inline-flex items-center gap-1"><School className="w-3 h-3" />{candidate.school}</span>
                <span className="inline-flex items-center gap-1"><Globe className="w-3 h-3" />{candidate.language.toUpperCase()}</span>
                <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(candidate.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SuspicionBadge score={candidate.authenticityScore} />
            <div className="text-right">
              <p className="text-3xl font-mono font-bold text-[#010042]">{candidate.overallScore}</p>
              <p className="text-xs text-gray-400">общий балл</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bento Grid */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {/* Radar Chart */}
        <motion.div variants={fadeUp} className="md:col-span-2 lg:col-span-1 lg:row-span-2">
          <Card className="bg-white border-t border-gray-100 p-5 h-full hover:shadow-md transition-shadow rounded-2xl">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-3 font-semibold">Профиль — 7 измерений</p>
            <RadarChartComponent scores={candidate.dimensions} size={320} />
          </Card>
        </motion.div>

        {/* Waterfall */}
        <motion.div variants={fadeUp} className="md:col-span-2 lg:col-span-2">
          <Card className="bg-white border-t border-gray-100 p-5 hover:shadow-md transition-shadow rounded-2xl">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-4 font-semibold">Декомпозиция баллов</p>
            <WaterfallChart scores={candidate.dimensions} overallScore={candidate.overallScore} />
          </Card>
        </motion.div>

        {/* Dimension cards */}
        {candidate.dimensions.map((dim, i) => (
          <motion.div key={dim.dimension} variants={fadeUp}>
            <Card className="bg-white border-t border-gray-100 p-5 hover:shadow-md transition-shadow h-full rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-semibold">{dim.dimension.replace(/_/g, ' ')}</p>
                <Badge variant="outline" className="border-[#010042]/20 text-[#010042] text-xs">
                  {dim.score}/5
                </Badge>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-4">{dim.reasoning}</p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(dim.score / 5) * 100}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                  className="h-full bg-[#010042] rounded-full"
                />
              </div>
              {DIMENSION_SOURCE[dim.dimension] && (
                <p className="text-[10px] text-gray-400 mt-2 italic">{DIMENSION_SOURCE[dim.dimension]}</p>
              )}
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
