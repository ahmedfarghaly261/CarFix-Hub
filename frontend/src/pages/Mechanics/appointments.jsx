import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMechanicsTheme } from '../../context/MechanicsThemeContext';
import { getUserAppointments, updateAppointmentStatus } from '../../services/appointmentService';

export default function MechanicsAppointmentsPage() {
  const { user } = useAuth();
  const { isDarkMode } = useMechanicsTheme();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await getUserAppointments();
        
        // Filter for pending appointments only
        const pendingAppointments = response.data
          .filter(apt => apt.status === 'pending')
          .map(apt => ({
            id: apt._id,
            customer: apt.userId?.name || 'Unknown',
            car: apt.carId ? `${apt.carId.year} ${apt.carId.make} ${apt.carId.model}` : 'Unknown',
            service: apt.title,
            date: apt.requestedDate || 'Not set',
            time: 'TBD',
            phone: apt.userId?.phone || 'N/A',
            description: apt.description,
            priority: apt.priority
          }));
        
        setAppointments(pendingAppointments);
        setError(null);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments');
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const handleConfirm = async (appointmentId) => {
    try {
      await updateAppointmentStatus(appointmentId, 'assigned');
      setAppointments(appointments.filter(apt => apt.id !== appointmentId));
    } catch (err) {
      console.error('Error confirming appointment:', err);
      alert('Failed to confirm appointment');
    }
  };

  const handleDecline = async (appointmentId) => {
    try {
      await updateAppointmentStatus(appointmentId, 'cancelled');
      setAppointments(appointments.filter(apt => apt.id !== appointmentId));
    } catch (err) {
      console.error('Error declining appointment:', err);
      alert('Failed to decline appointment');
    }
  };

  return (
    <div className={`pt-6 px-6 max-w-6xl transition-colors duration-300 ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Appointments</h1>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Your scheduled appointments</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading appointments...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className={`border px-4 py-3 rounded mb-6 ${isDarkMode ? 'bg-red-900 border-red-700 text-red-100' : 'bg-red-100 border-red-300 text-red-800'}`}>
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && appointments.length === 0 && (
        <div className="text-center py-12">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No pending appointments</p>
        </div>
      )}

      {/* Appointments Table */}
      {!loading && appointments.length > 0 && (
        <div className={`rounded-lg shadow border overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
          <table className="w-full">
            <thead className={`border-b transition-colors duration-300 ${isDarkMode ? 'bg-[#27384a] border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Customer</th>
                <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Vehicle</th>
                <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Service</th>
                <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Date & Time</th>
                <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Contact</th>
                <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {appointments.map((apt) => (
                <tr key={apt.id} className={`transition-colors ${isDarkMode ? 'hover:bg-[#27384a]' : 'hover:bg-gray-50'}`}>
                  <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{apt.customer}</td>
                  <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{apt.car}</td>
                  <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{apt.service}</td>
                  <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{apt.date} at {apt.time}</td>
                  <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{apt.phone}</td>
                  <td className="px-6 py-4 text-sm">
                    <button 
                      onClick={() => handleConfirm(apt.id)}
                      className={`transition mr-4 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                      Confirm
                    </button>
                    <button 
                      onClick={() => handleDecline(apt.id)}
                      className={`transition ${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}>
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
