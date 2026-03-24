export interface Trainer {
  id: string;
  name: string;
  username: string;
  specialty: string;
  bio: string;
  experience: number;
  rating: number;
  clientsCount: number;
  certificationsCount: number;
  sports: string[];
}

export const trainers: Trainer[] = [
  {
    id: 'trainer-1',
    name: 'Алексей Волков',
    username: '@alex_volkov',
    specialty: 'Силовые тренировки',
    bio: 'Мастер спорта по тяжёлой атлетике. 10 лет тренерского опыта. Специализируется на силовых и функциональных тренировках.',
    experience: 10,
    rating: 4.9,
    clientsCount: 340,
    certificationsCount: 5,
    sports: ['Силовые', 'HIIT', 'Функциональный'],
  },
  {
    id: 'trainer-2',
    name: 'Мария Соколова',
    username: '@maria_sokolova',
    specialty: 'Кардио и йога',
    bio: 'Сертифицированный тренер по фитнесу и йоге. Помогает улучшить выносливость и гибкость через осознанное движение.',
    experience: 7,
    rating: 4.8,
    clientsCount: 210,
    certificationsCount: 4,
    sports: ['Кардио', 'Йога'],
  },
  {
    id: 'trainer-3',
    name: 'Дмитрий Орлов',
    username: '@dmitry_orlov',
    specialty: 'Стретчинг и мобильность',
    bio: 'Физиотерапевт и тренер по восстановительным практикам. Специализируется на гибкости, осанке и реабилитации.',
    experience: 12,
    rating: 4.7,
    clientsCount: 180,
    certificationsCount: 6,
    sports: ['Стретчинг', 'Пилатес'],
  },
  {
    id: 'trainer-4',
    name: 'Екатерина Ли',
    username: '@kate_lee',
    specialty: 'Бокс и единоборства',
    bio: 'Мастер спорта по боксу, тренер по функциональным тренировкам. Создаёт интенсивные программы с акцентом на технику.',
    experience: 8,
    rating: 4.9,
    clientsCount: 290,
    certificationsCount: 5,
    sports: ['Бокс'],
  },
];

export const getTrainerBySport = (sport: string): Trainer => {
  return trainers.find((t) => t.sports.includes(sport)) ?? trainers[0];
};
