import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { TrpcProvider } from './lib/trpc.tsx';
import { HomePage } from './pages/HomePage';
import { ProgramsPage } from './pages/ProgramsPage';
import { ViewProgramPage } from './pages/ViewProgramPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HistoryPage } from './pages/HistoryPage';
import {
  getAllProgramsRoute,
  getViewProgramRoute,
  viewProgramRouteParams,
  getProfileRoute,
  getLoginRoute,
  getRegisterRoute,
  getHomeRoute,
  getHistoryRoute,
} from './lib/routes.ts';
import { Layout } from './components/Layout/index.tsx';
import './styles/global.scss';

export const App = () => {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route path={getLoginRoute()} element={<LoginPage />} />
          <Route path={getRegisterRoute()} element={<RegisterPage />} />
          <Route element={<Layout />}>
            <Route path={getHomeRoute()} element={<HomePage />} />
            <Route path={getAllProgramsRoute()} element={<ProgramsPage />} />
            <Route path={getViewProgramRoute(viewProgramRouteParams)} element={<ViewProgramPage />} />
            <Route path={getProfileRoute()} element={<ProfilePage />} />
            <Route path={getHistoryRoute()} element={<HistoryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  );
};
