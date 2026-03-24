import { useState } from 'react';
import { Link } from 'react-router-dom';
import { trpc } from '../../lib/trpc';
import { getViewProgramRoute } from '../../lib/routes';
import css from './index.module.scss';

type TabType = 'favorite' | 'completed' | 'wantTo';

const TAB_LABELS: Record<TabType, string> = {
  favorite: 'Избранные',
  completed: 'Пройденные',
  wantTo: 'Хочу пройти',
};

const SPORT_EMOJI: Record<string, string> = {
  Йога: '🧘',
  Кардио: '🏃',
  Силовые: '🏋️',
  HIIT: '⚡',
  Стретчинг: '🤸',
  Пилатес: '🌀',
  Функциональный: '💪',
  Бокс: '🥊',
};

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('favorite');
  const { data, isLoading, isError, refetch } = trpc.getUserProfile.useQuery();
  const removeMarkMutation = trpc.removeMark.useMutation({ onSuccess: () => refetch() });

  if (isLoading) return <div className={css.state}>Загрузка...</div>;
  if (isError || !data?.user) return <div className={css.state}>Ошибка загрузки профиля</div>;

  const { user, marks = [] } = data;
  const initials = user.name
    .split(' ')
    .map((w: string) => w[0])
    .join('');

  const tabMarks = marks.filter((m: any) => m.mark === activeTab);

  return (
    <div className={css.page}>
      <div className={css.cover} />

      <div className={css.headerRow}>
        <div className={css.avatarWrap}>
          <div className={css.avatar}>{initials}</div>
        </div>
        <div className={css.userInfo}>
          <h1 className={css.name}>{user.name}</h1>
          <p className={css.email}>{user.email}</p>
        </div>
        <div className={css.headerControls}>
          <div className={css.controlRow}>
            <span className={css.controlLabel}>Темная тема</span>
            <div className={css.toggle}>
              <div className={css.toggleKnob} />
            </div>
          </div>
          <div className={css.controlRow}>
            <span className={css.controlLabel}>Фон профиля</span>
            <button className={css.selectBtn} disabled>
              Sel ▾
            </button>
          </div>
        </div>
      </div>

      <div className={css.formGrid}>
        <div className={css.fieldGroup}>
          <label className={css.fieldLabel}>Адрес электронной почты</label>
          <div className={css.inputWrap}>
            <span className={css.inputIcon}>✉</span>
            <input className={css.input} type="email" defaultValue={user.email} disabled />
          </div>
        </div>
        <div className={css.fieldGroup}>
          <label className={css.fieldLabel}>Адрес электронной почты (подтверждение)</label>
          <div className={css.inputWrap}>
            <span className={css.inputIcon}>✉</span>
            <input className={css.input} type="email" placeholder="email@address.com" disabled />
          </div>
        </div>
        <div className={css.fieldGroup}>
          <label className={css.fieldLabel}>Дата рождения</label>
          <div className={css.inputWrap}>
            <input className={css.input} type="date" disabled />
            <span className={css.inputIconRight}>📅</span>
          </div>
        </div>
        <div className={css.fieldGroup}>
          <label className={css.fieldLabel}>Пол</label>
          <div className={css.inputWrap}>
            <select className={css.input} disabled>
              <option>Select</option>
              <option>Мужской</option>
              <option>Женский</option>
            </select>
          </div>
        </div>
      </div>

      <div className={css.marksSection}>
        <div className={css.tabs}>
          {(Object.keys(TAB_LABELS) as TabType[]).map((tab) => {
            const count = marks.filter((m: any) => m.mark === tab).length;
            return (
              <button
                key={tab}
                className={`${css.tab} ${activeTab === tab ? css.tabActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {TAB_LABELS[tab]}
                {count > 0 && <span className={css.tabCount}>{count}</span>}
              </button>
            );
          })}
        </div>

        {tabMarks.length === 0 ? (
          <div className={css.empty}>
            {activeTab === 'favorite' && 'Добавляйте тренировки в избранное, нажав ♡ на странице программы'}
            {activeTab === 'completed' && 'Здесь появятся пройденные тренировки'}
            {activeTab === 'wantTo' && 'Отмечайте тренировки, которые хотите пройти'}
          </div>
        ) : (
          <div className={css.programsScroll}>
            {tabMarks.map((m: any) => (
              <div key={m.programName} className={css.programCard}>
                <Link to={getViewProgramRoute({ programTitle: m.programName })} className={css.cardThumb}>
                  <div className={css.cardImg}>
                    <span className={css.cardEmoji}>{SPORT_EMOJI[m.programSport] ?? '🏅'}</span>
                  </div>
                  {activeTab === 'completed' && <span className={css.doneBadge}>✓</span>}
                </Link>
                <div className={css.cardBody}>
                  <p className={css.cardTitle}>Тренировка</p>
                  <p className={css.cardMeta}>
                    {m.programSport} · {m.programLevel}
                  </p>
                  <p className={css.cardDuration}>{m.programDuration} минут</p>
                </div>
                <button
                  className={css.removeBtn}
                  title="Убрать отметку"
                  onClick={() => removeMarkMutation.mutate({ programName: m.programName })}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
