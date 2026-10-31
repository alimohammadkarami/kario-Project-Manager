import React, { useState, useRef, useEffect } from "react";
import ProjectCard from "../../components/projects/ProjectCard.jsx";
import WelcomeBanner from "../../components/WelcomeBanner.jsx";
import { GetAllProjects } from "../../services/ProjectService.jsx";
import { useAuthCheck } from "../../hooks/useAuth.js";
export default function Dashboard() {
  const { user, loadings } = useAuthCheck();

  if (loadings) {
    return (
      <div className="p-8 text-center text-slate-500">
        در حال بررسی اعتبار حساب کاربری...
      </div>
    );
  }
  // اطلاعات متغیر نام کاربر (می‌توانید از props یا Context بگیرید)
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلوگیری از ارسال درخواست تکراری در حالت توسعه (StrictMode)
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await GetAllProjects();

        // استخراج آرایه پروژه‌ها (با فرض اینکه داخل response.projects یا response.data.projects است)
        const projectsArray =
          response.projects || response.data?.projects || [];
        setProjects(projectsArray);
      } catch (err) {
        console.error("خطا در دریافت پروژه‌ها:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // ۱. حالت بارگذاری
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          در حال بارگذاری پروژه‌ها...
        </div>
      </div>
    );
  }

  // ۲. حالت خطا
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
    <div className="w-full space-y-6" dir="rtl">
      {/* کارت بنر خوش‌آمدگویی بالا */}
      <WelcomeBanner
        userName={localStorage.getItem("fullName")}
        userInitials={localStorage.getItem("avatarName")}
      />

      {/* هدر بخش پروژه‌ها */}
      <div className="flex items-center justify-between pt-2 md:px-6">
        <div className="flex items-center gap-2.5">
          <svg
            width="29"
            height="29"
            viewBox="0 0 29 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.2917 23.5625H25.375"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke="#6F6F6F"
            />
            <path
              d="M13.2917 15.1041H25.375"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke="#6F6F6F"
            />
            <path
              d="M13.2917 6.64587H25.375"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke="#6F6F6F"
            />
            <path
              d="M3.625 6.64579L4.83333 7.85413L8.45833 4.22913"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke="#6F6F6F"
            />
            <path
              d="M3.625 15.1042L4.83333 16.3125L8.45833 12.6875"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke="#6F6F6F"
            />
            <path
              d="M3.625 23.5625L4.83333 24.7709L8.45833 21.1459"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke="#6F6F6F"
            />
          </svg>

          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            آخرین پروژه ها
          </h2>
        </div>

        <a
          href="/projects"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 transition"
        >
          مشاهده همه
          <svg
            className="h-3.5 w-3.5 rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>

      {/* گرید کارت‌های پروژه (ریسپانسیو کامل در موبایل و دسکتاپ) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:px-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              progress={project.progress}
              membersCount={project.membersCount || project.members?.length}
              dueDate={project.dueDate || project.jalaliDate}
              link={`/projects/${project.id}`}
            />
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-slate-400 text-sm">
            پروژه‌ای برای نمایش یافت نشد.
          </div>
        )}
      </div>
    </div>
  );
}
