import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { TrpcProvider } from './lib/trpc.tsx'
import { ProgramsPage } from './pages/ProgramsPage'
import { ViewProgramPage } from './pages/ViewProgramPage'
import { ProfilePage } from './pages/ProfilePage'
import { getAllProgramsRoute, getViewProgramRoute, viewProgramRouteParams, getProfileRoute} from './lib/routes.ts'
import { Layout } from './components/Layout/index.tsx'
import './styles/global.scss'

export const App = () => {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout/>}> 
            <Route path={getAllProgramsRoute()} element={<ProgramsPage/>} />
            <Route path={getViewProgramRoute(viewProgramRouteParams)} element={<ViewProgramPage/>} />
            <Route path={getProfileRoute()} element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  )
}
