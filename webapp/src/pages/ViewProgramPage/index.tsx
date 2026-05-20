/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trpc } from '../../lib/trpc';
import { type ViewProgramRouteParams, getViewProgramRoute } from '../../lib/routes';
import { trackProgramView } from '../HistoryPage';
import { Tooltip } from '../../components/Tooltip';
import { WorkoutModal, type WorkoutExercise } from './WorkoutModal';
import css from './index.module.scss';

export const SPORT_IMAGES: Record<string, string> = {
  'Йога':           'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
  'Кардио':         'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80',
  'Силовые':        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80',
  'HIIT':           'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&q=80',
  'Стретчинг':      'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=80',
  'Пилатес':        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
  'Функциональный': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
  'Бокс':           'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80',
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className={css.stars}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={s <= Math.round(rating) ? css.starFilled : css.starEmpty}>★</span>
    ))}
    <span className={css.ratingNum}>{rating.toFixed(1)}</span>
  </div>
);

const TrainerCard = ({ trainer }: { trainer: any }) => {
  const [hovered, setHovered] = useState(false);
  const initials = trainer.name.split(' ').map((n: string) => n[0]).join('');

  return (
    <div className={css.trainerCard} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className={css.trainerAvatar}>{initials}</div>
      <div className={css.trainerMeta}>
        <span className={css.trainerName}>{trainer.name}</span>
        <span className={css.trainerSpecialty}>{trainer.specialty}</span>
      </div>
      {hovered && (
        <div className={css.trainerPopup}>
          <div className={css.popupHeader}>
            <div className={css.popupAvatar}>{initials}</div>
            <div className={css.popupHeaderInfo}>
              <h3 className={css.popupName}>{trainer.name}</h3>
              <p className={css.popupSpecialty}>{trainer.specialty}</p>
              {trainer.username && <span className={css.popupUsername}>{trainer.username}</span>}
            </div>
          </div>
          <p className={css.popupBio}>{trainer.bio}</p>
          <div className={css.popupStats}>
            <div className={css.popupStat}><span className={css.popupStatValue}>{trainer.experience}</span><span className={css.popupStatLabel}>лет опыта</span></div>
            <div className={css.popupStat}><span className={css.popupStatValue}>{trainer.rating}</span><span className={css.popupStatLabel}>рейтинг</span></div>
            <div className={css.popupStat}><span className={css.popupStatValue}>{trainer.clientsCount}</span><span className={css.popupStatLabel}>клиентов</span></div>
            <div className={css.popupStat}><span className={css.popupStatValue}>{trainer.certificationsCount}</span><span className={css.popupStatLabel}>сертификатов</span></div>
          </div>
          {trainer.education && (
            <div className={css.popupDetail}>
              <span className={css.popupDetailIcon}>🎓</span>
              <span className={css.popupDetailText}>{trainer.education}</span>
            </div>
          )}
          {trainer.achievements && trainer.achievements.length > 0 && (
            <div className={css.popupAchievements}>
              {trainer.achievements.slice(0, 2).map((a: string, i: number) => (
                <span key={i} className={css.popupAchievement}>🏆 {a}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

type MarkType = 'completed' | 'favorite' | 'wantTo';

const MARK_CONFIG: { key: MarkType; icon: string; label: string; tooltip: string; activeColor: string }[] = [
  { key: 'completed', icon: '✓', label: 'Выполнено',   tooltip: 'Отметьте как пройденную — попадёт в статистику профиля', activeColor: '#1a936f' },
  { key: 'favorite',  icon: '♡', label: 'Избранное',   tooltip: 'Добавьте в избранное для быстрого доступа из профиля',   activeColor: '#e94560' },
  { key: 'wantTo',    icon: '+', label: 'Хочу пройти', tooltip: 'Сохраните в список желаний для планирования',            activeColor: '#2b7a78' },
];

const MarkButtons = ({ programName }: { programName: string }) => {
  const utils = trpc.useUtils();
  const { data: marksData } = trpc.getMarks.useQuery();
  const setMarkMutation = trpc.setMark.useMutation({ onSuccess: () => { utils.getMarks.invalidate(); utils.getUserProfile.invalidate(); } });
  const removeMarkMutation = trpc.removeMark.useMutation({ onSuccess: () => { utils.getMarks.invalidate(); utils.getUserProfile.invalidate(); } });
  const currentMark = marksData?.marks.find((m: any) => m.programName === programName)?.mark as MarkType | undefined;

  const handleClick = (key: MarkType) => {
    if (currentMark === key) removeMarkMutation.mutate({ programName });
    else setMarkMutation.mutate({ programName, mark: key });
  };

  return (
    <div className={css.markButtons}>
      {MARK_CONFIG.map(({ key, icon, label, tooltip, activeColor }) => {
        const isActive = currentMark === key;
        return (
          <Tooltip key={key} content={tooltip} position="top">
            <button
              className={`${css.markBtn} ${isActive ? css.markBtnActive : ''}`}
              style={isActive ? { background: activeColor, borderColor: activeColor } : {}}
              onClick={() => handleClick(key)}
            >
              <span className={css.markBtnIcon}>{isActive && key === 'favorite' ? '♥' : icon}</span>
              <span className={css.markBtnLabel}>{label}</span>
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
};

const SimilarPrograms = ({ programName, sport, level }: { programName: string; sport: string; level: string }) => {
  const navigate = useNavigate();
  const { data, isLoading } = trpc.getSimilarPrograms.useQuery({ programName, sport, level });
  if (isLoading || !data?.similar?.length) return null;

  return (
    <div className={css.similarSection}>
      <h2 className={css.similarTitle}>Похожие программы</h2>
      <div className={css.similarGrid}>
        {data.similar.map((p: any) => (
          <div
            key={p.name}
            className={css.similarCard}
            onClick={() => navigate(getViewProgramRoute({ programTitle: encodeURIComponent(p.name) }))}
          >
            <div className={css.similarThumb}>
              <img
                src={SPORT_IMAGES[p.sport] ?? SPORT_IMAGES['Кардио']}
                alt={p.sport}
                className={css.similarImg}
              />
              <span className={css.similarLevel}>{p.level}</span>
            </div>
            <div className={css.similarBody}>
              <span className={css.similarSport}>{p.sport}</span>
              <h3 className={css.similarName}>{p.name}</h3>
              <div className={css.similarMeta}>
                <span className={css.similarDuration}>{p.duration} мин</span>
                <span className={css.similarRating}>★ {p.rating.toFixed(1)}</span>
                <span className={css.similarCalories}>{p.calories} ккал</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ViewProgramPage = () => {
  const { programTitle } = useParams() as ViewProgramRouteParams;
  const { data, error, isLoading, isFetching, isError } = trpc.getProgram.useQuery({ programTitle });
  const [workoutOpen, setWorkoutOpen] = useState(false);

  useEffect(() => {
    if (data?.program?.name) trackProgramView(data.program.name);
  }, [data?.program?.name]);

  if (isLoading || isFetching) return <div className={css.loading}><span>Загрузка...</span></div>;
  if (isError) return <div className={css.error}>Ошибка: {error.message}</div>;
  if (!data?.program) return <div className={css.error}>Программа не найдена</div>;

  const { program, trainer } = data;
  const exercises = program.exercises as WorkoutExercise[];
  const imgSrc = SPORT_IMAGES[program.sport] ?? SPORT_IMAGES['Кардио'];

  return (
    <div className={css.page}>
      <div className={css.hero}>

        <div className={css.heroMedia}>
          <div className={css.mediaPicture}>
            <img src={imgSrc} alt={program.sport} className={css.mediaImg} />
            <div className={css.mediaOverlay}>
              <span className={css.mediaSportBadge}>{program.sport}</span>
            </div>
          </div>
        </div>

        <div className={css.heroInfo}>
          <p className={css.heroSportTag}>{program.sport} · {program.level}</p>
          <h1 className={css.heroTitle}>{program.name}</h1>
          <p className={css.heroDesc}>{program.description}</p>

          <div className={css.heroDuration}>
            <span className={css.durationNum}>{program.duration} минут</span>
            <span className={css.exercisesNum}>{exercises.length} упражнений</span>
          </div>

          <StarRating rating={program.rating} />
          <span className={css.reviewsCount}>({program.reviewsCount} отзывов)</span>

          <div className={css.statPills}>
            <div className={css.statPill}>
              <span className={css.pillLabel}>Калории</span>
              <span className={css.pillValue}>{program.calories}</span>
            </div>
            <div className={css.statPill}>
              <span className={css.pillLabel}>Прошли</span>
              <span className={css.pillValue}>{program.completedCount.toLocaleString('ru')}</span>
            </div>
            <div className={css.statPill}>
              <span className={css.pillLabel}>Уровень</span>
              <span className={css.pillValue}>{program.level}</span>
            </div>
          </div>

          <Tooltip content="Запустите тренировку: видео, таймер и прогресс по упражнениям" position="top">
            <button className={css.startBtn} onClick={() => setWorkoutOpen(true)}>
              <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path d="M5 4l13 6.5L5 17V4z"/></svg>
              Начать тренировку
            </button>
          </Tooltip>

          <MarkButtons programName={program.name} />

          {trainer && (
            <div className={css.trainerSection}>
              <span className={css.trainerLabel}>Тренер программы</span>
              <TrainerCard trainer={trainer} />
            </div>
          )}
        </div>
      </div>

      <div className={css.descBlock}>
        <p className={css.descText}>{program.description} Программа включает комплексный подход к тренировкам.</p>
        <ul className={css.checkList}>
          <li>Подходит для всех уровней подготовки</li>
          <li>Не требует дополнительного оборудования</li>
          <li>Включает разминку и заминку</li>
          <li>Адаптируется под ваш темп</li>
        </ul>
      </div>

      <SimilarPrograms programName={program.name} sport={program.sport} level={program.level} />

      {workoutOpen && (
        <WorkoutModal
          program={{ name: program.name, sport: program.sport, videoId: program.videoId, exercises }}
          onClose={() => setWorkoutOpen(false)}
        />
      )}
    </div>
  );
};
