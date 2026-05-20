import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { trpc } from '../../lib/trpc';
import { getViewProgramRoute } from '../../lib/routes';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Tooltip } from '../../components/Tooltip';
import { SPORT_IMAGES } from '../ViewProgramPage';
import css from './index.module.scss';

type TabType = 'favorite' | 'completed' | 'wantTo';

const TAB_LABELS: Record<TabType, string> = {
  favorite: 'Избранные',
  completed: 'Пройденные',
  wantTo: 'Хочу пройти',
};

const AVATAR_COLORS = [
  '#4f6ef7', '#e94560', '#1a936f', '#f5a623', '#9b59b6', '#2b7a78', '#e67e22', '#2c3e50',
];

const COVER_STYLES = [
  { id: 'mountains', label: '🏔 Горы', gradient: 'linear-gradient(135deg, #d0d0d8 0%, #e4e4ec 50%, #c8c8d2 100%)' },
  { id: 'ocean',     label: '🌊 Океан', gradient: 'linear-gradient(135deg, #1a6cf7 0%, #06b6d4 50%, #0ea5e9 100%)' },
  { id: 'forest',    label: '🌿 Лес',   gradient: 'linear-gradient(135deg, #1a936f 0%, #52b788 50%, #74c69d 100%)' },
  { id: 'sunset',    label: '🌅 Закат', gradient: 'linear-gradient(135deg, #f5a623 0%, #e94560 50%, #9b59b6 100%)' },
  { id: 'night',     label: '🌙 Ночь',  gradient: 'linear-gradient(135deg, #0f1117 0%, #1e2340 50%, #2b3272 100%)' },
];


type AchievementId =
  | 'first_favorite' | 'first_completed' | 'five_completed' | 'ten_completed'
  | 'first_wantto' | 'collector_5' | 'collector_15'
  | 'streak_3' | 'streak_7' | 'all_sports' | 'profile_filled' | 'custom_avatar';

interface Achievement {
  id: AchievementId;
  icon: string;
  title: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold';
  unlocked: boolean;
  progress?: { current: number; max: number };
}

function computeAchievements(p: {
  marks: any[]; stats: any; user: any; hasCustomAvatar: boolean;
}): Achievement[] {
  const completed = p.marks.filter((m) => m.mark === 'completed');
  const favorite  = p.marks.filter((m) => m.mark === 'favorite');
  const wantTo    = p.marks.filter((m) => m.mark === 'wantTo');
  const allMarks  = p.marks.length;
  const sports    = new Set(p.marks.map((m: any) => m.programSport)).size;
  const streak    = p.stats?.streak ?? 0;
  const isProfileFilled = !!p.user.name && !!p.user.email && !!p.user.birthDate && !!p.user.gender;

  return [
    { id: 'first_favorite',  icon: '♥',  title: 'Первая симпатия',       description: 'Добавить тренировку в избранное',                    tier: 'bronze', unlocked: favorite.length >= 1 },
    { id: 'first_completed', icon: '✓',  title: 'Первый шаг',            description: 'Завершить первую тренировку',                        tier: 'bronze', unlocked: completed.length >= 1,  progress: { current: Math.min(completed.length, 1),  max: 1  } },
    { id: 'five_completed',  icon: '🏅', title: 'На разогреве',          description: 'Завершить 5 тренировок',                             tier: 'bronze', unlocked: completed.length >= 5,  progress: { current: Math.min(completed.length, 5),  max: 5  } },
    { id: 'ten_completed',   icon: '🥈', title: 'Настоящий атлет',       description: 'Завершить 10 тренировок',                            tier: 'silver', unlocked: completed.length >= 10, progress: { current: Math.min(completed.length, 10), max: 10 } },
    { id: 'first_wantto',    icon: '🎯', title: 'Строю планы',           description: 'Добавить тренировку в список желаний',               tier: 'bronze', unlocked: wantTo.length >= 1 },
    { id: 'collector_5',     icon: '📚', title: 'Коллекционер',          description: 'Отметить 5 любых тренировок',                        tier: 'bronze', unlocked: allMarks >= 5,          progress: { current: Math.min(allMarks, 5),          max: 5  } },
    { id: 'collector_15',    icon: '🏆', title: 'Энциклопедист',         description: 'Отметить 15 любых тренировок',                       tier: 'gold',   unlocked: allMarks >= 15,         progress: { current: Math.min(allMarks, 15),         max: 15 } },
    { id: 'streak_3',        icon: '🔥', title: 'Три в ряд',             description: 'Серия 3 дня подряд',                                 tier: 'bronze', unlocked: streak >= 3,            progress: { current: Math.min(streak, 3),            max: 3  } },
    { id: 'streak_7',        icon: '⚡', title: 'Неделя без остановок',  description: 'Серия 7 дней подряд',                                tier: 'silver', unlocked: streak >= 7,            progress: { current: Math.min(streak, 7),            max: 7  } },
    { id: 'all_sports',      icon: '🌈', title: 'Разносторонний',        description: 'Отметить тренировки трёх разных видов спорта',       tier: 'silver', unlocked: sports >= 3,            progress: { current: Math.min(sports, 3),            max: 3  } },
    { id: 'profile_filled',  icon: '👤', title: 'Паспорт заполнен',      description: 'Заполнить все поля профиля',                         tier: 'bronze', unlocked: isProfileFilled },
    { id: 'custom_avatar',   icon: '📸', title: 'Лицо проекта',          description: 'Загрузить своё фото профиля',                        tier: 'bronze', unlocked: p.hasCustomAvatar },
  ];
}

const TIER_COLORS = {
  bronze: { bg: '#b87333', glow: 'rgba(184,115,51,0.35)',  label: 'Бронза' },
  silver: { bg: '#aaa9ad', glow: 'rgba(170,169,173,0.35)', label: 'Серебро' },
  gold:   { bg: '#ffd700', glow: 'rgba(255,215,0,0.4)',    label: 'Золото' },
};


export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('favorite');
  const { user: authUser, logout, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const utils = trpc.useUtils();
  const { data, isLoading, isError } = trpc.getUserProfile.useQuery();
  const removeMarkMutation = trpc.removeMark.useMutation({ onSuccess: () => utils.getUserProfile.invalidate() });
  const updateProfileMutation = trpc.updateProfile.useMutation({
    onSuccess: (result) => {
      utils.getUserProfile.invalidate();
      if (result?.user) updateUser({ name: result.user.name ?? undefined, email: result.user.email ?? undefined });
      setDirty(false);
    },
  });

  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender]       = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [coverStyle, setCoverStyle]   = useState('mountains');
  const [avatarPhoto, setAvatarPhoto] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto]   = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [hoveredAch, setHoveredAch] = useState<AchievementId | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data?.user) {
      setName(data.user.name ?? '');
      setEmail(data.user.email ?? '');
      setBirthDate(data.user.birthDate ? data.user.birthDate.slice(0, 10) : '');
      setGender(data.user.gender ?? '');
      setAvatarColor(data.user.avatarColor ?? AVATAR_COLORS[0]);
      setCoverStyle(data.user.coverStyle ?? 'mountains');
      setAvatarPhoto(data.user.avatarPhoto ?? null);
      setCoverPhoto(data.user.coverPhoto ?? null);
      setDirty(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.user?.name, data?.user?.email, data?.user?.birthDate, data?.user?.gender,
      data?.user?.avatarColor, data?.user?.coverStyle, data?.user?.avatarPhoto, data?.user?.coverPhoto]);

  if (isLoading) return <div className={css.state}>Загрузка...</div>;
  if (isError || !data?.user) {
    return (
      <div className={css.state}>
        {!authUser ? (
          <div className={css.authPrompt}>
            <span>👤</span>
            <p>Войдите, чтобы увидеть профиль</p>
            <Link to="/login" className={css.authBtn}>Войти</Link>
          </div>
        ) : 'Ошибка загрузки профиля'}
      </div>
    );
  }

  const { user, marks = [], stats } = data;
  const initials = user.name.split(' ').map((w: string) => w[0]).join('');
  const tabMarks = marks.filter((m: any) => m.mark === activeTab);

  const completedCount = marks.filter((m: any) => m.mark === 'completed').length;
  const favoriteCount  = marks.filter((m: any) => m.mark === 'favorite').length;
  const wantToCount    = marks.filter((m: any) => m.mark === 'wantTo').length;

  const coverGradient = COVER_STYLES.find((c) => c.id === coverStyle)?.gradient ?? COVER_STYLES[0].gradient;

  const age = birthDate
    ? Math.floor((Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 3600 * 1000))
    : null;
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
    : null;


  const handleSave = () => {
    updateProfileMutation.mutate({
      name: name || null, email: email || null,
      birthDate: birthDate || null, gender: gender || null,
      avatarColor, coverStyle,
      avatarPhoto: avatarPhoto ?? null,
      coverPhoto: coverPhoto ?? null,
    });
  };

  const readFileAsBase64 = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = (e) => res(e.target?.result as string);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

  const handleAvatarPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await readFileAsBase64(file);
    setAvatarPhoto(b64);
    setShowColorPicker(false);
    updateProfileMutation.mutate({
      name: name || null, email: email || null,
      birthDate: birthDate || null, gender: gender || null,
      avatarColor, coverStyle, avatarPhoto: b64, coverPhoto: coverPhoto ?? null,
    });
  };

  const handleCoverPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await readFileAsBase64(file);
    setCoverPhoto(b64);
    setShowCoverPicker(false);
    updateProfileMutation.mutate({
      name: name || null, email: email || null,
      birthDate: birthDate || null, gender: gender || null,
      avatarColor, coverStyle, avatarPhoto: avatarPhoto ?? null, coverPhoto: b64,
    });
  };

  const removeAvatarPhoto = () => {
    setAvatarPhoto(null);
    setShowColorPicker(false);
    updateProfileMutation.mutate({
      name: name || null, email: email || null,
      birthDate: birthDate || null, gender: gender || null,
      avatarColor, coverStyle, avatarPhoto: null, coverPhoto: coverPhoto ?? null,
    });
  };

  const removeCoverPhoto = () => {
    setCoverPhoto(null);
    updateProfileMutation.mutate({
      name: name || null, email: email || null,
      birthDate: birthDate || null, gender: gender || null,
      avatarColor, coverStyle, avatarPhoto: avatarPhoto ?? null, coverPhoto: null,
    });
  };


  const achievements = computeAchievements({
    marks, stats,
    user: { name, email, birthDate, gender },
    hasCustomAvatar: !!avatarPhoto,
  });
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className={css.page}>
      <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarPhotoChange} />
      <input ref={coverInputRef}  type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverPhotoChange} />

      <div
        className={css.cover}
        style={coverPhoto
          ? { backgroundImage: `url(${coverPhoto})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { background: coverGradient }}
      >
        <div className={css.coverBtnGroup}>
          <button className={css.coverEditBtn} onClick={() => { setShowCoverPicker((v) => !v); setShowColorPicker(false); }}>Сменить фон</button>
          <button className={css.coverEditBtn} onClick={() => coverInputRef.current?.click()}>📷 Фото с устройства</button>
          {coverPhoto && <button className={`${css.coverEditBtn} ${css.coverEditBtnDanger}`} onClick={removeCoverPhoto}>Убрать фото</button>}
        </div>
        {showCoverPicker && (
          <div className={css.coverPicker}>
            {COVER_STYLES.map((c) => (
              <button
                key={c.id}
                className={`${css.coverOption} ${coverStyle === c.id && !coverPhoto ? css.coverOptionActive : ''}`}
                style={{ background: c.gradient }}
                onClick={() => {
                  setCoverStyle(c.id); setDirty(true); setShowCoverPicker(false);
                  if (coverPhoto) removeCoverPhoto();
                }}
              >
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={css.headerRow}>
        <div className={css.avatarWrap}>
          <div
            className={css.avatar}
            style={avatarPhoto
              ? { backgroundImage: `url(${avatarPhoto})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' }
              : { background: avatarColor }}
          >
            {!avatarPhoto && initials}
          </div>
          <button className={css.avatarEditBtn} onClick={() => { setShowColorPicker((v) => !v); setShowCoverPicker(false); }} title="Изменить аватар">✏</button>
          {showColorPicker && (
            <div className={css.colorPicker}>
              <div className={css.colorPickerSection}>
                <span className={css.colorPickerLabel}>Цвет фона</span>
                <div className={css.colorSwatches}>
                  {AVATAR_COLORS.map((c) => (
                    <button
                      key={c}
                      className={`${css.colorSwatch} ${avatarColor === c && !avatarPhoto ? css.colorSwatchActive : ''}`}
                      style={{ background: c }}
                      onClick={() => { setAvatarColor(c); setDirty(true); setShowColorPicker(false); if (avatarPhoto) removeAvatarPhoto(); }}
                    />
                  ))}
                </div>
              </div>
              <div className={css.colorPickerDivider} />
              <button className={css.uploadPhotoBtn} onClick={() => { avatarInputRef.current?.click(); setShowColorPicker(false); }}>📷 Загрузить фото</button>
              {avatarPhoto && <button className={css.removePhotoBtn} onClick={removeAvatarPhoto}>Убрать фото</button>}
            </div>
          )}
        </div>

        <div className={css.userInfo}>
          <h1 className={css.name}>{user.name}</h1>
          <p className={css.email}>{user.email}</p>
          {(age !== null || gender) && (
            <p className={css.userMeta}>
              {age !== null && `${age} лет`}
              {age !== null && gender && ' · '}
              {gender === 'male' ? 'Мужской' : gender === 'female' ? 'Женский' : gender}
            </p>
          )}
          {memberSince && <p className={css.memberSince}>Участник с {memberSince}</p>}
        </div>

        <div className={css.headerControls}>
          <div className={css.controlRow}>
            <span className={css.controlLabel}>{isDark ? 'Тёмная тема' : 'Светлая тема'}</span>
            <button className={`${css.toggle} ${isDark ? css.toggleActive : ''}`} onClick={toggleTheme} aria-label="Переключить тему">
              <div className={css.toggleKnob} />
            </button>
          </div>
          {dirty && (
            <button className={css.saveBtn} onClick={handleSave} disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? 'Сохраняем...' : 'Сохранить'}
            </button>
          )}
          <button className={css.logoutBtn} onClick={logout}>Выйти</button>
        </div>
      </div>

      <div className={css.formGrid}>
        <div className={css.fieldGroup}>
          <label className={css.fieldLabel}>Адрес электронной почты</label>
          <div className={css.inputWrap}>
            <span className={css.inputIcon}>✉</span>
            <input className={`${css.input} ${css.inputEditable}`} type="email" value={email} onChange={(e) => { setEmail(e.target.value); setDirty(true); }} />
          </div>
        </div>
        <div className={css.fieldGroup}>
          <label className={css.fieldLabel}>Дата рождения</label>
          <div className={css.inputWrap}>
            <input className={`${css.input} ${css.inputEditable}`} style={{ paddingLeft: 12 }} type="date" value={birthDate} onChange={(e) => { setBirthDate(e.target.value); setDirty(true); }} />
            <span className={css.inputIconRight}>📅</span>
          </div>
        </div>
        <div className={css.fieldGroup}>
          <label className={css.fieldLabel}>Пол</label>
          <div className={css.inputWrap}>
            <select className={`${css.input} ${css.inputEditable}`} style={{ paddingLeft: 12 }} value={gender} onChange={(e) => { setGender(e.target.value); setDirty(true); }}>
              <option value="">Не указан</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>
        </div>
        <div className={css.fieldGroup}>
          <label className={css.fieldLabel}>Имя</label>
          <div className={css.inputWrap}>
            <span className={css.inputIcon}>👤</span>
            <input className={`${css.input} ${css.inputEditable}`} type="text" value={name} onChange={(e) => { setName(e.target.value); setDirty(true); }} />
          </div>
        </div>
      </div>

      <section className={css.section}>
        <div className={css.sectionHeader}><h2 className={css.sectionTitle}>Статистика</h2></div>
        <div className={css.statsGrid}>
          <div className={css.statCard}><span className={css.statValue}>{completedCount}</span><span className={css.statLabel}>Пройдено</span></div>
          <div className={css.statCard}><span className={css.statValue}>{favoriteCount}</span><span className={css.statLabel}>Избранных</span></div>
          <div className={css.statCard}><span className={css.statValue}>{wantToCount}</span><span className={css.statLabel}>Хочу пройти</span></div>
          <div className={css.statCard}><span className={css.statValue}>{stats?.totalMinutes ?? 0}</span><span className={css.statLabel}>Минут всего</span></div>
          <div className={css.statCard}><span className={css.statValue}>{stats?.totalCalories ? (stats.totalCalories >= 1000 ? `${Math.round(stats.totalCalories / 1000 * 10) / 10}k` : stats.totalCalories) : 0}</span><span className={css.statLabel}>Калорий сожжено</span></div>
          <div className={`${css.statCard} ${(stats?.streak ?? 0) > 0 ? css.statCardStreak : ''}`}><span className={css.statValue}>{stats?.streak ?? 0} 🔥</span><span className={css.statLabel}>Серия дней</span></div>
        </div>
      </section>

      <section className={css.section}>
        <div className={css.sectionHeader}>
          <h2 className={css.sectionTitle}>Достижения</h2>
          <Tooltip content="Достижения разблокируются автоматически по мере активности. Наводите на карточку чтобы увидеть прогресс." position="bottom"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="14" height="14" style={{marginRight:4,verticalAlign:"middle",opacity:0.5}}><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5.5v.5"/></svg></Tooltip><span className={css.achievementCounter}>{unlockedCount} / {achievements.length}</span>
        </div>
        <div className={css.achProgressBar}>
          <div className={css.achProgressFill} style={{ width: `${(unlockedCount / achievements.length) * 100}%` }} />
        </div>
        <div className={css.achievementsGrid}>
          {achievements.map((ach) => {
            const tier = TIER_COLORS[ach.tier];
            return (
              <div
                key={ach.id}
                className={`${css.achCard} ${ach.unlocked ? css.achCardUnlocked : css.achCardLocked}`}
                style={ach.unlocked ? { '--ach-glow': tier.glow, '--ach-color': tier.bg } as React.CSSProperties : {}}
                onMouseEnter={() => setHoveredAch(ach.id)}
                onMouseLeave={() => setHoveredAch(null)}
              >
                <div className={css.achIconWrap} style={ach.unlocked ? { background: tier.bg } : {}}>
                  <span className={css.achIcon}>{ach.unlocked ? ach.icon : '🔒'}</span>
                </div>
                <div className={css.achBody}>
                  <p className={css.achTitle}>{ach.title}</p>
                  <p className={css.achDesc}>{ach.description}</p>
                  {ach.progress && !ach.unlocked && (
                    <div className={css.achMiniBar}>
                      <div className={css.achMiniBarFill} style={{ width: `${(ach.progress.current / ach.progress.max) * 100}%` }} />
                      <span className={css.achMiniBarLabel}>{ach.progress.current}/{ach.progress.max}</span>
                    </div>
                  )}
                </div>
                {ach.unlocked && <span className={css.achTierBadge} style={{ background: tier.bg }}>{tier.label}</span>}
                {hoveredAch === ach.id && (
                  <div className={css.achTooltip}>
                    <strong>{ach.title}</strong>
                    <span>{ach.description}</span>
                    {ach.unlocked
                      ? <span className={css.achTooltipDone}>✓ Получено</span>
                      : ach.progress
                        ? <span>{ach.progress.current} из {ach.progress.max}</span>
                        : <span>Не получено</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className={css.section}>
        <h2 className={css.sectionTitle}>Мои тренировки</h2>
        <div className={css.tabs}>
          {(Object.keys(TAB_LABELS) as TabType[]).map((tab) => {
            const count = marks.filter((m: any) => m.mark === tab).length;
            return (
              <button key={tab} className={`${css.tab} ${activeTab === tab ? css.tabActive : ''}`} onClick={() => setActiveTab(tab)}>
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
                <Link to={getViewProgramRoute({ programTitle: m.programNick ?? m.programName })} className={css.cardThumb}>
                  <div className={css.cardImg}><img src={SPORT_IMAGES[m.programSport] ?? SPORT_IMAGES['Кардио']} alt={m.programSport} className={css.cardImgTag} /></div>
                  {activeTab === 'completed' && <span className={css.doneBadge}>✓</span>}
                  {activeTab === 'favorite'  && <span className={css.favBadge}>♥</span>}
                  {activeTab === 'wantTo'    && <span className={css.wantBadge}>+</span>}
                </Link>
                <div className={css.cardBody}>
                  <p className={css.cardTitle}>{m.programName}</p>
                  <p className={css.cardMeta}>{m.programSport} · {m.programLevel}</p>
                  <p className={css.cardDuration}>{m.programDuration} минут</p>
                </div>
                <button className={css.removeBtn} title="Убрать отметку" onClick={() => removeMarkMutation.mutate({ programName: m.programName })}>×</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={css.section}>
        <div className={css.sectionHeader}>
          <h2 className={css.sectionTitle}>Похожие тренировки</h2>
          {data.hasTaste && data.topSports?.length > 0 && (
            <p className={css.sectionHint}>На основе твоих{' '}{data.topSports.slice(0, 2).map((s: string) => `«${s}»`).join(' и ')}</p>
          )}
        </div>
        {!data.similarPrograms || data.similarPrograms.length === 0 ? (
          <p className={css.emptyHint}>Отметь несколько тренировок — и мы подберём похожие</p>
        ) : (
          <div className={css.similarRow}>
            {data.similarPrograms.map((p: any) => (
              <Link key={p.name} to={getViewProgramRoute({ programTitle: p.nick ?? p.name })} className={css.similarCard}>
                <div className={css.similarThumb}><img src={SPORT_IMAGES[p.sport] ?? SPORT_IMAGES['Кардио']} alt={p.sport} className={css.similarImg} /></div>
                <div className={css.similarBody}>
                  <p className={css.similarName}>{p.name}</p>
                  <p className={css.similarMeta}>{p.sport} · {p.level}</p>
                  <p className={css.similarDur}>{p.duration} мин</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
