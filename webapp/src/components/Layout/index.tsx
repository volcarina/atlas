import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getAllProgramsRoute, getProfileRoute, getHomeRoute, getHistoryRoute } from '../../lib/routes';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { PageTransition } from '../PageTransition';
import { NetworkStatus } from '../NetworkStatus';
import css from './index.module.scss';

export const Layout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(getHomeRoute());
  };

  const initials = user
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
    : null;

  return (
    <div className={css.layout}>
      <nav className={css.navigation}>
        <Link to={getHomeRoute()} className={css.logoWrap}>
          <div className={css.logoIcon}>
            <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 20L14 6L24 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 14H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className={css.logoText}>ATLAS</span>
        </Link>

        <div className={css.menuSection}>
          <span className={css.menuLabel}>Навигация</span>
          <ul className={css.menu}>
            <li>
              <NavLink to={getHomeRoute()} end className={({ isActive }) => `${css.link} ${isActive ? css.linkActive : ''}`}>
                <span className={css.linkIcon}>
                  <svg viewBox="0 0 20 20" fill="none"><path d="M3 10.5L10 3l7 7.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1v-6.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M7 18v-5h6v5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
                </span>
                <span className={css.linkText}>Главная</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={getAllProgramsRoute()} className={({ isActive }) => `${css.link} ${isActive ? css.linkActive : ''}`}>
                <span className={css.linkIcon}>
                  <svg viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="11" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="3" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6"/></svg>
                </span>
                <span className={css.linkText}>Программы</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={getHistoryRoute()} className={({ isActive }) => `${css.link} ${isActive ? css.linkActive : ''}`}>
                <span className={css.linkIcon}>
                  <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                </span>
                <span className={css.linkText}>История</span>
              </NavLink>
            </li>
          </ul>
        </div>

        <div className={css.menuSection}>
          <span className={css.menuLabel}>Аккаунт</span>
          <ul className={css.menu}>
            <li>
              <NavLink to={getProfileRoute()} className={({ isActive }) => `${css.link} ${isActive ? css.linkActive : ''}`}>
                <span className={css.linkIcon}>
                  <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.6"/><path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                </span>
                <span className={css.linkText}>Профиль</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Theme toggle */}
        <div className={css.themeToggleWrap}>
          <button
            className={css.themeToggleBtn}
            onClick={toggleTheme}
            title={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
            aria-label="Переключить тему"
          >
            <span className={css.themeToggleTrack} data-dark={isDark}>
              <span className={css.themeToggleKnob} />
            </span>
            <span className={css.themeToggleIcon}>
              {isDark ? (
                <svg viewBox="0 0 20 20" fill="none"><path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 1.5A6.5 6.5 0 1110 16.5 6.5 6.5 0 0110 3.5z" fill="currentColor" opacity=".3"/><circle cx="10" cy="10" r="3" fill="currentColor"/><path d="M10 5V3M10 17v-2M5 10H3M17 10h-2M6.34 6.34L4.93 4.93M15.07 15.07l-1.41-1.41M6.34 13.66l-1.41 1.41M15.07 4.93l-1.41 1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              ) : (
                <svg viewBox="0 0 20 20" fill="none"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" fill="currentColor"/></svg>
              )}
            </span>
            <span className={css.themeToggleLabel}>{isDark ? 'Светлая тема' : 'Тёмная тема'}</span>
          </button>
        </div>

        <div className={css.navFooter}>
          {user ? (
            <div className={css.userCard}>
              <div className={css.userAvatar}>{initials}</div>
              <div className={css.userInfo}>
                <span className={css.userName}>{user.name}</span>
                <span className={css.userEmail}>{user.email}</span>
              </div>
              <button className={css.logoutBtn} onClick={handleLogout} title="Выйти">
                <svg viewBox="0 0 20 20" fill="none"><path d="M7 3H4a1 1 0 00-1 1v12a1 1 0 001 1h3M13 14l4-4-4-4M17 10H7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          ) : (
            <Link to="/" className={css.loginBtn}>
              Войти
            </Link>
          )}
        </div>
      </nav>

      <div className={css.content}>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </div>

      <NetworkStatus />
    </div>
  );
};
