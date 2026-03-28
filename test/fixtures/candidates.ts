import { Candidate, Score, CandidateWithScores } from '@/lib/supabase/types'
import { DIMENSIONS } from '@/lib/scoring/types'

function makeScores(candidateId: string, values: Record<string, { score: number; reasoning: string }>): Score[] {
  return DIMENSIONS.map(dim => ({
    id: `score_${candidateId}_${dim}`,
    candidateId,
    sessionId: `session_${candidateId}`,
    dimension: dim,
    score: values[dim]?.score ?? 3,
    reasoning: values[dim]?.reasoning ?? 'Average performance.',
    evidence: [],
    confidence: 0.8,
    createdAt: new Date().toISOString(),
  }))
}

// Candidate A: Strong leader from rural area, authentic voice, high scores
const candidateA: Candidate = {
  id: 'cand_aisha',
  name: 'Аиша Нурланова',
  email: 'aisha@example.com',
  region: 'Туркестанская область',
  city: 'Шымкент',
  school: 'СШ №45 им. Абая',
  schoolType: 'general',
  language: 'ru',
  gender: 'female',
  createdAt: '2026-03-15T10:00:00Z',
}

const scoresA = makeScores('cand_aisha', {
  resourcefulness: { score: 5, reasoning: 'Предложила создать мобильное приложение для связи фермеров с покупателями за 50,000 тенге, подробно описав каждый шаг бюджета и привлечение волонтёров из IT-клуба.' },
  growth_trajectory: { score: 4, reasoning: 'Рассказала о переходе из аула в городскую школу и как это изменило её подход к обучению. Конкретные примеры преодоления трудностей.' },
  social_leadership: { score: 5, reasoning: 'Организовала школьный дебатный клуб с нуля, привлекла 30 участников. В SJT выбрала стратегии, связывающие все стороны конфликта.' },
  creative_problem_solving: { score: 4, reasoning: 'Нестандартный подход к проблеме водоснабжения — предложила дождевой сбор + образовательный компонент.' },
  authentic_voice: { score: 5, reasoning: 'Голосовой ответ полон конкретных деталей из жизни в ауле. Естественная речь, паузы для размышления, эмоциональная вовлечённость.' },
  community_commitment: { score: 5, reasoning: 'Планирует вернуться в Шымкент и создать EdTech стартап для сельских школ. Уже проводит бесплатные курсы для младшеклассников.' },
  cognitive_capacity: { score: 4, reasoning: 'Digit span: 7. BART: сбалансированная стратегия с хорошим risk-reward ratio. Быстрая реакция.' },
})

// Candidate B: Polished applicant from Almaty, AI-assisted responses detected
const candidateB: Candidate = {
  id: 'cand_arman',
  name: 'Арман Касымов',
  email: 'arman@example.com',
  region: 'Алматы',
  city: 'Алматы',
  school: 'НИШ ФМН г. Алматы',
  schoolType: 'nazarbayev',
  language: 'ru',
  gender: 'male',
  createdAt: '2026-03-15T11:00:00Z',
}

const scoresB = makeScores('cand_arman', {
  resourcefulness: { score: 4, reasoning: 'Хорошие предложения но чувствуется шаблонность формулировок. Все ответы структурированы слишком идеально.' },
  growth_trajectory: { score: 3, reasoning: 'Описывает рост абстрактно: "я научился работать в команде." Нет конкретных ситуаций провала и восстановления.' },
  social_leadership: { score: 4, reasoning: 'Президент школьного совета. Но описания лидерства звучат как резюме, не как личный опыт.' },
  creative_problem_solving: { score: 3, reasoning: 'Стандартные подходы, хорошо сформулированные. Нет по-настоящему оригинальных идей.' },
  authentic_voice: { score: 2, reasoning: 'Подозрение на AI-assisted ответы: CPS > 12, 3 paste events, нулевое время раздумья. Текст слишком гладкий для 17-летнего.' },
  community_commitment: { score: 3, reasoning: 'Упоминает волонтёрство но без деталей. Планы после выпуска расплывчаты.' },
  cognitive_capacity: { score: 5, reasoning: 'Digit span: 8. BART: оптимальная стратегия. Высокая скорость обработки.' },
})

// Candidate C: Average across board, genuine effort
const candidateC: Candidate = {
  id: 'cand_dana',
  name: 'Дана Сериккызы',
  email: 'dana@example.com',
  region: 'Карагандинская область',
  city: 'Караганда',
  school: 'Лицей №1',
  schoolType: 'lyceum',
  language: 'kz',
  gender: 'female',
  createdAt: '2026-03-15T12:00:00Z',
}

const scoresC = makeScores('cand_dana', {
  resourcefulness: { score: 3, reasoning: 'Предложила стандартное решение — субботник и посадка деревьев. Реалистично но без инновации.' },
  growth_trajectory: { score: 3, reasoning: 'Описала переход на казахский язык обучения как вызов. Конкретный пример но без глубокой рефлексии.' },
  social_leadership: { score: 3, reasoning: 'Участвует в школьных мероприятиях как активный участник, не как организатор.' },
  creative_problem_solving: { score: 3, reasoning: 'Стандартные подходы, но с практическим пониманием ограничений.' },
  authentic_voice: { score: 4, reasoning: 'Искренние ответы с конкретными деталями. Чувствуется реальный опыт. Естественные речевые паттерны.' },
  community_commitment: { score: 3, reasoning: 'Хочет стать учителем в родном городе. Искреннее желание но без конкретного плана.' },
  cognitive_capacity: { score: 3, reasoning: 'Digit span: 6. BART: средний результат. Нормальная скорость обработки.' },
})

// Candidate D: High cognitive scores (BART, digit span), weak on leadership
const candidateD: Candidate = {
  id: 'cand_timur',
  name: 'Тимур Жумабеков',
  email: 'timur@example.com',
  region: 'Астана',
  city: 'Астана',
  school: 'Гимназия №60',
  schoolType: 'gymnasium',
  language: 'ru',
  gender: 'male',
  createdAt: '2026-03-15T13:00:00Z',
}

const scoresD = makeScores('cand_timur', {
  resourcefulness: { score: 4, reasoning: 'Технически грамотный подход к решению проблемы. Предложил автоматизацию через Python скрипт.' },
  growth_trajectory: { score: 3, reasoning: 'Описывает рост в техническом плане — от HTML до fullstack. Слабо про личностный рост.' },
  social_leadership: { score: 2, reasoning: 'Предпочитает работать один. В SJT избегает конфронтации, выбирает пассивные стратегии.' },
  creative_problem_solving: { score: 4, reasoning: 'Нестандартные технические решения. Думает системно.' },
  authentic_voice: { score: 3, reasoning: 'Честный но сухой стиль. Фокус на фактах, мало эмоций и личных историй.' },
  community_commitment: { score: 2, reasoning: 'Планы сфокусированы на личной карьере. Слабое понимание социального импакта.' },
  cognitive_capacity: { score: 5, reasoning: 'Digit span: 9. BART: идеальная калибровка риска. Самая быстрая реакция из всех кандидатов.' },
})

// Candidate E: Strong community commitment, lower cognitive but high growth trajectory
const candidateE: Candidate = {
  id: 'cand_madina',
  name: 'Мадина Алтынбекова',
  email: 'madina@example.com',
  region: 'Актюбинская область',
  city: 'Актобе',
  school: 'СШ №3',
  schoolType: 'general',
  language: 'ru',
  gender: 'female',
  createdAt: '2026-03-15T14:00:00Z',
}

const scoresE = makeScores('cand_madina', {
  resourcefulness: { score: 4, reasoning: 'Организовала сбор средств для школьной библиотеки через Instagram, собрала 200,000 тенге за 2 недели.' },
  growth_trajectory: { score: 5, reasoning: 'Невероятная история роста: из семьи с минимальным доходом, сама выучила английский по YouTube, выиграла олимпиаду.' },
  social_leadership: { score: 4, reasoning: 'Создала волонтёрскую группу помощи пожилым. Мотивирует сверстников примером, не приказами.' },
  creative_problem_solving: { score: 3, reasoning: 'Практичные решения основанные на реальном опыте. Не самые оригинальные но работающие.' },
  authentic_voice: { score: 5, reasoning: 'Самый аутентичный голосовой ответ. Живая история, конкретные имена и места, эмоциональная глубина.' },
  community_commitment: { score: 5, reasoning: 'Хочет создать сеть бесплатных репетиторских центров в Актобе. Уже имеет план и партнёров.' },
  cognitive_capacity: { score: 2, reasoning: 'Digit span: 5. BART: импульсивная стратегия, много лопнувших шариков. Ниже среднего.' },
})

export const DEMO_CANDIDATES: Array<{
  candidate: Candidate
  scores: Score[]
  authenticityScore: number
  status: CandidateWithScores['status']
}> = [
  { candidate: candidateA, scores: scoresA, authenticityScore: 0.94, status: 'shortlisted' },
  { candidate: candidateB, scores: scoresB, authenticityScore: 0.42, status: 'flagged' },
  { candidate: candidateC, scores: scoresC, authenticityScore: 0.88, status: 'reviewed' },
  { candidate: candidateD, scores: scoresD, authenticityScore: 0.81, status: 'reviewed' },
  { candidate: candidateE, scores: scoresE, authenticityScore: 0.96, status: 'shortlisted' },
]
