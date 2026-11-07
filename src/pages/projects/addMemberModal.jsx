import React, { useState, useEffect } from "react";
import { AddProjectMember } from "../../services/ProjectService";
// فرض: سرویس افزودن عضو به پروژه را از این مسیر ایمپورت می‌کنید
// import { AddProjectMember } from "../../services/ProjectService";

export default function AddMemberModal({
  isOpen,
  onClose,
  projectId,
  onMemberAdded, // کال‌بک برای رفرش کردن لیست اعضا پس از افزودن موفق
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  
  // استیت‌های پیام اختصاصی داخل مودال (type: 'success' | 'error' | null)
  const [message, setMessage] = useState({ type: null, text: "" });

  // پاکسازی فرم و پیام‌ها هنگام باز یا بسته شدن مودال
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setMessage({ type: null, text: "" });
    }
  }, [isOpen]);

  // بستن مودال با کلید Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  // ارسال فرم به بک‌اند
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      setMessage({ type: null, text: "" });

      // --- اتصال به API شما ---
      const response = await AddProjectMember(projectId,  email );
      
      // شبیه‌سازی درخواست (پس از اتصال به بک‌اند این خطوط موقت را حذف کنید)
      console.log("ارسال ایمیل به بک‌اند برای پروژه:", projectId, "ایمیل:", email);
      
      // فرض موفقیت آمیز بودن درخواست
      setMessage({
        type: "success",
        text: "کاربر با موفقیت به پروژه اضافه شد.",
      });

      // رفرش کردن لیست اعضا در صفحه والد
      if (onMemberAdded) {
        onMemberAdded();
      }

      // بستن خودکار مودال پس از ۱.۵ ثانیه
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      console.error("خطا در افزودن عضو:", err);
      // نمایش پیام خطا در مسیج‌باکس اختصاصی مودال
      setMessage({
        type: "error",
        text: err.response?.data?.message || "خطایی رخ داد. کاربری با این ایمیل یافت نشد یا قبلاً اضافه شده است.",
      });
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
      {/* اوورلی تار و تیره پس‌زمینه */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={() => !loading && onClose()} 
      />

      {/* باکس اصلی مودال */}
      <div className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white dark:border-zinc-800 dark:bg-[#09090b] shadow-2xl">
        
        {/* هدر مودال */}
        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-zinc-800 px-6 py-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
            افزودن عضو جدید
          </h3>
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800 transition cursor-pointer disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* فرم */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* مسیج‌باکس اختصاصی داخل خود مودال */}
          {message.type && (
            <div
              className={`rounded-2xl p-3.5 text-xs font-semibold border transition-all ${
                message.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50"
                  : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/50"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* فیلد ورودی ایمیل */}
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
              ایمیل کاربر
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              required
              dir="ltr"
              className="w-full mt-3 rounded-md border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 px-4 py-2.5 text-xs text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:border-blue-600 focus:outline-none transition text-right"
            />
          </div>

          {/* دکمه‌های عملیاتی */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-zinc-900">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="rounded-2xl px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 transition cursor-pointer disabled:opacity-50"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "در حال بررسی و افزودن..." : "افزودن به پروژه"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}