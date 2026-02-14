import { type ReactNode } from 'react'
import { useAuthStore } from '@/stores/authStore'
import type { User } from '@/types/user'

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
