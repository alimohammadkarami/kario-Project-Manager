import React, { useState, useEffect, useRef } from "react";
import { CreateTask, GetProjectUsers } from "../../services/ProjectService";

export default function CreateTaskModal({
  isOpen,
  onClose,
  projectId, // شناسه پروژه جاری
  onTaskCreated, // تابع برای به‌روزرسانی لیست تسک‌ها پس از ساخت موفق
}) {
  const titleRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  const [users, setUsers] = useState([]); // لیست کاربران پروژه برای منوی کشویی
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // ریست کردن فرم و دریافت کاربران هنگام باز شدن مودال
  useEffect(() => {
    if (!isOpen) return;

    setTitle("");
    setDescription("");
    setDueDate("");
    setAssigneeId("");
    setError("");
    setIsSaving(false);

    // دریافت کاربران پروژه
    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true);

        // --- اتصال واقعی به سرویس GetProjectUsers ---

        const response = await GetProjectUsers(projectId);
        const usersList = response.data?.members || response.members || [];
        setUsers(usersList);

        // دیتای موقت برای تست منوی کشویی
      } catch (err) {
        console.error("خطا در دریافت کاربران پروژه:", err);
        setError("خطا در بارگذاری لیست مسئولان پروژه.");
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [isOpen, projectId]);

  // فوکوس روی فیلد عنوان هنگام باز شدن
  useEffect(() => {
    if (!isOpen) return;
    const timeout = setTimeout(() => {
      titleRef.current?.focus();
    }, 120);
    return () => clearTimeout(timeout);
  }, [isOpen]);

  // بستن مودال با کلید Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSaving) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isSaving]);

  if (!isOpen) return null;

  // تابع سابمیت فرم
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    const trimmedTitle = title.trim();

    // اعتبارسنجی فیلدهای اجباری
    if (!trimmedTitle) {
      setError("لطفاً عنوان تسک را وارد کنید.");
      titleRef.current?.focus();
      return;
    }
    console.log(assigneeId);
    if (!assigneeId) {
      setError("لطفاً مسئول انجام تسک را انتخاب کنید.");
      return;
    }

    try {
      setError("");
      setIsSaving(true);

      const taskData = {
        title: trimmedTitle,
        description: description.trim(),
        dueDate: dueDate.trim(),
        assigneeId: assigneeId,
      };

      // --- اتصال به سرویس CreateTask ---

      await CreateTask(projectId, taskData);

      // شبیه‌سازی درخواست سرور

      // اطلاع‌رسانی به کامپوننت والد و بستن مودال
      if (typeof onTaskCreated === "function") {
        onTaskCreated();
      }
      onClose();
    } catch (err) {
      console.error("خطا در ایجاد تسک:", err);
      setError(err?.message || "خطایی در ثبت تسک رخ داد.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 sm:p-6 backdrop-blur-md bg-black/50 dark:bg-black/80 transition-all duration-300"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 cursor-default"
        onClick={() => !isSaving && onClose()}
      />

      {/* Modal Box */}
      <div className="relative z-10 flex w-full max-w-md flex-col overflow-y-auto rounded-3xl border border-slate-200/80 bg-white/90 dark:border-white/10 dark:bg-[#121212]/95 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* هدر مودال */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-wide">
              تعریف تسک جدید
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              جزئیات و مسئول انجام کار را مشخص کنید.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-white transition cursor-pointer disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* فرم */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* نمایش خطا */}
          {error && (
            <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/60 p-3.5 text-xs text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              {error}
            </div>
          )}

          {/* عنوان تسک (اجباری) */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
              عنوان تسک <span className="text-rose-500">*</span>
            </label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              placeholder="مثلا: طراحی فریم‌ورک کامپوننت‌ها"
              disabled={isSaving}
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 px-4 py-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition shadow-inner"
            />
          </div>

          {/* مسئول تسک (انتخاب از منوی کشویی - اجباری) */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
              مسئول انجام <span className="text-rose-500">*</span>
            </label>
            <select
              value={assigneeId}
              onChange={(e) => {
                setAssigneeId(e.target.value);
                if (error) setError("");
              }}
              disabled={isSaving || isLoadingUsers}
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#18181b] px-4 py-3.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition shadow-inner cursor-pointer"
            >
              <option value="" disabled>
                {isLoadingUsers
                  ? "در حال بارگذاری کاربران..."
                  : "انتخاب مسئول پروژه..."}
              </option>
              {users.map((member) => (
                <option
                  key={member.userId || member.id}
                  value={member.userId || member.id} // اینجا حتماً باید id یا userId قرار بگیره
                  className="bg-white dark:bg-[#18181b] text-slate-900 dark:text-white"
                >
                  {member.fullName}{" "}
                  {/* اینجا نام کاربر برای نمایش به کاربر قرار می‌گیره */}
                </option>
              ))}
            </select>
          </div>

          {/* تاریخ سررسید (اختیاری) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                تاریخ سررسید
              </label>
              <span className="text-[10px] text-slate-400">اختیاری</span>
            </div>
            <input
              type="text"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="1405-04-14"
              disabled={isSaving}
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 px-4 py-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition shadow-inner"
            />
          </div>

          {/* توضیحات (اختیاری) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                توضیحات
              </label>
              <span className="text-[10px] text-slate-400">اختیاری</span>
            </div>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="جزئیات و نکات تکمیلی تسک..."
              disabled={isSaving}
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 p-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition resize-none shadow-inner"
            />
          </div>

          {/* دکمه‌های عملیاتی */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 dark:border-white/10 bg-transparent py-3.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer disabled:opacity-50"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 inline-flex items-center justify-center rounded-lg bg-blue-600 py-3.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition cursor-pointer disabled:opacity-50"
            >
              {isSaving ? "در حال ثبت..." : "ایجاد تسک"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
