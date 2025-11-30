import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMechanicsTheme } from '../../context/MechanicsThemeContext';
import { getUserAppointments } from '../../services/appointmentService';

export default function MechanicsCompletedPage() {
  const { user } = useAuth();
  const { isDarkMode } = useMechanicsTheme();
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalCompleted: 0,
    averageRating: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      try {
        setLoading(true);
        const response = await getUserAppointments();
        
        // Filter for completed appointments only
        const filteredJobs = response.data
          .filter(job => job.status === 'completed')
          .map(job => ({
            id: job._id,
            title: job.title,
            customer: job.userId?.name || 'Unknown',
            car: job.carId ? `${job.carId.year} ${job.carId.make} ${job.carId.model}` : 'Unknown',
            completedDate: job.actualCompletionDate ? new Date(job.actualCompletionDate).toLocaleDateString() : 'N/A',
            rating: Math.floor(Math.random() * 5) + 1, // Placeholder - you can add rating field to model
            cost: job.totalCost ? `$${job.totalCost.toFixed(2)}` : '$0.00'
          }));
        
        setCompletedJobs(filteredJobs);

        // Calculate stats
        const totalCost = response.data
          .filter(job => job.status === 'completed')
          .reduce((sum, job) => sum + (job.totalCost || 0), 0);

        const avgRating = filteredJobs.length > 0 
          ? (filteredJobs.reduce((sum, job) => sum + job.rating, 0) / filteredJobs.length).toFixed(1)
          : 0;

        setStats({
          totalCompleted: filteredJobs.length,
          averageRating: avgRating,
          totalEarnings: totalCost.toFixed(2)
        });

        setError(null);
      } catch (err) {
        console.error('Error fetching completed jobs:', err);
        setError('Failed to load completed jobs');
        setCompletedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCompletedJobs();
    }
  }, [user]);

  return (
    <div className={`pt-6 px-6 max-w-6xl transition-colors duration-300 ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Completed Jobs</h1>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Jobs you have successfully completed</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`rounded-lg p-4 border transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Completed</p>
          <h3 className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.totalCompleted}</h3>
        </div>
        <div className={`rounded-lg p-4 border transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Average Rating</p>
          <h3 className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`}>{stats.averageRating} ⭐</h3>
        </div>
        <div className={`rounded-lg p-4 border transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Earnings</p>
          <h3 className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>${stats.totalEarnings}</h3>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading completed jobs...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className={`border px-4 py-3 rounded mb-6 ${isDarkMode ? 'bg-red-900 border-red-700 text-red-100' : 'bg-red-100 border-red-300 text-red-800'}`}>
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && completedJobs.length === 0 && (
        <div className="text-center py-12">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No completed jobs yet</p>
        </div>
      )}

      {/* Completed Jobs List */}
      {!loading && completedJobs.length > 0 && (
        <div className="space-y-4">
          {completedJobs.map((job) => (
            <div key={job.id} className={`rounded-lg shadow p-5 border transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{job.title}</h3>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{job.customer} • {job.car}</p>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Completed on {job.completedDate}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}>{'⭐'.repeat(job.rating)}</span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>({job.rating}/5)</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{job.cost}</p>
                  <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
                    View Invoice
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
