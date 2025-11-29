import API from './api';

// AUTH ENDPOINTS
export const registerUser = (userData) => 
  API.post('/users/register', userData);

export const loginUser = (email, password) => 
  API.post('/users/login', { email, password });

export const logoutUser = () => 
  API.post('/users/logout');

export const getCurrentUser = () => 
  API.get('/users/profile');

export const updateUserProfile = (profileData) => 
  API.put('/users/profile', profileData);

////////////////////////////////////////////

// CAR ENDPOINTS
export const getUserCars = () => 
  API.get('/cars');

export const addCar = (carData) => 
  API.post('/cars', carData);

export const updateCar = (carId, carData) => 
  API.put(`/cars/${carId}`, carData);

export const deleteCar = (carId) => 
  API.delete(`/cars/${carId}`);

//////////////////////////////////////////////

// REQUEST ENDPOINTS
export const getRepairRequests = (status = null) => {
  const url = status ? `/repairs?status=${status}` : '/repairs';
  return API.get(url);
};

export const createRepairRequest = (repairData) => 
  API.post('/repairs', repairData);

export const updateRepairRequest = (repairId, updateData) => 
  API.put(`/repairs/${repairId}`, updateData);

export const getRepairDetails = (repairId) => 
  API.get(`/repairs/${repairId}`);

/////////////////////////////////////////////

// NOTIFICATION ENDPOINTS
export const getNotifications = () => 
  API.get('/notifications');

export const markNotificationRead = (notificationId) => 
  API.put(`/notifications/${notificationId}`, { read: true });

export const deleteNotification = (notificationId) => 
  API.delete(`/notifications/${notificationId}`);

/////////////////////////////////////////

// APPOINTMENTS ENDPOINTS
export const getAllAppointments = () => 
  API.get('/repairs');

export const bookAppointment = (appointmentData) => 
  API.post('/repairs', appointmentData);

export const cancelAppointment = (appointmentId) => 
  API.put(`/repairs/${appointmentId}`, { status: 'cancelled' });
