
import { FaEye, FaTrashAlt, FaSearch } from 'react-icons/fa';
function UsersPage() {
    const users = [
  { name: 'John Smith', email: 'john.smith@email.com', phone: '+1 234-567-8901', bookings: 12 },
  { name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1 234-567-8902', bookings: 8 },
  { name: 'Mike Williams', email: 'mike.w@email.com', phone: '+1 234-567-8903', bookings: 15 },
  { name: 'Emily Davis', email: 'emily.d@email.com', phone: '+1 234-567-8904', bookings: 5 },
  { name: 'David Brown', email: 'david.b@email.com', phone: '+1 234-567-8905', bookings: 20 },
  { name: 'Lisa Anderson', email: 'lisa.a@email.com', phone: '+1 234-567-8906', bookings: 10 },
];
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
          {users.map((user, index) => (
            <tr key={index} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user.phone}</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-semibold text-gray-700 bg-gray-100 rounded-full">
                  {user.bookings}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center space-x-2">
                  <button className="flex items-center justify-center px-3 py-2 text-xs font-bold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                    <FaEye className="mr-1" /> View
                  </button>
                  <button className="flex items-center justify-center px-3 py-2 text-xs font-bold text-white bg-red-500 rounded-md hover:bg-red-600">
                    <FaTrashAlt className="mr-1" /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>      </div>
    </div>
    </div>
  );
};

export default UsersPage;
