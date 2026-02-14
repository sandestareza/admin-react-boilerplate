import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <h1 className="text-9xl font-extrabold text-primary/20">404</h1>
      <h2 className="text-2xl font-bold mt-4 mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => window.history.back()} variant="outline">
          Go Back
        </Button>
        <Button onClick={() => navigate({ to: '/' })}>
          Go Home
        </Button>
      </div>
    </div>
  )
}
