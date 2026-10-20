import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomNav from "./BottomNav";
import MobileDrawer from "./MobileDrawer";
import useTheme from "../hooks/useTheme";
import { useLocation } from "react-router-dom";
import { DEFAULT_ACTIVE_NAV } from "../nav-items";
import { Outlet } from "react-router-dom";
import SupportModal from "./SupportModal";
import ProfileDrawer from "./ProfileDrawer";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";

const CURRENT_USER = {
  name: "علی محمد کرمی",
  email: "alikaramitd@gmail.com",
};

export default function AppShell({ children }) {
  const [activeNav, setActiveNav] = useState(DEFAULT_ACTIVE_NAV);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const handleEditProfile = () => {
    setProfileDrawerOpen(false);
    setEditModalOpen(true);
  };
  const handleSaveProfile = async (fullName) => {
    console.log("New name:", fullName);
  };
  const handleResetPassword = () => {
    setProfileDrawerOpen(false);
    setIsPasswordModalOpen(true);
  };

  const handleLogout = () => {
    console.log("Logout");
  };
  const location = useLocation();
  useEffect(() => {
    const currentNav = location.pathname.split("/")[1] || "";
    console.log(currentNav);

    setActiveNav(currentNav);
  }, [location.pathname]);

  const handleCreateProject = () => {};

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
            onOpenProfile={() => setProfileDrawerOpen(true)}
            user={CURRENT_USER}
            profileDrawer={
              <ProfileDrawer
                isOpen={profileDrawerOpen}
                onClose={() => setProfileDrawerOpen(false)}
                user={CURRENT_USER}
                onEditProfile={handleEditProfile}
                onResetPassword={handleResetPassword}
                onLogout={handleLogout}
              />
            }
            editModal={
              <EditProfileModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                user={CURRENT_USER}
                onSave={handleSaveProfile}
              />
            }
            passModal={
              <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onSave={(() => setIsPasswordModalOpen(false))}
              />
            }
          />

          <main className="flex-1 pb-24 lg:pb-3 justify-center items-center">
            <Outlet />
          </main>
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
  );
}
