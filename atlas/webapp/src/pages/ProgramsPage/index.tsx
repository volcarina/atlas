import { useState } from 'react';
import { trpc } from '../../lib/trpc';
import { getViewProgramRoute } from '../../lib/routes';
import { Link } from 'react-router-dom';
import css from './index.module.scss';

const DURATION_OPTIONS = [
  { label: 'Любая', value: undefined },
  { label: 'до 15 мин', value: 15 },
  { label: 'до 30 мин', value: 30 },
  { label: 'до 45 мин', value: 45 },
  { label: 'до 60 мин', value: 60 },
];

const LEVEL_COLORS: Record<string, string> = {
  Начинающий: '#4caf7d',
  Средний: '#f5a623',
  Продвинутый: '#e94560',
};

export const ProgramsPage = () => {
  const [sport, setSport] = useState<string>('Все');
  const [level, setLevel] = useState<string>('Все');
  const [maxDuration, setMaxDuration] = useState<number | undefined>(undefined);

  const { data, error, isLoading, isFetching, isError } = trpc.getPrograms.useQuery({
    sport: sport !== 'Все' ? sport : undefined,
    level: level !== 'Все' ? level : undefined,
    maxDuration,
  });

  const sports = ['Все', ...(data?.sports ?? [])];
  const levels = ['Все', ...(data?.levels ?? [])];
  const programs = data?.programs ?? [];

  return (
    <div className={css.page}>
      <div className={css.pageHeader}>
        <h1 className={css.title}>Программы тренировок</h1>
        <p className={css.subtitle}>Найдите идеальную программу для своего уровня и целей</p>
      </div>

      <div className={css.filters}>
        <div className={css.filterGroup}>
          <span className={css.filterLabel}>Вид спорта</span>
          <div className={css.pillGroup}>
            {sports.map((s) => (
              <button
                key={s}
                className={`${css.pill} ${sport === s ? css.pillActive : ''}`}
                onClick={() => setSport(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className={css.filterGroup}>
          <span className={css.filterLabel}>Уровень</span>
          <div className={css.pillGroup}>
            {levels.map((l) => (
              <button
                key={l}
                className={`${css.pill} ${level === l ? css.pillActive : ''}`}
                onClick={() => setLevel(l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className={css.filterGroup}>
          <span className={css.filterLabel}>Длительность</span>
          <div className={css.pillGroup}>
            {DURATION_OPTIONS.map((d) => (
              <button
                key={d.label}
                className={`${css.pill} ${maxDuration === d.value ? css.pillActive : ''}`}
                onClick={() => setMaxDuration(d.value)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={css.resultsBar}>
        {isLoading || isFetching
          ? 'Загрузка...'
          : isError
            ? `Ошибка: ${error.message}`
            : `Найдено ${programs.length} программ`}
      </div>

      {!isLoading && !isFetching && !isError && (
        <div className={css.grid}>
          {programs.map((program) => (
            <Link key={program.name} to={getViewProgramRoute({ programTitle: program.name })} className={css.card}>
              <div className={css.cardThumb}>
                <div className={css.cardImg} />
                <span className={css.levelBadge} style={{ background: LEVEL_COLORS[program.level] ?? '#888' }}>
                  {program.level}
                </span>
              </div>
              <div className={css.cardBody}>
                <div className={css.cardTop}>
                  <span className={css.cardSport}>{program.sport}</span>
                  <span className={css.cardRating}>★ {program.rating}</span>
                </div>
                <h2 className={css.cardTitle}>{program.sport}</h2>
                <p className={css.cardDesc}>{program.description}</p>
                <div className={css.cardFooter}>
                  <span className={css.cardDuration}>⏱ {program.duration} мин</span>
                  <span className={css.cardCalories}>🔥 {program.calories} ккал</span>
                  <span className={css.cardCount}>👤 {program.completedCount.toLocaleString('ru')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && !isError && programs.length === 0 && (
        <div className={css.empty}>Программы не найдены. Попробуйте изменить фильтры.</div>
      )}
    </div>
  );
};
