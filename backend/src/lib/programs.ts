import _ from 'lodash';

export const SPORTS = ['Йога', 'Кардио', 'Силовые', 'HIIT', 'Стретчинг', 'Пилатес', 'Функциональный', 'Бокс'] as const;
export const LEVELS = ['Начинающий', 'Средний', 'Продвинутый'] as const;
export const DURATIONS = [15, 20, 30, 45, 60] as const;

export const programs = _.times(100, (i) => ({
  id: String(i),
  name: `Программа ${i + 1}`,
  sport: SPORTS[i % SPORTS.length],
  level: LEVELS[i % LEVELS.length],
  duration: DURATIONS[i % DURATIONS.length],
  calories: 150 + (i % 8) * 50,
  description: `Описание программы ${i + 1}. Эффективная тренировка для развития силы и выносливости.`,
  text: _.times(10, (j) => `<p>Параграф ${j} программы ${i + 1}...</p>`).join(''),
  exercises: _.times(7, (j) => ({ id: j, name: `Упражнение ${j + 1}` })),
  rating: parseFloat((3.6 + (i % 15) * 0.1).toFixed(1)),
  reviewsCount: 10 + i * 3,
  completedCount: 100 + i * 12,
}));

export const userProfile = {
  name: 'Арина Волчек',
  email: 'arina.volchek@example.com',
};

export const users = [{ id: '1', name: 'Арина Волчек', email: 'arina.volchek@example.com', password: '123456' }];

export type MarkType = 'completed' | 'favorite' | 'wantTo';

export interface ProgramMark {
  programName: string;
  mark: MarkType;
  markedAt: string;
}

const userMarksStore = new Map<string, ProgramMark[]>();

const DEFAULT_USER_ID = '1';

export const getMarks = (userId = DEFAULT_USER_ID): ProgramMark[] => {
  return userMarksStore.get(userId) ?? [];
};

export const setMark = (programName: string, mark: MarkType, userId = DEFAULT_USER_ID): ProgramMark[] => {
  const marks = getMarks(userId).filter((m) => m.programName !== programName);
  marks.push({ programName, mark, markedAt: new Date().toISOString() });
  userMarksStore.set(userId, marks);
  return marks;
};

export const removeMark = (programName: string, userId = DEFAULT_USER_ID): ProgramMark[] => {
  const marks = getMarks(userId).filter((m) => m.programName !== programName);
  userMarksStore.set(userId, marks);
  return marks;
};
