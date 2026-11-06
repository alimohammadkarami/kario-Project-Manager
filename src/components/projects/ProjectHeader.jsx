export default function ProjectHeader({project , handleOpenMenu , handleOpenEditModal , handleConfirmModal , isMenuOpen}) {
  return (
    <div className="relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#121212] p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* سمت راست هدر: آیکون، عنوان و توضیحات */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <svg
              width="30"
              height="30"
              viewBox="0 0 35 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.4"
                d="M31.4544 15.3405L30.0313 21.4825C28.8114 26.787 26.4008 28.9323 21.8699 28.4915C21.1439 28.4327 20.3597 28.3005 19.5174 28.0947L17.0777 27.507C11.0221 26.0523 9.14874 23.0254 10.5719 16.8833L11.995 10.7266C12.2855 9.4776 12.634 8.39025 13.0697 7.49393C14.7687 3.93801 17.6586 2.98291 22.5089 4.14372L24.9341 4.71678C31.0188 6.15678 32.8776 9.19842 31.4544 15.3405Z"
                fill="#1B51E5"
              />
              <path
                d="M21.87 28.4914C20.9697 29.1086 19.837 29.6229 18.4574 30.0784L16.1629 30.8425C10.3977 32.7233 7.36262 31.151 5.48929 25.3176L3.63048 19.5135C1.77167 13.68 3.311 10.5943 9.0762 8.71349L11.3707 7.94941C11.9661 7.75839 12.5324 7.59675 13.0697 7.4939C12.6341 8.39022 12.2856 9.47757 11.9951 10.7265L10.572 16.8833C9.14881 23.0253 11.0221 26.0523 17.0778 27.507L19.5175 28.0947C20.3597 28.3004 21.1439 28.4327 21.87 28.4914Z"
                fill="#1B51E5"
              />
              <path
                d="M25.3989 15.4433C25.3117 15.4433 25.2246 15.4286 25.1229 15.4139L18.0798 13.6065C17.4989 13.4596 17.1504 12.8572 17.2956 12.2694C17.4408 11.6816 18.0362 11.329 18.6171 11.4759L25.6602 13.2833C26.2411 13.4302 26.5896 14.0327 26.4444 14.6204C26.3283 15.1053 25.8781 15.4433 25.3989 15.4433Z"
                fill="#1B51E5"
              />
              <path
                d="M21.1439 20.4098C21.0567 20.4098 20.9696 20.3951 20.8679 20.3804L16.6421 19.2931C16.0612 19.1461 15.7126 18.5437 15.8579 17.9559C16.0031 17.3682 16.5985 17.0155 17.1794 17.1625L21.4052 18.2498C21.9861 18.3967 22.3347 18.9992 22.1894 19.5869C22.0733 20.0865 21.6376 20.4098 21.1439 20.4098Z"
                fill="#1B51E5"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 truncate">
              {project.title}
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
              {project.description}
            </p>
          </div>
        </div>

        {/* سمت چپ هدر: تاریخ‌ها و منوی سه‌نقطه در یک ردیف */}
        <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div>
              <span className="text-slate-400 ml-1">شروع:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {project.createdDate}
              </span>
            </div>
            <div>
              <span className="text-slate-400 ml-1">مهلت:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {project.dueDate}
              </span>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={handleOpenMenu}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition cursor-pointer shrink-0"
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
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
            </button>

            {isMenuOpen && (
              <div className="absolute left-0 mt-2 w-36 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-1.5 shadow-lg z-20 space-y-1">
                <button
                  onClick={handleOpenEditModal}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  ویرایش
                </button>
                <button
                  onClick={handleConfirmModal}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                >
                  حذف پروژه
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
