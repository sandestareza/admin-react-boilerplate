import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '@/pages/admin'

export const Route = createFileRoute('/_admin/admin/settings')({
  component: SettingsPage,
})
