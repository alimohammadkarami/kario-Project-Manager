import { useEffect, useState } from 'react'

const STORAGE_KEY = 'kario-theme'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  const prefersDark = window.matchMedia?.(
    '(prefers-color-scheme: dark)'
  ).matches
  return prefersDark ? 'dark' : 'light'
}

/**
 * Manages the app's color theme. Mirrors the theme onto the `dark` class of
 * <html> (used by Tailwind's `dark:` variant) and persists the choice.
 */
export default function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  return { theme, isDark: theme === 'dark', toggleTheme }
}
