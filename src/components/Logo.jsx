// Kario ("کاریو") wordmark: bold brand-colored Persian type with a row of
// three accent dots beneath it, plus the "project management" tagline —
// matching the reference sidebar header.
export default function Logo({ className = '' }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* <svg viewBox="0 0 210 70" className="h-11 w-auto" aria-label="کاریو">
        <text
          x="105"
          y="42"
          textAnchor="middle"
          fontFamily="Vazirmatn, sans-serif"
          fontWeight="800"
          fontSize="40"
          fill="var(--color-brand-600)"
        >
          کاریو
        </text>
        <circle cx="78" cy="58" r="5" fill="var(--color-accent-500)" />
        <circle cx="97" cy="58" r="5" fill="var(--color-accent-500)" />
        <circle cx="116" cy="58" r="5" fill="var(--color-accent-500)" />
      </svg>
       */}
      <img src="/src/assets/kario.png" className="w-18 h-10" alt="" />
      <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
        مدیریت پروژه
      </span>
    </div>
  )
}
