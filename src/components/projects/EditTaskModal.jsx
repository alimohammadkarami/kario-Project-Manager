import React, { useState, useEffect } from "react";
import { UpdateTask } from "../../services/ProjectService";

export default function EditTaskModal({
  isOpen,
  onClose,
  taskToEdit, // تسکی که قرار است ویرایش شود (شامل id, title, description, dueDate)
  onTaskUpdated, // فانکشن کال‌بک برای رفرش لیست پس از ویرایش موفق
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  // هر بار که تسک جدیدی برای ویرایش پاس داده می‌شود، فیلدها پر شوند
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setDueDate(taskToEdit.dueDate || "");
    }
  }, [taskToEdit]);

  // بستن مودال با کلید Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // هندل کردن ارسال فرم ویرایش به API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);

      // --- ساختار آماده برای اتصال به API شما ---
      const updatedData = { title, description, dueDate };
      await UpdateTask(taskToEdit.id, updatedData);

      console.log("تسک با موفقیت ویرایش شد:", { id: taskToEdit.id, title, description, dueDate });

      // اطلاع‌رسانی به والد جهت به‌روزرسانی لیست تسک‌ها
      if (onTaskUpdated) {
        onTaskUpdated();
      }

      onClose();
    } catch (err) {
      console.error("خطا در ویرایش تسک:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* اوورلی پس‌زمینه */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* باکس اصلی مودال */}
      <div className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white dark:border-zinc-800 dark:bg-[#09090b] shadow-2xl">
        
        {/* هدر مودال */}
        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-zinc-800 px-6 py-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">ویرایش وظیفه</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* فرم ویرایش */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* فیلد عنوان */}
          <div className="space-y-2 text-right">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">عنوان وظیفه</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان تسک را وارد کنید..."
              required
              className="w-full rounded-md mt-2 border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 px-4 py-2.5 text-xs text-slate-800 dark:text-zinc-100 focus:border-blue-600 focus:outline-none transition"
            />
          </div>

          {/* فیلد توضیحات */}
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">توضیحات</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات تکمیلی تسک..."
              rows={3}
              className="w-full rounded-md mt-2 border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 px-4 py-2.5 text-xs text-slate-800 dark:text-zinc-100 focus:border-blue-600 focus:outline-none transition resize-none"
            />
          </div>

          {/* فیلد تاریخ سررسید */}
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">تاریخ سررسید</label>
            <input
              type="text"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="مثال: ۱۴۰۵/۰۵/۳۰"
              className="w-full rounded-md mt-2 border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 px-4 py-2.5 text-xs text-slate-800 dark:text-zinc-100 focus:border-blue-600 focus:outline-none transition"
            />
          </div>

          {/* دکمه‌های عملیاتی */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-900">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md  px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 transition cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}