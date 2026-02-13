import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Package, 
  ShoppingCart, 
  LineChart 
} from 'lucide-react'
import { type User } from '@/services/authService'

export interface NavigationItem {
  name: string
  href?: string
  icon: any
  children?: NavigationItem[]
  roles?: User['role'][] // Optional: if undefined, visible to all
}

export const navigation: NavigationItem[] = [
  { 
    name: 'Dashboard', 
    href: '/admin/dashboard', 
    icon: LayoutDashboard,
    roles: ['admin', 'user'] 
  },
  {
    name: 'Master Data',
    // icon: Package, // Keep icons explicit in component usage or import them
    icon: Package,
    roles: ['admin', 'user'], // Admin only
    children: [
      { name: 'Products', href: '/admin/products', icon: Package, roles: ['admin'] },
      { name: 'Users', href: '/admin/users', icon: Users, roles: ['admin', 'user'] },
    ]
  },
  { 
    name: 'Transactions', 
    href: '/admin/transactions', 
    icon: ShoppingCart,
    roles: ['admin', 'user']
  },
  { 
    name: 'Analytics', 
    href: '/admin/analytics', 
    icon: LineChart,
    roles: ['admin'] // Admin only
  },
  { 
    name: 'Settings', 
    href: '/admin/settings', 
    icon: Settings,
    roles: ['admin'] // Admin only
  },
]

export function getFilteredNavigation(role?: User['role']): NavigationItem[] {
  if (!role) return []

  const filterItems = (items: NavigationItem[]): NavigationItem[] => {
    return items.reduce<NavigationItem[]>((acc, item) => {
      // 1. Check if the item itself is allowed
      const isAllowed = !item.roles || item.roles.includes(role)
      if (!isAllowed) return acc

      // 2. If it has children, filter them recursively
      if (item.children) {
        const filteredChildren = filterItems(item.children)
        
        // If it has children defined but none remain after filtering, 
        // and distinctively it has no href (meaning it's just a group header),
        // then we shouldn't show this group header.
        if (filteredChildren.length === 0 && !item.href) {
          return acc
        }
        
        return [...acc, { ...item, children: filteredChildren }]
      }

      // 3. No children, just return the item
      return [...acc, item]
    }, [])
  }

  return filterItems(navigation)
}
