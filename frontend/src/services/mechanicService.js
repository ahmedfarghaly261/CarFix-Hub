import API from './api';

// DASHBOARD
export const getMechanicDashboard = () => 
  API.get('/mechanics/dashboard');

/////////////////////////////////////////////

// JOBS MANAGEMENT
export const getMechanicJobs = (status = null) => {
  const url = status ? `/mechanics/jobs?status=${status}` : '/mechanics/jobs';
  return API.get(url);
};

export const getJobById = (jobId) => 
  API.get(`/mechanics/jobs/${jobId}`);

export const startJob = (jobId) => 
  API.put(`/mechanics/jobs/${jobId}/start`);

export const completeJob = (jobId, completionData = {}) => 
  API.put(`/mechanics/jobs/${jobId}/complete`, completionData);

export const sendJobUpdate = (jobId, updateData) => 
  API.post(`/mechanics/jobs/${jobId}/update`, updateData);

/////////////////////////////////////////////

// APPOINTMENTS
export const getMechanicAppointments = () => 
  API.get('/mechanics/appointments');

export const confirmAppointment = (appointmentId) => 
  API.put(`/mechanics/appointments/${appointmentId}`, { status: 'confirmed' });

export const declineAppointment = (appointmentId) => 
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

export const updateMechanicProfile = (profileData) => 
  API.put('/mechanics/profile', profileData);


/////////////////////////////////////////////

// SETTINGS
export const getMechanicSettings = () => 
  API.get('/mechanics/settings');

export const updateMechanicSettings = (settingsData) => 
  API.put('/mechanics/settings', settingsData);

export const updateWorkHours = (workHours) => 
  API.put('/mechanics/settings', { workHours });

export const updateSpecializations = (specializations) => 
  API.put('/mechanics/settings', { specializations });
