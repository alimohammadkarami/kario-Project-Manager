import { NAV_ITEMS } from '../../nav-items'
import { GridIcon } from './icons'

export default function BottomNav({ activeNav, onNavigate, onOpenDrawer, drawerOpen }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
      aria-label="ناوبری اصلی"
    >
      <div className="mx-auto flex max-w-md items-center gap-0.5 rounded-[1.75rem] border border-white/70 bg-white/75 p-1.5 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/5 backdrop-blur-2xl dark:border-white/10 dark:bg-surface-dark/80 dark:shadow-black/50 dark:ring-white/10">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = id === activeNav
          return (
            <button
              key={id}
              type="button"
              onClick={() => location.href = `/${id}`}
              aria-current={active ? 'page' : undefined}
              className={`relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl px-1 py-2 text-[10px] leading-none transition-all duration-300 ease-out active:scale-95 ${
                active
                  ? 'bg-brand-600 font-semibold text-white shadow-lg shadow-brand-600/35'
                  : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-transform duration-300 ${active ? 'scale-110' : ''}`}
              />
              <span className="truncate">{label}</span>
            </button>
          )
        })}

        <button
          type="button"
          onClick={onOpenDrawer}
          aria-expanded={drawerOpen}
          aria-controls="mobile-sheet"
          className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl px-1 py-2 text-[10px] leading-none transition-all duration-300 ease-out active:scale-95 ${
            drawerOpen
              ? 'bg-slate-900 font-semibold text-white dark:bg-white dark:text-slate-900'
              : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
          }`}
        >
          <GridIcon className="h-5 w-5" />
          <span>بیشتر</span>
        </button>
      </div>
    </nav>
  )
}
