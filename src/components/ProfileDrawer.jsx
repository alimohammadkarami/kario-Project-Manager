import { useEffect, useRef } from "react";

function ProfileDrawer({
  isOpen,
  onClose,
  user,
  onEditProfile,
  onResetPassword,
  onLogout,
}) {
  const drawerRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    // Delay prevents the UserCard click itself from immediately
    // triggering the outside-click handler.
    const timeout = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={drawerRef}
      dir="rtl"
      className="
        absolute left-0 top-[calc(100%+12px)] z-50
        w-[320px] max-w-[calc(100vw-32px)]
        origin-top-left
        animate-profile-drawer
      "
    >
      <div
        className="
          overflow-hidden
          rounded-t-2xl
          rounded-b-3xl
          border border-slate-100
          bg-white
          shadow-xl shadow-slate-300/25
          dark:border-white/6
          dark:bg-surface-dark
          dark:shadow-black/25
        "
      >
        {/* Profile header */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center gap-3.5">
            {/* Avatar */}
            <div
              className="
                flex h-12 w-12 shrink-0 items-center justify-center
                rounded-2xl
                bg-brand-50
                text-brand-600
                dark:bg-brand-500/10
                dark:text-brand-400
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  d="M20 21a8 8 0 0 0-16 0"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </div>

            {/* User information */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                {user?.name}
              </p>

              <p
                dir="ltr"
                className="
                  mt-0.5 truncate text-right text-xs
                  text-slate-400
                  dark:text-slate-500
                "
              >
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 dark:bg-white/6" />

        {/* Actions */}
        <div className="p-2.5">
          {/* Edit profile */}
          <button
            type="button"
            onClick={onEditProfile}
            className="
              group flex w-full items-center gap-3
              rounded-2xl
              px-3.5 py-3
              text-right
              transition-colors duration-150
              hover:bg-slate-50
              dark:hover:bg-white/5
            "
          >
            <span
              className="
                flex h-9 w-9 shrink-0 items-center justify-center
                rounded-xl
                bg-slate-100
                text-slate-500
                transition-colors
                group-hover:bg-brand-50
                group-hover:text-brand-600
                dark:bg-white/6
                dark:text-slate-400
                dark:group-hover:bg-brand-500/10
                dark:group-hover:text-brand-400
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-[18px] w-[18px]"
                aria-hidden="true"
              >
                <path
                  d="M12 20h9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <span className="flex-1">
              <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                تغییر اطلاعات
              </span>
              <span className="mt-0.5 block text-xs text-slate-400 dark:text-slate-500">
                ویرایش اطلاعات حساب کاربری
              </span>
            </span>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="
                h-4 w-4 shrink-0
                text-slate-300
                transition-transform duration-150
                group-hover:-translate-x-0.5
                group-hover:text-brand-500
                dark:text-slate-600
              "
              aria-hidden="true"
            >
              <path
                d="m15 18-6-6 6-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Reset password */}
          <button
            type="button"
            onClick={onResetPassword}
            className="
              group flex w-full items-center gap-3
              rounded-2xl
              px-3.5 py-3
              text-right
              transition-colors duration-150
              hover:bg-slate-50
              dark:hover:bg-white/5
            "
          >
            <span
              className="
                flex h-9 w-9 shrink-0 items-center justify-center
                rounded-xl
                bg-slate-100
                text-slate-500
                transition-colors
                group-hover:bg-brand-50
                group-hover:text-brand-600
                dark:bg-white/6
                dark:text-slate-400
                dark:group-hover:bg-brand-500/10
                dark:group-hover:text-brand-400
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-[18px] w-[18px]"
                aria-hidden="true"
              >
                <rect
                  x="4"
                  y="10"
                  width="16"
                  height="11"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M8 10V7a4 4 0 0 1 8 0v3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="15.5"
                  r="1"
                  fill="currentColor"
                />
              </svg>
            </span>

            <span className="flex-1">
              <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                تغییر رمز عبور
              </span>
              <span className="mt-0.5 block text-xs text-slate-400 dark:text-slate-500">
                رمز عبور حساب خود را تغییر دهید
              </span>
            </span>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="
                h-4 w-4 shrink-0
                text-slate-300
                transition-transform duration-150
                group-hover:-translate-x-0.5
                group-hover:text-brand-500
                dark:text-slate-600
              "
              aria-hidden="true"
            >
              <path
                d="m15 18-6-6 6-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Logout separator */}
        <div className="mx-3 h-px bg-slate-100 dark:bg-white/6" />

        {/* Logout */}
        <div className="p-2.5">
          <button
            type="button"
            onClick={onLogout}
            className="
              group flex w-full items-center gap-3
              rounded-2xl
              px-3.5 py-3
              text-right
              transition-colors duration-150
              hover:bg-red-50
              dark:hover:bg-red-500/8
            "
          >
            <span
              className="
                flex h-9 w-9 shrink-0 items-center justify-center
                rounded-xl
                bg-red-50
                text-red-500
                transition-colors
                group-hover:bg-red-100
                dark:bg-red-500/10
                dark:text-red-400
                dark:group-hover:bg-red-500/15
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-[18px] w-[18px]"
                aria-hidden="true"
              >
                <path
                  d="M10 17l5-5-5-5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 12H3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <span className="text-sm font-medium text-red-500 dark:text-red-400">
              خروج از حساب
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileDrawer;