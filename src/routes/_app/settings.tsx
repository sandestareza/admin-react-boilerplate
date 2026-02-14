import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '@/pages/app'

export const Route = createFileRoute('/_app/settings')({
  component: SettingsPage,
})
