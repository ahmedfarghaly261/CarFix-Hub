
import React, { useEffect, useState } from 'react';
import { FaEye, FaTrashAlt, FaSearch } from 'react-icons/fa';
import { getAllUsers, deleteUser } from '../../services/adminService';

function UsersPage() {
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
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Users</h2>
      <div className="bg-white p-4 rounded shadow">Users management</div>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>

        <div className="p-6 mt-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">All Users</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
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
                    <tr key={user._id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-semibold text-gray-700 bg-gray-100 rounded-full">
                          {user.bookings || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button className="flex items-center justify-center px-3 py-2 text-xs font-bold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
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
