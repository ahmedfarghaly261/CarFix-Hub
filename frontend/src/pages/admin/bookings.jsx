import React, { useEffect, useState } from 'react';
import {
  Search,
  ShoppingCart,
  UserCircle,
  ChevronDown,
  SquarePen,
  Users,
  AlertCircle,
  Check,
  X
} from 'lucide-react';

import { getAllBookings, updateBooking, assignMechanic, getMechanics } from '../../services/adminService';

// Helper object for styling status badges
const statusClasses = {
  'completed': 'bg-green-100 text-green-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  'assigned': 'bg-blue-100 text-blue-700',
  'pending': 'bg-yellow-100 text-yellow-700',
  'cancelled': 'bg-red-100 text-red-700',
};

// --- Bookings Page Component ---
export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [filterStatus, setFilterStatus] = useState('pending');

  useEffect(() => {
    fetchBookings();
    fetchMechanics();
  }, [filterStatus]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getAllBookings();
      // Filter by status if needed
      const filtered = filterStatus ? res.data.filter(b => b.status === filterStatus) : res.data;
      setBookings(filtered || []);
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMechanics = async () => {
    try {
      const res = await getMechanics();
      setMechanics(res.data || []);
    } catch (err) {
      console.error('Failed to load mechanics', err);
    }
  };

  const handleAssignMechanic = async () => {
    if (!selectedMechanic || !selectedBooking) {
      alert('Please select a mechanic');
      return;
    }

    try {
      const res = await assignMechanic(selectedBooking._id, { mechanicId: selectedMechanic });
      // Update local state
      setBookings(bookings.map(b => b._id === selectedBooking._id ? res.data : b));
      setShowAssignModal(false);
      setSelectedBooking(null);
      setSelectedMechanic(null);
      alert('Mechanic assigned successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign mechanic');
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await updateBooking(bookingId, { status: newStatus });
      setBookings(bookings.map(b => b._id === bookingId ? res.data : b));
      alert('Status updated!');
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };
  return (
    // Main container with light gray background
    <div className="min-h-screen bg-gray-50">
      
      {/* --- App Header --- */}
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Search Bar */}
            <div className="flex-shrink-0 flex items-center">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="bg-gray-100 rounded-md py-2 pl-10 pr-4 block w-full sm:text-sm border-transparent focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Right Side Icons & User */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-500 hover:text-gray-700" />
              </div>
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <div className="font-medium text-gray-800">Admin</div>
                  <div className="text-sm text-gray-500">admin@carfix.com</div>
                </div>
                <UserCircle className="h-10 w-10 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="p-6 sm:p-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Appointment Requests
          </h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filterStatus === 'pending' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}>
              Pending
            </button>
            <button 
              onClick={() => setFilterStatus('assigned')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filterStatus === 'assigned' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}>
              Assigned
            </button>
            <button 
              onClick={() => setFilterStatus('')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filterStatus === '' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}>
              All
            </button>
          </div>
        </div>

        {/* --- Bookings Table Card --- */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <AlertCircle className="text-blue-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-800">
              {filterStatus === 'pending' ? 'Pending Appointments' : 'All Appointments'}
            </h2>
            <span className="ml-auto bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {bookings.length} {filterStatus === 'pending' ? 'pending' : 'total'}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['ID', 'Customer', 'Vehicle', 'Service', 'Date & Time', 'Status', 'Mechanic', 'Actions'].map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={8} className="px-6 py-4 text-center text-gray-500">Loading...</td></tr>
                ) : bookings.length === 0 ? (
                  <tr><td colSpan={8} className="px-6 py-4 text-center text-gray-500">No appointments found</td></tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{booking._id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div>
                          <p className="font-medium">{booking.userId?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{booking.userId?.email || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div>
                          <p className="font-medium">
                            {booking.carId?.year} {booking.carId?.make} {booking.carId?.model}
                          </p>
                          <p className="text-xs text-gray-500">{booking.carId?.licensePlate || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {booking.serviceType || booking.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {booking.requestedDate ? new Date(booking.requestedDate).toLocaleString() : 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusClasses[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                          {booking.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {booking.assignedTo?.name || (
                          <span className="text-gray-400">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowAssignModal(true);
                              }}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded"
                            >
                              <Users size={16} />
                              Assign
                            </button>
                          </>
                        )}
                        {booking.status !== 'completed' && (
                          <button
                            onClick={() => handleUpdateStatus(booking._id, 'completed')}
                            className="flex items-center gap-1 text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded"
                          >
                            <Check size={16} />
                            Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Assign Mechanic Modal */}
      {showAssignModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Assign Mechanic to {selectedBooking.serviceType || selectedBooking.title}
            </h2>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">
                Customer: <span className="font-medium">{selectedBooking.userId?.name}</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Vehicle: <span className="font-medium">
                  {selectedBooking.carId?.year} {selectedBooking.carId?.make} {selectedBooking.carId?.model}
                </span>
              </p>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Mechanic
              </label>
              <select
                value={selectedMechanic || ''}
                onChange={(e) => setSelectedMechanic(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a mechanic...</option>
                {mechanics.map(mech => (
                  <option key={mech._id} value={mech._id}>
                    {mech.name} {mech.specializations ? `- ${mech.specializations.join(', ')}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedBooking(null);
                  setSelectedMechanic(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignMechanic}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}