import { apiService } from '@/services/api.service'

// DASHBOARD
export const getMechanicDashboard = () =>
  apiService.get('/mechanics/dashboard')

// JOBS MANAGEMENT
export const getMechanicJobs = (status: string | null = null) => {
  const url = status ? `/mechanics/jobs?status=${status}` : '/mechanics/jobs'
  return apiService.get(url)
}

export const getJobById = (jobId: string) =>
  apiService.get(`/mechanics/jobs/${jobId}`)

export const startJob = (jobId: string) =>
  apiService.put(`/mechanics/jobs/${jobId}/start`)

export const completeJob = (jobId: string, completionData: Record<string, any> = {}) =>
  apiService.put(`/mechanics/jobs/${jobId}/complete`, completionData)

export const sendJobUpdate = (jobId: string, updateData: any) =>
  apiService.post(`/mechanics/jobs/${jobId}/update`, updateData)

export const addWorkReport = (jobId: string, reportData: any) =>
  apiService.put(`/mechanics/jobs/${jobId}/update`, reportData)

// APPOINTMENTS
export const getMechanicAppointments = () =>
  apiService.get('/mechanics/appointments')

export const confirmAppointment = (appointmentId: string) =>
  apiService.put(`/mechanics/appointments/${appointmentId}`, { status: 'confirmed' })

export const declineAppointment = (appointmentId: string) =>
  apiService.put(`/mechanics/appointments/${appointmentId}`, { status: 'declined' })

// IN-PROGRESS JOBS
export const getInProgressJobs = () =>
  apiService.get('/mechanics/in-progress')

// COMPLETED JOBS
export const getCompletedJobs = () =>
  apiService.get('/mechanics/completed')

// REVIEWS & RATINGS
export const getMechanicReviews = () =>
  apiService.get('/mechanics/reviews')

// PROFILE
export const getMechanicProfile = () =>
  apiService.get('/mechanics/profile')

export const updateMechanicProfile = (profileData: any) =>
  apiService.put('/mechanics/profile', profileData)

// SETTINGS
export const getMechanicSettings = () =>
  apiService.get('/mechanics/settings')

export const updateMechanicSettings = (settingsData: any) =>
  apiService.put('/mechanics/settings', settingsData)

export const updateWorkHours = (workHours: any) =>
  apiService.put('/mechanics/settings', { workHours })

export const updateSpecializations = (specializations: any) =>
  apiService.put('/mechanics/settings', { specializations })
