'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'
import { Shield, Lightbulb, Target, Gamepad2, Brain, Mic } from 'lucide-react'

interface AssessmentShellProps {
  currentStep: number
  totalSteps: number
  children: ReactNode
  stepKey: string
}

const STEP_CONTEXT: Record<number, { label: string; icon: typeof Shield; context: string; why: string }> = {
  0: {
    label: 'Структурированные вопросы',
    icon: Lightbulb,
    context: 'Вопрос конкретный — ответ нельзя загуглить или сгенерировать. UCAS (Британия) перешли на этот формат в 2025 году.',
    why: 'Personal statements не предсказывают успех студента (Murphy et al., 2009). Структурированные вопросы — предсказывают.',
  },
  1: {
    label: 'Структурированные вопросы',
    icon: Lightbulb,
    context: 'Мы следим за тем, как вы печатаете: скорость, паузы, вставки. Это невозможно подделать — в отличие от текста эссе.',
    why: 'Minerva University: 100% кандидатов говорят, что их оценили как реального человека, а не как заявку.',
  },
  2: {
    label: 'Структурированные вопросы',
    icon: Lightbulb,
    context: 'Последний вопрос. Здесь нет правильного ответа — нам важна ваша мотивация и конкретность планов.',
    why: '61% эссе non-native speakers ошибочно помечаются AI-детекторами. Структурированные вопросы решают эту проблему.',
  },
  3: {
    label: 'Ситуационные сценарии',
    icon: Target,
    context: 'Реальная ситуация — реальный выбор. Нет правильного ответа, но есть разница между действием и бездействием.',
    why: 'Адаптивная сложность как у Duolingo: движок подбирает сценарий под ваш уровень в реальном времени.',
  },
  4: {
    label: 'Ситуационные сценарии',
    icon: Target,
    context: 'Сценарии из реальной жизни казахстанских школьников. Не абстрактные задачи — а ситуации, которые вы узнаёте.',
    why: 'SJT (ситуационные тесты) предсказывают успех на 50% лучше, чем неструктурированные интервью.',
  },
  5: {
    label: 'Ситуационные сценарии',
    icon: Target,
    context: 'Ваш выбор + объяснение — мы оцениваем не только что вы выбрали, но как вы думаете.',
    why: 'Y Combinator отбирает по целеустремлённости, не по тестам. Мы измеряем то же — через поведение.',
  },
  6: {
    label: 'BART — Мини-игра',
    icon: Gamepad2,
    context: 'Игра на баланс риска и осторожности. Не нужны знания — нужна только ваша природная реакция.',
    why: 'Pymetrics собирает 12,000+ данных за 25 мин через игры. Мы используем тот же подход — впервые для admissions.',
  },
  7: {
    label: 'Digit Span — Память',
    icon: Brain,
    context: 'Невербальный тест рабочей памяти. Нет cultural bias — цифры одинаковы для всех.',
    why: 'Рабочая память — один из сильнейших предикторов академического успеха. И её невозможно натренировать за неделю.',
  },
  8: {
    label: 'Голосовой ответ',
    icon: Mic,
    context: 'Живой голос — самая сложная вещь для подделки. Мы анализируем не содержание, а то, как вы говорите.',
    why: 'Скорость речи, паузы, слова-паразиты — поведенческие маркеры, которые отражают реальную уверенность.',
  },
}

export function AssessmentShell({ currentStep, totalSteps, children, stepKey }: AssessmentShellProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100
  const ctx = STEP_CONTEXT[currentStep]
  const Icon = ctx?.icon || Shield

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-gray-100 w-full shrink-0">
        <motion.div
          className="h-full bg-[#010042]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-display text-base font-semibold text-[#010042]">talgap</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-400">inVision U</span>
        </div>
        <div className="flex items-center gap-4">
          {ctx && (
            <span className="hidden sm:inline text-sm text-gray-500 font-medium">{ctx.label}</span>
          )}
          <span className="text-sm text-gray-400 font-mono bg-gray-50 px-2.5 py-0.5 rounded-full">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Content + context sidebar */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Main content — scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-start justify-center px-6 py-8 min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={stepKey}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-full max-w-2xl"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Context sidebar — accessible research explanations */}
        {ctx && (
          <div className="hidden lg:flex flex-col justify-end w-[280px] border-l border-gray-100 p-6 shrink-0 bg-gray-50/30">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#010042]/5 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#010042]" />
                </div>
                <span className="text-sm font-semibold text-[#010042]">{ctx.label}</span>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                {ctx.context}
              </p>

              <div className="border-l-2 border-[#010042]/15 pl-3">
                <p className="text-sm text-gray-500 leading-relaxed italic">
                  {ctx.why}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
