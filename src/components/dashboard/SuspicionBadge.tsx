'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react'

interface SuspicionBadgeProps {
  score: number // 0-1, where 1 = fully authentic
  showLabel?: boolean
}

export function SuspicionBadge({ score, showLabel = true }: SuspicionBadgeProps) {
  const level = score >= 0.8 ? 'authentic' : score >= 0.6 ? 'uncertain' : 'suspicious'

  const config = {
    authentic: {
      color: '#16a34a',
      bg: 'bg-green-50',
      icon: ShieldCheck,
      label: 'Authentic',
    },
    uncertain: {
      color: '#ca8a04',
      bg: 'bg-amber-50',
      icon: ShieldAlert,
      label: 'Review',
    },
    suspicious: {
      color: '#dc2626',
      bg: 'bg-red-50',
      icon: ShieldX,
      label: 'Flagged',
    },
  }

  const { color, bg, icon: Icon, label } = config[level]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${bg}`}
    >
      <Icon className="w-4 h-4" style={{ color }} />
      <span className="text-sm font-mono font-medium" style={{ color }}>
        {Math.round(score * 100)}%
      </span>
      {showLabel && (
        <span className="text-xs" style={{ color }}>{label}</span>
      )}
    </motion.div>
  )
}
