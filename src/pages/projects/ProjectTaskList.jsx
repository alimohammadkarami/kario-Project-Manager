import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { DeleteTask, GetProjectTasks } from "../../services/ProjectService";
import EditTaskModal from "../../components/projects/EditTaskModal";

export default function ProjectTasksPage() {
  const { projectId } = useParams();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const menuRef = useRef(null);

  // بستن منوی سه‌نقطه با کلیک خارج از آن
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // دریافت تسک‌ها از API
  const fetchProjectTasks = async () => {
    try {
      setLoading(true);
      const response = await GetProjectTasks(projectId);
      const tasksArray = response.data?.tasks || response.tasks || [];
      setTasks(tasksArray);
    } catch (err) {
      console.error("خطا در دریافت تسک‌ها:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectTasks();
    }
  }, [projectId]);

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("آیا از حذف این تسک اطمینان دارید؟")) return;
    try {
      await DeleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("خطا در حذف تسک:", err);
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  // فیلتر کردن تسک‌ها (اصلاح تطابق تب done با statusهای مختلف تکمیل شده)
  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true;
    if (
      activeTab === "in-progress" &&
      (task.status === "in-progress" || task.status === "todo" || task.status === "doing")
    )
      return true;
    if (
      activeTab === "done" &&
      (task.status === "completed" || task.status === "done")
    )
      return true;
    if (activeTab === "overdue" && task.status === "overdue") return true;
    return false;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "in-progress":
      case "doing":
      case "todo":
        return (
          <span className="rounded-full bg-blue-100 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            در جریان
          </span>
        );
      case "pending":
      case "pending_approval":
      case "waiting":
        return (
          <span className="rounded-full bg-amber-100 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
            در انتظار
          </span>
        );
      case "completed":
      case "done":
        return (
          <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            تکمیل شده
          </span>
        );
      case "overdue":
        return (
          <span className="rounded-full bg-rose-100 px-3.5 py-1 text-xs font-semibold text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            عقب افتاده
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {status || "نامشخص"}
          </span>
        );
    }
  };

  return (
    <div dir="rtl" className="relative min-h-screen w-full p-3 sm:p-6 lg:p-8 font-sans">
      {/* کارت اصلی وظایف پروژه */}
      <div className="w-full rounded-3xl bg-white md:bg-transparent! md:border-none! dark:bg-[#09090b] p-4 sm:p-8 shadow-sm border border-slate-200/60 dark:border-zinc-800 space-y-6">
        
        {/* هدر: عنوان و تب‌ها */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-zinc-100">
            وظایف پروژه
          </h1>

          {/* تب‌ها با قابلیت اسکرول افقی روی موبایل */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: "all", label: "همه" },
              { id: "overdue", label: "عقب‌افتاده" },
              { id: "done", label: "انجام شده" },
              { id: "in-progress", label: "در حال انجام" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* لیست کارت‌های وظایف */}
        <div className="space-y-3">
          {loading ? (
            <div className="p-10 text-center text-xs text-slate-400 dark:text-zinc-500">
              در حال دریافت تسک‌ها...
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400 dark:text-zinc-500">
              هیچ تسکی یافت نشد.
            </div>
          ) : (
            filteredTasks.map((task, index) => (
              <div
                key={task.id}
                dir="ltr"
                style={{ zIndex: filteredTasks.length - index }}
                className="relative flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-slate-200/60 dark:border-zinc-800 bg-white dark:bg-[#000000] px-4 sm:px-5 py-4 transition hover:border-slate-300 dark:hover:border-zinc-700"
              >
                {/* بخش اکشن‌ها و جزئیات */}
                <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-2 sm:gap-4 border-t sm:border-t-0 border-slate-100 dark:border-zinc-900 pt-3 sm:pt-0">
                  
                  {/* منوی سه‌نقطه */}
                  <div className="relative" ref={openMenuId === task.id ? menuRef : null}>
                    <button
                      type="button"
                      onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-zinc-900 transition cursor-pointer"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="5" r="1.5" />
                        <circle cx="12" cy="12" r="1.5" />
                        <circle cx="12" cy="19" r="1.5" />
                      </svg>
                    </button>

                    {/* منوی شناور دارک */}
                    {openMenuId === task.id && (
                      <div className="absolute -right-26 sm:right-auto sm:left-0 top-9 z-50 w-32 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl py-1 space-y-1">
                        <button
                          onClick={() => {
                            setOpenMenuId(null);
                            handleEditTask(task);
                          }}
                          className="w-full px-4 py-2 text-right text-xs text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-900 transition"
                        >
                          ویرایش
                        </button>
                        <button
                          onClick={() => {
                            setOpenMenuId(null);
                            handleDeleteTask(task.id);
                          }}
                          className="w-full px-4 py-2 text-right text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                        >
                          حذف
                        </button>
                      </div>
                    )}
                  </div>

                  {/* سررسید */}
                  <div className="rounded-md bg-slate-100 dark:bg-zinc-900 px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold text-slate-400 dark:text-zinc-400 border border-slate-200/40 dark:border-zinc-800">
                    سررسید: {task.dueDate || "---"}
                  </div>

                  {/* وضعیت (Status Badge) */}
                  {getStatusBadge(task.status)}
                </div>

                {/* سمت راست: عنوان و اسم مسئول */}
                <div className="text-right w-full sm:w-auto">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
                    {task.assigneeName || "مسئول تعیین نشده"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        taskToEdit={selectedTask}
        onTaskUpdated={() => {
          fetchProjectTasks();
        }}
      />
    </div>
  );
}