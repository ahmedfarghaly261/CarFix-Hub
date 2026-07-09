import { baseApiService } from '@/services/base-api.service'

// DASHBOARD
export const getAdminDashboard = () =>
  baseApiService.get('/admin/dashboard')

// USERS MANAGEMENT
export const getAllUsers = (filters: Record<string, any> = {}) =>
  baseApiService.get('/admin/users', filters)

export const getUserById = (userId: string) =>
  baseApiService.get(`/admin/users/${userId}`)

export const updateUser = (userId: string, userData: any) =>
  baseApiService.put(`/admin/users/${userId}`, userData)

export const deleteUser = (userId: string) =>
  baseApiService.delete(`/admin/users/${userId}`)

export const changeUserRole = (userId: string, newRole: string) =>
  baseApiService.put(`/admin/users/${userId}`, { role: newRole })

// MECHANICS MANAGEMENT
export const getAllMechanics = (filters: Record<string, any> = {}) =>
  baseApiService.get('/admin/mechanics', filters)

export const getMechanicById = (mechanicId: string) =>
  baseApiService.get(`/admin/mechanics/${mechanicId}`)

export const updateMechanic = (mechanicId: string, mechanicData: any) =>
  baseApiService.put(`/admin/mechanics/${mechanicId}`, mechanicData)

export const deleteMechanic = (mechanicId: string) =>
  baseApiService.delete(`/admin/mechanics/${mechanicId}`)

export const createMechanic = (mechanicData: any) =>
  baseApiService.post('/admin/mechanics', mechanicData)

// BOOKINGS/APPOINTMENTS
export const getAllBookings = (filters: Record<string, any> = {}) =>
  baseApiService.get('/repairs', filters)

export const getBookingById = (bookingId: string) =>
  baseApiService.get(`/repairs/${bookingId}`)

export const updateBooking = (bookingId: string, bookingData: any) =>
  baseApiService.put(`/repairs/${bookingId}`, bookingData)

export const assignMechanic = (bookingId: string, data: { mechanicId: string }) =>
  baseApiService.put(`/repairs/${bookingId}`, { assignedTo: data.mechanicId })

export const getMechanics = () =>
  baseApiService.get('/admin/mechanics')

// SERVICES
export const getServices = () =>
  baseApiService.get('/admin/services')

export const createService = (serviceData: any) =>
  baseApiService.post('/admin/services', serviceData)

export const updateService = (serviceId: string, serviceData: any) =>
  baseApiService.put(`/admin/services/${serviceId}`, serviceData)

export const deleteService = (serviceId: string) =>
  baseApiService.delete(`/admin/services/${serviceId}`)

// NOTIFICATIONS
export const getAdminNotifications = () =>
  baseApiService.get('/notifications')

export const markNotificationAsRead = (notificationId: string) =>
  baseApiService.put(`/notifications/${notificationId}`, { read: true })

export const getAllNotifications = (filters: Record<string, any> = {}) =>
  baseApiService.get('/notifications', filters)

// REVIEWS
export const getMechanicReviews = () =>
  baseApiService.get('/admin/reviews')

// REPORTS
export const getSystemReports = (reportType: string = 'all') =>
  baseApiService.get('/admin/reports', { type: reportType })

export const getRevenueReport = () =>
  baseApiService.get('/admin/reports', { type: 'revenue' })

export const getRequestsReport = () =>
  baseApiService.get('/admin/reports', { type: 'requests' })

// JOBS MANAGEMENT
export const getAllJobs = () =>
  baseApiService.get('/admin/jobs')

export const getJobById = (jobId: string) =>
  baseApiService.get(`/admin/jobs/${jobId}`)

export const sendInvoice = (jobId: string, amount: number | null = null) =>
  baseApiService.post(`/admin/jobs/${jobId}/send-invoice`, amount == null ? {} : { amount })

export const setMechanicSalary = (jobId: string, mechanicSalary: number) =>
  baseApiService.put(`/admin/jobs/${jobId}/salary`, { mechanicSalary })
