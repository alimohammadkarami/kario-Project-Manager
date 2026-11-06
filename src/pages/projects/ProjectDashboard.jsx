import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  DeleteProject,
  GetProjectDetailsById,
  GetProjectTasks,
  UpdateProject,
} from "../../services/ProjectService";
import CreateTaskModal from "../../components/CreateTaskModal";
import ProjectHeader from "../../components/projects/ProjectHeader";

export default function ProjectDashboardPage() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks , setTasks] = useState(false);
  const [IsTaskListOpen, setIsTaskListOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  // استیت‌های مودال ویرایش
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [editError, setEditError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const isFetchingRef = useRef(false);
  // باز کردن مودال ویرایش و پر کردن فیلدها با اطلاعات فعلی پروژه
  const handleOpenEditModal = () => {
    setIsMenuOpen(false);
    setEditForm({
      title: project.title || "",
      description: project.description || "",
      dueDate: project.dueDate || "",
    });
    setEditError("");
    setIsEditModalOpen(true);
  };
  const handleOpenMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  // تابع ارسال فرم ویرایش (حداقل یک فیلد الزامی)
  const handleUpdateProject = async (e) => {
    e.preventDefault();

    // بررسی اینکه حداقل یک فیلد پر شده باشد
    if (
      !editForm.title.trim() &&
      !editForm.description.trim() &&
      !editForm.dueDate.trim()
    ) {
      setEditError("حداقل پر کردن یکی از فیلدها الزامی است.");
      return;
    }

    setEditError("");

    try {
      setIsUpdating(true);

      // --- اینجا فانکشن سابمیت و درخواست API خود را قرار دهید ---
      await UpdateProject(id, editForm);

      setProject((prevProject) => ({
        ...prevProject,
        title: editForm.title.trim() ? editForm.title : prevProject.title,
        description: editForm.description.trim()
          ? editForm.description
          : prevProject.description,
        dueDate: editForm.dueDate.trim()
          ? editForm.dueDate
          : prevProject.dueDate,
      }));

      setIsEditModalOpen(false);
    } catch (err) {
      console.error("خطا در ویرایش پروژه:", err);
      setEditError("خطایی در بروزرسانی پروژه رخ داد.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmModal = () => {
    setIsMenuOpen(false);
    setIsDeleteModalOpen(true);
  };
  // تابع اجرای عملیات حذف پس از تایید کاربر
  const handleDeleteProject = async () => {
    try {
      setIsDeleting(true);

      await DeleteProject(id);

      window.location.href = "/projects";
    } catch (err) {
      console.error("خطا در حذف پروژه:", err);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };
  // دریافت اطلاعات از API
  // تعریف تابع دریافت اطلاعات به صورت مستقل
  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const response = await GetProjectDetailsById(id);
      const projectData = response.data?.project || response.project;
      setProject(projectData);
    } catch (err) {
      console.error("خطا در دریافت اطلاعات پروژه:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTasks = async()=>{
    window.location.href=`/${id}/tasks`
  }
  // فراخوانی اولیه هنگام لود صفحه
  useEffect(() => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (id) {
      fetchProjectData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          در حال بارگذاری اطلاعات پروژه...
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-3 sm:p-6" dir="rtl">
        <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 p-4 text-sm text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
          {error || "اطلاعات پروژه یافت نشد."}
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full space-y-4 p-3 sm:p-6 max-w-full overflow-x-hidden"
      dir="rtl"
    >
      {/* ۱. هدر بالای صفحه (تنظیم شده به صورت افقی و یک‌دست در دسکتاپ مطابق تصویر) */}
      <ProjectHeader
        project={project}
        handleOpenEditModal={handleOpenEditModal}
        handleOpenMenu={handleOpenMenu}
        handleConfirmModal={handleConfirmModal}
        isMenuOpen={isMenuOpen}
      />

      {/* ۲. بخش‌های میانی */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ستون چپ */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#121212] p-4 sm:p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
            <h2 className="w-full text-right text-sm font-bold text-slate-800 dark:text-slate-100">
              پیشرفت پروژه
            </h2>

            <div className="relative flex items-center justify-center my-2">
              <div className="flex h-32 w-32 sm:h-36 sm:w-36 items-center justify-center rounded-full border-8 border-blue-50 dark:border-blue-950/50 relative">
                <svg
                  className="absolute inset-0 h-full w-full -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    className="text-blue-600"
                    strokeDasharray={`${project.progress}, 100`}
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="space-y-0.5">
                  <span className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
                    {project.progress}%
                  </span>
                  <p className="text-[10px] text-slate-400">تکمیل شده</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 w-full pt-2">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-3 text-center border border-slate-100 dark:border-slate-800/60">
                <span className="text-[10px] text-slate-400 block mb-1">
                  انجام شده
                </span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {project.tasks?.done || 0} وظیفه
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-3 text-center border border-slate-100 dark:border-slate-800/60">
                <span className="text-[10px] text-slate-400 block mb-1">
                  کل وظایف
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {project.tasks?.total || 0} وظیفه
                </span>
              </div>
            </div>
          </div>

          {/* وظایف عقب‌افتاده */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#121212] p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                وظایف عقب افتاده
              </h2>
              <span className="rounded-full bg-rose-100 dark:bg-rose-950/60 px-2.5 py-0.5 text-[11px] font-light text-rose-700 dark:text-rose-400">
                {project.overdueTasks?.length || 0} مورد
              </span>
            </div>

            <div className="space-y-2">
              {project.overdueTasks && project.overdueTasks.length > 0 ? (
                project.overdueTasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                        {task.title}
                      </span>
                    </div>
                    <span className="text-slate-400 text-[11px] pr-3.5 sm:pr-0">
                      سررسید : {task.dueDate}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-xs text-slate-400 py-3">
                  وظیفه عقب‌افتاده‌ای وجود ندارد.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ستون راست */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#121212] p-4 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  وضعیت وظایف پروژه
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  وظایف به تفکیک وضعیت
                </p>
              </div>
              <span className="text-xs text-slate-500">
                کل : {project.tasks?.total || 0}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="flex items-center justify-between sm:justify-start gap-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shrink-0" />
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    درانتظار
                  </span>
                </div>
                <span className="font-bold text-xs bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-lg">
                  {project.tasks?.todo || 0}
                </span>
              </div>

              <div className="flex items-center justify-between sm:justify-start gap-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    در حال انجام
                  </span>
                </div>
                <span className="font-bold text-xs bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-lg">
                  {project.tasks?.inProgress || 0}
                </span>
              </div>

              <div className="flex items-center justify-between sm:justify-start gap-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    انجام شده
                  </span>
                </div>
                <span className="font-bold text-xs bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-lg">
                  {project.tasks?.done || 0}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsTaskModalOpen(true)}
                className="w-full sm:flex-1 rounded-sm bg-blue-600 py-2.5 text-center text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition cursor-pointer"
              >
                + ایجاد وظیفه جدید
              </button>
              <button
                type="button"
                onClick={handleOpenTasks}
                className="w-full sm:w-auto rounded-sm border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-center text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                مشاهده
              </button>
            </div>
          </div>

          {/* اعضای پروژه */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#121212] p-4 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  اعضای پروژه
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  افرادی که در این پروژه عضو هستند
                </p>
              </div>
              <button
                type="button"
                onClick={() => console.log("مدیریت اعضا")}
                className="inline-flex items-center justify-center gap-1.5 rounded-sm bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition cursor-pointer"
              >
                مدیریت اعضا
              </button>
            </div>

            <div className="w-full overflow-x-auto pt-2">
              <table className="w-full text-right text-xs min-w-[260px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-medium">
                    <th className="pb-3 font-normal">عضو</th>
                    <th className="pb-3 font-normal">نقش</th>
                    <th className="pb-3 font-normal text-left">تاریخ پیوستن</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {project.members &&
                    project.members.map((member, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
                      >
                        <td className="py-3 font-medium text-slate-800 dark:text-slate-200">
                          {member.fullName}
                        </td>
                        <td className="py-3 text-slate-500">
                          {member.roleLabel}
                        </td>
                        <td className="py-3 text-left text-slate-400">
                          {member.joinedDate}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* مودال تأیید حذف (Confirm Modal) */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          dir="rtl"
        >
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1a1a1a] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  حذف پروژه
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  آیا از حذف پروژه «{project.title}» اطمینان دارید؟ این عمل قابل
                  بازگشت نیست.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteProject}
                className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "در حال حذف..." : "تایید و حذف"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* مودال تأیید حذف (Confirm Modal) */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
          dir="rtl"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#18181b] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            {/* آیکون هشدار و متن‌ها */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  حذف پروژه
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  آیا از حذف پروژه{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    «{project.title}»
                  </span>{" "}
                  اطمینان دارید؟ این عمل قابل بازگشت نیست.
                </p>
              </div>
            </div>

            {/* دکمه‌های اکشن */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteProject}
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-rose-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "در حال حذف..." : "تایید و حذف"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* مودال ویرایش پروژه - طراحی مینیمال، شیشه‌ای کدر و سازگار با لایت و دارک مود */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-md p-4 transition-all duration-300"
          dir="rtl"
        >
          <div className="w-full max-w-md rounded-3xl bg-white/90 dark:bg-[#121212]/95 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-white/10 space-y-6">
            {/* هدر مینیمال مودال */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-wide">
                  ویرایش پروژه
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  اطلاعات جدید پروژه را وارد کنید.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* فرم ویرایش */}
            <form onSubmit={handleUpdateProject} className="space-y-4">
              {editError && (
                <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/60 p-3.5 text-xs text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                  {editError}
                </div>
              )}

              {/* فیلد عنوان */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                  عنوان پروژه
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  placeholder="مثلا: کمپین فروش کاریو"
                  className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 px-4 py-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition shadow-inner"
                />
              </div>

              {/* فیلد توضیحات */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                  توضیحات
                </label>
                <textarea
                  rows="3"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  placeholder="توضیحات مختصر درباره پروژه..."
                  className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 p-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition resize-none shadow-inner"
                />
              </div>

              {/* فیلد تاریخ سررسید */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                  تاریخ سررسید
                </label>
                <input
                  type="text"
                  value={editForm.dueDate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, dueDate: e.target.value })
                  }
                  placeholder="1405-04-14"
                  className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 px-4 py-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition shadow-inner"
                />
              </div>

              {/* دکمه‌های اکشن */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 rounded-lg border border-slate-200 dark:border-white/10 bg-transparent py-3.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 inline-flex items-center justify-center rounded-lg bg-blue-600 py-3.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projectId={id} // ارسال آیدی پروژه برای دریافت کاربران
        onTaskCreated={() => {
          fetchProjectData();
        }}
      />
    </div>
  );
}
