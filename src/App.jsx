import AppShell from './components/AppShell'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProjectsEmpty } from './components/ProjectsEmpty'
import { Home } from './components/Home'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/test'

export default function App() {
  return (
    <div className="app">
      <Router>
        <Routes>

          {/* صفحات بدون AppShell */}
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* صفحات داخل AppShell */}
          <Route element={<AppShell />}>
            <Route path="/"  element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsEmpty />} />
            <Route path="/tasks" element={<div>tasks</div>} />
            <Route path="/profile" element={<div></div>} />
            <Route path="/settings" element={<div>settings</div>} />
            <Route path="/support" element={<div>support</div>} />
            <Route path="/logout" element={<div>logout</div>} />
          </Route>

        </Routes>
      </Router>
    </div>
  )
}