import { useState, useEffect, useCallback } from 'react';
import css from './index.module.scss';

type StatusType = 'offline' | 'server-error' | null;

interface NetworkStatusProps {
  onRef?: (trigger: (type: 'server-error') => void) => void;
}

export let triggerNetworkError: ((type: 'server-error') => void) | null = null;

export const NetworkStatus = (_props: NetworkStatusProps) => {
  const [status, setStatus] = useState<StatusType>(null);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  const show = useCallback((type: StatusType) => {
    setStatus(type);
    setExiting(false);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      setExiting(false);
      setStatus(null);
    }, 320);
  }, []);

  useEffect(() => {
    const handleOffline = () => show('offline');
    const handleOnline = () => {
      if (status === 'offline') hide();
    };

    if (!navigator.onLine) show('offline');

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [show, hide, status]);

  useEffect(() => {
    triggerNetworkError = (type: 'server-error') => {
      show(type);
      // Auto-hide server error after 5s
      setTimeout(hide, 5000);
    };
    return () => { triggerNetworkError = null; };
  }, [show, hide]);

  if (!visible) return null;

  const isOffline = status === 'offline';

  return (
    <div className={`${css.banner} ${exiting ? css.bannerExit : css.bannerEnter}`}>
      <span className={css.icon}>
        {isOffline ? (
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18">
            <line x1="1" y1="1" x2="19" y2="19" />
            <path d="M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18">
            <circle cx="10" cy="10" r="8" />
            <line x1="10" y1="6" x2="10" y2="10" />
            <line x1="10" y1="14" x2="10.01" y2="14" />
          </svg>
        )}
      </span>
      <div className={css.text}>
        <strong>{isOffline ? 'Нет подключения к интернету' : 'Ошибка сервера'}</strong>
        <span>{isOffline ? 'Проверьте соединение и попробуйте снова' : 'Сервер не отвечает. Попробуйте позже'}</span>
      </div>
      {!isOffline && (
        <button className={css.closeBtn} onClick={hide} aria-label="Закрыть">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14">
            <line x1="2" y1="2" x2="14" y2="14" />
            <line x1="14" y1="2" x2="2" y2="14" />
          </svg>
        </button>
      )}
      {isOffline && (
        <div className={css.pulse} />
      )}
    </div>
  );
};
