import { MoonIcon } from "./icons";

/**
 * Switch-style dark mode toggle. Used both in the desktop sidebar footer
 * and the mobile drawer, so it's kept self-contained and prop-driven.
 */
export default function ThemeToggle({ isDark, onToggle, className = "" }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={onToggle}
      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm text-slate-500 transition-colors hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5 ${className}`}
    >
      <span className="flex items-center gap-2">
        <MoonIcon className="h-4 w-4" />
        حالت تاریک
      </span>

      <span
        dir="ltr"
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${
          isDark ? "bg-brand-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`mx-1 h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
            isDark ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}
