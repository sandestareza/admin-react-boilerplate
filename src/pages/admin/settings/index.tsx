import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { useAuthStore } from '@/stores/authStore'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export function SettingsPage() {
  const { user, updateUser } = useAuthStore()
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const onProfileSubmit = async (data: ProfileFormData) => {
    setProfileLoading(true)
    setProfileSuccess(false)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    updateUser({ name: data.name, email: data.email })
    
    setProfileLoading(false)
    setProfileSuccess(true)
    setTimeout(() => setProfileSuccess(false), 3000)
  }

  const onPasswordSubmit = async (_data: PasswordFormData) => {
    setPasswordLoading(true)
    setPasswordSuccess(false)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setPasswordLoading(false)
    setPasswordSuccess(true)
    passwordForm.reset()
    setTimeout(() => setPasswordSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Profile settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" required>Full Name</Label>
                <Input
                  id="name"
                  error={profileForm.formState.errors.name?.message}
                  {...profileForm.register('name')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" required>Email</Label>
                <Input
                  id="email"
                  type="email"
                  error={profileForm.formState.errors.email?.message}
                  {...profileForm.register('email')}
                  disabled
                />
              </div>

              <div className="flex items-center gap-4">
                <Button type="submit" isLoading={profileLoading}>
                  Save Changes
                </Button>
                {profileSuccess && (
                  <span className="text-sm text-green-500">Profile updated successfully!</span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password settings */}
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" required>Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  error={passwordForm.formState.errors.currentPassword?.message}
                  {...passwordForm.register('currentPassword')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" required>New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  error={passwordForm.formState.errors.newPassword?.message}
                  {...passwordForm.register('newPassword')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" required>Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  error={passwordForm.formState.errors.confirmPassword?.message}
                  {...passwordForm.register('confirmPassword')}
                />
              </div>

              <div className="flex items-center gap-4">
                <Button type="submit" isLoading={passwordLoading}>
                  Update Password
                </Button>
                {passwordSuccess && (
                  <span className="text-sm text-green-500">Password updated successfully!</span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
