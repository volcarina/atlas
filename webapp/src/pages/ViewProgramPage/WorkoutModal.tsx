import { useState, useEffect, useRef } from 'react';
import { trpc } from '../../lib/trpc';
import css from './WorkoutModal.module.scss';

export interface WorkoutExercise {
  id: number;
  name: string;
  order: number;
  duration: number;
  restAfter: number;
}

interface WorkoutModalProps {
  program: {
    name: string;
    sport: string;
    videoId?: string | null;
    exercises: WorkoutExercise[];
  };
  onClose: () => void;
}

type Phase = 'intro' | 'workout' | 'done';

const VIDEO_TIMECODES: Record<string, number[]> = {
  'LTWYnDD9PiM': [57, 134, 191, 286, 344, 593, 859, 998, 1467],
};

const SPORT_VIDEOS: Record<string, string> = {
  'Йога':           'LTWYnDD9PiM',
  'Кардио':         'ml6cT4AZdqI',
  'Силовые':        'UBMk30rjy0o',
  'HIIT':           'TkaYafQ-XC4',
  'Стретчинг':      'L_xrDAtykMI',
  'Пилатес':        'g_tea8ZNk5A',
  'Функциональный': 'IODxDxX7oi4',
  'Бокс':           'p6b9zPIWJBo',
};

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export const WorkoutModal = ({ program, onClose }: WorkoutModalProps) => {
  const exercises = program.exercises;
  const videoId = program.videoId ?? SPORT_VIDEOS[program.sport] ?? 'LTWYnDD9PiM';
  const timecodes = VIDEO_TIMECODES[videoId];

  const totalSeconds = exercises.reduce((acc, ex) => acc + ex.duration + ex.restAfter, 0);

  const [phase, setPhase] = useState<Phase>('intro');
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [markedAsCompleted, setMarkedAsCompleted] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 280);
  };
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const utils = trpc.useUtils();
  const setMarkMutation = trpc.setMark.useMutation({
    onSuccess: () => {
      utils.getMarks.invalidate();
      utils.getUserProfile.invalidate();
    },
  });

  useEffect(() => {
    if (phase !== 'workout' || !containerRef.current) return;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }

    function createPlayer() {
      if (playerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          mute: 1,
        },
        events: {
          onReady: (event: any) => {
            setPlayerReady(true);
          },
        },
      });
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // cleanup
        }
        playerRef.current = null;
      }
    };
  }, [phase, videoId]);

  useEffect(() => {
    if (phase !== 'workout' || !playerReady || !playerRef.current) return;

    stateCheckRef.current = setInterval(() => {
      try {
        const playerState = playerRef.current?.getPlayerState?.();
        if (playerState === 2 && !paused) {
          setPaused(true);
        } else if (playerState === 1 && paused) {
          setPaused(false);
        }
      } catch (e) {
      }
    }, 500);

    return () => {
      if (stateCheckRef.current) clearInterval(stateCheckRef.current);
    };
  }, [phase, playerReady, paused]);

  const getCurrentExerciseIdx = (e: number) => {
    let acc = 0;
    for (let i = 0; i < exercises.length; i++) {
      acc += exercises[i].duration + exercises[i].restAfter;
      if (e < acc) return i;
    }
    return exercises.length - 1;
  };

  const currentExIdx = getCurrentExerciseIdx(elapsed);
  const currentEx = exercises[currentExIdx];

  let exStartTime = 0;
  for (let i = 0; i < currentExIdx; i++) {
    exStartTime += exercises[i].duration + exercises[i].restAfter;
  }
  const exElapsed = elapsed - exStartTime;
  const exTotal = currentEx.duration + currentEx.restAfter;
  const exProgress = Math.min(exElapsed / exTotal, 1);
  const exRemaining = Math.max(exTotal - exElapsed, 0);

  const totalRemaining = totalSeconds - elapsed;
  const totalProgress = Math.min(elapsed / totalSeconds, 1);

  useEffect(() => {
    if (playerReady && playerRef.current && timecodes && timecodes[currentExIdx] !== undefined) {
      const expectedVideoTime = timecodes[currentExIdx] + exElapsed;
      try {
        playerRef.current.seekTo(expectedVideoTime, true);
      } catch (e) {
      }
    }
  }, [elapsed, currentExIdx, exElapsed, timecodes, playerReady]);

  useEffect(() => {
    if (phase !== 'workout' || paused) return;
    intervalRef.current = setInterval(() => {
      setElapsed((e) => {
        const next = e + 1;
        if (next >= totalSeconds) {
          clearInterval(intervalRef.current!);
          setPhase('done');
          return totalSeconds;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [phase, paused, totalSeconds]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleStart = () => {
    setElapsed(0);
    setPaused(false);
    setPhase('workout');
  };

  const handleSkip = () => {
    let nextTime = 0;
    for (let i = 0; i <= currentExIdx; i++) {
      nextTime += exercises[i].duration + exercises[i].restAfter;
    }
    if (nextTime < totalSeconds) {
      setElapsed(nextTime);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newElapsed = Math.floor(percent * totalSeconds);
    setElapsed(Math.min(newElapsed, totalSeconds));
  };

  const handleDone = () => {
    if (!markedAsCompleted) {
      setMarkMutation.mutate({ programName: program.name, mark: 'completed' });
      setMarkedAsCompleted(true);
    }
    handleClose();
  };

  const isRest = exElapsed > currentEx.duration;

  return (
    <div className={`${css.overlay} ${closing ? css.overlayExit : ''}`} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className={`${css.modal} ${closing ? css.modalExit : ''}`}>

        {phase === 'intro' && (
          <div className={css.intro}>
            <button className={css.closeBtn} onClick={handleClose}>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18"><path d="M4 4l12 12M16 4L4 16"/></svg>
            </button>

            <div className={css.introTag}>{program.sport}</div>
            <h2 className={css.introTitle}>{program.name}</h2>

            <div className={css.introMeta}>
              <span className={css.introPill}>
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="15" height="15"><circle cx="10" cy="10" r="7"/><path d="M10 6v4l2.5 2"/></svg>
                {formatTime(totalSeconds)}
              </span>
              <span className={css.introPill}>
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="15" height="15"><rect x="3" y="3" width="5" height="5" rx="1"/><rect x="12" y="3" width="5" height="5" rx="1"/><rect x="3" y="12" width="5" height="5" rx="1"/><rect x="12" y="12" width="5" height="5" rx="1"/></svg>
                {exercises.length} упражнений
              </span>
            </div>

            <div className={css.introExList}>
              {exercises.map((ex, i) => (
                <div key={ex.id} className={css.introExRow}>
                  <span className={css.introExNum}>{i + 1}</span>
                  <span className={css.introExName}>{ex.name}</span>
                  <span className={css.introExTime}>{ex.duration}с{ex.restAfter > 0 ? ` + ${ex.restAfter}с` : ''}</span>
                </div>
              ))}
            </div>

            <button className={css.startBtn} onClick={handleStart}>
              <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path d="M5 4l13 6.5L5 17V4z"/></svg>
              Начать тренировку
            </button>
          </div>
        )}

        {phase === 'workout' && (
          <div className={css.workout}>

            {/* Шапка */}
            <div className={css.workoutHeader}>
              <span className={css.workoutTitle}>{program.name}</span>
              <div className={css.headerActions}>
                <button className={css.iconBtn} onClick={() => setPaused((p) => !p)} title={paused ? 'Продолжить' : 'Пауза'}>
                  {paused
                    ? <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M5 4l13 6.5L5 17V4z"/></svg>
                    : <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><rect x="4" y="3" width="4" height="14" rx="1"/><rect x="12" y="3" width="4" height="14" rx="1"/></svg>
                  }
                </button>
                <button className={css.iconBtn} onClick={handleClose} title="Закрыть">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16"><path d="M4 4l12 12M16 4L4 16"/></svg>
                </button>
              </div>
            </div>

            <div className={css.totalProgress}>
              <div 
                className={css.totalProgressBar}
                onClick={handleProgressClick}
                style={{ cursor: 'pointer' }}
              >
                <div className={css.totalProgressFill} style={{ width: `${totalProgress * 100}%` }} />
              </div>
              <div className={css.totalProgressLabels}>
                <span>{formatTime(elapsed)}</span>
                <span className={css.totalProgressPct}>{Math.round(totalProgress * 100)}%</span>
                <span>−{formatTime(totalRemaining)}</span>
              </div>
            </div>

            <div className={css.workoutBody}>

              <div className={css.videoCol}>
                <div className={css.videoWrap}>
                  {paused && (
                    <div className={css.pausedOverlay}>
                      <svg viewBox="0 0 60 60" fill="none" width="60" height="60">
                        <circle cx="30" cy="30" r="28" fill="rgba(0,0,0,0.6)"/>
                        <rect x="20" y="17" width="7" height="26" rx="2" fill="white"/>
                        <rect x="33" y="17" width="7" height="26" rx="2" fill="white"/>
                      </svg>
                      <span className={css.pausedLabel}>Пауза</span>
                    </div>
                  )}
                  <div ref={containerRef} className={css.playerContainer} />
                </div>

                <div className={css.exStrip}>
                  {exercises.map((ex, i) => {
                    const done = i < currentExIdx;
                    const active = i === currentExIdx;
                    return (
                      <div
                        key={ex.id}
                        className={`${css.exChip} ${active ? css.exChipActive : ''} ${done ? css.exChipDone : ''}`}
                      >
                        {done
                          ? <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="10" height="10"><path d="M2 6l3 3 5-5"/></svg>
                          : <span className={css.exChipNum}>{i + 1}</span>
                        }
                        <span className={css.exChipName}>{ex.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={css.sidePanel}>

                <div className={`${css.currentCard} ${isRest ? css.currentCardRest : ''}`}>
                  <div className={css.currentLabel}>
                    {isRest ? 'Отдых' : `Упражнение ${currentExIdx + 1} / ${exercises.length}`}
                  </div>
                  <div className={css.currentName}>
                    {isRest ? 'Восстановитесь' : currentEx.name}
                  </div>

                  <div className={css.stepProgress}>
                    <svg viewBox="0 0 80 80" width="80" height="80" className={css.stepRing}>
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#444" strokeWidth="6"/>
                      <circle
                        cx="40" cy="40" r="32"
                        fill="none"
                        stroke={isRest ? '#ffa500' : '#4f6ef7'}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 32}`}
                        strokeDashoffset={`${2 * Math.PI * 32 * (1 - exProgress)}`}
                        transform="rotate(-90 40 40)"
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                      />
                    </svg>
                    <div className={css.stepCountdown}>{Math.ceil(exRemaining)}с</div>
                  </div>
                </div>

                <div className={css.timerCard}>
                  <div className={css.timerLabel}>Всего осталось</div>
                  <div className={css.timerVal}>{formatTime(totalRemaining)}</div>
                </div>

                {currentExIdx + 1 < exercises.length && (
                  <div className={css.nextCard}>
                    <div className={css.nextLabel}>Следующее</div>
                    <div className={css.nextName}>{exercises[currentExIdx + 1]?.name ?? '—'}</div>
                  </div>
                )}

                <button className={css.skipBtn} onClick={handleSkip}>
                  Пропустить
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14"><path d="M4 3l7 5-7 5V3zM13 3v10"/></svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className={css.done}>
            <div className={css.doneCircle}>
              <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
                <circle cx="32" cy="32" r="30" stroke="#4f6ef7" strokeWidth="3"/>
                <path d="M18 32l10 10 18-18" stroke="#4f6ef7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className={css.doneTitle}>Тренировка завершена!</h2>
            <p className={css.doneSubtitle}>«{program.name}»</p>
            <div className={css.doneStats}>
              <div className={css.doneStat}>
                <div className={css.doneStatVal}>{formatTime(totalSeconds)}</div>
                <div className={css.doneStatLabel}>Время</div>
              </div>
              <div className={css.doneStat}>
                <div className={css.doneStatVal}>{exercises.length}</div>
                <div className={css.doneStatLabel}>Упражнений</div>
              </div>
            </div>
            <button className={css.doneBtn} onClick={handleDone} disabled={setMarkMutation.isPending}>
              {setMarkMutation.isPending ? 'Сохранение...' : 'Завершить'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
