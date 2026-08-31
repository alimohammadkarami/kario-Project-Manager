import { useEffect } from 'react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import {
  AvatarGlyph,
  ChevronDownIcon,
  CloseIcon,
  HeadsetIcon,
  PlusIcon,
  UserIcon,
} from './icons'
import { NAV_ITEMS } from '../nav-items'
import usePersianClock from '../hooks/usePersianClock'

const SECONDARY_ITEMS = [
  { id: 'profile', label: 'پروفایل', icon: UserIcon },
  { id: 'support', label: 'پشتیبانی', icon: HeadsetIcon },
]

export default function MobileDrawer({
  open,
  onClose,
  activeNav,
  onNavigate,
  isDark,
  onToggleTheme,
  onCreateProject,
  user,
}) {
  const { date, time } = usePersianClock()

  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div
      className={`fixed inset-0 z-40 lg:hidden ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
      inert={!open || undefined}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-slate-950/50 backdrop-blur-md transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        id="mobile-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="منوی بیشتر"
        className={`mobile-sheet absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col overflow-y-auto rounded-t-[2rem] bg-white pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-20px_60px_-20px_rgba(15,23,42,0.45)] dark:bg-surface-dark ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex flex-col items-center pt-3">
          <span className="h-1.5 w-10 rounded-full bg-slate-200 dark:bg-white/15" aria-hidden="true" />
        </div>

        <div className="flex items-center justify-between px-5 pb-2 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-white/8 dark:text-slate-300 dark:hover:bg-white/12"
            aria-label="بستن منو"
          >
            <CloseIcon className="h-[18px] w-[18px]" />
          </button>
          <Logo className="scale-90" />
          <span className="w-10" />
        </div>

        {user && (
          <div className="px-5 pt-2">
            <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-l from-brand-50 to-slate-50 px-3 py-3 dark:from-brand-600/15 dark:to-white/5">
              <AvatarGlyph className="h-11 w-11 shrink-0" />
              <span className="min-w-0 text-right leading-tight">
                <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {user.name}
                </span>
                <span className="block truncate text-xs text-slate-400 dark:text-slate-500" dir="ltr">
                  {user.email}
                </span>
              </span>
            </div>
          </div>
        )}

        <div className="px-5 pt-3">
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-100/80 bg-slate-50/80 px-3 py-2.5 text-xs text-slate-500 dark:border-white/5 dark:bg-white/5 dark:text-slate-400">
            <span>{date}</span>
            <span className="h-3.5 w-px bg-brand-500/50" />
            <span dir="ltr" className="tabular-nums">
              {time}
            </span>
          </div>
        </div>

        <div className="px-5 pt-3">
          <button
            type="button"
            onClick={() => {
              onCreateProject?.()
              onClose()
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-sm font-medium text-white shadow-lg shadow-brand-600/30 transition-transform active:scale-[0.98]"
          >
            <PlusIcon className="h-4 w-4" />
            ایجاد پروژه جدید
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-5 pt-5">
          <p className="mb-1 px-1 text-[11px] font-medium tracking-wide text-slate-400 dark:text-slate-500">
            صفحات
          </p>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = id === activeNav
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onNavigate(id)
                  onClose()
                }}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm transition-all duration-200 ${
                  active
                    ? 'bg-brand-600 font-medium text-white shadow-md shadow-brand-600/25'
                    : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5'
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    active
                      ? 'bg-white/15'
                      : 'bg-slate-100 text-slate-500 dark:bg-white/8 dark:text-slate-400'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {label}
              </button>
            )
          })}
        </nav>

        <div className="flex flex-col gap-1 px-5 pb-2 pt-4">
          <p className="mb-1 px-1 text-[11px] font-medium tracking-wide text-slate-400 dark:text-slate-500">
            حساب
          </p>
          {SECONDARY_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className="flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm text-slate-500 transition-colors hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/8">
                  <Icon className="h-5 w-5" />
                </span>
                {label}
              </span>
              <ChevronDownIcon className="h-3.5 w-3.5 rotate-90 text-slate-300 dark:text-slate-600" />
            </button>
          ))}

          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} className="mt-1 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
