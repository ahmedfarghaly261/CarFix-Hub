import React from "react";
import { Bell } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Wrench, CalendarDays, CheckCircle,  } from "lucide-react";

const AdminDashboardPage = () => {
 const pieData = [
    { name: "Completed", value: 52, color: "#10B981" },
    { name: "In Progress", value: 29, color: "#F97316" },
    { name: "Pending", value: 15, color: "#3B82F6" },
    { name: "Cancelled", value: 4, color: "#EF4444" },
  ];

  const barData = [
    { month: "Jan", bookings: 65 },
    { month: "Feb", bookings: 80 },
    { month: "Mar", bookings: 95 },
    { month: "Apr", bookings: 85 },
    { month: "May", bookings: 100 },
    { month: "Jun", bookings: 110 },
  ];

  const bookings = [
  {
    customer: "John Smith",
    carModel: "Toyota Camry 2020",
    service: "Oil Change",
    status: "Completed",
  },
  {
    customer: "Sarah Johnson",
    carModel: "Honda Accord 2019",
    service: "Brake Repair",
    status: "In Progress",
  },
  {
    customer: "Mike Williams",
    carModel: "Ford F-150 2021",
    service: "Tire Replacement",
    status: "Pending",
  },
  {
    customer: "Emily Davis",
    carModel: "BMW X5 2022",
    service: "Engine Diagnostic",
    status: "Completed",
  },
  {
    customer: "David Brown",
    carModel: "Tesla Model 3 2023",
    service: "Battery Check",
    status: "In Progress",
  },
];
const statusColor = {
  Completed: "bg-green-100 text-green-700",
  "In Progress": "bg-orange-100 text-orange-700",
  Pending: "bg-blue-100 text-blue-700",
  Cancelled: "bg-red-100 text-red-700",
};
  return (
    <div className="p-6">
   
<div className="flex flex-col w-full text-white min-h-screen bg-[#101828]">
      {/* Header */}
      <header className="flex justify-between items-center bg-[#101828] text-white shadow-sm p-4">
        <input
          type="text"
          placeholder="🔍 Search..."
          className="w-1/3 p-2 rounded-md border border-gray-200 focus:outline-none focus:ring focus:ring-blue-200"
        />
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="text-gray-500" size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">3</span>
          </div>
          <div className="flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
              alt="Admin"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="font-semibold text-gray-700 text-sm">Admin User</p>
              <p className="text-xs text-gray-500">admin@carfix.com</p>
            </div>
          </div>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4 p-6">
        <div className="flex items-center justify-between bg-[#122e60] p-4 rounded-lg shadow-sm">
          <div>
            <p className="text-gray-600 text-sm">Total Users</p>
            <h2 className="text-2xl font-semibold">1,248</h2>
          </div>
          <div className="bg-blue-600 p-3 rounded-lg text-white">
            <Users size={22} />
          </div>
        </div>

        <div className="flex items-center justify-between bg-[#122e60] p-4 rounded-lg shadow-sm">
          <div>
            <p className="text-gray-600 text-sm">Total Mechanics</p>
            <h2 className="text-2xl font-semibold">42</h2>
          </div>
          <div className="bg-orange-500 p-3 rounded-lg text-white">
            <Wrench size={22} />
          </div>
        </div>

        <div className="flex items-center justify-between bg-[#122e60] p-4 rounded-lg shadow-sm">
          <div>
            <p className="text-gray-600 text-sm">Active Bookings</p>
            <h2 className="text-2xl font-semibold">87</h2>
          </div>
          <div className="bg-purple-500 p-3 rounded-lg text-white">
            <CalendarDays size={22} />
          </div>
        </div>

        <div className="flex items-center justify-between bg-[#122e60] p-4 rounded-lg shadow-sm">
          <div>
            <p className="text-gray-600 text-sm">Completed Services</p>
            <h2 className="text-2xl font-semibold">3,456</h2>
          </div>
          <div className="bg-green-500 p-3 rounded-lg text-white">
            <CheckCircle size={22} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-4 p-6">
        {/* Pie Chart */}
        <div className="bg-[#122e60] p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">Booking Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name} ${value}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="flex justify-center gap-4 text-sm mt-2">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-[#101828] p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">Monthly Bookings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
     <div className="bg-[#12254a] text-white rounded-lg shadow-sm p-6 mt-4">
      <h3 className="font-semibold mb-4 text-gray-700">Recent Bookings</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-gray-600 text-sm border-b">
              <th className="pb-2">Customer Name</th>
              <th className="pb-2">Car Model</th>
              <th className="pb-2">Service Type</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr
                key={index}
                className="border-t border-gray-100 hover:bg-[#123e96] transition-all"
              >
                <td className="py-2">{booking.customer}</td>
                <td className="py-2">{booking.carModel}</td>
                <td className="py-2">{booking.service}</td>
                <td className="py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default AdminDashboardPage;
