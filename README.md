# کاریو — Project Manager App Shell

A responsive, RTL-first page template (sidebar + header + content) built for
a Persian project-management web app, using **React 19**, **Vite** and
**Tailwind CSS v4** (installed as a dev dependency).

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build      # production build -> dist/
npm run preview    # preview the production build
```

## What's included

- **Header** - user menu (avatar, name, email, dropdown chevron), a
  breadcrumb with the active section, and a soft gradient glow along the
  bottom edge of the card, matching the reference design.
- **Sidebar** (desktop, `lg:` and up) - wordmark logo, a live Persian
  (Jalali) date & clock that updates every second, a "create project"
  button, the primary nav (میز کار / پروژه‌ها / وظایف من), and a footer
  with profile/support links plus a dark-mode switch.
- **Bottom navigation** (below `lg:`) - the sidebar is replaced by a
  floating, rounded navigation bar pinned to the bottom of the screen with
  the three primary sections plus a "بیشتر" (more) button.
- **Mobile drawer** - opened from the header's menu button or the bottom
  nav's "بیشتر" button, it surfaces the same content as the desktop
  sidebar (logo, clock, create button, full nav, profile/support, theme
  toggle) so no functionality is lost on small screens.
- **Dark mode** - a class-based (`dark:`) theme toggle, persisted to
  `localStorage` and applied before first paint (see the inline script in
  `index.html`) to avoid a light/dark flash on reload.
- **Content area** - intentionally left empty; this is a layout template
  meant to be filled in with actual pages/routes.

## Project structure

```
src/
  components/
    icons.jsx         # shared SVG icon set (house, folder, checklist, etc.)
    Logo.jsx           # "کاریو" wordmark
    ThemeToggle.jsx     # dark-mode switch control
    Sidebar.jsx          # desktop sidebar
    Header.jsx            # top header bar
    BottomNav.jsx          # mobile floating bottom navigation
    MobileDrawer.jsx        # mobile slide-over (sidebar content)
    AppShell.jsx              # composes everything + responsive behaviour
  hooks/
    usePersianClock.js   # live Jalali date/time
    useTheme.js            # dark/light theme state + persistence
  nav-items.js              # shared nav configuration
  App.jsx
  main.jsx
  index.css                 # Tailwind v4 import + design tokens (@theme)
```

## Notes

- The typeface is **Vazirmatn**, loaded via CDN link in `index.html`. Swap
  this for a self-hosted copy if you need to work offline.
- Design tokens (brand blue, accent amber, backgrounds, dark surfaces) live
  in the `@theme` block in `src/index.css` - adjust them there to re-theme
  the whole app.
- `activeNav` state and the "create project" handler currently live in
  `AppShell`; wire them up to real routing/state management as needed.
