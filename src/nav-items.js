import { ChecklistIcon, DashboardIcon, FolderIcon } from './components/icons'

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'میز کار', icon: DashboardIcon },
  { id: 'projects', label: 'پروژه‌ها', icon: FolderIcon },
  { id: 'tasks', label: 'وظایف من', icon: ChecklistIcon },
]

export const DEFAULT_ACTIVE_NAV = 'tasks'
