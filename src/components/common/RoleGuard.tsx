import { type ReactNode } from 'react'
import { useAuthStore, type User } from '@/stores/authStore'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: User['role'][]
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user } = useAuthStore()

  if (!user || !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
