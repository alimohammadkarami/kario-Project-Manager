import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AddMemberModal from "./addMemberModal";
import { DeleteMember, GetProjectMembers } from "../../services/ProjectService";
import { useAuthCheck } from "../../hooks/useAuth";

export default function ProjectMembersPage() {
  const { user, loadings } = useAuthCheck();
  const { projectId } = useParams();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // --- فانکشن دریافت اعضای پروژه از API ---
  const fetchProjectMembers = async () => {
    try {
      setLoading(true);

      // TODO: سرویس بک‌اند خودت را اینجا جایگزین کن
      const response = await GetProjectMembers(projectId);
      setMembers(response.data?.members || response.members || []);
        console.log(response);
        
      // دیتای موقت برای تست ظاهر صفحه (مطابق تصویر)
     
    } catch (err) {
      console.error("خطا در دریافت اعضا:", err);
      setError("خطا در بارگذاری اعضای پروژه");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectMembers();
    }
  }, [projectId]);

  // --- فانکشن حذف عضو از پروژه (اتصال به API) ---
  const handleDeleteMember = async (memberId) => {
    if (!window.confirm("آیا از حذف این عضو از پروژه اطمینان دارید؟")) return;

    try {
      // TODO: سرویس حذف عضو از بک‌اند را اینجا صدا بزن
      console.log(memberId)
      await DeleteMember(projectId, memberId);

      // به‌روزرسانی استیت محلی بدون نیاز به رفرش
      setMembers((prev) => prev.filter((m) => m.userId !== memberId));
    } catch (err) {
      console.error("خطا در حذف عضو:", err);
      alert("خطا در حذف عضو. لطفاً دوباره تلاش کنید.");
    }
  };

  // گرفتن حروف اول نام برای آواتار
  const getInitials = (name) => {
    if (!name) return "ع ک";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]} ${parts[1][0]}`;
    }
    return name[0];
  };

  return (
    <div
      dir="rtl"
      className="relative min-h-screen w-full p-3 sm:p-6 lg:p-8 font-sans"
    >
      {/* کارت اصلی حاوی بخش اعضا */}
      <div className="w-full rounded-3xl bg-white md:bg-transparent! md:border-none! dark:bg-[#09090b] p-4 sm:p-8  border border-slate-200/60 dark:border-zinc-800 space-y-6">
        {/* هدر صفحه: عنوان و دکمه افزودن عضو جدید */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-zinc-100">
            اعضای پروژه
          </h1>

          <button
            onClick={() => {
              // TODO: باز کردن مودال افزودن عضو جدید
              setIsAddModalOpen(true)
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition cursor-pointer"
          >
            <span>افزودن عضو جدید</span>
            <span className="text-sm font-bold">+</span>
          </button>
        </div>

        {/* لیست اعضای پروژه */}
        <div className="space-y-3">
          {loading ? (
            <div className="p-10 text-center text-xs text-slate-400 dark:text-zinc-500">
              در حال دریافت اعضای پروژه...
            </div>
          ) : error ? (
            <div className="p-10 text-center text-xs text-rose-500">
              {error}
            </div>
          ) : members.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400 dark:text-zinc-500">
              هیچ عضوی در این پروژه یافت نشد.
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.userId}
                dir="ltr"
                className="relative flex items-center justify-between rounded-2xl border border-slate-200/60 dark:border-zinc-800 bg-white dark:bg-[#000000] px-4 sm:px-6 py-4 transition hover:border-slate-300 dark:hover:border-zinc-700"
              >
                {/* سمت راست: دکمه حذف (سطل زبا‌له) */}
                <button
                  type="button"
                  onClick={() => handleDeleteMember(member.userId)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                  title="حذف عضو"
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
                      strokeWidth="1.5"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>

                {/* سمت چپ: نام، ایمیل و آواتار کاربر */}
                <div className="flex items-center gap-3 sm:gap-4 text-right">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                      {member.fullName}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
                      {member.email}
                    </p>
                  </div>

                  {/* آواتار دایره‌ای با حروف اول */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ${member.avatarBg || "bg-blue-600"}`}
                  >
                    {getInitials(member.name)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        projectId={projectId}
        onMemberAdded={() => {
          fetchProjectMembers(); // رفرش شدن لیست پس از افزودن موفق کاربر
        }}
      />
    </div>
  );
}
