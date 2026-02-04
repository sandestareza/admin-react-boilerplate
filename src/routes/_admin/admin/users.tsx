import { createFileRoute } from '@tanstack/react-router'
import { UsersPage } from '@/pages/admin'

export const Route = createFileRoute('/_admin/admin/users')({
  component: UsersPage,
})
