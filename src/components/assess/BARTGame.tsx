'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { BARTResult } from '@/lib/assessment/types'

interface BARTGameProps {
  onComplete: (result: BARTResult) => void
}

const MAX_PUMPS = 30
const TOTAL_ROUNDS = 5
const POP_PROBABILITIES = Array.from({ length: MAX_PUMPS }, (_, i) => Math.min(0.02 + i * 0.03, 0.95))

export function BARTGame({ onComplete }: BARTGameProps) {
  const [round, setRound] = useState(0)
  const [pumps, setPumps] = useState(0)
  const [popped, setPopped] = useState(false)
  const [cashing, setCashing] = useState(false)
  const [totalEarned, setTotalEarned] = useState(0)
  const [roundHistory, setRoundHistory] = useState<BARTResult['rounds']>([])
  const [gameOver, setGameOver] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number }>>([])
  const reactionTimesRef = useRef<number[]>([])
  const lastPumpTimeRef = useRef(Date.now())

  const balloonSize = 80 + pumps * 8
  const riskLevel = pumps / MAX_PUMPS

  const pump = useCallback(() => {
    if (popped || cashing || gameOver) return

    const now = Date.now()
    reactionTimesRef.current.push(now - lastPumpTimeRef.current)
    lastPumpTimeRef.current = now

    const newPumps = pumps + 1

    if (Math.random() < POP_PROBABILITIES[pumps]) {
      setPopped(true)
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: 0,
        y: 0,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
      }))
      setParticles(newParticles)

      const roundData = {
        pumps: newPumps,
        popped: true,
        earned: 0,
        reactionTimes: [...reactionTimesRef.current],
      }

      setTimeout(() => {
        const newHistory = [...roundHistory, roundData]
        setRoundHistory(newHistory)
        if (round + 1 >= TOTAL_ROUNDS) {
          finishGame(newHistory)
        } else {
          nextRound(newHistory)
        }
      }, 1500)
    } else {
      setPumps(newPumps)
    }
  }, [pumps, popped, cashing, gameOver, round, roundHistory])

  const cashOut = useCallback(() => {
    if (popped || cashing || pumps === 0 || gameOver) return
    setCashing(true)

    const earned = pumps
    const roundData = {
      pumps,
      popped: false,
      earned,
      reactionTimes: [...reactionTimesRef.current],
    }

    setTotalEarned(prev => prev + earned)

    setTimeout(() => {
      const newHistory = [...roundHistory, roundData]
      setRoundHistory(newHistory)
      if (round + 1 >= TOTAL_ROUNDS) {
        finishGame(newHistory)
      } else {
        nextRound(newHistory)
      }
    }, 800)
  }, [pumps, popped, cashing, gameOver, round, roundHistory])

  const nextRound = (history: BARTResult['rounds']) => {
    setRound(prev => prev + 1)
    setPumps(0)
    setPopped(false)
    setCashing(false)
    setParticles([])
    reactionTimesRef.current = []
    lastPumpTimeRef.current = Date.now()
  }

  const finishGame = (history: BARTResult['rounds']) => {
    setGameOver(true)
    const totalE = history.reduce((sum, r) => sum + r.earned, 0)
    const avgPumps = history.reduce((sum, r) => sum + r.pumps, 0) / history.length
    const popCount = history.filter(r => r.popped).length
    const cashCount = history.filter(r => !r.popped).length
    const riskScore = Math.min(avgPumps / MAX_PUMPS, 1)

    onComplete({
      rounds: history,
      totalEarned: totalE,
      averagePumps: Math.round(avgPumps * 10) / 10,
      popCount,
      cashOutCount: cashCount,
      riskToleranceScore: Math.round(riskScore * 100) / 100,
    })
  }

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); pump() }
      if (e.code === 'Enter') { e.preventDefault(); cashOut() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [pump, cashOut])

  if (gameOver) return null

  return (
    <div className="text-center space-y-6">
      {/* Round info */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 font-mono bg-gray-50 px-2.5 py-0.5 rounded-full">
          Раунд {round + 1} / {TOTAL_ROUNDS}
        </span>
        <span className="text-sm font-mono text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
          Заработано: {totalEarned} очков
        </span>
      </div>

      {/* Balloon area */}
      <div className="relative flex items-center justify-center min-h-[260px]">
        <AnimatePresence>
          {!popped ? (
            <motion.div
              key="balloon"
              animate={{
                width: balloonSize,
                height: balloonSize * 1.2,
                x: riskLevel > 0.6 ? [0, -2, 2, -1, 1, 0] : 0,
              }}
              transition={{
                width: { type: 'spring', stiffness: 300, damping: 20 },
                height: { type: 'spring', stiffness: 300, damping: 20 },
                x: { repeat: Infinity, duration: 0.3 },
              }}
              className="rounded-full relative"
              style={{
                background: `radial-gradient(circle at 35% 35%,
                  hsl(${220 + riskLevel * 20}, ${50 + riskLevel * 30}%, ${70 - riskLevel * 30}%) 0%,
                  hsl(${220 + riskLevel * 20}, ${40 + riskLevel * 30}%, ${50 - riskLevel * 20}%) 50%,
                  hsl(${220 + riskLevel * 20}, ${30 + riskLevel * 30}%, ${35 - riskLevel * 15}%) 100%)`,
                boxShadow: `0 ${10 + riskLevel * 20}px ${30 + riskLevel * 30}px hsl(${220 + riskLevel * 20}, 40%, 40%, 0.2)`,
              }}
            >
              {/* Shine */}
              <div
                className="absolute rounded-full opacity-50"
                style={{
                  width: '30%',
                  height: '20%',
                  top: '15%',
                  left: '20%',
                  background: 'radial-gradient(ellipse, white 0%, transparent 70%)',
                }}
              />
              {/* Knot */}
              <div
                className="absolute left-1/2 -translate-x-1/2 w-3 h-4"
                style={{
                  bottom: -8,
                  background: `hsl(${220 + riskLevel * 20}, 30%, 35%)`,
                  clipPath: 'polygon(30% 0%, 70% 0%, 50% 100%)',
                }}
              />
            </motion.div>
          ) : (
            // Explosion particles
            particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: p.vx * 30,
                  y: p.vy * 30,
                  opacity: 0,
                  scale: 0.3,
                }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: `hsl(${Math.random() * 40 + 210}, 60%, 60%)`,
                }}
              />
            ))
          )}
        </AnimatePresence>

        {cashing && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute text-3xl font-display font-bold text-emerald-600"
          >
            +{pumps}
          </motion.div>
        )}
      </div>

      {/* Current pumps */}
      <div className="text-center">
        <p className="text-4xl font-mono font-bold text-[#010042]">{pumps}</p>
        <p className="text-sm text-gray-500 mt-1">нажатий в этом раунде</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={pump}
          disabled={popped || cashing}
          size="lg"
          className="bg-[#010042] hover:bg-[#010042]/90 text-white rounded-full px-10 text-base disabled:opacity-30"
        >
          Надуть
          <span className="ml-2 text-xs opacity-60">[Пробел]</span>
        </Button>
        <Button
          onClick={cashOut}
          disabled={popped || cashing || pumps === 0}
          size="lg"
          variant="outline"
          className={`border-emerald-300 text-emerald-600 hover:bg-emerald-50 rounded-full px-10 text-base disabled:opacity-30 ${
            pumps > 10 ? 'animate-pulse' : ''
          }`}
        >
          Забрать
          <span className="ml-2 text-xs opacity-60">[Enter]</span>
        </Button>
      </div>

      <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
        Каждое нажатие добавляет 1 очко. Но шарик может лопнуть в любой момент — и вы теряете всё за раунд.
        Здесь нет правильной стратегии — мы измеряем ваш естественный баланс риска и осторожности.
      </p>
    </div>
  )
}
