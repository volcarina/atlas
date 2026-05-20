import { useLocation } from 'react-router-dom';
import css from './index.module.scss';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Простая анимация появления при смене маршрута.
 * Используем key={pathname} чтобы React пересоздавал элемент
 * и запускал CSS-анимацию fadeIn заново на каждой новой странице.
 * НЕ делаем exit-анимацию — она требует держать старый Outlet живым
 * параллельно с новым, что вызывает двойную загрузку страницы.
 */
export const PageTransition = ({ children }: PageTransitionProps) => {
  const { pathname } = useLocation();

  return (
    <div key={pathname} className={css.page}>
      {children}
    </div>
  );
};
