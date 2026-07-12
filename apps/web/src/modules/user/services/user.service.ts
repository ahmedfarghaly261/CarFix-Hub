import { apiService } from '@/services/api.service'

// Re-export profile functions from auth service for convenience
export { getCurrentUser, updateUserProfile } from '@/modules/auth/services/auth.service'

// CAR ENDPOINTS
export const getUserCars = () =>
  apiService.get('/cars')

export const addCar = (carData: any) =>
  apiService.post('/cars', carData)

export const updateCar = (carId: string, carData: any) =>
  apiService.put(`/cars/${carId}`, carData)

export const deleteCar = (carId: string) =>
  apiService.delete(`/cars/${carId}`)

// REPAIR REQUEST ENDPOINTS
export const getRepairRequests = (status: string | null = null) => {
  const url = status ? `/repairs?status=${status}` : '/repairs'
  return apiService.get(url)
}

export const createRepairRequest = (repairData: any) =>
  apiService.post('/repairs', repairData)

export const updateRepairRequest = (repairId: string, updateData: any) =>
  apiService.put(`/repairs/${repairId}`, updateData)

export const getRepairDetails = (repairId: string) =>
  apiService.get(`/repairs/${repairId}`)

// NOTIFICATION ENDPOINTS
export const getNotifications = () =>
  apiService.get('/notifications')

export const markNotificationRead = (notificationId: string) =>
  apiService.put(`/notifications/${notificationId}`, { read: true })

export const deleteNotification = (notificationId: string) =>
  apiService.delete(`/notifications/${notificationId}`)

// APPOINTMENT ENDPOINTS
export const getAllAppointments = () =>
  apiService.get('/repairs')

/** @alias getAllAppointments */
export const getUserAppointments = () =>
  apiService.get('/repairs')

export const bookAppointment = (appointmentData: any) =>
  apiService.post('/repairs', appointmentData)

export const cancelAppointment = (appointmentId: string) =>
  apiService.put(`/repairs/${appointmentId}`, { status: 'cancelled' })

export const getAppointmentDetails = (appointmentId: string) =>
  apiService.get(`/repairs/${appointmentId}`)

export const updateAppointmentStatus = (appointmentId: string, status: string) =>
  apiService.put(`/repairs/${appointmentId}`, { status })

export const addMechanicIteration = (appointmentId: string, iterationData: any) =>
  apiService.post(`/repairs/${appointmentId}/iterations`, iterationData)
