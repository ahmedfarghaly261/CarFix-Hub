import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useUserTheme } from '../../../context/UserThemeContext';
import API from '../../../services/api';
import { Star } from 'lucide-react';

export default function CompletedRepairs() {
  const { user } = useAuth();
  const { isDarkMode } = useUserTheme();
  const navigate = useNavigate();
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRepair, setSelectedRepair] = useState(null);

  useEffect(() => {
    fetchCompletedRepairs();
  }, [user]);

  const fetchCompletedRepairs = async () => {
    try {
      setLoading(true);
      console.log('[CompletedRepairs] Fetching completed repairs for user:', user?._id);
      const response = await API.get('/users/completed-repairs');
      console.log('[CompletedRepairs] Response:', response.data);
      setRepairs(response.data);
    } catch (error) {
      console.error('[CompletedRepairs] Error fetching:', error);
      if (error.response?.data?.message) {
        console.error('[CompletedRepairs] Error message:', error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (repair) => {
    navigate(`/repairs/${repair._id}`);
  };

  if (loading) {
    return (
      <div className={`px-6 min-h-screen ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
        <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Loading completed repairs...
        </p>
      </div>
    );
  }

  return (
    <div className={`px-6 max-w-6xl mx-auto pb-12 ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Completed Repairs
      </h1>

      {repairs.length === 0 ? (
        <div className={`rounded-lg p-8 text-center ${isDarkMode ? 'bg-[#1E2A38]' : 'bg-white'}`}>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
            No completed repairs yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {repairs.map((repair) => (
            <div
              key={repair._id}
              className={`rounded-lg shadow p-6 transition-colors ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {repair.title}
                  </h3>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {repair.carId?.year} {repair.carId?.make} {repair.carId?.model}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Plate: {repair.carId?.plate}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${repair.totalCost || 'TBD'}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total Cost
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Mechanic
                  </p>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {repair.assignedTo?.name}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Mechanic Rating
                  </p>
                  <div className="flex items-center gap-1">
                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {repair.assignedTo?.rating || 'Not rated'}
                    </span>
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Report
                </p>
                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {repair.reportDetails || 'No report provided'}
                </p>
              </div>

              <button
                onClick={() => handleViewDetails(repair)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View Details & Rate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
