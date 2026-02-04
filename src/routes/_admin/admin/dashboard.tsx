import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '@/pages/admin'

export const Route = createFileRoute('/_admin/admin/dashboard')({
  component: DashboardPage,
})
