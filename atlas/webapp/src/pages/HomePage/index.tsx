import { Link } from 'react-router-dom';
import { getAllProgramsRoute, getRegisterRoute } from '../../lib/routes';
import css from './index.module.scss';

const PROGRAMS = [
  { name: 'Full body mobility', category: 'Фитнес', emoji: '🏋️' },
  { name: 'Продольный шпагат', category: 'Растяжка', emoji: '🤸' },
  { name: 'Кундалини йога', category: 'Йога', emoji: '🧘' },
  { name: 'Утренняя йога', category: 'Йога', emoji: '☀️' },
  { name: 'Functional core', category: 'Пилатес', emoji: '💪' },
];

const FEATURES = [
  { icon: '🏋️', title: 'Для любого уровня', text: 'Тренировки для новичков и опытных спортсменов' },
  { icon: '✅', title: 'Сертифицированные тренеры', text: 'Проверенные эксперты с подтверждёнными дипломами' },
  { icon: '🏠', title: 'Удобно дома', text: 'Занимайтесь когда и где хотите без поездок в зал' },
  { icon: '📈', title: 'Трекинг прогресса', text: 'Видите свои результаты в личном кабинете' },
];

const TRAINERS = [
  { name: 'Анна Иванова', spec: 'Фитнес', initials: 'АИ' },
  { name: 'Игорь Смирнов', spec: 'Силовые', initials: 'ИС' },
  { name: 'Мария Коваль', spec: 'Йога', initials: 'МК' },
  { name: 'Алексей Петров', spec: 'Функциональный', initials: 'АП' },
  { name: 'Екатерина Орлова', spec: 'Пилатес', initials: 'ЕО' },
  { name: 'Дмитрий Волков', spec: 'Кардио', initials: 'ДВ' },
];

const REVIEWS = [
  { text: 'Занимаюсь на ATLAS уже месяц — реально видно прогресс! Рекомендую всем.', author: 'Александр' },
  { text: 'Очень удобно тренироваться дома, программы понятные и хорошо структурированные.', author: 'Елена' },
  { text: 'Лучшие тренеры и отличная подача материала. Наконец-то нашла свой формат.', author: 'Максим' },
];

export const HomePage = () => {
  return (
    <>
      {/* Hero */}
      <section className={css.hero}>
        <div className={css.heroContent}>
          <div className={css.heroEyebrow}>🏅 Платформа тренировок №1</div>
          <h1 className={css.heroTitle}>
            Домашние тренировки<br />с <span>лучшими тренерами</span>
          </h1>
          <p className={css.heroText}>
            Платформа ATLAS — ваш персональный гид в мире домашних тренировок.
            Подберите программу, следите за прогрессом, достигайте целей.
          </p>
          <div className={css.heroActions}>
            <Link to={getAllProgramsRoute()} className={css.ctaButton}>
              Начни тренироваться →
            </Link>
            <Link to={getRegisterRoute()} className={css.secondaryBtn}>
              Создать аккаунт
            </Link>
          </div>
        </div>

        <div className={css.heroStats}>
          <div className={css.heroStatCard}>
            <div className={css.heroStatVal}>50+</div>
            <div className={css.heroStatLabel}>Программ тренировок</div>
          </div>
          <div className={css.heroStatCard}>
            <div className={css.heroStatVal}>6</div>
            <div className={css.heroStatLabel}>Опытных тренеров</div>
          </div>
          <div className={css.heroStatCard}>
            <div className={css.heroStatVal}>1K+</div>
            <div className={css.heroStatLabel}>Активных пользователей</div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className={css.section}>
        <div className={css.sectionContainer}>
          <div className={css.sectionEyebrow}>🔥 Популярное</div>
          <h2 className={css.sectionTitle}>Наши лучшие программы</h2>
          <p className={css.sectionSubtitle}>
            Проверенные программы от сертифицированных тренеров для любого уровня подготовки
          </p>
          <div className={css.programsGrid}>
            {PROGRAMS.map((p) => (
              <div key={p.name} className={css.programCard}>
                <span className={css.programEmoji}>{p.emoji}</span>
                <div className={css.programName}>{p.name}</div>
                <div className={css.programCategory}>{p.category}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className={css.splitDivider} />

      {/* Features */}
      <section className={css.section}>
        <div className={css.sectionContainer}>
          <div className={css.sectionEyebrow}>✨ Преимущества</div>
          <h2 className={css.sectionTitle}>Почему ATLAS?</h2>
          <p className={css.sectionSubtitle}>
            Всё что нужно для эффективных тренировок — в одном месте
          </p>
          <div className={css.featuresGrid}>
            {FEATURES.map((f) => (
              <div key={f.title} className={css.feature}>
                <div className={css.featureIcon}>{f.icon}</div>
                <div className={css.featureTitle}>{f.title}</div>
                <div className={css.featureText}>{f.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className={css.splitDivider} />

      {/* Service split */}
      <section className={css.section}>
        <div className={css.sectionContainer}>
          <div className={css.splitSection}>
            <div className={css.splitText}>
              <div className={css.sectionEyebrow}>🎯 Наш сервис</div>
              <h2 className={css.sectionTitle}>Тренируйся умно, а не тяжело</h2>
              <p className={css.sectionSubtitle}>
                Платформа ATLAS позволяет легко подобрать программу тренировок под ваш уровень и цели.
                Занимайтесь дома и следите за прогрессом прямо в приложении.
              </p>
              <Link to={getAllProgramsRoute()} className={css.ctaButton} style={{ alignSelf: 'flex-start' }}>
                Смотреть программы →
              </Link>
            </div>
            <div className={css.splitVisual}>🏋️‍♀️</div>
          </div>
        </div>
      </section>

      <hr className={css.splitDivider} />

      {/* Support split */}
      <section className={css.section}>
        <div className={css.sectionContainer}>
          <div className={`${css.splitSection} ${css.splitSectionReverse}`}>
            <div className={css.splitText}>
              <div className={css.sectionEyebrow}>💬 Мотивация</div>
              <h2 className={css.sectionTitle}>Поддержка на каждом шагу</h2>
              <p className={css.sectionSubtitle}>
                Наши тренеры всегда готовы дать советы и поддержать вас. Система трекинга прогресса
                помогает оставаться мотивированным каждый день.
              </p>
            </div>
            <div className={css.splitVisual}>💪</div>
          </div>
        </div>
      </section>

      <hr className={css.splitDivider} />

      {/* Trainers */}
      <section className={css.section}>
        <div className={css.sectionContainer}>
          <div className={css.sectionEyebrow}>👥 Команда</div>
          <h2 className={css.sectionTitle}>Тренерский состав</h2>
          <p className={css.sectionSubtitle}>
            Профессионалы с многолетним опытом — для вашего результата
          </p>
          <div className={css.trainersGrid}>
            {TRAINERS.map((t) => (
              <div key={t.name} className={css.trainerCard}>
                <div className={css.trainerAvatar}>{t.initials}</div>
                <div className={css.trainerName}>{t.name}</div>
                <div className={css.trainerSpec}>{t.spec}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className={css.splitDivider} />

      {/* Reviews */}
      <section className={css.section}>
        <div className={css.sectionContainer}>
          <div className={css.sectionEyebrow}>⭐ Отзывы</div>
          <h2 className={css.sectionTitle}>Что говорят пользователи</h2>
          <p className={css.sectionSubtitle}>Реальные результаты реальных людей</p>
          <div className={css.reviewsGrid}>
            {REVIEWS.map((r) => (
              <div key={r.author} className={css.reviewCard}>
                <div className={css.reviewStars}>★★★★★</div>
                <p className={css.reviewText}>«{r.text}»</p>
                <div className={css.reviewAuthor}>{r.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={css.section}>
        <div className={css.sectionContainer}>
          <div className={css.ctaBanner}>
            <h2 className={css.ctaBannerTitle}>Готов начать?</h2>
            <p className={css.ctaBannerText}>Зарегистрируйся бесплатно и начни тренироваться уже сегодня</p>
            <Link to={getRegisterRoute()} className={css.ctaBannerBtn}>
              Создать аккаунт →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
