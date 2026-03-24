import _ from 'lodash'

export const SPORTS = ['Йога', 'Кардио', 'Силовые', 'HIIT', 'Стретчинг', 'Пилатес', 'Функциональный', 'Бокс'] as const
export const LEVELS = ['Начинающий', 'Средний', 'Продвинутый'] as const
export const DURATIONS = [15, 20, 30, 45, 60] as const

export const programs = _.times(100, (i) => ({
  id: String(i),
  name: `program-${i}`,
  sport: SPORTS[i % SPORTS.length],
  level: LEVELS[i % LEVELS.length],
  duration: DURATIONS[i % DURATIONS.length],
  calories: 150 + (i % 8) * 50,
  description: `Описание программы ${i}. Эффективная тренировка для развития силы и выносливости.`,
  text: _.times(10, (j) => `<p>Параграф ${j} программы ${i}...</p>`).join(''),
  exercises: _.times(4 + (i % 5), (j) => ({ id: j, name: `Упражнение ${j + 1}` })),
  rating: parseFloat((3.5 + (i % 15) * 0.1).toFixed(1)),
  reviewsCount: 10 + i * 3,
  completedCount: 100 + i * 12,
}))

export const userProfile = {
  name: 'Арина Волчек',
  email: 'arina.volchek@example.com',
}

export const users = [
  { id: '1', name: 'Арина Волчек', email: 'arina.volchek@example.com', password: '123456' },
]
