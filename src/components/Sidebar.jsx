import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import { ChevronDownIcon, HeadsetIcon, PlusIcon, UserIcon } from './icons'
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

  return (
    <aside className="sticky top-3 hidden h-[calc(100vh-1.5rem)] w-[280px] shrink-0 flex-col rounded-3xl bg-white shadow-sm shadow-slate-200/60 lg:flex dark:bg-surface-dark dark:shadow-none">
      <div className="flex items-center justify-center border-b border-slate-100 px-6 py-6 dark:border-white/5">
        <Logo />
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-center justify-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-xs text-slate-500 dark:border-white/5 dark:bg-white/5 dark:text-slate-400">
          <span>{date}</span>
          <span className="h-3.5 w-[2px] bg-brand-600" />
          <span dir="ltr" className="tabular-nums">
            {time}
          </span>
        </div>
      </div>

      <div className="px-4 pt-4">
        <button
          type="button"
          onClick={onCreateProject}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-medium text-white shadow-sm shadow-brand-600/30 transition-colors hover:bg-brand-700 active:bg-brand-800"
        >
          ایجاد پروژه جدید

          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex flex-col gap-1 px-4 pt-6">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = id === activeNav
          return (
            <button
              key={id}
              type="button"
              onClick={() => location.href = `/${id}`}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm transition-colors ${
                active
                  ? 'bg-brand-100 font-medium text-brand-600 dark:bg-brand-600/20 dark:text-brand-300'
                  : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5'
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          )
        })}
      </nav>

      <div className="flex-1" />

      <div className="flex flex-col gap-1 border-t border-slate-100 px-4 py-3 dark:border-white/5">
        {SECONDARY_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={id === 'support' ? onOpenSupport : undefined}
            className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm text-slate-500 transition-colors hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5"
          >
            <span className="flex items-center gap-2.5">
              <Icon className="h-5 w-5" />
              {label}
            </span>
            <ChevronDownIcon className="h-3.5 w-3.5 rotate-90 text-slate-300 dark:text-slate-600" />
          </button>
        ))}

        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} className="mt-1" />
      </div>
    </aside>
  )
}
