
import { MoonIcon } from "./icons";

export default function ThemeToggle({
  isDark,
  onToggle,
  className = "",
  isCollapsed = false,
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="حالت تاریک"
      title={isCollapsed ? "حالت تاریک" : undefined}
      onClick={onToggle}
      className={`flex w-full items-center rounded-xl py-3 text-sm text-slate-500 transition-colors hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5 ${
        isCollapsed
          ? "justify-center px-0"
          : "justify-between px-4"
      } ${className}`}
    >
      <span
        className={`flex items-center ${
          isCollapsed ? "" : "gap-2"
        }`}
      >
        <MoonIcon className="h-4 w-4 shrink-0" />
        {!isCollapsed && <span>حالت تاریک</span>}
      </span>

      {!isCollapsed && (
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
      )}
    </button>
  );
}
