/* eslint-disable prettier/prettier */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SPORT_VIDEOS: Record<string, string> = {
  Йога: 'LTWYnDD9PiM',
  Кардио: 'ml6cT4AZdqI',
  Силовые: 'UBMk30rjy0o',
  HIIT: 'TkaYafQ-XC4',
  Стретчинг: 'L_xrDAtykMI',
  Пилатес: 'g_tea8ZNk5A',
  Функциональный: 'IODxDxX7oi4',
  Бокс: 'p6b9zPIWJBo',
};

type ExDef = { name: string; duration: number; restAfter: number };

const EXERCISES: Record<string, ExDef[]> = {
  Йога: [
    { name: 'Дыхательные упражнения', duration: 76, restAfter: 1 },
    { name: 'Растяжка спины', duration: 56, restAfter: 1 },
    { name: 'Растяжка рук и шеи', duration: 94, restAfter: 1 },
    { name: 'Растяжка запястий и переход в позу кошки', duration: 57, restAfter: 1 },
    { name: 'Поза ребёнка и возвращение в исходное положение', duration: 248, restAfter: 1 },
    { name: 'Планка и собака вниз', duration: 265, restAfter: 1 },
    { name: 'Работа с тазом и мула-бандха', duration: 138, restAfter: 1 },
    { name: 'Скрутки и перекаты', duration: 385, restAfter: 1 },
    { name: 'Завершение практики', duration: 167, restAfter: 0 },
  ],
  Кардио: [
    { name: 'Разминка — марш на месте', duration: 60, restAfter: 0 },
    { name: 'Джампинг-джек', duration: 40, restAfter: 20 },
    { name: 'Высокие колени', duration: 40, restAfter: 20 },
    { name: 'Бурпи', duration: 30, restAfter: 30 },
    { name: 'Боковые прыжки', duration: 40, restAfter: 20 },
    { name: 'Бег на месте (спринт)', duration: 30, restAfter: 30 },
    { name: 'Mountain climbers', duration: 40, restAfter: 20 },
    { name: 'Заминка — ходьба на месте', duration: 60, restAfter: 0 },
  ],
  Силовые: [
    { name: 'Разминка — суставная гимнастика', duration: 60, restAfter: 0 },
    { name: 'Приседания', duration: 45, restAfter: 30 },
    { name: 'Отжимания', duration: 40, restAfter: 30 },
    { name: 'Выпады поочерёдно', duration: 45, restAfter: 30 },
    { name: 'Планка', duration: 45, restAfter: 20 },
    { name: 'Гиперэкстензия лёжа', duration: 40, restAfter: 20 },
    { name: 'Скручивания на пресс', duration: 40, restAfter: 20 },
    { name: 'Заминка — растяжка', duration: 60, restAfter: 0 },
  ],
  HIIT: [
    { name: 'Разминка 2 мин', duration: 120, restAfter: 0 },
    { name: 'Бурпи ×10', duration: 30, restAfter: 10 },
    { name: 'Прыжки на месте ×20', duration: 30, restAfter: 10 },
    { name: 'Mountain climbers ×20', duration: 30, restAfter: 10 },
    { name: 'Приседания-прыжки ×10', duration: 30, restAfter: 10 },
    { name: 'Отжимания ×10', duration: 30, restAfter: 10 },
    { name: 'Высокие колени 30 сек', duration: 30, restAfter: 10 },
    { name: 'Заминка', duration: 60, restAfter: 0 },
  ],
  Стретчинг: [
    { name: 'Наклон к ногам стоя', duration: 60, restAfter: 10 },
    { name: 'Поза бабочки', duration: 60, restAfter: 10 },
    { name: 'Растяжка квадрицепса стоя', duration: 45, restAfter: 10 },
    { name: 'Боковой наклон сидя', duration: 45, restAfter: 10 },
    { name: 'Поза голубя', duration: 60, restAfter: 10 },
    { name: 'Растяжка грудных мышц', duration: 45, restAfter: 10 },
    { name: 'Поперечный шпагат (попытка)', duration: 60, restAfter: 10 },
    { name: 'Шавасана — расслабление', duration: 60, restAfter: 0 },
  ],
  Пилатес: [
    { name: 'Дыхание по Пилатесу', duration: 60, restAfter: 10 },
    { name: 'Сотня (The Hundred)', duration: 60, restAfter: 15 },
    { name: 'Перекаты на спине', duration: 45, restAfter: 15 },
    { name: 'Ножницы', duration: 45, restAfter: 15 },
    { name: 'Велосипед', duration: 45, restAfter: 15 },
    { name: 'Мост', duration: 45, restAfter: 15 },
    { name: 'Боковые подъёмы ног', duration: 45, restAfter: 15 },
    { name: 'Планка Пилатес', duration: 45, restAfter: 0 },
  ],
  Функциональный: [
    { name: 'Разминка', duration: 60, restAfter: 0 },
    { name: 'Рывок гири', duration: 40, restAfter: 20 },
    { name: 'Турецкий подъём', duration: 45, restAfter: 25 },
    { name: 'Прыжки на ящик', duration: 30, restAfter: 30 },
    { name: 'Тяга резины стоя', duration: 40, restAfter: 20 },
    { name: 'Берпи с отжиманием', duration: 30, restAfter: 30 },
    { name: 'Фермерская прогулка', duration: 40, restAfter: 20 },
    { name: 'Заминка', duration: 60, restAfter: 0 },
  ],
  Бокс: [
    { name: 'Разминка — скакалка', duration: 60, restAfter: 10 },
    { name: 'Стойка и прямой удар (джеб)', duration: 45, restAfter: 15 },
    { name: 'Хук с обеих рук', duration: 45, restAfter: 15 },
    { name: 'Апперкот', duration: 45, restAfter: 15 },
    { name: 'Комбо: джеб-кросс-хук', duration: 45, restAfter: 15 },
    { name: 'Уклоны и защита', duration: 45, restAfter: 15 },
    { name: 'Работа в тени 2 мин', duration: 120, restAfter: 30 },
    { name: 'Заминка', duration: 60, restAfter: 0 },
  ],
};

const PROGRAMS = [
  // ЙОГА
  {
    nick: 'yoga-morning-beginner',
    name: 'Утренняя йога для начинающих',
    sport: 'Йога',
    level: 'Начинающий',
    duration: 20,
    calories: 180,
    rating: 4.8,
    reviewsCount: 124,
    completedCount: 1830,
  },
  {
    nick: 'yoga-flexibility',
    name: 'Йога для гибкости',
    sport: 'Йога',
    level: 'Средний',
    duration: 30,
    calories: 220,
    rating: 4.7,
    reviewsCount: 98,
    completedCount: 1240,
  },
  {
    nick: 'yoga-power',
    name: 'Power Yoga: сила и гибкость',
    sport: 'Йога',
    level: 'Продвинутый',
    duration: 45,
    calories: 320,
    rating: 4.9,
    reviewsCount: 76,
    completedCount: 890,
  },
  // КАРДИО
  {
    nick: 'cardio-beginner',
    name: 'Кардио для новичков',
    sport: 'Кардио',
    level: 'Начинающий',
    duration: 20,
    calories: 280,
    rating: 4.6,
    reviewsCount: 211,
    completedCount: 3100,
  },
  {
    nick: 'cardio-fat-burn',
    name: 'Сжигание жира: 30 минут',
    sport: 'Кардио',
    level: 'Средний',
    duration: 30,
    calories: 380,
    rating: 4.8,
    reviewsCount: 187,
    completedCount: 2750,
  },
  {
    nick: 'cardio-advanced',
    name: 'Высокоинтенсивное кардио',
    sport: 'Кардио',
    level: 'Продвинутый',
    duration: 45,
    calories: 520,
    rating: 4.7,
    reviewsCount: 93,
    completedCount: 1100,
  },
  // СИЛОВЫЕ
  {
    nick: 'strength-basics',
    name: 'Сила с нуля: базовые упражнения',
    sport: 'Силовые',
    level: 'Начинающий',
    duration: 30,
    calories: 300,
    rating: 4.9,
    reviewsCount: 302,
    completedCount: 4200,
  },
  {
    nick: 'strength-legs',
    name: 'Прокачка ног и ягодиц',
    sport: 'Силовые',
    level: 'Средний',
    duration: 45,
    calories: 420,
    rating: 4.8,
    reviewsCount: 214,
    completedCount: 3050,
  },
  {
    nick: 'strength-fullbody',
    name: 'Full Body: тело за 45 минут',
    sport: 'Силовые',
    level: 'Продвинутый',
    duration: 45,
    calories: 480,
    rating: 4.7,
    reviewsCount: 145,
    completedCount: 1980,
  },
  // HIIT
  {
    nick: 'hiit-beginner',
    name: 'HIIT для начинающих',
    sport: 'HIIT',
    level: 'Начинающий',
    duration: 20,
    calories: 320,
    rating: 4.7,
    reviewsCount: 178,
    completedCount: 2600,
  },
  {
    nick: 'hiit-tabata',
    name: 'Табата: 20/10',
    sport: 'HIIT',
    level: 'Средний',
    duration: 20,
    calories: 380,
    rating: 4.9,
    reviewsCount: 256,
    completedCount: 3800,
  },
  {
    nick: 'hiit-total',
    name: 'Тотальный HIIT',
    sport: 'HIIT',
    level: 'Продвинутый',
    duration: 30,
    calories: 480,
    rating: 4.8,
    reviewsCount: 112,
    completedCount: 1450,
  },
  // СТРЕТЧИНГ
  {
    nick: 'stretch-fullbody',
    name: 'Растяжка всего тела',
    sport: 'Стретчинг',
    level: 'Начинающий',
    duration: 20,
    calories: 130,
    rating: 4.8,
    reviewsCount: 198,
    completedCount: 2900,
  },
  {
    nick: 'stretch-splits',
    name: 'Шпагат за 30 дней',
    sport: 'Стретчинг',
    level: 'Средний',
    duration: 30,
    calories: 160,
    rating: 4.9,
    reviewsCount: 321,
    completedCount: 4500,
  },
  {
    nick: 'stretch-athletes',
    name: 'Стретчинг для спортсменов',
    sport: 'Стретчинг',
    level: 'Продвинутый',
    duration: 45,
    calories: 200,
    rating: 4.7,
    reviewsCount: 87,
    completedCount: 1100,
  },
  // ПИЛАТЕС
  {
    nick: 'pilates-beginner',
    name: 'Классический пилатес',
    sport: 'Пилатес',
    level: 'Начинающий',
    duration: 30,
    calories: 200,
    rating: 4.8,
    reviewsCount: 167,
    completedCount: 2300,
  },
  {
    nick: 'pilates-back',
    name: 'Пилатес для спины',
    sport: 'Пилатес',
    level: 'Средний',
    duration: 30,
    calories: 220,
    rating: 4.9,
    reviewsCount: 289,
    completedCount: 3900,
  },
  {
    nick: 'pilates-power',
    name: 'Power Pilates',
    sport: 'Пилатес',
    level: 'Продвинутый',
    duration: 45,
    calories: 300,
    rating: 4.7,
    reviewsCount: 78,
    completedCount: 980,
  },
  // ФУНКЦИОНАЛЬНЫЙ
  {
    nick: 'functional-basics',
    name: 'Функциональный тренинг с нуля',
    sport: 'Функциональный',
    level: 'Начинающий',
    duration: 30,
    calories: 320,
    rating: 4.7,
    reviewsCount: 143,
    completedCount: 2100,
  },
  {
    nick: 'functional-kettlebell',
    name: 'Тренировка с гирей',
    sport: 'Функциональный',
    level: 'Средний',
    duration: 30,
    calories: 380,
    rating: 4.8,
    reviewsCount: 97,
    completedCount: 1380,
  },
  {
    nick: 'functional-crossfit',
    name: 'Кроссфит-основы',
    sport: 'Функциональный',
    level: 'Продвинутый',
    duration: 45,
    calories: 500,
    rating: 4.9,
    reviewsCount: 134,
    completedCount: 1750,
  },
  // БОМ
  {
    nick: 'boxing-beginner',
    name: 'Бокс для начинающих',
    sport: 'Бокс',
    level: 'Начинающий',
    duration: 20,
    calories: 280,
    rating: 4.8,
    reviewsCount: 201,
    completedCount: 2800,
  },
  {
    nick: 'boxing-shadow',
    name: 'Shadowboxing: техника и скорость',
    sport: 'Бокс',
    level: 'Средний',
    duration: 30,
    calories: 380,
    rating: 4.9,
    reviewsCount: 178,
    completedCount: 2300,
  },
  {
    nick: 'boxing-advanced',
    name: 'Продвинутый бокс',
    sport: 'Бокс',
    level: 'Продвинутый',
    duration: 45,
    calories: 520,
    rating: 4.8,
    reviewsCount: 89,
    completedCount: 1100,
  },
];

const DESCRIPTIONS: Record<string, string> = {
  Йога: 'Гармоничное сочетание асан, дыхания и медитации для баланса тела и разума.',
  Кардио: 'Эффективная кардионагрузка для улучшения работы сердца и сжигания калорий.',
  Силовые: 'Целенаправленные силовые упражнения для наращивания мышечной массы и силы.',
  HIIT: 'Высокоинтенсивные интервальные тренировки для максимального жиросжигания.',
  Стретчинг: 'Глубокая растяжка мышц и связок для гибкости, подвижности и восстановления.',
  Пилатес: 'Система упражнений для укрепления кора, улучшения осанки и контроля тела.',
  Функциональный: 'Комплексные движения для разностороннего развития силы и координации.',
  Бокс: 'Техника боксёрских ударов и защиты для координации, силы и выносливости.',
};

const TEXTS: Record<string, string> = {
  Йога: '<p>Йога объединяет физические упражнения, дыхательные практики и медитацию.</p><p>Каждое занятие начинается с разминки и заканчивается шавасаной.</p>',
  Кардио:
    '<p>Кардиотренировки — основа здоровья сердечно-сосудистой системы.</p><p>Интенсивность постепенно возрастает от занятия к занятию.</p>',
  Силовые:
    '<p>Программа построена на базовых многосуставных упражнениях.</p><p>Включает периоды восстановления для максимальной эффективности.</p>',
  HIIT: '<p>HIIT — самый эффективный способ сжечь жир за короткое время.</p><p>Эффект дожигания калорий продолжается 24–48 часов после тренировки.</p>',
  Стретчинг:
    '<p>Программа включает статическую и динамическую растяжку для всех групп мышц.</p><p>Регулярный стретчинг снижает риск травм и улучшает осанку.</p>',
  Пилатес:
    '<p>Центральное место занимает работа с мышцами кора.</p><p>Упражнения выполняются медленно и осознанно с акцентом на дыхание.</p>',
  Функциональный:
    '<p>Функциональные движения задействуют несколько суставов и мышечных групп.</p><p>Улучшает координацию, равновесие и взрывную силу.</p>',
  Бокс: '<p>Изучите базовые удары, защитные техники и работу ног.</p><p>Отличный способ снять стресс и улучшить реакцию.</p>',
};

async function main() {
  console.log('Очищаем базу данных...');
  await prisma.mark.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.program.deleteMany();
  await prisma.trainer.deleteMany();
  await prisma.user.deleteMany();

  console.log('Создаём тренеров...');
  await prisma.trainer.createMany({
    data: [
      {
        name: 'Алексей Волков',
        username: '@alex_volkov',
        specialty: 'Силовые тренировки',
        bio: 'Мастер спорта по тяжёлой атлетике. 10 лет тренерского опыта.',
        experience: 10,
        rating: 4.9,
        clientsCount: 310,
        certificationsCount: 5,
        sports: ['Силовые', 'Функциональный'],
        education: 'РГУФКСМиТ',
        achievements: ['Мастер спорта по тяжёлой атлетике', 'Certified Strength Coach (NSCA)'],
      },
      {
        name: 'Мария Соколова',
        username: '@maria_sokolova',
        specialty: 'Кардио и йога',
        bio: 'Сертифицированный тренер по фитнесу и йоге. Практикует более 12 лет.',
        experience: 7,
        rating: 4.8,
        clientsCount: 210,
        certificationsCount: 4,
        sports: ['Кардио', 'Йога'],
        education: 'СПБГУ',
        achievements: ['500-ч сертификат RYT', 'ACE Certified Personal Trainer'],
      },
      {
        name: 'Анна Крылова',
        username: '@anna_krylova',
        specialty: 'Йога и медитация',
        bio: 'Преподаватель хатха- и кундалини-йоги. Более 500 часов обучения в Индии.',
        experience: 9,
        rating: 4.9,
        clientsCount: 195,
        certificationsCount: 6,
        sports: ['Йога', 'Стретчинг'],
        education: 'Sivananda Yoga Vedanta Centre',
        achievements: ['E-RYT 500 (Yoga Alliance)'],
      },
      {
        name: 'Дмитрий Орлов',
        username: '@dmitry_orlov',
        specialty: 'Стретчинг и мобильность',
        bio: 'Физиотерапевт. Специализируется на гибкости и реабилитации.',
        experience: 12,
        rating: 4.7,
        clientsCount: 180,
        certificationsCount: 6,
        sports: ['Стретчинг', 'Пилатес'],
        education: 'Первый МГМУ',
        achievements: ['STOTT Pilates Certified', 'FMS Level 2'],
      },
      {
        name: 'Ольга Зайцева',
        username: '@olga_zaitseva',
        specialty: 'Пилатес и реабилитация',
        bio: 'Инструктор по пилатесу. Работает при болях в спине и сколиозе.',
        experience: 11,
        rating: 4.9,
        clientsCount: 160,
        certificationsCount: 5,
        sports: ['Пилатес', 'Стретчинг'],
        education: 'РГПУ им. Герцена',
        achievements: ['Balanced Body Pilates Certified'],
      },
      {
        name: 'Сергей Громов',
        username: '@sergey_gromov',
        specialty: 'HIIT и функциональный тренинг',
        bio: 'Тренер-методист. Создаёт HIIT-программы для максимального результата.',
        experience: 6,
        rating: 4.7,
        clientsCount: 255,
        certificationsCount: 3,
        sports: ['HIIT', 'Функциональный'],
        education: 'РГУФКСМиТ',
        achievements: ['NASM Certified', 'Kettlebell Instructor (RKC)'],
      },
      {
        name: 'Екатерина Ли',
        username: '@kate_lee',
        specialty: 'Бокс и единоборства',
        bio: 'Мастер спорта по боксу. Создаёт интенсивные программы с акцентом на технику.',
        experience: 8,
        rating: 4.9,
        clientsCount: 290,
        certificationsCount: 5,
        sports: ['Бокс', 'HIIT'],
        education: 'Поволжская академия спорта',
        achievements: ['Мастер спорта по боксу', 'Certified Boxing Coach (AIBA)'],
      },
      {
        name: 'Павел Тихонов',
        username: '@pavel_tikhonov',
        specialty: 'Кроссфит и функциональный тренинг',
        bio: 'Сертифицированный тренер по кроссфиту Level 2.',
        experience: 10,
        rating: 4.8,
        clientsCount: 220,
        certificationsCount: 4,
        sports: ['Функциональный', 'Силовые'],
        education: 'CrossFit Level 2 Trainer, NSCA-CSCS',
        achievements: ['CrossFit Level 2 Certificate'],
      },
    ],
  });

  console.log('Создаём программы...');
  for (const p of PROGRAMS) {
    const exercises = EXERCISES[p.sport];
    // Считаем реальную длительность из упражнений (в минутах), фолбэк — из PROGRAMS
    const totalSec = exercises.reduce((acc, e) => acc + e.duration + e.restAfter, 0);
    const computedDuration = Math.max(p.duration, Math.round(totalSec / 60));

    await prisma.program.create({
      data: {
        nick: p.nick,
        name: p.name,
        sport: p.sport,
        level: p.level,
        duration: computedDuration,
        calories: p.calories,
        description: DESCRIPTIONS[p.sport],
        text: TEXTS[p.sport],
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        completedCount: p.completedCount,
        videoId: SPORT_VIDEOS[p.sport],
        exercises: {
          create: exercises.map((ex, idx) => ({
            name: ex.name,
            order: idx,
            duration: ex.duration,
            restAfter: ex.restAfter,
          })),
        },
      },
    });
  }

  console.log('Создаём тестового пользователя...');
  await prisma.user.create({
    data: {
      name: 'Арина Волчек',
      email: 'arina.volchek@example.com',
      password: '123456',
    },
  });

  const total = await prisma.program.count();
  console.log(`✓ Создано ${total} программ, 8 тренеров, 1 пользователь.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
