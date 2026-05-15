export interface Trainer {
  id: string;
  name: string;
  username: string;
  specialty: string;
  bio: string;
  experience: number;
  rating: number;
  sports: string[];
  location?: string;
  languages?: string[];
  education?: string;
  achievements?: string[];
}

export const trainers: Trainer[] = [
  {
    id: 'trainer-1',
    name: 'Алексей Волков',
    username: '@alex_volkov',
    specialty: 'Силовые тренировки',
    bio: 'Мастер спорта по тяжёлой атлетике. 10 лет тренерского опыта. Специализируется на силовых и функциональных тренировках, работает с любым уровнем подготовки.',
    experience: 10,
    rating: 4.9,
    sports: ['Силовые', 'HIIT', 'Функциональный'],
    location: 'Москва',
    languages: ['Русский', 'English'],
    education: 'РГУФКСМиТ, факультет спорта',
    achievements: ['Мастер спорта по тяжёлой атлетике', 'Чемпион Москвы 2019', 'Certified Strength Coach (NSCA)'],
  },
  {
    id: 'trainer-2',
    name: 'Мария Соколова',
    username: '@maria_sokolova',
    specialty: 'Кардио и йога',
    bio: 'Сертифицированный тренер по фитнесу и йоге. Помогает улучшить выносливость и гибкость через осознанное движение. Практикует более 12 лет.',
    experience: 7,
    rating: 4.8,
    sports: ['Кардио', 'Йога'],
    location: 'Санкт-Петербург',
    languages: ['Русский'],
    education: 'СПБГУ, кафедра физической культуры',
    achievements: [
      '500-часовой сертификат RYT (Yoga Alliance)',
      'ACE Certified Personal Trainer',
      'Участница чемпионата России по фитнесу',
    ],
  },
  {
    id: 'trainer-3',
    name: 'Дмитрий Орлов',
    username: '@dmitry_orlov',
    specialty: 'Стретчинг и мобильность',
    bio: 'Физиотерапевт и тренер по восстановительным практикам. Специализируется на гибкости, осанке и реабилитации после травм.',
    experience: 12,
    rating: 4.7,
    sports: ['Стретчинг', 'Пилатес'],
    location: 'Москва',
    languages: ['Русский', 'Deutsch'],
    education: 'Первый МГМУ, специальность «Физиотерапия»',
    achievements: [
      'Диплом физиотерапевта',
      'STOTT Pilates Certified',
      'FMS Level 2',
      'Реабилитолог сборной по лёгкой атлетике',
    ],
  },
  {
    id: 'trainer-4',
    name: 'Екатерина Ли',
    username: '@kate_lee',
    specialty: 'Бокс и единоборства',
    bio: 'Мастер спорта по боксу, тренер по функциональным тренировкам. Создаёт интенсивные программы с акцентом на технику и взрывную силу.',
    experience: 8,
    rating: 4.9,
    sports: ['Бокс'],
    location: 'Казань',
    languages: ['Русский', 'English', '中文'],
    education: 'Поволжская академия спорта',
    achievements: [
      'Мастер спорта по боксу',
      'Серебро чемпионата России',
      'Certified Boxing Coach (AIBA)',
      'Тренер года 2023 по версии FitAwards',
    ],
  },
];

export const getTrainerBySport = (sport: string): Trainer => {
  return trainers.find((t) => t.sports.includes(sport)) ?? trainers[0];
};
