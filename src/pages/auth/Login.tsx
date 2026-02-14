import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui'
import { useAuthStore } from '@/stores/authStore'
import { loginSchema, type LoginFormData } from '@/validations/authValidation'


export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, error: authError } = useAuthStore()
  // const [isLoading, setIsLoading] = useState(false) // Use store loading state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    // setIsLoading(true) // Handled by store
    
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 1000))
    
    try {
        await login({
            email: data.email,
            password: data.password
        })
        navigate({ to: '/dashboard' })
    } catch (error) {
        console.error("Login failed", error)
        // Error is handled by store and displayed below
    }
  }

  return (
    <Card className="bg-card/50 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        {authError && (
            <div className="mb-4 p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium">
                {authError}
            </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" required>Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" required>Password</Label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign in
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
