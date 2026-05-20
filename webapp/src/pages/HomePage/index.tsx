import { Link } from 'react-router-dom';
import { getAllProgramsRoute, getRegisterRoute } from '../../lib/routes';
import { useAuth } from '../../contexts/AuthContext';
import { trpc } from '../../lib/trpc';
import css from './index.module.scss';

const PROGRAMS = [
  { name: 'Full body mobility', category: 'Фитнес', icon: 'fitness' },
  { name: 'Продольный шпагат', category: 'Растяжка', icon: 'stretch' },
  { name: 'Кундалини йога', category: 'Йога', icon: 'yoga' },
  { name: 'Утренняя йога', category: 'Йога', icon: 'morning' },
  { name: 'Functional core', category: 'Пилатес', icon: 'pilates' },
];

const FEATURES = [
  {
    svgPath: 'M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5',
    title: 'Для любого уровня',
    text: 'Тренировки для новичков и опытных спортсменов'
  },
  {
    svgPath: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    title: 'Сертифицированные тренеры',
    text: 'Проверенные эксперты с подтверждёнными дипломами'
  },
  {
    svgPath: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22v-10h6v10',
    title: 'Удобно дома',
    text: 'Занимайтесь когда и где хотите без поездок в зал'
  },
  {
    svgPath: 'M22 12l-4 0-3 9-6-18-3 9-4 0',
    title: 'Трекинг прогресса',
    text: 'Видите свои результаты в личном кабинете'
  },
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
  { text: 'Занимаюсь на ATLAS уже месяц — реально видно прогресс! Рекомендую всем.', author: 'Александр', score: 5 },
  { text: 'Очень удобно тренироваться дома, программы понятные и хорошо структурированные.', author: 'Елена', score: 5 },
  { text: 'Лучшие тренеры и отличная подача материала. Наконец-то нашла свой формат.', author: 'Максим', score: 5 },
];

const PROGRAM_ICONS: Record<string, React.ReactElement> = {
  fitness: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 4v16M18 4v16M3 8h3M18 8h3M3 16h3M18 16h3M6 12h12"/></svg>,
  stretch: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="5" r="2"/><path d="M12 9c-3 0-5 2-5 4 0 1.5 1 2.5 2.5 3L8 20h8l-1.5-4C16 15.5 17 14.5 17 13c0-2-2-4-5-4z"/></svg>,
  yoga: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="4" r="1.5"/><path d="M12 7v5M8 10c1 1 2.5 2 4 2s3-1 4-2M7 17c1-2 2.5-3 5-3s4 1 5 3"/></svg>,
  morning: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="10" r="4"/><path d="M12 2v2M12 18v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M5 22h14"/></svg>,
  pilates: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><ellipse cx="12" cy="12" rx="9" ry="4"/><path d="M3 12c0 4 4 8 9 8s9-4 9-8"/><path d="M12 8v8"/></svg>,
};

const UserDashboard = ({ user }: { user: { name: string; email: string } }) => {
  const { data: profileData } = trpc.getUserProfile.useQuery();
  const marks = (profileData?.marks ?? []) as Array<{ mark: string }>;
  const completed = marks.filter((m) => m.mark === 'completed').length;
  const favorites = marks.filter((m) => m.mark === 'favorite').length;
  const wantTo = marks.filter((m) => m.mark === 'wantTo').length;
  const streak = (profileData as any)?.stats?.streak ?? 0;
  const firstName = user.name.split(' ')[0];

  return (
    <div className={css.userDashboard}>
      <div className={css.dashboardHeader}>
        <div>
          <div className={css.dashboardHello}>С возвращением,</div>
          <div className={css.dashboardName}>{firstName}</div>
        </div>
        <Link to={getAllProgramsRoute()} className={css.ctaButton}>
          Начать тренировку
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16"><path d="M4 10h12M10 4l6 6-6 6"/></svg>
        </Link>
      </div>
      <div className={css.dashboardStats}>
        {[
          { val: completed, label: 'Пройдено тренировок', max: 10, color: 'var(--color-accent)' },
          { val: streak, label: 'Дней подряд', max: 7, color: 'var(--color-warning)' },
          { val: favorites, label: 'В избранном', max: 5, color: '#e94560' },
          { val: wantTo, label: 'Хочу пройти', max: 5, color: '#2b7a78' },
        ].map((s) => (
          <div key={s.label} className={css.dashStat}>
            <div className={css.dashStatVal}>{s.val}</div>
            <div className={css.dashStatLabel}>{s.label}</div>
            <div className={css.dashStatBar}>
              <div className={css.dashStatBarFill} style={{ width: `${Math.min((s.val / s.max) * 100, 100)}%`, background: s.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const HomePage = () => {
  const { user } = useAuth();

  return (
    <>
      <section className={css.hero}>
        <div className={css.heroContent}>
          <div className={css.heroEyebrow}>Платформа тренировок №&nbsp;1</div>
          <h1 className={css.heroTitle}>
            Домашние тренировки<br />с <span>лучшими тренерами</span>
          </h1>
          <p className={css.heroText}>
            Платформа ATLAS — ваш персональный гид в мире домашних тренировок.
            Подберите программу, следите за прогрессом, достигайте целей.
          </p>
          <div className={css.heroActions}>
            <Link to={getAllProgramsRoute()} className={css.ctaButton}>
              {user ? 'Смотреть программы' : 'Начни тренироваться'}
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16"><path d="M4 10h12M10 4l6 6-6 6"/></svg>
            </Link>
            {!user && (
              <Link to={getRegisterRoute()} className={css.secondaryBtn}>
                Создать аккаунт
              </Link>
            )}
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

      {/* User dashboard */}
      {user && (
        <section className={css.section}>
          <div className={css.sectionContainer}>
            <UserDashboard user={user} />
          </div>
        </section>
      )}

      <section className={css.section}>
        <div className={css.sectionContainer}>
          <div className={css.sectionEyebrow}>Популярное</div>
          <h2 className={css.sectionTitle}>Наши лучшие программы</h2>
          <p className={css.sectionSubtitle}>
            Проверенные программы от сертифицированных тренеров для любого уровня подготовки
          </p>
          <div className={css.programsGrid}>
            {PROGRAMS.map((p) => (
              <div key={p.name} className={css.programCard}>
                <span className={css.programIconWrap}>{PROGRAM_ICONS[p.icon]}</span>
                <div className={css.programName}>{p.name}</div>
                <div className={css.programCategory}>{p.category}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className={css.splitDivider} />

      <section className={css.section}>
        <div className={css.sectionContainer}>
          <div className={css.sectionEyebrow}>Преимущества</div>
          <h2 className={css.sectionTitle}>Почему ATLAS?</h2>
          <p className={css.sectionSubtitle}>Всё что нужно для эффективных тренировок — в одном месте</p>
          <div className={css.featuresGrid}>
            {FEATURES.map((f) => (
              <div key={f.title} className={css.feature}>
                <div className={css.featureIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.svgPath} />
                  </svg>
                </div>
                <div className={css.featureTitle}>{f.title}</div>
                <div className={css.featureText}>{f.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className={css.splitDivider} />

      <section className={css.section}>
        <div className={css.sectionContainer}>
          <div className={css.splitSection}>
            <div className={css.splitText}>
              <div className={css.sectionEyebrow}>Наш сервис</div>
              <h2 className={css.sectionTitle}>Тренируйся умно, а не тяжело</h2>
              <p className={css.sectionSubtitle}>
                Платформа ATLAS позволяет легко подобрать программу тренировок под ваш уровень и цели.
                Занимайтесь дома и следите за прогрессом прямо в приложении.
              </p>
              <Link to={getAllProgramsRoute()} className={css.ctaButton} style={{ alignSelf: 'flex-start' }}>
                Смотреть программы
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16"><path d="M4 10h12M10 4l6 6-6 6"/></svg>
              </Link>
            </div>
            <div className={css.splitVisual}>
              <div className={css.splitVisualInner}>
                <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={css.splitVisualSvg}>
                  <circle cx="60" cy="40" r="14" strokeWidth="2.5" opacity="0.7"/>
                  <path d="M30 95c0-16.57 13.43-30 30-30s30 13.43 30 30" strokeWidth="2.5" opacity="0.7"/>
                  <path d="M18 55l8 8 16-16" strokeWidth="2.5" opacity="0.9"/>
                  <line x1="90" y1="48" x2="106" y2="48" opacity="0.5"/>
                  <line x1="90" y1="56" x2="102" y2="56" opacity="0.5"/>
                  <line x1="90" y1="64" x2="98" y2="64" opacity="0.5"/>
                </svg>
                <div className={css.splitVisualLabel}>Тренировки для вас</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className={css.splitDivider} />

      <section className={css.section}>
        <div className={css.sectionContainer}>
          <div className={`${css.splitSection} ${css.splitSectionReverse}`}>
            <div className={css.splitText}>
              <div className={css.sectionEyebrow}>Мотивация</div>
              <h2 className={css.sectionTitle}>Поддержка на каждом шагу</h2>
              <p className={css.sectionSubtitle}>
                Наши тренеры всегда готовы дать советы и поддержать вас. Система трекинга прогресса
                помогает оставаться мотивированным каждый день.
              </p>
            </div>
            <div className={css.splitVisual}>
              <div className={css.splitVisualInner}>
                <svg viewBox="0 0 120 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={css.splitVisualSvg}>
                  <polyline points="10,80 30,55 50,65 70,35 90,45 110,20" opacity="0.7"/>
                  <circle cx="30" cy="55" r="4" fill="currentColor" opacity="0.3"/>
                  <circle cx="70" cy="35" r="4" fill="currentColor" opacity="0.3"/>
                  <circle cx="110" cy="20" r="5" fill="currentColor" opacity="0.5"/>
                </svg>
                <div className={css.splitVisualLabel}>Ваш прогресс растёт</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className={css.splitDivider} />

      <section className={css.section}>
        <div className={css.sectionContainer}>
          <div className={css.sectionEyebrow}>Команда</div>
          <h2 className={css.sectionTitle}>Тренерский состав</h2>
          <p className={css.sectionSubtitle}>Профессионалы с многолетним опытом — для вашего результата</p>
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

      <section className={css.section}>
        <div className={css.sectionContainer}>
          <div className={css.sectionEyebrow}>Отзывы</div>
          <h2 className={css.sectionTitle}>Что говорят пользователи</h2>
          <p className={css.sectionSubtitle}>Реальные результаты реальных людей</p>
          <div className={css.reviewsGrid}>
            {REVIEWS.map((r) => (
              <div key={r.author} className={css.reviewCard}>
                <div className={css.reviewStars}>
                  {Array.from({ length: r.score }).map((_, i) => (
                    <svg key={i} viewBox="0 0 16 16" width="14" height="14" fill="currentColor" className={css.reviewStarSvg}>
                      <path d="M8 1.5l1.55 3.13 3.45.5-2.5 2.44.59 3.43L8 9.25l-3.09 1.75.59-3.43L3 5.13l3.45-.5L8 1.5z"/>
                    </svg>
                  ))}
                </div>
                <p className={css.reviewText}>«{r.text}»</p>
                <div className={css.reviewAuthor}>{r.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!user && (
        <section className={css.section}>
          <div className={css.sectionContainer}>
            <div className={css.ctaBanner}>
              <h2 className={css.ctaBannerTitle}>Готов начать?</h2>
              <p className={css.ctaBannerText}>Зарегистрируйся бесплатно и начни тренироваться уже сегодня</p>
              <Link to={getRegisterRoute()} className={css.ctaBannerBtn}>
                Создать аккаунт
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="16" height="16"><path d="M4 10h12M10 4l6 6-6 6"/></svg>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
