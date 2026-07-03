import API from './api';

// Book an appointment (create repair request)
export const bookAppointment = (appointmentData: any) => 
  API.post('/repairs', appointmentData);

// Get all appointments for user
export const getUserAppointments = () => 
  API.get('/repairs');

// Get appointment details
export const getAppointmentDetails = (appointmentId: string) => 
  API.get(`/repairs/${appointmentId}`);

// Cancel appointment
export const cancelAppointment = (appointmentId: string) => 
  API.put(`/repairs/${appointmentId}`, { status: 'cancelled' });

// Update appointment status
export const updateAppointmentStatus = (appointmentId: string, status: string) => 
  API.put(`/repairs/${appointmentId}`, { status });

// Add mechanic iteration to appointment
export const addMechanicIteration = (appointmentId: string, iterationData: any) => 
  API.post(`/repairs/${appointmentId}/iterations`, iterationData);
