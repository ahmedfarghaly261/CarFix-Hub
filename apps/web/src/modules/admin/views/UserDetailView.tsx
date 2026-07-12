import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminTheme } from '@/context/AdminThemeContext';
import API from '@/services/api.service';
import { FaArrowLeft, FaEdit, FaTrashAlt } from 'react-icons/fa';

function UserDetailPage() {
  const { isDarkMode } = useAdminTheme();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cars'); // cars, repairs

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user info
      const userRes = await API.get(`/admin/users/${userId}`);
      setUser(userRes.data);
      
      // Fetch user's cars
      try {
        console.log('Fetching cars for userId:', userId);
        const carsRes = await API.get(`/cars?userId=${userId}`);
        console.log('Cars response:', carsRes.data);
        setCars(carsRes.data || []);
      } catch (err) {
        console.log('Could not fetch cars:', err.message);
        console.log('Error response:', err.response?.data);
        setCars([]);
      }
      
      // Fetch user's repairs
      try {
        const repairsRes = await API.get(`/repairs?userId=${userId}`);
        setRepairs(repairsRes.data || []);
      } catch (err) {
        console.log('Could not fetch repairs:', err.message);
        setRepairs([]);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`p-6 min-h-screen ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`p-6 min-h-screen ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>User not found</p>
      </div>
    );
  }

  return (
    <div className={`p-6 min-h-screen transition-colors ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/users')}
          className={`flex items-center gap-2 mb-4 px-4 py-2 rounded ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
        >
          <FaArrowLeft size={16} /> Back
        </button>
        
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          User Details
        </h1>
      </div>

      {/* User Info Card */}
      <div className={`rounded-lg shadow-sm p-6 mb-6 ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200'}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Name</p>
            <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
          </div>
          <div>
            <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{user.email}</p>
          </div>
          <div>
            <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</p>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{user.phone || 'N/A'}</p>
          </div>
          <div>
            <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Role</p>
            <p className={`text-lg font-bold capitalize ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{user.role}</p>
          </div>
        </div>
        {user.address && (
          <div className="mt-4">
            <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Address</p>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{user.address}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('cars')}
          className={`px-6 py-2 rounded font-semibold transition ${
            activeTab === 'cars'
              ? isDarkMode
                ? 'bg-blue-600 text-white'
                : 'bg-blue-500 text-white'
              : isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Cars ({cars.length})
        </button>
        <button
          onClick={() => setActiveTab('repairs')}
          className={`px-6 py-2 rounded font-semibold transition ${
            activeTab === 'repairs'
              ? isDarkMode
                ? 'bg-blue-600 text-white'
                : 'bg-blue-500 text-white'
              : isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Repair History ({repairs.length})
        </button>
      </div>

      {/* Cars Tab */}
      {activeTab === 'cars' && (
        <div className={`rounded-lg shadow-sm p-6 ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>User's Cars</h2>
          
          {cars.length === 0 ? (
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No cars added yet</p>
          ) : (
            <div className="space-y-4">
              {cars.map((car) => (
                <div key={car._id} className={`p-4 rounded border ${isDarkMode ? 'bg-[#27384a] border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Make</p>
                      <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{car.make}</p>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Model</p>
                      <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{car.model}</p>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Year</p>
                      <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{car.year}</p>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>License Plate</p>
                      <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{car.licensePlate || 'N/A'}</p>
                    </div>
                  </div>
                  {car.vin && (
                    <div className="mt-2">
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>VIN</p>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{car.vin}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Repair History Tab */}
      {activeTab === 'repairs' && (
        <div className={`rounded-lg shadow-sm p-6 ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Repair History</h2>
          
          {repairs.length === 0 ? (
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No repairs yet</p>
          ) : (
            <div className="space-y-4">
              {repairs.map((repair) => (
                <div key={repair._id} className={`p-4 rounded border ${isDarkMode ? 'bg-[#27384a] border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Title</p>
                      <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{repair.title}</p>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                      <span className={`inline-block px-3 py-1 rounded text-xs font-bold capitalize ${
                        repair.status === 'completed' ? (isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') :
                        repair.status === 'in-progress' ? (isDarkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800') :
                        repair.status === 'pending' ? (isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800') :
                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {repair.status}
                      </span>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Priority</p>
                      <p className={`capitalize font-bold ${
                        repair.priority === 'high' ? 'text-red-500' :
                        repair.priority === 'medium' ? 'text-orange-500' :
                        'text-green-500'
                      }`}>{repair.priority}</p>
                    </div>
                  </div>

                  <div>
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Description</p>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{repair.description}</p>
                  </div>

                  {repair.assignedTo && (
                    <div className="mt-3">
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Assigned Mechanic</p>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {typeof repair.assignedTo === 'string' ? repair.assignedTo : repair.assignedTo?.name || 'Unknown'}
                      </p>
                    </div>
                  )}

                  {repair.reportDetails && (
                    <div className={`mt-3 p-3 rounded ${isDarkMode ? 'bg-[#1E2A38]' : 'bg-gray-100'}`}>
                      <p className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Mechanic Report</p>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{repair.reportDetails}</p>
                    </div>
                  )}

                  <div className="flex gap-4 text-xs mt-3">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Created: {new Date(repair.createdAt).toLocaleDateString()}
                    </span>
                    {repair.actualCompletionDate && (
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                        Completed: {new Date(repair.actualCompletionDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserDetailPage;
