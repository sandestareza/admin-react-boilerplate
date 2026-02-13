import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui'
import { useState } from 'react'
import { registerSchema, type RegisterFormData } from '@/validations/authValidation'


export function RegisterPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    console.log({data});
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // Mock registration - replace with actual API call
    
    setIsLoading(false)
    navigate({ to: '/login' })
  }

  return (
    <Card className="bg-card/50 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" required>Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              error={errors.name?.message}
              {...register('name')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" required>Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" required>Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" required>Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Create account
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
