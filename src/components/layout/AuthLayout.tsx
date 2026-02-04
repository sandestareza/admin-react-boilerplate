import { Outlet } from '@tanstack/react-router'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">A</span>
            </div>
            <span className="text-2xl font-bold">Admin</span>
          </div>
        </div>

        {/* Auth form content */}
        <Outlet />

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Admin Boilerplate. All rights reserved.
        </p>
      </div>
    </div>
  )
}
