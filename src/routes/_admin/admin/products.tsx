import { createFileRoute } from '@tanstack/react-router'
import { ProductsPage } from '@/pages/admin'

export const Route = createFileRoute('/_admin/admin/products')({
  component: ProductsPage,
})
