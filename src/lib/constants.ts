export const APP_NAME = 'Admin Boilerplate'
export const APP_DESCRIPTION = 'React Admin Dashboard Template'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/admin/dashboard',
  USERS: '/admin/users',
  SETTINGS: '/admin/settings',
} as const

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
