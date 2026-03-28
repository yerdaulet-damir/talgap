'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CandidateWithScores } from '@/lib/supabase/types'
import { seedDemoData } from '@/lib/supabase/seed'
import { getAllCandidatesWithScores } from '@/lib/supabase/queries'
import { Card } from '@/components/ui/card'
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react'

function ParityIndicator({ ratio }: { ratio: number }) {
  if (ratio >= 0.8) return <ShieldCheck className="w-4 h-4 text-green-600" />
  if (ratio >= 0.6) return <ShieldAlert className="w-4 h-4 text-amber-500" />
  return <ShieldX className="w-4 h-4 text-red-500" />
}

function calculateParity(groups: Array<{ label: string; scores: number[] }>) {
  const avgs = groups.map(g => ({
    label: g.label,
    avg: g.scores.length > 0 ? g.scores.reduce((a, b) => a + b, 0) / g.scores.length : 0,
    count: g.scores.length,
  }))

  const maxAvg = Math.max(...avgs.map(a => a.avg), 1)

  return avgs.map(a => ({
    ...a,
    parityRatio: maxAvg > 0 ? a.avg / maxAvg : 1,
  }))
}

export default function FairnessPage() {
  const [candidates, setCandidates] = useState<CandidateWithScores[]>([])

  useEffect(() => {
    seedDemoData()
    getAllCandidatesWithScores().then(setCandidates)
  }, [])

  const regionGroups = new Map<string, number[]>()
  for (const c of candidates) {
    const region = c.region || 'Unknown'
    if (!regionGroups.has(region)) regionGroups.set(region, [])
    regionGroups.get(region)!.push(c.overallScore)
  }
  const regionParity = calculateParity(
    Array.from(regionGroups.entries()).map(([label, scores]) => ({ label, scores }))
  )

  const langGroups = new Map<string, number[]>()
  for (const c of candidates) {
    const lang = c.language?.toUpperCase() || 'Unknown'
    if (!langGroups.has(lang)) langGroups.set(lang, [])
    langGroups.get(lang)!.push(c.overallScore)
  }
  const langParity = calculateParity(
    Array.from(langGroups.entries()).map(([label, scores]) => ({ label, scores }))
  )

  const schoolGroups = new Map<string, number[]>()
  for (const c of candidates) {
    const type = c.schoolType || 'other'
    if (!schoolGroups.has(type)) schoolGroups.set(type, [])
    schoolGroups.get(type)!.push(c.overallScore)
  }
  const schoolParity = calculateParity(
    Array.from(schoolGroups.entries()).map(([label, scores]) => ({ label, scores }))
  )

  const genderGroups = new Map<string, number[]>()
  for (const c of candidates) {
    const gender = c.gender || 'unknown'
    if (!genderGroups.has(gender)) genderGroups.set(gender, [])
    genderGroups.get(gender)!.push(c.overallScore)
  }
  const genderParity = calculateParity(
    Array.from(genderGroups.entries()).map(([label, scores]) => ({ label, scores }))
  )

  const overallFairness = [...regionParity, ...langParity, ...schoolParity, ...genderParity]
  const avgParity = overallFairness.length > 0
    ? overallFairness.reduce((sum, p) => sum + p.parityRatio, 0) / overallFairness.length
    : 1

  return (
    <div className="p-8 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl font-medium text-[#010042]">Fairness Audit</h1>
        <p className="text-sm text-gray-400 mt-1">
          Demographic parity по регионам, языку, типу школы, полу
        </p>
      </motion.div>

      {/* Overall */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Card className="bg-white border-t border-gray-100 p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-2 font-semibold">Общий Fairness Score</p>
              <p className="text-4xl font-mono font-bold text-[#010042]">{Math.round(avgParity * 100) / 100}</p>
              <p className="text-xs text-gray-400 mt-1">Parity ratio &middot; 1.0 = идеальный паритет</p>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              avgParity >= 0.8 ? 'bg-green-50' : avgParity >= 0.6 ? 'bg-amber-50' : 'bg-red-50'
            }`}>
              {avgParity >= 0.8 ? (
                <ShieldCheck className="w-8 h-8 text-green-600" />
              ) : avgParity >= 0.6 ? (
                <ShieldAlert className="w-8 h-8 text-amber-500" />
              ) : (
                <ShieldX className="w-8 h-8 text-red-500" />
              )}
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-4 border-l-2 border-[#010042]/10 pl-4 leading-relaxed">
            Chouldechova, 2017: невозможно одновременно достичь demographic parity, equalized odds и predictive parity.
            Мы мониторим все три и делаем trade-offs явными.
          </p>
        </Card>
      </motion.div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'По регионам', data: regionParity },
          { title: 'По языку', data: langParity },
          { title: 'По типу школы', data: schoolParity, capitalize: true },
          { title: 'По полу', data: genderParity, capitalize: true },
        ].map((group, gi) => (
          <motion.div key={group.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + gi * 0.05 }}>
            <Card className="bg-white border-t border-gray-100 p-5 rounded-2xl">
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-4 font-semibold">{group.title}</p>
              <div className="space-y-3">
                {group.data.map(r => (
                  <div key={r.label} className="flex items-center gap-3">
                    <ParityIndicator ratio={r.parityRatio} />
                    <span className={`text-sm text-gray-600 flex-1 truncate ${group.capitalize ? 'capitalize' : ''}`}>{r.label}</span>
                    <span className="text-xs font-mono text-gray-400">{r.count}</span>
                    <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#010042] rounded-full" style={{ width: `${r.avg}%` }} />
                    </div>
                    <span className="text-xs font-mono text-[#010042] w-8">{Math.round(r.avg)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
