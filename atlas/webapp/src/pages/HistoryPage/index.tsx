import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trpc } from '../../lib/trpc';
import { getViewProgramRoute } from '../../lib/routes';
import css from './index.module.scss';

const VIEW_KEY = 'atlas_viewed_today';

interface ViewRecord {
  date: string;
  programs: string[];
}

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function getViewedToday(): string[] {
  try {
    const raw = localStorage.getItem(VIEW_KEY);
    if (!raw) return [];
    const rec: ViewRecord = JSON.parse(raw);
    return rec.date === getTodayStr() ? rec.programs : [];
  } catch {
    return [];
  }
}

export function trackProgramView(programName: string) {
  const today = getTodayStr();
  const current = getViewedToday();
  if (current.includes(programName)) return;
  const updated: ViewRecord = { date: today, programs: [...current, programName] };
  localStorage.setItem(VIEW_KEY, JSON.stringify(updated));
}

function buildCalendarData(marks: any[], viewedToday: string[]) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const completedDays: Record<number, string[]> = {};
  marks
    .filter((m) => m.mark === 'completed' && m.markedAt)
    .forEach((m) => {
      const d = new Date(m.markedAt);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!completedDays[day]) completedDays[day] = [];
        completedDays[day].push(m.programName);
      }
    });

  const viewedDays: Record<number, string[]> = {};
  if (viewedToday.length > 0) {
    viewedDays[today] = viewedToday;
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const offset = (firstDow + 6) % 7;

  return { year, month, daysInMonth, offset, viewedDays, completedDays, todayDate: today };
}

const MONTH_RU = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];
const DOW_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const HistoryPage = () => {
  const { data, isLoading, isError } = trpc.getMarks.useQuery();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [viewedToday, setViewedToday] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setViewedToday(getViewedToday());
    sync();
    window.addEventListener('focus', sync);
    const interval = setInterval(sync, 5000);
    return () => {
      window.removeEventListener('focus', sync);
      clearInterval(interval);
    };
  }, []);

  const marks = data?.marks ?? [];
  const cal = useMemo(() => buildCalendarData(marks, viewedToday), [marks, viewedToday]);

  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7;
  const weekStart = now.getDate() - dayOfWeek;
  const completedThisWeek = Object.entries(cal.completedDays)
    .filter(([d]) => Number(d) >= weekStart && Number(d) <= now.getDate())
    .flatMap(([, names]) => names);

  const totalViewed = viewedToday.length;
  const totalCompleted = marks.filter((m) => m.mark === 'completed').length;

  const selViewed = selectedDay ? (cal.viewedDays[selectedDay] ?? []) : [];
  const selCompleted = selectedDay ? (cal.completedDays[selectedDay] ?? []) : [];
  const hasActivity = selViewed.length > 0 || selCompleted.length > 0;

  if (isLoading) return <div className={css.state}>Загрузка...</div>;
  if (isError) return <div className={css.state}>Ошибка загрузки</div>;

  const cells: (number | null)[] = [
    ...Array(cal.offset).fill(null),
    ...Array.from({ length: cal.daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className={css.page}>
      <div className={css.header}>
        <h1 className={css.title}>История тренировок</h1>
        <p className={css.subtitle}>
          {MONTH_RU[cal.month]} {cal.year}
        </p>
      </div>

      <div className={css.summary}>
        <div className={css.summaryCard}>
          <span className={css.summaryVal}>{totalViewed}</span>
          <span className={css.summaryLabel}>Открыто сегодня</span>
        </div>
        <div className={css.summaryCard}>
          <span className={css.summaryVal}>{completedThisWeek.length}</span>
          <span className={css.summaryLabel}>Выполнено за неделю</span>
        </div>
        <div className={css.summaryCard}>
          <span className={css.summaryVal}>{totalCompleted}</span>
          <span className={css.summaryLabel}>Выполнено всего</span>
        </div>
        <div className={css.summaryCard}>
          <span className={css.summaryVal}>{dayOfWeek + 1}</span>
          <span className={css.summaryLabel}>День недели</span>
        </div>
      </div>

      <div className={css.body}>
        {/* Calendar */}
        <div className={css.calendarWrap}>
          <div className={css.calendarDow}>
            {DOW_RU.map((d) => (
              <span key={d} className={css.dowLabel}>
                {d}
              </span>
            ))}
          </div>
          <div className={css.calendarGrid}>
            {cells.map((day, idx) => {
              if (!day) return <div key={idx} className={css.cellEmpty} />;
              const isViewed = !!cal.viewedDays[day]?.length;
              const isDone = !!cal.completedDays[day]?.length;
              const isToday = day === cal.todayDate;
              const isFuture = day > cal.todayDate;
              const isSelected = day === selectedDay;
              return (
                <button
                  key={idx}
                  disabled={isFuture}
                  className={[
                    css.cell,
                    isViewed ? css.cellViewed : '',
                    isDone ? css.cellDone : '',
                    isToday ? css.cellToday : '',
                    isSelected ? css.cellSelected : '',
                    isFuture ? css.cellFuture : '',
                  ].join(' ')}
                  onClick={() => !isFuture && setSelectedDay(day === selectedDay ? null : day)}
                >
                  <span className={css.cellDay}>{day}</span>
                  {isDone && <span className={css.cellDot} data-type="done" />}
                  {isViewed && !isDone && <span className={css.cellDot} data-type="viewed" />}
                </button>
              );
            })}
          </div>

          <div className={css.legend}>
            <span className={css.legendItem}>
              <span className={css.legendDot} data-type="done" />
              Выполнено
            </span>
            <span className={css.legendItem}>
              <span className={css.legendDot} data-type="viewed" />
              Открывал сегодня
            </span>
          </div>

          <div className={css.calNote}>
            История отображает только текущий месяц. Просмотренные тренировки фиксируются только за сегодня.
          </div>
        </div>

        <div className={css.sidebar}>
          <div className={css.card}>
            <h3 className={css.cardTitle}>👁 Открыто сегодня</h3>
            {viewedToday.length === 0 ? (
              <p className={css.empty}>Открой любую тренировку — она появится здесь</p>
            ) : (
              <ul className={css.list}>
                {viewedToday.map((name, i) => (
                  <li key={i} className={css.listItem}>
                    <Link
                      to={getViewProgramRoute({ programTitle: name })}
                      className={`${css.listLink} ${css.listLinkMuted}`}
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={css.card}>
            <h3 className={css.cardTitle}>✅ Выполнено на этой неделе</h3>
            {completedThisWeek.length === 0 ? (
              <p className={css.empty}>Пока ничего — вперёд!</p>
            ) : (
              <ul className={css.list}>
                {completedThisWeek.map((name, i) => (
                  <li key={i} className={css.listItem}>
                    <Link to={getViewProgramRoute({ programTitle: name })} className={css.listLink}>
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedDay && (
            <div className={css.card}>
              <h3 className={css.cardTitle}>
                📅 {selectedDay} {MONTH_RU[cal.month]}
              </h3>
              {!hasActivity ? (
                <p className={css.empty}>В этот день активности нет</p>
              ) : (
                <>
                  {selCompleted.length > 0 && (
                    <>
                      <p className={css.cardSubtitle}>Выполнено:</p>
                      <ul className={css.list}>
                        {selCompleted.map((name, i) => (
                          <li key={i} className={css.listItem}>
                            <Link to={getViewProgramRoute({ programTitle: name })} className={css.listLink}>
                              ✓ {name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {selViewed.length > 0 && (
                    <>
                      <p className={css.cardSubtitle}>Открывал:</p>
                      <ul className={css.list}>
                        {selViewed.map((name, i) => (
                          <li key={i} className={css.listItem}>
                            <Link
                              to={getViewProgramRoute({ programTitle: name })}
                              className={`${css.listLink} ${css.listLinkMuted}`}
                            >
                              {name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
