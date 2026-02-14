import { createFileRoute } from '@tanstack/react-router'
import { UsersPage } from '@/pages/app'

export const Route = createFileRoute('/_app/users')({
  component: UsersPage,
})
