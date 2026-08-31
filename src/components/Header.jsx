import { AvatarGlyph, ChevronDownIcon, FolderIcon, MenuIcon } from './icons'
import { NAV_ITEMS } from '../nav-items'

export default function Header({ activeNav, onOpenDrawer, user }) {
  const activeItem = NAV_ITEMS.find((item) => item.id === activeNav)

  return (
    <header className="relative">
      <div className="flex items-center justify-between rounded-3xl bg-white px-4 py-3 shadow-sm shadow-slate-200/60 dark:bg-surface-dark dark:shadow-none sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenDrawer}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-white/8 dark:text-slate-200 dark:hover:bg-white/12 lg:hidden"
            aria-label="باز کردن منو"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="hidden items-center gap-2.5 rounded-xl px-1.5 py-1 transition-colors hover:bg-slate-50 dark:hover:bg-white/5 sm:flex"
          >
            <AvatarGlyph className="h-9 w-9" />
            <span className="text-right leading-tight">
              <span className="block text-sm font-semibold text-slate-700 dark:text-slate-100">
                {user.name}
              </span>
              <span className="block text-xs text-slate-400 dark:text-slate-500" dir="ltr">
                {user.email}
              </span>
            </span>
            <ChevronDownIcon className="h-4 w-4 text-brand-600" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <FolderIcon className="h-5 w-5 text-brand-600" />
          <span className="font-medium text-slate-700 dark:text-slate-200">میز کار</span>
          {activeNav !== 'dashboard' && (
            <>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span className="text-brand-600">{activeItem?.label}</span>
            </>
          )}
        </div>
      </div>

      {/* Soft gradient glow along the bottom edge of the header card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 -bottom-2 h-4 rounded-full bg-gradient-to-r from-transparent via-brand-300/70 to-transparent blur-lg dark:via-brand-500/30"
      />
    </header>
  )
}
