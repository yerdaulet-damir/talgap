'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CandidateTable } from '@/components/dashboard/CandidateTable'
import { CandidateWithScores } from '@/lib/supabase/types'
import { seedDemoData } from '@/lib/supabase/seed'
import { getAllCandidatesWithScores } from '@/lib/supabase/queries'
import { Users, UserCheck, Clock, ShieldCheck } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  trend?: { value: string; positive: boolean }
}

function KPICard({ title, value, subtitle, icon: Icon, trend }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-t border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-semibold">{title}</span>
        <Icon className="w-4 h-4 text-gray-300" />
      </div>
      <p className="text-3xl font-mono font-bold text-[#010042]">{value}</p>
      <div className="flex items-center gap-2 mt-1">
        {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
        {trend && (
          <span className={`text-xs font-mono ${trend.positive ? 'text-green-600' : 'text-red-500'}`}>
            {trend.positive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const [candidates, setCandidates] = useState<CandidateWithScores[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    seedDemoData()
    const data = getAllCandidatesWithScores()
    Promise.resolve(data).then(result => {
      setCandidates(result)
      setLoading(false)
    })
  }, [])

  const shortlisted = candidates.filter(c => c.status === 'shortlisted').length
  const flagged = candidates.filter(c => c.status === 'flagged').length
  const avgScore = candidates.length > 0
    ? Math.round(candidates.reduce((sum, c) => sum + c.overallScore, 0) / candidates.length)
    : 0
  const avgAuth = candidates.length > 0
    ? Math.round(candidates.reduce((sum, c) => sum + c.authenticityScore, 0) / candidates.length * 100) / 100
    : 0

  return (
    <div className="p-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-2xl font-medium text-[#010042]">Кандидаты</h1>
        <p className="text-sm text-gray-400 mt-1">
          Мультидименсиональная оценка &middot; 7 измерений &middot; behavioral telemetry
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Всего кандидатов"
          value={candidates.length}
          subtitle="прошли оценку"
          icon={Users}
        />
        <KPICard
          title="Отобраны"
          value={shortlisted}
          subtitle={`${flagged} помечены`}
          icon={UserCheck}
          trend={{ value: `${shortlisted}/${candidates.length}`, positive: true }}
        />
        <KPICard
          title="Средний балл"
          value={avgScore}
          subtitle="из 100"
          icon={Clock}
        />
        <KPICard
          title="Аутентичность"
          value={`${Math.round(avgAuth * 100)}%`}
          icon={ShieldCheck}
          trend={{ value: avgAuth >= 0.8 ? 'healthy' : 'review', positive: avgAuth >= 0.8 }}
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <CandidateTable candidates={candidates} />
      )}
    </div>
  )
}
