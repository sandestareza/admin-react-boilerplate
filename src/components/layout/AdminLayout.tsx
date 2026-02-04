import { Outlet, Link, useLocation, useNavigate } from '@tanstack/react-router'
import { 
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Package,
  ShoppingCart
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { ModeToggle } from '@/components/mode-toggle'

type NavigationItem = {
  name: string
  href?: string
  icon: any
  children?: NavigationItem[]
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  {
    name: 'Master Data',
    icon: Package,
    children: [
      { name: 'Products', href: '/admin/products', icon: Package },
      { name: 'Users', href: '/admin/users', icon: Users },
    ]
  },
  { name: 'Transactions', href: '/admin/transactions', icon: ShoppingCart }, // Placeholder
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'Master Data': true // Default open for demo
  })
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  const toggleSubmenu = (name: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  const renderNavItem = (item: NavigationItem, depth = 0) => {
    // If it has children, render as a collapsible group
    if (item.children && item.children.length > 0) {
      const isExpanded = expandedMenus[item.name]
      const isActiveGroup = item.children.some(child =>
        child.href && location.pathname.startsWith(child.href)
      )

      return (
        <div key={item.name} className="space-y-1">
          <button
            onClick={() => toggleSubmenu(item.name)}
            className={cn(
              'flex items-center justify-between w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActiveGroup
                ? 'text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              depth > 0 && 'pl-8'
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5" />
              {item.name}
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {isExpanded && (
            <div className="space-y-1 mt-1">
              {item.children.map(child => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      )
    }

    // Leaf node (link)
    const isActive = item.href ? location.pathname.startsWith(item.href) : false
    return (
      <Link
        key={item.name}
        to={item.href!}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
           depth > 0 && 'ml-4 border-l border-border pl-4 rounded-none rounded-r-lg' // Indent for children
        )}
      >
        <item.icon className="h-5 w-5" />
        {item.name}
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-sidebar border-r border-sidebar-border transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-sidebar-foreground hover:text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navigation.map(item => renderNavItem(item))}
        </nav>

        {/* User section at bottom */}
        <div className="border-t border-sidebar-border p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            {/* Theme Toggle */}
            <ModeToggle />
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent transition-colors"
                id="user-menu-button"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <span className="text-primary font-bold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden md:flex flex-col items-start pr-2">
                  <span className="text-sm font-medium leading-none mb-1">{user?.name || 'User'}</span>
                  <span className="text-xs text-muted-foreground leading-none">{user?.role || 'Admin'}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-popover p-1 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-2 py-1.5 text-sm font-semibold border-b border-border mb-1">
                      My Account
                    </div>
                    <Link 
                      to="/admin/settings" 
                      className="block px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-2 py-1.5 text-sm text-destructive rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
