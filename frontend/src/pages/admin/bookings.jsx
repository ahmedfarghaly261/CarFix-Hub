import React from 'react';
import {
  Search,
  ShoppingCart,
  UserCircle,
  ChevronDown,
  SquarePen
} from 'lucide-react';

// --- Mock Data ---
// This data array mimics the content shown in the image.
const bookingsData = [
  { id: '#1024', customer: 'John Smith', car: 'Toyota Camry 2020', serviceType: 'Oil Change', assignedMechanic: 'Tom Wilson', date: '2025-10-20', status: 'Completed' },
  { id: '#1025', customer: 'Sarah Johnson', car: 'Honda Accord 2019', serviceType: 'Brake Repair', assignedMechanic: 'Sarah Lee', date: '2025-10-18', status: 'In Progress' },
  { id: '#1026', customer: 'Mike Williams', car: 'Ford F-150 2021', serviceType: 'Tire Replacement', assignedMechanic: 'Not Assigned', date: '2025-10-22', status: 'Pending' },
  { id: '#1027', customer: 'Emily Davis', car: 'BMW X5 2022', serviceType: 'Engine Diagnostic', assignedMechanic: 'James Martinez', date: '2025-10-19', status: 'In Progress' },
  { id: '#1028', customer: 'David Brown', car: 'Tesla Model 3 2023', serviceType: 'Battery Check', assignedMechanic: 'Linda Garcia', date: '2025-10-15', status: 'Completed' },
];

// Helper object for styling status badges
const statusClasses = {
  Completed: 'bg-green-100 text-green-700',
  'In Progress': 'bg-amber-100 text-amber-700',
  Pending: 'bg-blue-100 text-blue-700',
};

// --- Single BookingsPage Component ---
export default function BookingsPage() {
  return (
    // Main container with light gray background
    <div className="min-h-screen ">
      
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
                  placeholder="Search..."
                  className="bg-gray-100 rounded-md py-2 pl-10 pr-4 block w-full sm:text-sm border-transparent focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Right Side Icons & User */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  2
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <div className="font-medium text-gray-800">Admin User</div>
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
            Bookings Management
          </h1>
          <button className="flex items-center space-x-2 bg-white px-4 py-2 rounded-md border border-gray-300 shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
            <span>All Bookings</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* --- Bookings Table Card --- */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">All Bookings</h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['ID', 'Customer', 'Car', 'Service Type', 'Assigned Mechanic', 'Date', 'Status', 'Actions'].map((header) => (
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
                {bookingsData.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.car}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.serviceType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.assignedMechanic}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      
                      {/* --- Inlined Status Badge --- */}
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          statusClasses[booking.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-900">
                        <SquarePen className="h-4 w-4" />
                        <span>Update Status</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}