import { apiService } from '@/services/api.service'

// AUTH ENDPOINTS
export const registerUser = (userData: any) =>
  apiService.post('/users/register', userData)

export const loginUser = (email: string, password: string) =>
  apiService.post('/users/login', { email, password })

export const logoutUser = () =>
  apiService.post('/users/logout')

export const getCurrentUser = () =>
  apiService.get('/users/profile')

export const updateUserProfile = (profileData: any) =>
  apiService.put('/users/profile', profileData)
