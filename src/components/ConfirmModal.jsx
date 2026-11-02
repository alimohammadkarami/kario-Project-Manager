export default function ConfirmModal() {
  return (
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
  );
}
