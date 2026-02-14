import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { NotFound } from '@/components/common/NotFound'
import { GlobalError } from '@/components/common/GlobalError'
import nprogress from 'nprogress'
import { useEffect } from 'react'

nprogress.configure({ showSpinner: false })

function RootComponent() {
  const isLoading = useRouterState({ select: (s) => s.status === 'pending' })

  useEffect(() => {
    if (isLoading) {
      nprogress.start()
    } else {
      nprogress.done()
    }
  }, [isLoading])

  return (
    <>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: (props) => <GlobalError {...props} />,
})
