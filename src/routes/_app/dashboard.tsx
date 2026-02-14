import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '@/pages/app'

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardPage,
})
