import React, { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Mail, Phone } from "lucide-react";
import { getAllAppointments, cancelAppointment } from "../../../services/userService";
import { useUserTheme } from '../../../context/UserThemeContext';

const Appointments = () => {
  const { isDarkMode } = useUserTheme();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All Appointments');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await getAllAppointments();
        setAppointments(res.data || []);
      } catch (err) {
        console.error('Failed to load appointments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleCancel = async (appointmentId) => {
    try {
      await cancelAppointment(appointmentId);
      setAppointments(appointments.filter(a => a._id !== appointmentId));
    } catch (err) {
      console.error('Failed to cancel appointment', err);
    }
  };

  const filtered = appointments.filter(a => {
    if (filter === 'Upcoming') return a.status === 'pending';
    if (filter === 'Completed') return a.status === 'completed';
    if (filter === 'Cancelled') return a.status === 'cancelled';
    return true;
  });
  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-[#101828]' : 'bg-white'}`}>
      <div className={`p-6 max-w-5xl mx-auto font-sans`}>
      {/* Page Title */}
      <h1 className={`text-3xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Appointments</h1>
      <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage your service appointments</p>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {["All Appointments", "Upcoming", "Completed", "Cancelled"].map(
          (tab, index) => (
            <button
              key={index}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full border transition ${
                filter === tab
                  ? "bg-blue-600 text-white border-blue-600"
                  : isDarkMode ? "bg-[#1E2A38] text-gray-300 border-gray-700 hover:bg-[#27384a]" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8"><p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Loading appointments...</p></div>
        ) : filtered.length > 0 ? (
          filtered.map((apt) => (
            <div key={apt._id} className={`shadow rounded-xl p-5 border transition ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
              {/* Title Section */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{apt.serviceType || 'Service Request'}</h2>
                  <span className={`px-2 py-1 text-sm rounded-full inline-block mt-1 ${
                    apt.status === 'completed' ? isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600' :
                    apt.status === 'pending' ? isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600' :
                    isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'
                  }`}>
                    {apt.status}
                  </span>
                  <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{apt.carId?.model || 'Vehicle'}</p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-blue-600">${apt.estimatedCost || '0'}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Service request</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className={`p-4 rounded-lg mt-4 grid md:grid-cols-2 gap-4 ${isDarkMode ? 'bg-[#27384a]' : 'bg-gray-50'}`}>
                {/* Date */}
                <div className="flex items-start gap-3">
                  <CalendarDays className="text-blue-600 mt-1" />
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Date Created</p>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{new Date(apt.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="flex items-start gap-3">
                  <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Description</p>
                </div>
              </div>

              <div className={`p-3 rounded-lg text-sm mt-3 ${isDarkMode ? 'bg-[#27384a] text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
                {apt.description || 'No description provided'}
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-6 gap-3">
                {apt.status === 'pending' ? (
                  <>
                    <button className={`flex-grow text-white py-3 rounded-lg transition font-semibold ${
                      isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
                    }`}>
                      View Details
                    </button>
                    <button 
                      onClick={() => handleCancel(apt._id)}
                      className={`px-5 py-3 border rounded-lg transition font-semibold ${
                        isDarkMode ? 'bg-red-900/20 text-red-400 border-red-700 hover:bg-red-900/30' : 'bg-red-100 text-red-600 border-red-300 hover:bg-red-200'
                      }`}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className={`w-full text-white py-3 rounded-lg font-semibold ${isDarkMode ? 'bg-gray-700' : 'bg-gray-400'}`} disabled>
                    {apt.status}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8"><p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No appointments found</p></div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Appointments;
