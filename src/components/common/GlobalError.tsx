import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface GlobalErrorProps {
  error: any
  reset?: () => void
}

export function GlobalError({ error, reset }: GlobalErrorProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="bg-destructive/10 p-4 rounded-full mb-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        An unexpected error occurred. Our team has been notified.
      </p>
      
      {import.meta.env.DEV && error && (
        <pre className="bg-muted p-4 rounded-md text-xs font-mono mb-8 max-w-2xl overflow-auto border border-border">
          {error.message || JSON.stringify(error, null, 2)}
          {error.stack && `\n\n${error.stack}`}
        </pre>
      )}

      <div className="flex gap-4">
        <Button onClick={() => navigate({ to: '/' })} variant="outline">
          Go Home
        </Button>
        <Button onClick={() => reset ? reset() : window.location.reload()}>
          Try Again
        </Button>
      </div>
    </div>
  )
}
