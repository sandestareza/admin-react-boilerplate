import { createFileRoute } from '@tanstack/react-router'
import { ProductsPage } from '@/pages/app'

export const Route = createFileRoute('/_app/products')({
  component: ProductsPage,
})
