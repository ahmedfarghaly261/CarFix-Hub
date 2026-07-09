import { BaseAPI } from './BaseApi';

// DASHBOARD
export const getAdminDashboard = () =>
  BaseAPI.get('/admin/dashboard');

///////////////////////////////////////

// USERS MANAGEMENT
export const getAllUsers = (filters: Record<string, any> = {}) => {
  return BaseAPI.get('/admin/users', filters);
};

export const getUserById = (userId: string) =>
  BaseAPI.get(`/admin/users/${userId}`);

export const updateUser = (userId: string, userData: any) =>
  BaseAPI.put(`/admin/users/${userId}`, userData);

export const deleteUser = (userId: string) =>
  BaseAPI.delete(`/admin/users/${userId}`);

export const changeUserRole = (userId: string, newRole: string) =>
  BaseAPI.put(`/admin/users/${userId}`, { role: newRole });

// MECHANICS MANAGEMENT
export const getAllMechanics = (filters: Record<string, any> = {}) => {
  return BaseAPI.get('/admin/mechanics', filters);
};

export const getMechanicById = (mechanicId: string) =>
  BaseAPI.get(`/admin/mechanics/${mechanicId}`);

export const updateMechanic = (mechanicId: string, mechanicData: any) =>
  BaseAPI.put(`/admin/mechanics/${mechanicId}`, mechanicData);

export const deleteMechanic = (mechanicId: string) =>
  BaseAPI.delete(`/admin/mechanics/${mechanicId}`);

export const createMechanic = (mechanicData: any) =>
  BaseAPI.post('/admin/mechanics', mechanicData);

// BOOKINGS/APPOINTMENTS MANAGEMENT
export const getAllBookings = (filters: Record<string, any> = {}) => {
  return BaseAPI.get('/repairs', filters);
};

export const getBookingById = (bookingId: string) =>
  BaseAPI.get(`/repairs/${bookingId}`);

export const updateBooking = (bookingId: string, bookingData: any) =>
  BaseAPI.put(`/repairs/${bookingId}`, bookingData);

export const assignMechanic = (bookingId: string, data: { mechanicId: string }) =>
  BaseAPI.put(`/repairs/${bookingId}`, { assignedTo: data.mechanicId });

export const getMechanics = () =>
  BaseAPI.get('/admin/mechanics');

// SERVICES
export const getServices = () =>
  BaseAPI.get('/admin/services');

export const createService = (serviceData: any) =>
  BaseAPI.post('/admin/services', serviceData);

export const updateService = (serviceId: string, serviceData: any) =>
  BaseAPI.put(`/admin/services/${serviceId}`, serviceData);

export const deleteService = (serviceId: string) =>
  BaseAPI.delete(`/admin/services/${serviceId}`);

// NOTIFICATIONS
export const getAdminNotifications = () =>
  BaseAPI.get('/notifications');

export const markNotificationAsRead = (notificationId: string) =>
  BaseAPI.put(`/notifications/${notificationId}`, { read: true });

export const getAllNotifications = (filters: Record<string, any> = {}) =>
  BaseAPI.get('/notifications', filters);

// REVIEWS
export const getMechanicReviews = () =>
  BaseAPI.get('/admin/reviews');

// REPORTS
export const getSystemReports = (reportType: string = 'all') =>
  BaseAPI.get(`/admin/reports`, { type: reportType });

export const getRevenueReport = () =>
  BaseAPI.get('/admin/reports', { type: 'revenue' });

export const getRequestsReport = () =>
  BaseAPI.get('/admin/reports', { type: 'requests' });

// JOBS MANAGEMENT
export const getAllJobs = () =>
  BaseAPI.get('/admin/jobs');

export const getJobById = (jobId: string) =>
  BaseAPI.get(`/admin/jobs/${jobId}`);

export const sendInvoice = (jobId: string, amount: number | null = null) =>
  BaseAPI.post(`/admin/jobs/${jobId}/send-invoice`, amount == null ? {} : { amount });

export const setMechanicSalary = (jobId: string, mechanicSalary: number) =>
  BaseAPI.put(`/admin/jobs/${jobId}/salary`, { mechanicSalary });
