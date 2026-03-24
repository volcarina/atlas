/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { trpc } from '../../lib/trpc';
import { type ViewProgramRouteParams } from '../../lib/routes';
import css from './index.module.scss';

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className={css.stars}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? css.starFilled : css.starEmpty}>
          ★
        </span>
      ))}
      <span className={css.ratingNum}>{rating.toFixed(1)}</span>
    </div>
  );
};

const TrainerCard = ({ trainer }: { trainer: NonNullable<ReturnType<typeof useTrainer>> }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className={css.trainerCard} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className={css.trainerAvatar}>
        {trainer.name
          .split(' ')
          .map((n: string) => n[0])
          .join('')}
      </div>

      <div className={css.trainerMeta}>
        <span className={css.trainerName}>{trainer.name}</span>
        <span className={css.trainerSpecialty}>{trainer.specialty}</span>
      </div>

      {hovered && (
        <div className={css.trainerPopup}>
          <div className={css.popupAvatar}>
            {trainer.name
              .split(' ')
              .map((n: string) => n[0])
              .join('')}
          </div>

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useTrainer() {
  return null as any;
}

export const ViewProgramPage = () => {
  const { programTitle } = useParams() as ViewProgramRouteParams;

  const { data, error, isLoading, isFetching, isError } = trpc.getProgram.useQuery({ programTitle });

  const setMark = trpc.setMark.useMutation();

  const [marks, setMarks] = useState({
    completed: false,
    favorite: false,
    wantTo: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(`program-marks-${programTitle}`);

    if (saved) {
      setMarks(JSON.parse(saved));
    }
  }, [programTitle]);

  if (isLoading || isFetching) {
    return (
      <div className={css.loading}>
        <span>Загрузка...</span>
      </div>
    );
  }

  if (isError) {
    return <div className={css.error}>Ошибка: {error.message}</div>;
  }

  if (!data || !data.program) {
    return <div className={css.error}>Программа не найдена</div>;
  }

  const { program, trainer } = data;

  const handleMark = async (mark: 'completed' | 'favorite' | 'wantTo') => {
    await setMark.mutateAsync({
      programName: program.name,
      mark,
    });

    setMarks((prev) => {
      const updated = {
        ...prev,
        [mark]: !prev[mark],
      };

      localStorage.setItem(`program-marks-${programTitle}`, JSON.stringify(updated));

      return updated;
    });
  };

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
          <div className={css.heroHeader}>
            <div>
              <p className={css.heroSportTag}>
                {program.sport} · {program.level}
              </p>

              <h1 className={css.heroTitle}>{program.name}</h1>
            </div>
          </div>

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

          <div className={css.markButtons}>
            <button
              className={`${css.markBtn} ${marks.completed ? css.activeCompleted : ''}`}
              onClick={() => handleMark('completed')}
            >
              ✓ Выполнено
            </button>

            <button
              className={`${css.markBtn} ${marks.favorite ? css.activeFavorite : ''}`}
              onClick={() => handleMark('favorite')}
            >
              ♡ Избранное
            </button>

            <button
              className={`${css.markBtn} ${marks.wantTo ? css.activeWantTo : ''}`}
              onClick={() => handleMark('wantTo')}
            >
              + Хочу пройти
            </button>
          </div>

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
