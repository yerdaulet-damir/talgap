'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CandidateWithScores } from '@/lib/supabase/types'
import { ArrowUpDown, Search, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface CandidateTableProps {
  candidates: CandidateWithScores[]
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-gray-100 text-gray-500',
  reviewed: 'bg-[#010042]/5 text-[#010042]',
  shortlisted: 'bg-green-50 text-green-600',
  flagged: 'bg-red-50 text-red-500',
  rejected: 'bg-gray-50 text-gray-400',
}

function AuthenticityBadge({ score }: { score: number }) {
  const color = score >= 0.8 ? '#16a34a' : score >= 0.6 ? '#ca8a04' : '#dc2626'
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs font-mono" style={{ color }}>{Math.round(score * 100)}%</span>
    </div>
  )
}

type SortKey = 'name' | 'overallScore' | 'authenticityScore' | 'region'

export function CandidateTable({ candidates }: CandidateTableProps) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('overallScore')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const filtered = useMemo(() => {
    let result = candidates.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.region.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
    )

    result.sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })

    return result
  }, [candidates, search, sortKey, sortDir])

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search candidates..."
          className="pl-10 bg-white border-gray-200 text-[#010042] placeholder:text-gray-300 focus:border-[#010042] rounded-xl shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left">
                <button onClick={() => handleSort('name')} className="flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-[#010042]">
                  Candidate <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button onClick={() => handleSort('region')} className="flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-[#010042]">
                  Region <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-center">
                <button onClick={() => handleSort('overallScore')} className="flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-[#010042]">
                  Score <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Authenticity</span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</span>
              </th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((candidate, i) => (
              <motion.tr
                key={candidate.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-100 cursor-pointer group"
              >
                <td className="px-4 py-3">
                  <Link href={`/dashboard/candidate/${candidate.id}`} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#010042]/5 flex items-center justify-center text-xs font-medium text-[#010042]">
                      {candidate.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#010042]">{candidate.name}</p>
                      <p className="text-xs text-gray-400">{candidate.school}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-500">{candidate.city}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm font-mono font-bold text-[#010042]">{candidate.overallScore}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <AuthenticityBadge score={candidate.authenticityScore} />
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge variant="outline" className={`text-[10px] uppercase tracking-wider border-0 ${STATUS_COLORS[candidate.status]}`}>
                    {candidate.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/dashboard/candidate/${candidate.id}`}>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
