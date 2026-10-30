
import { useEffect, useState } from 'react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import {
  ChevronDownIcon,
  HeadsetIcon,
  PlusIcon,
} from './icons'
import { NAV_ITEMS } from '../nav-items'
import usePersianClock from '../hooks/usePersianClock'

const SECONDARY_ITEMS = [
  { id: 'support', label: 'پشتیبانی', icon: HeadsetIcon },
]

export default function Sidebar({
  activeNav,
  onNavigate,
  isDark,
  onToggleTheme,
  onCreateProject,
  onOpenSupport,
}) {
  const { date, time } = usePersianClock()
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(isCollapsed));
  }, [isCollapsed]);

  return (
    <aside
      className={`sticky top-3 hidden h-[calc(100vh-1.5rem)] shrink-0 flex-col rounded-3xl bg-white shadow-sm shadow-slate-200/60 transition-[width] duration-300 ease-in-out lg:flex dark:bg-surface-dark dark:shadow-none ${
        isCollapsed ? 'w-[80px]' : 'w-[280px]'
      }`}
    >
      {/* Header */}
      
{/* Header */}
<div
  className={`relative flex items-center border-b border-slate-100 py-6 dark:border-white/5 ${
    isCollapsed ? 'justify-center px-2' : 'justify-center px-6'
  }`}
>
  <button
    type="button"
    onClick={() => setIsCollapsed((prev) => !prev)}
    aria-label={isCollapsed ? 'باز کردن سایدبار' : 'جمع کردن سایدبار'}
    title={isCollapsed ? 'باز کردن سایدبار' : 'جمع کردن سایدبار'}
    className={`group relative flex items-center justify-center ${
      isCollapsed ? 'h-10 w-10' : ''
    }`}
  >
    <span
      className={`transition-opacity duration-200 ${
        isCollapsed ? 'group-hover:opacity-20' : ''
      }`}
    >
      <Logo />
    </span>

    {isCollapsed && (
      <span className="absolute inset-0 flex items-center justify-center rounded-lg text-slate-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-slate-400">
        <ChevronDownIcon className="h-4 w-4 rotate-90" />
      </span>
    )}
  </button>

  {!isCollapsed && (
    <button
      type="button"
      onClick={() => setIsCollapsed(true)}
      aria-label="جمع کردن سایدبار"
      title="جمع کردن سایدبار"
      className="absolute left-3 flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-600 dark:text-slate-400 dark:hover:bg-white/10"
    >
      <ChevronDownIcon className="h-4 w-4 -rotate-90" />
    </button>
  )}
</div>


      {/* Clock */}
      {!isCollapsed && (
        <div className="px-4 pt-4">
          <div className="flex items-center justify-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-xs text-slate-500 dark:border-white/5 dark:bg-white/5 dark:text-slate-400">
            <span>{date}</span>
            <span className="h-3.5 w-[2px] bg-brand-600" />
            <span dir="ltr" className="tabular-nums">
              {time}
            </span>
          </div>
        </div>
      )}

      {/* Create Project */}
      <div className={`pt-4 ${isCollapsed ? 'px-3' : 'px-4'}`}>
        <button
          type="button"
          onClick={onCreateProject}
          title={isCollapsed ? 'ایجاد پروژه جدید' : undefined}
          aria-label="ایجاد پروژه جدید"
          className={`flex w-full items-center justify-center rounded-xl bg-brand-600 text-sm font-medium text-white shadow-sm shadow-brand-600/30 transition-colors hover:bg-brand-700 active:bg-brand-800 ${
            isCollapsed ? 'h-12' : 'gap-2 py-3'
          }`}
        >
          {!isCollapsed && 'ایجاد پروژه جدید'}
          <PlusIcon className="h-4 w-4 shrink-0" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav
        className={`flex flex-col gap-1 pt-6 ${
          isCollapsed ? 'px-3' : 'px-4'
        }`}
      >
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = id === activeNav

          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                location.href = `/${id}`
              }}
              aria-current={active ? 'page' : undefined}
              aria-label={label}
              title={isCollapsed ? label : undefined}
              className={`flex w-full items-center rounded-xl py-3 text-sm transition-colors ${
                isCollapsed
                  ? 'justify-center px-0'
                  : 'gap-2.5 px-4'
              } ${
                active
                  ? 'bg-brand-100 font-medium text-brand-600 dark:bg-brand-600/20 dark:text-brand-300'
                  : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{label}</span>}
            </button>
          )
        })}
      </nav>

      <div className="flex-1" />

      {/* Secondary Navigation */}
      <div
        className={`flex flex-col gap-1 border-t border-slate-100 py-3 dark:border-white/5 ${
          isCollapsed ? 'px-3' : 'px-4'
        }`}
      >
        {SECONDARY_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={id === 'support' ? onOpenSupport : undefined}
            title={isCollapsed ? label : undefined}
            aria-label={label}
            className={`flex w-full items-center rounded-xl py-2.5 text-sm text-slate-500 transition-colors hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5 ${
              isCollapsed
                ? 'justify-center px-0'
                : 'justify-between px-4'
            }`}
          >
            <span className={`flex items-center ${isCollapsed ? '' : 'gap-2.5'}`}>
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{label}</span>}
            </span>

            {!isCollapsed && (
              <ChevronDownIcon className="h-3.5 w-3.5 rotate-90 text-slate-300 dark:text-slate-600" />
            )}
          </button>
        ))}

        <ThemeToggle
          isDark={isDark}
          onToggle={onToggleTheme}
          className="mt-1"
          isCollapsed={isCollapsed}
        />
      </div>
    </aside>
  )
}
