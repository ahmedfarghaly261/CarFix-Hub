import API from './api';

// DASHBOARD
export const getMechanicDashboard = () => 
  API.get('/mechanics/dashboard');

/////////////////////////////////////////////

// JOBS MANAGEMENT
export const getMechanicJobs = (status: string | null = null) => {
  const url = status ? `/mechanics/jobs?status=${status}` : '/mechanics/jobs';
  return API.get(url);
};

export const getJobById = (jobId: string) => 
  API.get(`/mechanics/jobs/${jobId}`);

export const startJob = (jobId: string) => 
  API.put(`/mechanics/jobs/${jobId}/start`);

export const completeJob = (jobId: string, completionData: Record<string, any> = {}) => 
  API.put(`/mechanics/jobs/${jobId}/complete`, completionData);

export const sendJobUpdate = (jobId: string, updateData: any) => 
  API.post(`/mechanics/jobs/${jobId}/update`, updateData);

export const addWorkReport = (jobId: string, reportData: any) =>
  API.put(`/mechanics/jobs/${jobId}/update`, reportData);

/////////////////////////////////////////////

// APPOINTMENTS
export const getMechanicAppointments = () => 
  API.get('/mechanics/appointments');

export const confirmAppointment = (appointmentId: string) => 
  API.put(`/mechanics/appointments/${appointmentId}`, { status: 'confirmed' });

export const declineAppointment = (appointmentId: string) => 
  API.put(`/mechanics/appointments/${appointmentId}`, { status: 'declined' });

/////////////////////////////////////////////

// IN-PROGRESS JOBS
export const getInProgressJobs = () => 
  API.get('/mechanics/in-progress');

// COMPLETED JOBS
export const getCompletedJobs = () => 
  API.get('/mechanics/completed');

// REVIEWS & RATINGS
export const getMechanicReviews = () => 
  API.get('/mechanics/reviews');

// PROFILE
export const getMechanicProfile = () => 
  API.get('/mechanics/profile');

export const updateMechanicProfile = (profileData: any) => 
  API.put('/mechanics/profile', profileData);


/////////////////////////////////////////////

// SETTINGS
export const getMechanicSettings = () => 
  API.get('/mechanics/settings');

export const updateMechanicSettings = (settingsData: any) => 
  API.put('/mechanics/settings', settingsData);

export const updateWorkHours = (workHours: any) => 
  API.put('/mechanics/settings', { workHours });

export const updateSpecializations = (specializations: any) => 
  API.put('/mechanics/settings', { specializations });
