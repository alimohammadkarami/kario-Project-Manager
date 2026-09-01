import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import BottomNav from './BottomNav'
import MobileDrawer from './MobileDrawer'
import useTheme from '../hooks/useTheme'
import { useLocation } from "react-router-dom";
import { DEFAULT_ACTIVE_NAV } from '../nav-items'
import { Outlet } from 'react-router-dom'
import SupportModal from './SupportModal'

const CURRENT_USER = {
  name: 'علی محمد کرمی',
  email: 'alikaramitd@gmail.com',
}

export default function AppShell({ children }) {
  const [activeNav, setActiveNav] = useState(DEFAULT_ACTIVE_NAV)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation();
  useEffect(() => {
    const currentNav = location.pathname.split("/")[1] || "dashboard";
  
    setActiveNav(currentNav);
  }, [location.pathname]);
  
  const handleCreateProject = () => {
    
  }

  return (
    <div className="min-h-screen bg-app-bg dark:bg-app-bg-dark">
      <div className="flex gap-3 p-3">
        <Sidebar
          activeNav={activeNav}
          onNavigate={setActiveNav}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onCreateProject={handleCreateProject}
          onOpenSupport={() => setSupportOpen(true)}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Header
            activeNav={activeNav}
            onOpenDrawer={() => setDrawerOpen(true)}
            user={CURRENT_USER}
          />

          <main className="flex-1 pb-24 lg:pb-3 justify-center items-center"><Outlet /></main>
        </div>
      </div>

      <BottomNav
        activeNav={activeNav}
        onNavigate={setActiveNav}
        onOpenDrawer={() => setDrawerOpen(true)}
        drawerOpen={drawerOpen}
      />

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeNav={activeNav}
        onNavigate={setActiveNav}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onCreateProject={handleCreateProject}
        onOpenSupport={() => setSupportOpen(true)}
        user={CURRENT_USER}
      />

      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
    </div>
  )
}
