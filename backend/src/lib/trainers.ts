export interface Trainer {
  id: string
  name: string
  username: string
  specialty: string
  bio: string
  experience: number
  rating: number
  clientsCount: number
  certificationsCount: number
  programIds: string[]
}

export const trainers: Trainer[] = [
  {
    id: 'trainer-1',
    name: 'Алексей Волков',
    username: '@alex_volkov',
    specialty: 'Силовые тренировки',
    bio: 'Мастер спорта по тяжёлой атлетике. 10 лет тренерского опыта.',
    experience: 10,
    rating: 4.9,
    clientsCount: 340,
    certificationsCount: 5,
    programIds: ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'],
  },
  {
    id: 'trainer-2',
    name: 'Мария Соколова',
    username: '@maria_sokolova',
    specialty: 'Кардио и HIIT',
    bio: 'Сертифицированный тренер по фитнесу и йоге.',
    experience: 7,
    rating: 4.8,
    clientsCount: 210,
    certificationsCount: 4,
    programIds: ['25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49'],
  },
  {
    id: 'trainer-3',
    name: 'Дмитрий Орлов',
    username: '@dmitry_orlov',
    specialty: 'Стретчинг и мобильность',
    bio: 'Физиотерапевт и тренер по восстановительным практикам.',
    experience: 12,
    rating: 4.7,
    clientsCount: 180,
    certificationsCount: 6,
    programIds: ['50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74'],
  },
  {
    id: 'trainer-4',
    name: 'Екатерина Ли',
    username: '@kate_lee',
    specialty: 'Функциональный тренинг',
    bio: 'Бывший профессиональный гимнаст.',
    experience: 8,
    rating: 4.9,
    clientsCount: 290,
    certificationsCount: 5,
    programIds: ['75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99'],
  },
]