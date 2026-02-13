import { Outlet, Link, useLocation, useNavigate } from '@tanstack/react-router'
import { 
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Bell,
  MoreVertical,
  Settings,
  LogOut
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { ModeToggle } from '@/components/mode-toggle'

import { getFilteredNavigation, type NavigationItem } from '@/config/menu'

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // const [userMenuOpen, setUserMenuOpen] = useState(false) // No longer needed
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'Master Data': true // Default open for demo
  })

  // Mock Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New User Registered', message: 'A new user has signed up.', time: '5m ago', read: false },
    { id: 2, title: 'System Update', message: 'System maintenance scheduled.', time: '1h ago', read: false },
    { id: 3, title: 'New Order', message: 'Order #1234 has been placed.', time: '2h ago', read: true },
    { id: 4, title: 'Server Alert', message: 'High CPU usage detected.', time: '5h ago', read: false },
    { id: 5, title: 'Backup Completed', message: 'Daily backup successful.', time: '1d ago', read: true },
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  
  const navigation = getFilteredNavigation(user?.role)

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
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-sidebar border-r border-sidebar-border transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col',
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
            <div className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors group">
              <div className="h-9 w-9 rounded-full border border-sidebar-border overflow-hidden bg-muted flex items-center justify-center">
                 {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                 ) : (
                    <span className="text-xs font-medium text-muted-foreground">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                 )}
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <span className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || 'User'}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.role || 'Admin'}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-sidebar-foreground">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56" side="top">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate({ to: '/admin/settings' })}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive font-bold focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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

          <div className="flex items-center gap-2 ml-auto">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 ring-2 ring-background" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                  <span className="font-semibold text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    <div className="grid gap-1 p-1">
                      {notifications.map((notification) => (
                        <DropdownMenuItem 
                          key={notification.id} 
                          className={cn(
                            "flex flex-col items-start gap-1 p-3 cursor-pointer",
                            !notification.read && "bg-accent/50"
                          )}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex w-full items-start justify-between gap-2">
                            <span className={cn("text-sm font-medium leading-none", !notification.read && "text-foreground")}>
                              {notification.title}
                            </span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <ModeToggle />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
