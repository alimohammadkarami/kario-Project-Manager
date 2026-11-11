import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomNav from "./BottomNav";
import MobileDrawer from "./MobileDrawer";
import useTheme from "../../hooks/useTheme";
import { useLocation } from "react-router-dom";
import { DEFAULT_ACTIVE_NAV } from "../../nav-items";
import { Outlet } from "react-router-dom";
import SupportModal from "../tickets/SupportModal";
import ProfileDrawer from "./ProfileDrawer";
import EditProfileModal from "../modals/EditProfileModal";
import ChangePasswordModal from "../modals/ChangePasswordModal";
import CreateProjectModal from "../modals/CreateProjectModal";
import { ModifyFullname } from "../../services/AuthService";
import { CreateProject } from "../../services/ProjectService";

const CURRENT_USER = {
  name: localStorage.getItem("fullName"),
  email: localStorage.getItem("email"),
};

export default function AppShell({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem("fullName") || "null";
  });
  const [activeNav, setActiveNav] = useState(DEFAULT_ACTIVE_NAV);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  console.log(currentUser);
  const handleEditProfile = () => {
    setProfileDrawerOpen(false);
    setEditModalOpen(true);
  };
  const handleSaveProfile = async (fullName) => {
    console.log("New name:", fullName);
    try {
      const response = await ModifyFullname(fullName);
    } catch (err) {
      console.log(err.message);
    } finally {
      setEditModalOpen(false);
      localStorage.setItem("fullName", fullName);
      setCurrentUser(fullName);
    }
  };
  const handleResetPassword = () => {
    setProfileDrawerOpen(false);
    setIsPasswordModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  const location = useLocation();
  useEffect(() => {
    const currentNav = location.pathname.split("/")[1] || "";
    console.log(currentNav);

    setActiveNav(currentNav);
  }, [location.pathname]);

  const handleCreateProject = async (formData) => {
    setIsCreateModalOpen(true);
    try {
      // نام کلیدها را دقیقاً مطابق با نیاز بک‌اند تنظیم می‌کنیم (title به جای name اگر لازم باشد)
      const payload = {
        title: formData.name, // نام فیلد در فرم شما projectName بود که به title تبدیل شد
        description: formData.description,
        dueDate: formData.dueDate, // تاریخ سررسید (مثلاً 1405-04-14)
      };

      // کال کردن سرویس ساخت پروژه
      const response = await CreateProject(payload);

      console.log("پروژه با موفقیت ساخته شد:", response);
      setIsCreateModalOpen(false);
      // کارهای بعدی مثل بستن مودال، رفرش لیست پروژه‌ها یا هدایت کاربر
      // setIsOpen(false);
      // fetchProjectsList();
      window.location.href = "/projects";
    } catch (error) {
      console.error("خطا در ایجاد پروژه:", error);
      throw new Error(
        error.response?.data?.message || "خطایی در ساخت پروژه رخ داد.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-app-bg dark:bg-app-bg-dark">
      <div className="flex gap-3 p-3">
        <Sidebar
          activeNav={activeNav}
          onNavigate={setActiveNav}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onCreateProject={handleCreateProject}
          onOpenSupport={() => (window.location.href = "/tickets")}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Header
            activeNav={activeNav}
            onOpenDrawer={() => setDrawerOpen(true)}
            onOpenProfile={() => setProfileDrawerOpen(true)}
            userName={currentUser}
            userEmail={CURRENT_USER.email}
            profileDrawer={
              <ProfileDrawer
                isOpen={profileDrawerOpen}
                onClose={() => setProfileDrawerOpen(false)}
                userName={currentUser}
                userEmail={CURRENT_USER.email}
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
                onSave={() => setIsPasswordModalOpen(false)}
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
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateProject}
      />
    </div>
  );
}
