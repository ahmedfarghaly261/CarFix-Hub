import API from './api';

// Book an appointment (create repair request)
export const bookAppointment = (appointmentData) => 
  API.post('/repairs', appointmentData);

// Get all appointments for user
export const getUserAppointments = () => 
  API.get('/repairs');

// Get appointment details
export const getAppointmentDetails = (appointmentId) => 
  API.get(`/repairs/${appointmentId}`);

// Cancel appointment
export const cancelAppointment = (appointmentId) => 
  API.put(`/repairs/${appointmentId}`, { status: 'cancelled' });

// Update appointment status
export const updateAppointmentStatus = (appointmentId, status) => 
  API.put(`/repairs/${appointmentId}`, { status });

// Add mechanic iteration to appointment
export const addMechanicIteration = (appointmentId, iterationData) => 
  API.post(`/repairs/${appointmentId}/iterations`, iterationData);
