import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthLayout } from '@/components/layout'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/_auth')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()
    
    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: AuthLayout,
})
