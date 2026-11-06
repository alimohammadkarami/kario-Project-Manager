import AppShell from './components/AppShell'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProjectsEmpty } from './components/ProjectsEmpty'
import { Home } from './components/Home'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/test'
import TicketsPage from './pages/Tickets/UserTickets'
import SupportTicketArchive from './pages/Tickets/AllTickets'
import Dashboard from './pages/projects/Dashboard'
import MyProjectsPage from './pages/projects/MyProjects'
import MyTasksPage from './pages/projects/MyTask'
import ProjectDashboardPage from './pages/projects/ProjectDashboard'
import ProjectTasksPage from './pages/projects/ProjectTaskList'

export default function App() {
  const userRole = localStorage.getItem("user_role");
  return (
    <div className="app">
      <Router>
        <Routes>

          {/* صفحات بدون AppShell */}
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* صفحات داخل AppShell */}
          <Route element={<AppShell />}>
            <Route path="/"  element={<Dashboard />} />
            <Route path="/projects" element={<MyProjectsPage />} />
            // مثال در React Router
            <Route path="/projects/:id" element={<ProjectDashboardPage/>} />
            <Route path="/:projectId/tasks" element={<ProjectTasksPage />} />
            <Route path="/tasks" element={<MyTasksPage />} />
            <Route path="/profile" element={<div></div>} />
            <Route path="/settings" element={<div>settings</div>} />
            <Route path="/tickets" element={userRole == "support" ? <SupportTicketArchive /> : <TicketsPage /> } />
            <Route path="/logout" element={<div>logout</div>} />
          </Route>

        </Routes>
      </Router>
    </div>
  )
}