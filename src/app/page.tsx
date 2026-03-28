'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight, Gamepad2, Target, Shield, Brain, Mic,
  Lightbulb, Heart, Users, TrendingUp, Sparkles,
  X, Check, AlertTriangle, Clock, MessageSquare, BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
}

const inView = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
}

/* ── Brand Logo SVGs (stylized initials, not trademarked logos) ── */

function YCLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="4" fill="#F26625" />
      <path d="M10 10L18 22V28M26 10L18 22" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MinervaLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="4" fill="#00857C" />
      <path d="M8 28V10L18 20L28 10V28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DuolingoLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="4" fill="#58CC02" />
      <circle cx="18" cy="16" r="8" stroke="white" strokeWidth="2.5" fill="none" />
      <path d="M18 24V28" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="15" cy="14" r="1.5" fill="white" />
      <circle cx="21" cy="14" r="1.5" fill="white" />
    </svg>
  )
}

function ThielLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="4" fill="#1a1a2e" />
      <path d="M11 10H25M18 10V28" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-3">
            <div className="font-display text-xl font-semibold tracking-tight text-[#010042]">
              talgap
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-400 font-medium">by inVision U</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-[#010042] transition-colors duration-150">
              Dashboard
            </Link>
            <Link href="/assess/demo">
              <Button size="sm" className="bg-[#010042] hover:bg-[#010042]/90 text-white rounded-full px-5">
                Пройти оценку
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-32 pb-20 px-6">
        {/* ════════════════ HERO ════════════════ */}
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="flex justify-center gap-3 mb-8">
            <span className="rounded-full bg-[#010042]/5 px-4 py-1.5 text-sm font-medium text-[#010042]">
              inVision U &middot; Decentrathon 5.0
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl md:text-7xl font-medium leading-[0.9] tracking-[-0.04em] mb-8 text-[#010042]"
          >
            Эссе можно{' '}
            <span className="italic">подделать</span>.
            <br />
            Потенциал — нет.
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-600 mb-14 max-w-2xl mx-auto leading-relaxed">
            Talgap — платформа оценки кандидатов для inVision University.
            15 минут игр, адаптивных сценариев и голосового анализа вместо эссе,
            которые 61% AI-детекторов не могут отличить от ChatGPT.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/assess/demo">
              <Button size="lg" className="bg-[#010042] hover:bg-[#010042]/90 text-white rounded-full gap-2 text-base px-8">
                Попробовать оценку
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-gray-200 text-gray-600 hover:text-[#010042] hover:border-gray-300 rounded-full text-base px-8">
                Dashboard комиссии
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* ════════════════ ESSAY VS REALITY ════════════════ */}
        <div className="max-w-5xl mx-auto mt-40">
          <motion.div {...inView}>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-[#010042] leading-tight tracking-[-0.03em] mb-4 text-center">
              Почему эссе — это <span className="italic">лотерея</span>
            </h2>
            <p className="text-lg text-gray-500 text-center mb-16 max-w-2xl mx-auto">
              Одно и то же эссе. Два способа прочитать кандидата. Только один из них честный.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: The Essay Problem */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-red-100 bg-red-50/30 p-8 relative"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-red-900">Традиционное эссе</h3>
              </div>

              <div className="bg-white rounded-xl border border-red-100 p-5 mb-5">
                <p className="text-sm text-gray-400 mb-2 font-medium">Вопрос: &laquo;Расскажите о себе&raquo;</p>
                <p className="text-base text-gray-700 leading-relaxed italic">
                  &laquo;С детства я мечтал изменить мир. Участвуя в олимпиадах и волонтёрских проектах,
                  я понял, что образование — ключ к трансформации общества. inVision University
                  представляет уникальную возможность реализовать мой потенциал...&raquo;
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-red-700">61% ложных срабатываний</span> — AI-детекторы
                    помечают тексты non-native speakers как сгенерированные
                    <span className="text-gray-400 ml-1">(Stanford HAI, 2023)</span>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-red-700">0 предсказательной силы</span> — personal statements
                    не добавляют ничего поверх GPA при прогнозе успеха
                    <span className="text-gray-400 ml-1">(Murphy et al., 2009)</span>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-red-700">Невозможно проверить</span> — написал сам,
                    помог репетитор или сгенерировал ChatGPT?
                  </p>
                </div>
              </div>
            </motion.div>

            {/* RIGHT: Talgap behavioral data */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-8 relative"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-900">Поведенческая оценка Talgap</h3>
              </div>

              {/* Mini behavioral dashboard */}
              <div className="bg-white rounded-xl border border-emerald-100 p-5 mb-5 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Находчивость</span>
                    <span className="text-sm font-semibold text-emerald-600">82/100</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '82%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Когнитивный потенциал</span>
                    <span className="text-sm font-semibold text-[#010042]">7 цифр</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#010042] rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Аутентичность</span>
                    <span className="text-sm font-semibold text-emerald-600">97%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '97%' }} />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-emerald-700">Keystroke dynamics</span> — скорость печати,
                    паузы, удаления. Невозможно подделать.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-emerald-700">Адаптивная сложность</span> — движок
                    подбирает задачи под уровень, как Duolingo (reliability 0.90)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-emerald-700">Голосовой анализ</span> — живая речь,
                    pitch variability, filler words. Настоящий человек.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ════════════════ LIVE ASSESSMENT PREVIEW ════════════════ */}
        <div className="max-w-5xl mx-auto mt-40">
          <motion.div {...inView}>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-[#010042] leading-tight tracking-[-0.03em] mb-4 text-center">
              Как это выглядит <span className="italic">изнутри</span>
            </h2>
            <p className="text-lg text-gray-500 text-center mb-16 max-w-2xl mx-auto">
              Реальные вопросы. Реальные ответы. Каждый этап измеряет то, что нельзя загуглить.
            </p>
          </motion.div>

          <div className="space-y-6">
            {/* Preview Card 1: Structured Question */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-gray-100 bg-gray-50/50 overflow-hidden"
            >
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-white">
                <div className="w-8 h-8 rounded-lg bg-[#010042]/5 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-[#010042]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#010042]">Структурированный вопрос</p>
                  <p className="text-sm text-gray-400">Этап 1 из 5 &middot; 3 минуты</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-sm text-emerald-600 font-medium">Keystroke tracking active</span>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-lg font-medium text-[#010042] mb-6">
                  Опишите ситуацию, когда вам пришлось решить проблему с минимальными ресурсами.
                  Что именно вы сделали и к чему это привело?
                </p>
                <div className="bg-white rounded-xl border border-gray-200 p-5 relative">
                  <p className="text-base text-gray-700 leading-relaxed">
                    В 10 классе наша школа в Актау потеряла финансирование на робототехнический кружок.
                    Мы с двумя друзьями написали письмо в местный бизнес-инкубатор, получили списанные
                    Arduino-платы и за 3 месяца собрали робота для республиканской олимпиады.
                    Заняли 2 место — нас заметил аким и вернул финансирование кружку.
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> 2:34 время набора
                    </span>
                    <span>847 символов</span>
                    <span>3 удаления</span>
                    <span className="text-emerald-500 font-medium">0 вставок</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Preview Card 2: SJT Scenario */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="rounded-2xl border border-gray-100 bg-gray-50/50 overflow-hidden"
            >
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-white">
                <div className="w-8 h-8 rounded-lg bg-[#010042]/5 flex items-center justify-center">
                  <Target className="w-4 h-4 text-[#010042]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#010042]">Ситуационный сценарий</p>
                  <p className="text-sm text-gray-400">Этап 2 из 5 &middot; Адаптивная сложность</p>
                </div>
                <div className="ml-auto">
                  <span className="bg-amber-50 text-amber-700 text-sm font-medium px-2.5 py-0.5 rounded-full">Elo: 1340</span>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-lg font-medium text-[#010042] mb-6">
                  Вы запустили студенческий стартап. За неделю до питча главного инвестора ваш
                  со-основатель уходит из проекта, забирая ключевые наработки. Что вы сделаете?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { label: 'A', text: 'Подам жалобу на со-основателя и попрошу перенести питч', selected: false },
                    { label: 'B', text: 'Соберу команду, перераспределю задачи и за неделю восстановлю ключевые части', selected: true },
                    { label: 'C', text: 'Найду нового со-основателя через знакомых за оставшуюся неделю', selected: false },
                    { label: 'D', text: 'Откажусь от питча и начну проект заново с нуля', selected: false },
                  ].map((opt) => (
                    <div
                      key={opt.label}
                      className={`rounded-xl border-2 p-4 transition-all ${
                        opt.selected
                          ? 'border-[#010042] bg-[#010042]/5'
                          : 'border-gray-100 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                          opt.selected
                            ? 'bg-[#010042] text-white'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {opt.label}
                        </span>
                        <p className={`text-sm leading-relaxed ${opt.selected ? 'text-[#010042] font-medium' : 'text-gray-600'}`}>
                          {opt.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Preview Card 3: BART Game Mini */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.05 }}
                className="rounded-2xl border border-gray-100 bg-gray-50/50 overflow-hidden"
              >
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-white">
                  <div className="w-8 h-8 rounded-lg bg-[#010042]/5 flex items-center justify-center">
                    <Gamepad2 className="w-4 h-4 text-[#010042]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#010042]">BART — Шарик</p>
                    <p className="text-sm text-gray-400">Мини-игра &middot; 2 мин</p>
                  </div>
                </div>
                <div className="p-6 flex flex-col items-center">
                  {/* Balloon visualization */}
                  <div className="relative w-32 h-32 mb-4">
                    <svg viewBox="0 0 100 120" className="w-full h-full">
                      <ellipse cx="50" cy="45" rx="35" ry="40" fill="#010042" opacity="0.1" />
                      <ellipse cx="50" cy="45" rx="32" ry="37" fill="#010042" opacity="0.15" />
                      <path d="M50 82 L47 95 L53 95 Z" fill="#010042" opacity="0.2" />
                      <text x="50" y="50" textAnchor="middle" fill="#010042" fontSize="16" fontWeight="600">78%</text>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 text-center leading-relaxed">
                    Надувайте шарик — чем больше, тем больше очков.
                    Но он может лопнуть. Измеряет баланс риска и осторожности.
                  </p>
                  <div className="mt-4 flex gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-[#010042]">12</p>
                      <p className="text-gray-400">раундов</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-[#010042]">0.64</p>
                      <p className="text-gray-400">risk score</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.15 }}
                className="rounded-2xl border border-gray-100 bg-gray-50/50 overflow-hidden"
              >
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-white">
                  <div className="w-8 h-8 rounded-lg bg-[#010042]/5 flex items-center justify-center">
                    <Mic className="w-4 h-4 text-[#010042]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#010042]">Голосовой ответ</p>
                    <p className="text-sm text-gray-400">Живая речь &middot; 3 мин</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-base font-medium text-[#010042] mb-4">
                    &laquo;Что для вас значит лидерство?&raquo;
                  </p>
                  {/* Voice waveform visualization */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      </div>
                      <div className="flex-1 flex items-center gap-0.5 h-8">
                        {[3,5,8,12,7,15,10,18,6,14,9,16,4,11,7,13,5,9,12,8,15,6,10,14,3,7,11,5,8,4].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-[#010042]/20 rounded-full"
                            style={{ height: `${h * 2.2}px` }}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400 font-mono">1:42</span>
                    </div>
                    <p className="text-sm text-gray-600 italic">
                      &laquo;Лидерство для меня — это не позиция, а ответственность. В нашей команде
                      я не самый умный, но я тот, кто не даёт сдаться когда всё идёт не так...&raquo;
                    </p>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>Темп: 142 сл/мин</span>
                    <span>Паузы: 4</span>
                    <span>Филлеры: 2</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ════════════════ SOCIAL PROOF ════════════════ */}
        <div className="max-w-5xl mx-auto mt-40">
          <motion.div {...inView}>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-[#010042] leading-tight tracking-[-0.03em] mb-4 text-center">
              Лидеры уже отказались от{' '}
              <span className="italic">старых методов</span>
            </h2>
            <p className="text-lg text-gray-500 text-center mb-12 max-w-2xl mx-auto">
              Мы не придумали это с нуля. Мы взяли то, что работает у лучших, и собрали в одну оценку.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                Logo: YCLogo,
                brand: 'Y Combinator',
                narrative: 'Отбирают по целеустремлённости, а не по тестам',
                detail: '1-2% acceptance rate',
              },
              {
                Logo: MinervaLogo,
                brand: 'Minerva University',
                narrative: 'Полностью test-blind: ни SAT, ни ACT',
                detail: '3.6% acceptance rate',
              },
              {
                Logo: DuolingoLogo,
                brand: 'Duolingo',
                narrative: 'Адаптивное тестирование с reliability 0.90',
                detail: 'Стандарт adaptive CAT',
              },
              {
                Logo: ThielLogo,
                brand: 'Thiel Fellowship',
                narrative: 'Траектория важнее текущих оценок',
                detail: 'Buterin, Collison',
              },
            ].map((card, i) => (
              <motion.div
                key={card.brand}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 hover:border-gray-200 hover:bg-gray-50 transition-all duration-200"
              >
                <card.Logo />
                <p className="text-sm font-medium text-gray-400 mt-4 mb-2">{card.brand}</p>
                <p className="text-base font-semibold text-[#010042] mb-2 leading-snug">{card.narrative}</p>
                <p className="text-sm text-gray-500">{card.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ════════════════ WHAT WE DO DIFFERENTLY ════════════════ */}
        <div className="max-w-5xl mx-auto mt-40">
          <motion.div {...inView}>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-[#010042] leading-tight tracking-[-0.03em] mb-14 text-center">
              Три принципа, которые{' '}
              <span className="italic">меняют отбор</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Gamepad2,
                title: 'Игры вместо тестов',
                body: 'Мини-игры измеряют когнитивные способности без зубрёжки. Нельзя подготовиться — можно только быть собой.',
              },
              {
                icon: Target,
                title: 'Адаптивные сценарии',
                body: 'Сложность подбирается под уровень кандидата в реальном времени. Как Duolingo, но для потенциала.',
              },
              {
                icon: Shield,
                title: 'Защита от подделки',
                body: 'Keystroke dynamics, paste detection, голосовой анализ. Каждый ответ верифицирован поведением.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#010042]/5 flex items-center justify-center mb-5">
                  <item.icon className="w-7 h-7 text-[#010042]" />
                </div>
                <h3 className="text-xl font-semibold text-[#010042] mb-3">{item.title}</h3>
                <p className="text-base text-gray-600 leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ════════════════ 7 DIMENSIONS ════════════════ */}
        <div className="max-w-5xl mx-auto mt-40">
          <motion.div {...inView}>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-[#010042] leading-tight tracking-[-0.03em] mb-4 text-center">
              7 измерений <span className="italic">потенциала</span>
            </h2>
            <p className="text-lg text-gray-500 text-center mb-12 max-w-2xl mx-auto">
              Не один балл. Не субъективное впечатление. Семь конкретных показателей,
              каждый подтверждённый поведенческими данными.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: Lightbulb, dim: 'Находчивость', desc: 'Решение задач с ограниченными ресурсами', how: 'SJT-сценарии' },
              { icon: TrendingUp, dim: 'Траектория роста', desc: 'Путь развития и преодоление препятствий', how: 'Анкета + анализ' },
              { icon: Users, dim: 'Социальное лидерство', desc: 'Способность вести за собой команду', how: 'Командные сценарии' },
              { icon: Sparkles, dim: 'Креативность', desc: 'Нестандартный подход к проблемам', how: 'Открытые вопросы + BART' },
              { icon: Shield, dim: 'Аутентичность', desc: 'Подлинность ответов и мотивации', how: 'Keystroke + voice' },
              { icon: Heart, dim: 'Приверженность', desc: 'Ответственность перед сообществом', how: 'Планы после выпуска' },
              { icon: Brain, dim: 'Когнитивный потенциал', desc: 'Рабочая память и обработка информации', how: 'Digit Span + BART timing' },
            ].map((d, i) => (
              <motion.div
                key={d.dim}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 hover:border-gray-200 hover:bg-gray-50 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-[#010042]/5 flex items-center justify-center mb-3">
                  <d.icon className="w-5 h-5 text-[#010042]" />
                </div>
                <h3 className="text-base font-semibold text-[#010042] mb-1">{d.dim}</h3>
                <p className="text-sm text-gray-600 mb-2">{d.desc}</p>
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" /> {d.how}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ════════════════ METHODOLOGY CREDIT ════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto mt-24 border-t border-gray-100 pt-8"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            <span className="text-sm text-gray-400">Методология вдохновлена:</span>
            {['Y Combinator', 'Minerva University', 'Duolingo CAT', 'Thiel Fellowship', 'Pymetrics'].map((name) => (
              <span key={name} className="text-sm font-semibold text-gray-500">{name}</span>
            ))}
          </div>
        </motion.div>

        {/* ════════════════ BOTTOM CTA ════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mt-32 text-center"
        >
          <h2 className="font-display text-3xl md:text-5xl font-medium text-[#010042] leading-tight tracking-[-0.03em] mb-6">
            Готовы увидеть{' '}
            <span className="italic">в действии?</span>
          </h2>
          <p className="text-lg text-gray-500 mb-10 max-w-lg mx-auto">
            Пройдите оценку сами. 15 минут — и вы увидите, чем это отличается от эссе.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/assess/demo">
              <Button size="lg" className="bg-[#010042] hover:bg-[#010042]/90 text-white rounded-full gap-2 text-lg px-10 py-6">
                Попробовать оценку
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-gray-200 text-gray-600 hover:text-[#010042] hover:border-gray-300 rounded-full text-lg px-10 py-6">
                Dashboard комиссии
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-8">Бесплатно. Без регистрации. 15 минут.</p>
        </motion.div>
      </main>

      <footer className="border-t border-gray-100 py-10 text-center text-sm text-gray-400 tracking-wide">
        Talgap &middot; by inVision U &middot; Team Decentraton &middot; Decentrathon 5.0
      </footer>
    </div>
  )
}
