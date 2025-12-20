import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useUserTheme } from '../../../context/UserThemeContext';
import API from '../../../services/api';
import { useNavigate } from 'react-router-dom';

export default function RepairHistory() {
  const { user } = useAuth();
  const { isDarkMode } = useUserTheme();
  const navigate = useNavigate();
  
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserCars();
    }
  }, [user]);

  const fetchUserCars = async () => {
    try {
      setLoading(true);
      const response = await API.get('/cars');
      setCars(response.data);
      if (response.data.length > 0) {
        setSelectedCar(response.data[0]._id);
        fetchRepairsForCar(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRepairsForCar = async (carId) => {
    try {
      setLoading(true);
      const response = await API.get(`/users/repairs-history/${carId}`);
      setRepairs(response.data);
    } catch (error) {
      console.error('Error fetching repair history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCarSelect = (carId) => {
    setSelectedCar(carId);
    fetchRepairsForCar(carId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-200 text-green-700';
      case 'in-progress':
        return isDarkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-200 text-yellow-700';
      case 'assigned':
        return isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-200 text-blue-700';
      case 'pending':
        return isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700';
      default:
        return isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className={`px-6 min-h-screen ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
        <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Loading repair history...
        </p>
      </div>
    );
  }

  return (
    <div className={`px-6 max-w-6xl mx-auto pb-12 ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Repair History
      </h1>

      {cars.length === 0 ? (
        <div className={`rounded-lg p-8 text-center ${isDarkMode ? 'bg-[#1E2A38]' : 'bg-white'}`}>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
            No cars found. Add a car to view repair history.
          </p>
        </div>
      ) : (
        <>
          {/* Car Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {cars.map((car) => (
              <button
                key={car._id}
                onClick={() => handleCarSelect(car._id)}
                className={`p-4 rounded-lg transition-colors ${
                  selectedCar === car._id
                    ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : isDarkMode ? 'bg-[#1E2A38] text-gray-300 hover:bg-[#27384a]' : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
              >
                <p className="font-semibold">{car.year} {car.make}</p>
                <p className="text-sm">{car.model}</p>
                <p className="text-xs">{car.licensePlate}</p>
              </button>
            ))}
          </div>

          {/* Repairs List */}
          {repairs.length === 0 ? (
            <div className={`rounded-lg p-8 text-center ${isDarkMode ? 'bg-[#1E2A38]' : 'bg-white'}`}>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                No repairs found for this car
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {repairs.map((repair) => (
                <div
                  key={repair._id}
                  className={`rounded-lg shadow p-6 transition-colors cursor-pointer hover:shadow-lg ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200'}`}
                  onClick={() => repair.status === 'completed' && navigate(`/repairs/${repair._id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {repair.title}
                      </h3>
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                        {repair.description}
                      </p>
                      <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Requested: {new Date(repair.createdAt).toLocaleDateString()}
                        {repair.actualCompletionDate && ` • Completed: ${new Date(repair.actualCompletionDate).toLocaleDateString()}`}
                      </p>
                      {repair.assignedTo && (
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Mechanic: {repair.assignedTo.name}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-3 ml-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(repair.status)}`}>
                        {repair.status.charAt(0).toUpperCase() + repair.status.slice(1)}
                      </span>
                      {repair.status === 'completed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/repairs/${repair._id}`);
                          }}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
