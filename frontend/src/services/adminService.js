import { BaseAPI } from './BaseApi';

// DASHBOARD
export const getAdminDashboard = () =>
  BaseAPI.get('/admin/dashboard');

///////////////////////////////////////

// USERS MANAGEMENT
export const getAllUsers = (filters = {}) => {
  return BaseAPI.get('/admin/users', filters);
};

export const getUserById = (userId) =>
  BaseAPI.get(`/admin/users/${userId}`);

export const updateUser = (userId, userData) =>
  BaseAPI.put(`/admin/users/${userId}`, userData);

export const deleteUser = (userId) =>
  BaseAPI.delete(`/admin/users/${userId}`);

export const changeUserRole = (userId, newRole) =>
  BaseAPI.put(`/admin/users/${userId}`, { role: newRole });

// MECHANICS MANAGEMENT
export const getAllMechanics = (filters = {}) => {
  return BaseAPI.get('/admin/mechanics', filters);
};

export const getMechanicById = (mechanicId) =>
  BaseAPI.get(`/admin/mechanics/${mechanicId}`);

export const updateMechanic = (mechanicId, mechanicData) =>
  BaseAPI.put(`/admin/mechanics/${mechanicId}`, mechanicData);

export const deleteMechanic = (mechanicId) =>
  BaseAPI.delete(`/admin/mechanics/${mechanicId}`);

export const createMechanic = (mechanicData) =>
  BaseAPI.post('/admin/mechanics', mechanicData);

// BOOKINGS/APPOINTMENTS MANAGEMENT
export const getAllBookings = (filters = {}) => {
  return BaseAPI.get('/repairs', filters);
};

export const getBookingById = (bookingId) =>
  BaseAPI.get(`/repairs/${bookingId}`);

export const updateBooking = (bookingId, bookingData) =>
  BaseAPI.put(`/repairs/${bookingId}`, bookingData);

export const assignMechanic = (bookingId, data) =>
  BaseAPI.put(`/repairs/${bookingId}`, { assignedTo: data.mechanicId });

export const getMechanics = () =>
  BaseAPI.get('/admin/mechanics');

// SERVICES
export const getServices = () =>
  BaseAPI.get('/admin/services');

export const createService = (serviceData) =>
  BaseAPI.post('/admin/services', serviceData);

export const updateService = (serviceId, serviceData) =>
  BaseAPI.put(`/admin/services/${serviceId}`, serviceData);

export const deleteService = (serviceId) =>
  BaseAPI.delete(`/admin/services/${serviceId}`);

// NOTIFICATIONS
export const getAdminNotifications = () =>
  BaseAPI.get('/notifications');

export const markNotificationAsRead = (notificationId) =>
  BaseAPI.put(`/notifications/${notificationId}`, { read: true });

export const getAllNotifications = (filters = {}) =>
  BaseAPI.get('/notifications', filters);

// REVIEWS
export const getMechanicReviews = () =>
  BaseAPI.get('/admin/reviews');

// REPORTS
export const getSystemReports = (reportType = 'all') =>
  BaseAPI.get(`/admin/reports`, { type: reportType });

export const getRevenueReport = () =>
  BaseAPI.get('/admin/reports', { type: 'revenue' });

export const getRequestsReport = () =>
  BaseAPI.get('/admin/reports', { type: 'requests' });
