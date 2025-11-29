
import { 
  FaSearch, 
  FaRegBell, 
  FaPlus, 
  FaEdit, 
  FaTrashAlt, 
  FaCheck, 
  FaChevronDown,
  FaTimes 
} from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { getAllMechanics, createMechanic, updateMechanic, deleteMechanic, getAllBookings, assignMechanic } from '../../services/adminService';

function MechanicsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    yearsOfExperience: '',
    specialization: '',
    phone: '',
    email: ''
  });
  const [mechanicsData, setMechanicsData] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getAllMechanics();
        setMechanicsData(res.data || []);
        const bRes = await getAllBookings({ limit: 10 });
        setBookingsList(bRes.data || []);
      } catch (err) {
        console.error('Failed to load mechanics or bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);
  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Mechanics Management
              </h2>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search mechanics..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <FaPlus className="mr-2 h-5 w-5" />
                Add Mechanic
              </button>
            </div>
          </div>
        </div>
      </header>

        {/* Add Mechanic Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Add New Mechanic</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={24} />
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                try {
                  const createRes = createMechanic({
                    name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    yearsOfExperience: formData.yearsOfExperience,
                    specialization: formData.specialization
                  });
                  setMechanicsData((s) => [createRes.data, ...s]);
                } catch (err) {
                  alert(err.response?.data?.message || 'Create failed');
                }
                setIsModalOpen(false);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={formData.yearsOfExperience}
                      onChange={(e) => setFormData({...formData, yearsOfExperience: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization
                    </label>
                    <select
                      value={formData.specialization}
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Specialization</option>
                      <option value="Engine Specialist">Engine Specialist</option>
                      <option value="Brake Systems">Brake Systems</option>
                      <option value="Electrical Systems">Electrical Systems</option>
                      <option value="Transmission">Transmission</option>
                      <option value="General Mechanic">General Mechanic</option>
                      <option value="Diagnostics">Diagnostics</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Add Mechanic
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mechanicsData.map((mechanic) => (
                <tr key={mechanic._id || mechanic.name} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xl font-medium text-gray-600">
                          {mechanic.name?.charAt(0) || '-'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{mechanic.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{mechanic.specialization}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{mechanic.experience}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(mechanic.status)}`}>
                      {mechanic.status}
                    </span>
                  </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {mechanic.status === 'Pending' && (
                        <button onClick={async () => {
                          try {
                            const res = await updateMechanic(mechanic._id, { status: 'Active' });
                            setMechanicsData((s) => s.map(m => m._id === mechanic._id ? res.data : m));
                          } catch (err) {
                            alert(err.response?.data?.message || 'Update failed');
                          }
                        }} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                          <FaCheck className="mr-1" /> Approve
                        </button>
                      )}
                      <button onClick={async () => {
                        // placeholder for edit
                        const newName = prompt('Edit mechanic name', mechanic.name);
                        if (!newName) return;
                        try {
                          const res = await updateMechanic(mechanic._id, { name: newName });
                          setMechanicsData((s) => s.map(m => m._id === mechanic._id ? res.data : m));
                        } catch (err) {
                          alert(err.response?.data?.message || 'Edit failed');
                        }
                      }} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <FaEdit className="mr-1" /> Edit
                      </button>
                      <button onClick={async () => {
                        if (!confirm('Delete this mechanic?')) return;
                        try {
                          await deleteMechanic(mechanic._id);
                          setMechanicsData((s) => s.filter(m => m._id !== mechanic._id));
                        } catch (err) {
                          alert(err.response?.data?.message || 'Delete failed');
                        }
                      }} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        <FaTrashAlt className="mr-1" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>


    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden p-6">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Assign Mechanic to Booking</h2>
          <p className="mt-1 text-sm text-gray-500">Select a booking and mechanic to create an assignment</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Select Booking Dropdown */}
          <div className="md:col-span-1">
            <label htmlFor="booking" className="block text-sm font-medium text-gray-700 mb-1">
              Select Booking
            </label>
            <div className="relative">
              <select
                id="booking"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Choose booking</option>
                {bookingsList.map((b) => (
                  <option key={b._id} value={b._id}>{`#${b._id.slice(-6)} - ${b.userId?.name || b.userId?.email || 'Customer'}`}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FaChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Select Mechanic Dropdown */}
          <div className="md:col-span-1">
            <label htmlFor="mechanic" className="block text-sm font-medium text-gray-700 mb-1">
              Select Mechanic
            </label>
            <div className="relative">
              <select
                id="mechanic"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Choose mechanic</option>
                {mechanicsData
                  .filter(m => m.status === 'Active')
                  .map((mechanic) => (
                    <option key={mechanic._id} value={mechanic._id}>
                      {mechanic.name} - {mechanic.specialization}
                    </option>
                  ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FaChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Assign Button */}
          <div className="md:col-span-1 flex items-end">
            <button onClick={async () => {
              const bookingId = document.getElementById('booking')?.value;
              const mechanicId = document.getElementById('mechanic')?.value;
              if (!bookingId || !mechanicId) return alert('Select booking and mechanic');
              try {
                await assignMechanic(bookingId, { mechanicId });
                alert('Assigned');
              } catch (err) {
                alert(err.response?.data?.message || 'Assign failed');
              }
            }} className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <FaCheck className="mr-2 h-4 w-4" />
              Assign Mechanic
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default MechanicsPage;
