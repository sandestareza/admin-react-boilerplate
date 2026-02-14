import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authService, type LoginCredentials } from '@/services/authService'
import type { User } from '@/types/user'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: Partial<User>) => void
  setLoading: (isLoading: boolean) => void
  clearError: () => void
}

type AuthStore = AuthState & AuthActions

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false, // Changed default to false, app should check auth status on init if needed
  error: null,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const { user, token } = await authService.login(credentials)
          localStorage.setItem('auth_token', token)
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          set({ 
            error: error.message || 'Login failed',
            isLoading: false 
          })
          throw error // Re-throw to let component handle it if needed
        }
      },
      
      logout: async () => {
        set({ isLoading: true })
        try {
           await authService.logout()
        } catch (error) {
           console.error('Logout failed', error)
        } finally {
            localStorage.removeItem('auth_token')
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: null
            })
        }
      },
      
      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }))
      },
      
      setLoading: (isLoading) => set({ isLoading }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setLoading(false)
        }
      },
    }
  )
)

// Selector hooks for better performance
export const useUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)
export const useAuthError = () => useAuthStore((state) => state.error)
