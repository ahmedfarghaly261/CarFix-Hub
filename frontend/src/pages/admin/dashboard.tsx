import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Wrench, CalendarDays, CheckCircle } from "lucide-react";
import { useAdminTheme } from "../../context/AdminThemeContext";
import { getAdminDashboard, getAllBookings } from '../../services/adminService';

const AdminDashboardPage = () => {
  const { isDarkMode } = useAdminTheme();
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
    <div className={`p-6 min-h-screen transition-colors ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`flex items-center justify-between p-4 rounded-lg shadow-sm border transition-colors ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Users</p>
            <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{counts.totalUsers}</h2>
          </div>
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
            <Users size={24} />
          </div>
        </div>

        <div className={`flex items-center justify-between p-4 rounded-lg shadow-sm border transition-colors ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Mechanics</p>
            <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{counts.totalMechanics}</h2>
          </div>
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-600'}`}>
            <Wrench size={24} />
          </div>
        </div>

        <div className={`flex items-center justify-between p-4 rounded-lg shadow-sm border transition-colors ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active Bookings</p>
            <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{counts.totalRequests}</h2>
          </div>
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
            <CalendarDays size={24} />
          </div>
        </div>

        <div className={`flex items-center justify-between p-4 rounded-lg shadow-sm border transition-colors ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Completed Services</p>
            <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{counts.completedRequests}</h2>
          </div>
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600'}`}>
            <CheckCircle size={24} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart */}
        <div className={`p-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Booking Status Distribution</h3>
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
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className={`p-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Monthly Bookings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="month" stroke={isDarkMode ? '#4B5563' : '#9CA3AF'} />
              <YAxis stroke={isDarkMode ? '#4B5563' : '#9CA3AF'} />
              <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#27384a' : '#ffffff', border: `1px solid ${isDarkMode ? '#4B5563' : '#e5e7eb'}` }} />
              <Bar dataKey="bookings" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className={`rounded-lg shadow-sm border p-6 ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
        <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Bookings</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Customer Name</th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Car Model</th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Service Type</th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr
                  key={booking._id || index}
                  className={`border-b transition-colors ${isDarkMode ? 'border-gray-700 hover:bg-[#27384a]' : 'border-gray-100 hover:bg-gray-50'}`}
                >
                  <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{booking.userId?.name || booking.customer || '—'}</td>
                  <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{booking.carId ? `${booking.carId.make} ${booking.carId.model} ${booking.carId.year}` : '—'}</td>
                  <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{booking.title || booking.service || '—'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[booking.status?.toLowerCase()] || (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700')}`}
                    >
                      {booking.status || '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No bookings found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
