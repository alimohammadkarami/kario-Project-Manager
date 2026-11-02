import React, { useState, useEffect, useRef } from "react";
import { GetMyTasks } from "../../services/ProjectService";
// فرضیه: سرویس دریافت وظایف کاربر

export default function MyTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all"); // فیلتر وضعیت‌ها
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isFetchingRef = useRef(false);

    useEffect(() => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      const fetchTasks = async () => {
        try {
          setLoading(true);
          const response = await GetMyTasks();

          // استخراج آرایه وظایف بر اساس ساختار پاسخ API
          const tasksArray = response.tasks || response.data?.tasks || [];
          setTasks(tasksArray);
        } catch (err) {
          console.error("خطا در دریافت وظایف:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchTasks();
    }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
      case "done":
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 text-xs font-light text-emerald-700 dark:text-emerald-400">
            تکمیل شده
          </span>
        );
      case "pending_approval":
      case "waiting":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-950/60 px-3 py-1 text-xs font-light text-amber-700 dark:text-amber-400">
            در انتظار تایید
          </span>
        );
      case "in_progress":
      case "doing":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-950/60 px-3 py-1 text-xs font-light text-blue-700 dark:text-blue-400">
            در حال انجام
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-light text-slate-700 dark:text-slate-300">
            نامشخص
          </span>
        );
    }
  };

  // مدیریت کلیک روی دکمه‌های عملیاتی کارت (مثلاً تایید یا تکمیل)
  const handleActionClick = async (taskId, newStatus) => {
    try {
      console.log(`تغییر وضعیت تسک ${taskId} به ${newStatus}`);
      // اینجا می‌توانید تابع آپدیت API را صدا بزنید
      // await UpdateTaskStatus(taskId, newStatus);

      // آپدیت موقت استیت محلی برای واکنش سریع UI
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
      );
    } catch (err) {
      console.error("خطا در بروزرسانی وضعیت تسک:", err);
    }
  };

  // فیلتر کردن وظایف بر اساس انتخاب کاربر
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

    if (loading) {
      return (
        <div className="flex h-64 items-center justify-center" dir="rtl">
          <div className="text-sm text-slate-500 dark:text-slate-400">در حال بارگذاری وظایف...</div>
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
      {/* هدر صفحه و فیلتر کشویی */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M25.6663 12.8334V19.8334C25.6663 24.5 24.4997 25.6667 19.833 25.6667H8.16634C3.49967 25.6667 2.33301 24.5 2.33301 19.8334V8.16671C2.33301 3.50004 3.49967 2.33337 8.16634 2.33337H9.91634C11.6663 2.33337 12.0513 2.84671 12.7163 3.73337L14.4663 6.06671C14.9097 6.65004 15.1663 7.00004 16.333 7.00004H19.833C24.4997 7.00004 25.6663 8.16671 25.6663 12.8334Z"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke="#1B51E5"
              />
              <path
                d="M9.33301 2.33337H19.833C22.1663 2.33337 23.333 3.50004 23.333 5.83337V7.44337"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke="#1B51E5"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            وظایف من
          </h1>
        </div>

        {/* فیلتر کشویی (Dropdown) */}
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] py-2.5 pr-4 pl-10 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition cursor-pointer appearance-none"
          >
            <option value="all">همه وظایف</option>
            <option value="in_progress">در حال انجام</option>
            <option value="pending_approval">در انتظار تایید</option>
            <option value="completed">تکمیل شده</option>
          </select>
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <svg
              className="h-4 w-4"
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
          </span>
        </div>
      </div>

      {/* لیست کارت‌های وظایف */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#121212] p-5 shadow-sm transition-all hover:shadow-md"
            >
              {/* بخش سمت راست: عنوان در بالا و تاریخ + بج در پایینِ آن */}
              <div className="space-y-2">
                {/* عنوان تسک */}
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base">
                  {task.title}
                </h3>

                {/* ردیف پایین: تاریخ سررسید و بج وضعیت در کنار هم */}
                <div className="flex items-center gap-3">
                  {/* بج وضعیت دقیقاً قبل از تاریخ / زیر عنوان */}
                  {getStatusBadge(task.status)}
                  <div className="flex items-center gap-1.5 text-xs  text-slate-400 dark:text-slate-500">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>تاریخ سررسید: {task.dueDate || task.jalaliDate}</span>
                  </div>
                </div>
              </div>

              {/* دکمه‌های عملیاتی سمت چپ کارت */}
              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handleActionClick(task.id, "pending_approval")}
                  className="rounded-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  تایید
                </button>
                <button
                  type="button"
                  onClick={() => handleActionClick(task.id, "completed")}
                  className="rounded-sm bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition cursor-pointer"
                >
                  تکمیل شد
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-slate-400 text-sm rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#121212]">
            وظیفه‌ای برای نمایش وجود ندارد.
          </div>
        )}
      </div>
    </div>
  );
}
