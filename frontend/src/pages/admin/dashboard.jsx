import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Wrench, CalendarDays, CheckCircle } from "lucide-react";
import { getAdminDashboard, getAllBookings } from '../../services/adminService';

const AdminDashboardPage = () => {
  const [pieData, setPieData] = useState([
    { name: "Completed", value: 0, color: "#10B981" },
    { name: "In Progress", value: 0, color: "#F97316" },
    { name: "Pending", value: 0, color: "#3B82F6" },
    { name: "Cancelled", value: 0, color: "#EF4444" },
  ]);

  const [barData, setBarData] = useState([
    { month: "Jan", bookings: 0 },
    { month: "Feb", bookings: 0 },
    { month: "Mar", bookings: 0 },
    { month: "Apr", bookings: 0 },
    { month: "May", bookings: 0 },
    { month: "Jun", bookings: 0 },
  ]);

  const [bookings, setBookings] = useState([]);
  const [counts, setCounts] = useState({
    totalUsers: 0,
    totalMechanics: 0,
    totalRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAdminDashboard();
        const d = res.data || {};
        setCounts(d);

        // Build pie data from counts
        setPieData([
          { name: 'Completed', value: d.completedRequests || 0, color: '#10B981' },
          { name: 'In Progress', value: d.inProgressRequests || 0, color: '#F97316' },
          { name: 'Pending', value: d.pendingRequests || 0, color: '#3B82F6' },
          { name: 'Cancelled', value: 0, color: '#EF4444' },
        ]);

        // Fetch recent bookings
        const bRes = await getAllBookings({ limit: 10 });
        setBookings(bRes.data || []);
      } catch (err) {
        console.error('Admin dashboard load error', err);
      }
    };
    fetchData();
  }, []);

  const statusColor = {
    completed: "bg-green-100 text-green-700",
    "in-progress": "bg-orange-100 text-orange-700",
    pending: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Users</p>
            <h2 className="text-3xl font-bold text-gray-900">{counts.totalUsers}</h2>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <Users size={24} />
          </div>
        </div>

        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Mechanics</p>
            <h2 className="text-3xl font-bold text-gray-900">{counts.totalMechanics}</h2>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
            <Wrench size={24} />
          </div>
        </div>

        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div>
            <p className="text-gray-500 text-sm font-medium">Active Bookings</p>
            <h2 className="text-3xl font-bold text-gray-900">{counts.totalRequests}</h2>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
            <CalendarDays size={24} />
          </div>
        </div>

        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div>
            <p className="text-gray-500 text-sm font-medium">Completed Services</p>
            <h2 className="text-3xl font-bold text-gray-900">{counts.completedRequests}</h2>
          </div>
          <div className="bg-green-100 p-3 rounded-lg text-green-600">
            <CheckCircle size={24} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Booking Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name} ${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="flex justify-center gap-4 text-sm mt-4 flex-wrap">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span className="text-gray-700">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Monthly Bookings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Bar dataKey="bookings" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Bookings</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Car Model</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Service Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr
                  key={booking._id || index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">{booking.userId?.name || booking.customer || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{booking.carId ? `${booking.carId.make} ${booking.carId.model} ${booking.carId.year}` : '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{booking.title || booking.service || '—'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[booking.status?.toLowerCase()] || 'bg-gray-100 text-gray-700'}`}
                    >
                      {booking.status || '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">No bookings found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
