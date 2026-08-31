import AppShell from './components/AppShell'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProjectsEmpty } from './components/ProjectsEmpty'
import { Home } from './components/Home'

export default function App() {
  return (
    <div className="app">
      <Router>
        <Routes>

          {/* صفحات بدون AppShell */}
          <Route path="/signup" element={<div>Signup</div>} />
          <Route path="/login" element={<div>Login</div>} />

          {/* صفحات داخل AppShell */}
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectsEmpty />} />
            <Route path="/tasks" element={<div>tasks</div>} />
            <Route path="/profile" element={<div>profile</div>} />
            <Route path="/settings" element={<div>settings</div>} />
            <Route path="/support" element={<div>support</div>} />
            <Route path="/logout" element={<div>logout</div>} />
          </Route>

        </Routes>
      </Router>
    </div>
  )
}