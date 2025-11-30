import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMechanicsTheme } from '../../context/MechanicsThemeContext';
import { getUserAppointments, updateAppointmentStatus } from '../../services/appointmentService';

export default function MechanicsInProgressPage() {
  const { user } = useAuth();
  const { isDarkMode } = useMechanicsTheme();
  const [inProgressJobs, setInProgressJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInProgressJobs = async () => {
      try {
        setLoading(true);
        const response = await getUserAppointments();
        
        // Filter for in-progress appointments only
        const filteredJobs = response.data
          .filter(job => job.status === 'in-progress')
          .map(job => ({
            id: job._id,
            title: job.title,
            customer: job.userId?.name || 'Unknown',
            car: job.carId ? `${job.carId.year} ${job.carId.make} ${job.carId.model}` : 'Unknown',
            plate: job.carId?.licensePlate || 'N/A',
            startTime: job.requestedDate || 'Not set',
            estimatedCompletion: 'TBD',
            progress: 50, // Default progress for in-progress jobs
            description: job.description
          }));
        
        setInProgressJobs(filteredJobs);
        setError(null);
      } catch (err) {
        console.error('Error fetching in-progress jobs:', err);
        setError('Failed to load in-progress jobs');
        setInProgressJobs([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchInProgressJobs();
    }
  }, [user]);

  const handleMarkComplete = async (jobId) => {
    try {
      await updateAppointmentStatus(jobId, 'completed');
      setInProgressJobs(inProgressJobs.filter(job => job.id !== jobId));
    } catch (err) {
      console.error('Error marking job as complete:', err);
      alert('Failed to mark job as complete');
    }
  };

  return (
    <div className={`pt-6 px-6 max-w-6xl transition-colors duration-300 ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>In Progress</h1>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Jobs currently being worked on</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading in-progress jobs...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className={`border px-4 py-3 rounded mb-6 ${isDarkMode ? 'bg-red-900 border-red-700 text-red-100' : 'bg-red-100 border-red-300 text-red-800'}`}>
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && inProgressJobs.length === 0 && (
        <div className="text-center py-12">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No jobs in progress</p>
        </div>
      )}

      {/* In Progress Jobs */}
      {!loading && inProgressJobs.length > 0 && (
        <div className="space-y-4">
          {inProgressJobs.map((job) => (
            <div key={job.id} className={`rounded-lg shadow p-5 border transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{job.title}</h3>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{job.customer} • {job.car} • {job.plate}</p>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Started at {job.startTime} • Est. completion: {job.estimatedCompletion}</p>
                </div>
                <button 
                  onClick={() => handleMarkComplete(job.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm">
                  Mark Complete
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Progress</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{job.progress}%</span>
                </div>
                <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all" 
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
