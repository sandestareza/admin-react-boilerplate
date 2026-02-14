import { createFileRoute, redirect } from '@tanstack/react-router'
import { AppLayout } from '@/components/layout'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/_app')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: AppLayout,
})
