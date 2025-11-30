
import React, { useEffect, useState } from 'react';
import { FaEye, FaTrashAlt, FaSearch } from 'react-icons/fa';
import { useAdminTheme } from '../../context/AdminThemeContext';
import { getAllUsers, deleteUser } from '../../services/adminService';

function UsersPage() {
  const { isDarkMode } = useAdminTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await getAllUsers();
        setUsers(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      setUsers((s) => s.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className={`p-6 min-h-screen transition-colors ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      <div className={`p-4 rounded shadow transition-colors ${isDarkMode ? 'bg-[#1E2A38] text-white' : 'bg-white'}`}>Users management</div>
      <div>

        <div className={`p-6 mt-6 border rounded-xl shadow-sm transition-colors ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>All Users</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className={`w-full py-2 pl-10 pr-4 rounded-lg sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-[#27384a] text-white border-gray-600' : 'bg-white text-gray-700 border-gray-300'} border`}
              />
            </div>
          </div>

          {loading ? (
            <div className={isDarkMode ? 'text-gray-400' : ''}>Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className={`min-w-full text-sm text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                <thead className={`text-xs uppercase ${isDarkMode ? 'text-gray-300 bg-[#27384a]' : 'text-gray-700 bg-gray-50'}`}>
                  <tr>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Email</th>
                    <th scope="col" className="px-6 py-3">Phone</th>
                    <th scope="col" className="px-6 py-3">Number of Bookings</th>
                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className={`border-b ${isDarkMode ? 'bg-[#1E2A38] border-gray-700 hover:bg-[#27384a]' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                      <td className={`px-6 py-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</td>
                      <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-300' : ''}`}>{user.email}</td>
                      <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-300' : ''}`}>{user.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center justify-center px-3 py-1 text-sm font-semibold rounded-full ${isDarkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-700 bg-gray-100'}`}>
                          {user.bookings || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button className={`flex items-center justify-center px-3 py-2 text-xs font-bold rounded-md ${isDarkMode ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}>
                            <FaEye className="mr-1" /> View
                          </button>
                          <button onClick={() => handleDelete(user._id)} className="flex items-center justify-center px-3 py-2 text-xs font-bold text-white bg-red-500 rounded-md hover:bg-red-600">
                            <FaTrashAlt className="mr-1" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UsersPage;
