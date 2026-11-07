import React, { useState, useEffect, useRef } from "react";
import ProjectCard from "../../components/projects/ProjectCard"; // مسیر کامپوننت کارت پروژه
import { CreateProject, GetAllProjects } from "../../services/ProjectService";
import CreateProjectModal from "../../components/CreateProjectModal";
import { useAuthCheck } from "../../hooks/useAuth";

export default function MyProjectsPage() {
  const { user, loadings } = useAuthCheck();
  const [projects, setProjects] = useState([]);
  const [archivedProjects, setArchivedProjects] = useState([]);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const isFetchingRef = useRef(false);
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

  useEffect(() => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    const fetchProjectsData = async () => {
      try {
        setLoading(true);
        const response = await GetAllProjects();

        const projectsArray =
          response.projects || response.data?.projects || [];

        const active = projectsArray.filter((p) => !p.isArchived);
        const archived = projectsArray.filter((p) => p.isArchived);

        setProjects(active);
        setArchivedProjects(archived);
      } catch (err) {
        console.error("خطا در دریافت پروژه‌ها:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          در حال بارگذاری پروژه‌ها...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6" dir="rtl">
        <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 p-4 text-sm text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
          خطا در ارتباط با سرور: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-6" dir="rtl">
      {/* هدر صفحه: عنوان و دکمه ایجاد پروژه جدید */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">
            پروژه های من
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            همه پروژه های شما در یک جا
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateProject}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition cursor-pointer"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          ایجاد پروژه جدید
        </button>
      </div>

      {/* گرید پروژه‌های فعال */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              progress={project.progress}
              membersCount={
                project.membersCount || project.members?.length || 0
              }
              dueDate={project.dueDate || project.jalaliDate}
              link={`/projects/${project.id}`}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400 text-sm rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#121212]">
            پروژه فعالی برای نمایش وجود ندارد.
          </div>
        )}
      </div>

      {/* بخش آکاردئونی پروژه‌های آرشیو شده - فقط زمانی که پروژه آرشیو شده وجود داشته باشد نشان داده می‌شود */}
      {archivedProjects.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#121212] shadow-sm transition-colors">
          <div
            onClick={() => setIsArchiveOpen(!isArchiveOpen)}
            className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  پروژه های آرشیو شده
                </span>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {archivedProjects.length} مورد
                </span>
              </div>
            </div>

            <button
              type="button"
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 transition"
            >
              <span>نمایش</span>
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${isArchiveOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* محتوای بازشونده آرشیو */}
          {isArchiveOpen && (
            <div className="border-t border-slate-100 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {archivedProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    title={project.title}
                    description={project.description}
                    progress={project.progress}
                    membersCount={project.membersCount || 0}
                    dueDate={project.dueDate || project.jalaliDate}
                    link={`/projects/${project.id}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateProject}
      />
    </div>
  );
}
