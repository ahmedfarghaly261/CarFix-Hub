import React, { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Mail, Phone } from "lucide-react";
import { getAllAppointments, cancelAppointment } from "../../../services/userService";

const Appointments = () => {
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
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Appointments</h1>
      <div className="p-6 max-w-5xl mx-auto font-sans">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold">My Appointments</h1>
      <p className="text-gray-500 mb-6">Manage your service appointments</p>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {["All Appointments", "Upcoming", "Completed", "Cancelled"].map(
          (tab, index) => (
            <button
              key={index}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full border ${
                filter === tab
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300"
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
          <div className="text-center py-8"><p className="text-gray-500">Loading appointments...</p></div>
        ) : filtered.length > 0 ? (
          filtered.map((apt) => (
            <div key={apt._id} className="bg-white shadow rounded-xl p-5 border">
              {/* Title Section */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{apt.serviceType || 'Service Request'}</h2>
                  <span className={`px-2 py-1 text-sm rounded-full ${
                    apt.status === 'completed' ? 'bg-green-100 text-green-600' :
                    apt.status === 'pending' ? 'bg-blue-100 text-blue-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {apt.status}
                  </span>
                  <p className="text-gray-500 mt-1">{apt.carId?.model || 'Vehicle'}</p>
                </div>

                <div className="text-right">
                  <p className="text-blue-600 font-semibold">${apt.estimatedCost || '0'}</p>
                  <p className="text-gray-400 text-sm">Service request</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="bg-gray-50 p-4 rounded-lg mt-4 grid md:grid-cols-2 gap-4">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <CalendarDays className="text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">Date Created</p>
                    <p className="text-gray-600">{new Date(apt.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="flex items-start gap-3">
                  <p className="font-medium">Description</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg text-sm mt-3">
                {apt.description || 'No description provided'}
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-6 gap-3">
                {apt.status === 'pending' ? (
                  <>
                    <button className="flex-grow bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                      View Details
                    </button>
                    <button 
                      onClick={() => handleCancel(apt._id)}
                      className="px-5 py-3 bg-red-100 text-red-600 border border-red-300 rounded-lg hover:bg-red-200"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className="w-full bg-gray-400 text-white py-3 rounded-lg" disabled>
                    {apt.status}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8"><p className="text-gray-500">No appointments found</p></div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Appointments;
