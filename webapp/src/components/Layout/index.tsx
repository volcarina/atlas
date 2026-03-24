import { Link, Outlet } from 'react-router-dom';
import { getAllProgramsRoute, getProfileRoute, getHomeRoute } from '../../lib/routes';
import css from './index.module.scss';

export const Layout = () => {
  return (
    <div className={css.layout}>
      <div className={css.navigation}>
        <div className={css.logo}>ATLAS</div>
        <ul className={css.menu}>
          <li className={css.item}>
            <Link className={css.link} to={getHomeRoute()}>
              Главная
            </Link>
          </li>
          <li className={css.item}>
            <Link className={css.link} to={getAllProgramsRoute()}>
              Все программы
            </Link>
          </li>
          <li className={css.item}>
            <Link className={css.link} to={getProfileRoute()}>
              Личный кабинет
            </Link>
          </li>
        </ul>
      </div>
      <div className={css.content}>
        <Outlet />
      </div>
    </div>
  );
};
