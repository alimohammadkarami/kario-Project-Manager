// Centralized icon set for the app shell.
// All icons share a 24x24 viewBox, 1.7 stroke width and round joins/caps
// so they read consistently at the sizes used across the sidebar/header.

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function DashboardIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.6 19.4 9.7v7.8a2.5 2.5 0 0 1-2.5 2.5H7.1a2.5 2.5 0 0 1-2.5-2.5V9.7z" />
      <path d="M12 15.2v3" />
    </svg>
  )
}

export function FolderIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5.2 8.4a2 2 0 0 1 2-2h2.6v-1a1.3 1.3 0 0 1 1.3-1.3h2.9a1.3 1.3 0 0 1 1.3 1.3v1" />
      <rect x="5.2" y="6.4" width="13.6" height="12" rx="2" />
    </svg>
  )
}

export function ChecklistIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m4.3 6.6 1.1 1.1 2-2.1" />
      <path d="M10.3 6.5h9.4" />
      <path d="m4.3 12.6 1.1 1.1 2-2.1" />
      <path d="M10.3 12.5h9.4" />
      <path d="m4.3 18.6 1.1 1.1 2-2.1" />
      <path d="M10.3 18.5h9.4" />
    </svg>
  )
}

export function UserIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8.2" r="3.2" />
      <path d="M5.3 20a6.7 6.7 0 0 1 13.4 0" />
    </svg>
  )
}

export function HeadsetIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 14V12a7.5 7.5 0 0 1 15 0v2" />
      <rect x="3.2" y="13" width="3.4" height="6" rx="1.5" />
      <rect x="17.4" y="13" width="3.4" height="6" rx="1.5" />
      <path d="M17.4 19v.6a2.4 2.4 0 0 1-2.4 2.4h-2" />
    </svg>
  )
}

export function ChevronDownIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function MoonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.6 14.7A8.3 8.3 0 0 1 9.3 3.4a.8.8 0 0 0-1-1A10 10 0 1 0 21.6 15.7a.8.8 0 0 0-1-1z" />
    </svg>
  )
}

export function SunIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.8v2M12 19.2v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.8 12h2M19.2 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

export function PlusIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function MenuIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export function GridIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.6" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" />
    </svg>
  )
}

export function CloseIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

// Small filled "person" glyph used for the header avatar — a light head
// circle over a solid shoulders ellipse, matching the reference mark.
export function AvatarGlyph({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill="var(--color-brand-300)" />
      <ellipse cx="12" cy="18.5" rx="7" ry="4.2" fill="var(--color-brand-600)" />
    </svg>
  )
}
