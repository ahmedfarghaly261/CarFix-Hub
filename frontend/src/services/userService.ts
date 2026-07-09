import API from './api';

// AUTH ENDPOINTS
export const registerUser = (userData: any) => 
  API.post('/users/register', userData);

export const loginUser = (email: string, password: string) => 
  API.post('/users/login', { email, password });

export const logoutUser = () => 
  API.post('/users/logout');

export const getCurrentUser = () => 
  API.get('/users/profile');

export const updateUserProfile = (profileData: any) => 
  API.put('/users/profile', profileData);

////////////////////////////////////////////

// CAR ENDPOINTS
export const getUserCars = () => 
  API.get('/cars');

export const addCar = (carData: any) => 
  API.post('/cars', carData);

export const updateCar = (carId: string, carData: any) => 
  API.put(`/cars/${carId}`, carData);

export const deleteCar = (carId: string) => 
  API.delete(`/cars/${carId}`);

//////////////////////////////////////////////

// REQUEST ENDPOINTS
export const getRepairRequests = (status: string | null = null) => {
  const url = status ? `/repairs?status=${status}` : '/repairs';
  return API.get(url);
};

export const createRepairRequest = (repairData: any) => 
  API.post('/repairs', repairData);

export const updateRepairRequest = (repairId: string, updateData: any) => 
  API.put(`/repairs/${repairId}`, updateData);

export const getRepairDetails = (repairId: string) => 
  API.get(`/repairs/${repairId}`);

/////////////////////////////////////////////

// NOTIFICATION ENDPOINTS
export const getNotifications = () => 
  API.get('/notifications');

export const markNotificationRead = (notificationId: string) => 
  API.put(`/notifications/${notificationId}`, { read: true });

export const deleteNotification = (notificationId: string) => 
  API.delete(`/notifications/${notificationId}`);

/////////////////////////////////////////

// APPOINTMENTS ENDPOINTS
export const getAllAppointments = () => 
  API.get('/repairs');

export const bookAppointment = (appointmentData: any) => 
  API.post('/repairs', appointmentData);

export const cancelAppointment = (appointmentId: string) => 
  API.put(`/repairs/${appointmentId}`, { status: 'cancelled' });
