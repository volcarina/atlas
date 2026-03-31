/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { trpc } from '../../lib/trpc';
import { type ViewProgramRouteParams } from '../../lib/routes';
import { trackProgramView } from '../HistoryPage';
import css from './index.module.scss';

const StarRating = ({ rating }: { rating: number }) => (
  <div className={css.stars}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={s <= Math.round(rating) ? css.starFilled : css.starEmpty}>
        ★
      </span>
    ))}
    <span className={css.ratingNum}>{rating.toFixed(1)}</span>
  </div>
);

const TrainerCard = ({ trainer }: { trainer: any }) => {
  const [hovered, setHovered] = useState(false);
  const initials = trainer.name
    .split(' ')
    .map((n: string) => n[0])
    .join('');

  return (
    <div className={css.trainerCard} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className={css.trainerAvatar}>{initials}</div>
      <div className={css.trainerMeta}>
        <span className={css.trainerName}>{trainer.name}</span>
        <span className={css.trainerSpecialty}>{trainer.specialty}</span>
      </div>
      {hovered && (
        <div className={css.trainerPopup}>
          <div className={css.popupAvatar}>{initials}</div>
          <h3 className={css.popupName}>{trainer.name}</h3>
          <p className={css.popupSpecialty}>{trainer.specialty}</p>
          <p className={css.popupBio}>{trainer.bio}</p>
          <div className={css.popupStats}>
            <div className={css.popupStat}>
              <span className={css.popupStatValue}>{trainer.experience}</span>
              <span className={css.popupStatLabel}>лет опыта</span>
            </div>
            <div className={css.popupStat}>
              <span className={css.popupStatValue}>{trainer.rating}</span>
              <span className={css.popupStatLabel}>рейтинг</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

type MarkType = 'completed' | 'favorite' | 'wantTo';

const MARK_CONFIG: { key: MarkType; icon: string; label: string; activeColor: string }[] = [
  { key: 'completed', icon: '✓', label: 'Выполнено', activeColor: '#1a936f' },
  { key: 'favorite', icon: '♡', label: 'Избранное', activeColor: '#e94560' },
  { key: 'wantTo', icon: '+', label: 'Хочу пройти', activeColor: '#2b7a78' },
];

const MarkButtons = ({ programName }: { programName: string }) => {
  const utils = trpc.useUtils();

  const { data: marksData } = trpc.getMarks.useQuery();

  const setMarkMutation = trpc.setMark.useMutation({
    onSuccess: () => {
      utils.getMarks.invalidate();
      utils.getUserProfile.invalidate();
    },
  });

  const removeMarkMutation = trpc.removeMark.useMutation({
    onSuccess: () => {
      utils.getMarks.invalidate();
      utils.getUserProfile.invalidate();
    },
  });

  const currentMark = marksData?.marks.find((m: any) => m.programName === programName)?.mark as MarkType | undefined;

  const handleClick = (key: MarkType) => {
    if (currentMark === key) {
      removeMarkMutation.mutate({ programName });
    } else {
      setMarkMutation.mutate({ programName, mark: key });
    }
  };

  return (
    <div className={css.markButtons}>
      {MARK_CONFIG.map(({ key, icon, label, activeColor }) => {
        const isActive = currentMark === key;
        return (
          <button
            key={key}
            className={`${css.markBtn} ${isActive ? css.markBtnActive : ''}`}
            style={isActive ? { background: activeColor, borderColor: activeColor } : {}}
            onClick={() => handleClick(key)}
            title={label}
          >
            <span className={css.markBtnIcon}>{isActive && key === 'favorite' ? '♥' : icon}</span>
            <span className={css.markBtnLabel}>{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export const ViewProgramPage = () => {
  const { programTitle } = useParams() as ViewProgramRouteParams;
  const { data, error, isLoading, isFetching, isError } = trpc.getProgram.useQuery({ programTitle });

  useEffect(() => {
    if (data?.program?.name) {
      trackProgramView(data.program.name);
    }
  }, [data?.program?.name]);

  if (isLoading || isFetching)
    return (
      <div className={css.loading}>
        <span>Загрузка...</span>
      </div>
    );
  if (isError) return <div className={css.error}>Ошибка: {error.message}</div>;
  if (!data?.program) return <div className={css.error}>Программа не найдена</div>;

  const { program, trainer } = data;

  return (
    <div className={css.page}>
      <div className={css.hero}>
        <div className={css.heroMedia}>
          <div className={css.mediaPicture}>
            <div className={css.mediaPlaceholder} />
          </div>
          <div className={css.exercisesSection}>
            <h3 className={css.exercisesTitle}>Упражнения</h3>
            <div className={css.exercisesRow}>
              {(program.exercises as any[]).map((ex, idx) => (
                <div key={idx} className={css.exerciseThumb}>
                  <div className={css.exerciseImg} />
                  <span className={css.exerciseName}>{ex.name}</span>
                </div>
              ))}
              <button className={css.exercisesMore}>›</button>
            </div>
          </div>
        </div>

        <div className={css.heroInfo}>
          <p className={css.heroSportTag}>
            {program.sport} · {program.level}
          </p>
          <h1 className={css.heroTitle}>{program.name}</h1>
          <p className={css.heroDesc}>{program.description}</p>

          <div className={css.heroDuration}>
            <span className={css.durationNum}>{program.duration} минут</span>
            <span className={css.exercisesNum}>{(program.exercises as any[]).length} упражнений</span>
          </div>

          <StarRating rating={program.rating} />
          <span className={css.reviewsCount}>({program.reviewsCount} отзывов)</span>

          <div className={css.statPills}>
            <div className={css.statPill}>
              <span className={css.pillLabel}>Релиз</span>
              <span className={css.pillValue}>2026</span>
            </div>
            <div className={css.statPill}>
              <span className={css.pillLabel}>Калории</span>
              <span className={css.pillValue}>{program.calories}</span>
            </div>
            <div className={css.statPill}>
              <span className={css.pillLabel}>Прошли</span>
              <span className={css.pillValue}>{program.completedCount.toLocaleString('ru')}</span>
            </div>
          </div>

          <button className={css.startBtn}>Начать тренировку</button>

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
    </div>
  );
};
