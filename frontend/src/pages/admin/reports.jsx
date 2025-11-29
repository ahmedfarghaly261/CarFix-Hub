// // 1. Lucide Icons Imports
// import React, { useEffect, useState } from 'react';
// import { 
//   DollarSign, 
//   LineChart, 
//   Users, 
//   Wrench, 
//   Bell,
//   User,
//   Search,
//   LayoutDashboard
// } from 'lucide-react';

// // 2. Recharts Imports for the Charts
// import React, { useEffect, useState } from 'react';
// import { Search, Bell, User } from 'lucide-react';
// import {
//   LineChart as RechartsLineChart,
//   BarChart as RechartsBarChart,
//   Line,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';

// import { getSystemReports, getRevenueReport } from '../../services/adminService';

// const StatCard = ({ title, value, change }) => (
//   <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md w-full">
//     <div>
//       <h3 className="text-sm font-medium text-gray-500">{title}</h3>
//       <p className="text-2xl font-bold text-gray-900">{value}</p>
//       <p className={`text-sm font-medium ${change && change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{change}</p>
//     </div>
//   </div>
// );

// const RevenueChart = ({ data }) => (
//   <div className="p-6 bg-white rounded-xl shadow-md">
//     <h2 className="mb-4 text-xl font-semibold text-gray-800">Revenue Overview (Last 6 Months)</h2>
//     <div style={{ width: '100%', height: 300 }}>
//       <ResponsiveContainer>
//         <RechartsLineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
//           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
//           <XAxis dataKey="name" stroke="#a0a0a0" />
//           <YAxis stroke="#a0a0a0" />
//           <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
//           <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={false} />
//         </RechartsLineChart>
//       </ResponsiveContainer>
//     </div>
//   </div>
// );

// const BarChartComponent = ({ title, data, dataKey }) => (
//   <div className="p-6 bg-white rounded-xl shadow-md">
//     <h2 className="mb-4 text-xl font-semibold text-gray-800">{title}</h2>
//     <div style={{ width: '100%', height: 250 }}>
//       <ResponsiveContainer>
//         <RechartsBarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 5 }}>
//           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
//           <XAxis dataKey="name" stroke="#a0a0a0" />
//           <YAxis stroke="#a0a0a0" />
//           <Tooltip />
//           <Bar dataKey={dataKey} fill="#3B82F6" radius={[6, 6, 0, 0]} />
//         </RechartsBarChart>
//       </ResponsiveContainer>
//     </div>
//   </div>
// );

// export default function ReportsPage() {
//   const [reports, setReports] = useState(null);
//   const [revenueData, setRevenueData] = useState([]);
//   const [totalRevenue, setTotalRevenue] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let mounted = true;
//     const load = async () => {
//       setLoading(true);
//       try {
//         const sys = await getSystemReports();
//         if (mounted) setReports(sys.data || {});
//       } catch (e) {
//         console.error('getSystemReports failed', e);
//       }
//       try {
//         const rev = await getRevenueReport();
//         if (mounted) {
//           setRevenueData(rev.data?.monthly || []);
//           setTotalRevenue(rev.data?.totalRevenue || 0);
//         }
//       } catch (e) {
//         console.error('getRevenueReport failed', e);
//       }
//       if (mounted) setLoading(false);
//     };
//     load();
//     return () => { mounted = false; };
//   }, []);

//   const stats = [
//     { title: 'Total Revenue', value: `$${Number(totalRevenue).toLocaleString()}`, change: reports?.revenueChange },
//     { title: 'Total Bookings', value: reports?.totalBookings ?? '—', change: reports?.bookingsChange },
//     { title: 'Active Users', value: reports?.activeUsers ?? '—', change: reports?.usersChange },
//     { title: 'Mechanics', value: reports?.mechanics ?? '—', change: reports?.mechanicsChange },
//   ];

//   const revenueChartData = (revenueData && revenueData.length) ? revenueData : [
//     { name: 'Jan', revenue: 11000 },
//     { name: 'Feb', revenue: 14500 },
//     { name: 'Mar', revenue: 18000 },
//     { name: 'Apr', revenue: 16500 },
//     { name: 'May', revenue: 19000 },
//     { name: 'Jun', revenue: 20000 },
//   ];

//   const serviceUsageData = reports?.serviceUsage || [
//     { name: 'Service A', usage: 150 },
//     { name: 'Service B', usage: 120 },
//     { name: 'Service C', usage: 80 },
//   ];

//   const mechanicPerformanceData = reports?.mechanicPerformance || [
//     { name: 'Mech 1', performance: 75 },
//     { name: 'Mech 2', performance: 85 },
//     { name: 'Mech 3', performance: 60 },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100 font-sans">
//       <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="flex items-center space-x-4">
//           <Search className="w-5 h-5 text-gray-500" />
//           <div className="w-64 p-2 bg-gray-100 rounded-lg text-gray-500 text-sm">Search...</div>
//         </div>
//         <div className="flex items-center space-x-4">
//           <div className="relative cursor-pointer">
//             <Bell className="w-6 h-6 text-gray-500" />
//             <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">3</span>
//           </div>
//           <div className="text-right">
//             <p className="text-sm font-semibold text-gray-800">Admin User</p>
//             <p className="text-xs text-gray-500">admin@cartix.com</p>
//           </div>
//           <User className="w-10 h-10 p-1 bg-gray-200 rounded-full text-gray-500" />
//         </div>
//       </header>

//       <main className="p-6">
//         <section className="mb-8">
//           <h2 className="mb-4 text-lg font-semibold text-gray-700">Reports & Analytics</h2>
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
//             {stats.map((s, i) => (
//               <StatCard key={i} {...s} />
//             ))}
//           </div>
//         </section>

//         <section className="mb-8">
//           <RevenueChart data={revenueChartData} />
//           <div className="mt-2 text-sm text-gray-600">Total Revenue (API): ${Number(totalRevenue).toLocaleString()}</div>
//         </section>

//         <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//           <BarChartComponent title="Service Usage" data={serviceUsageData} dataKey="usage" />
//           <BarChartComponent title="Mechanic Performance" data={mechanicPerformanceData} dataKey="performance" />
//         </section>

//         <div className="p-6 space-y-10">
//           <div className="bg-white shadow rounded-xl p-4">
//             <h2 className="text-lg font-semibold mb-4">Top Performing Mechanics</h2>
//             <div className="space-y-3">
//               {(reports?.topMechanics || []).map((m, idx) => (
//                 <div key={idx} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
//                   <div className="flex items-center gap-4">
//                     <span className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full">{idx + 1}</span>
//                     <div>
//                       <div className="font-semibold">{m.name}</div>
//                       <div className="text-gray-500 text-sm">{m.jobs} jobs completed</div>
//                     </div>
//                   </div>
//                   <div className="text-gray-700">Rating <span className="font-semibold">{m.rating} / 5.0</span></div>
//                 </div>
//               ))}
//               {!reports?.topMechanics?.length && (
//                 <div className="text-sm text-gray-500">No mechanic data available.</div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>);
  

          
//           </section>}
//         {/* --- REVENUE OVERVIEW CHART --- */}
//             <RevenueChart />
//             <div className="mt-2 text-sm text-gray-600">Total Revenue (API): ${revenue.toLocaleString()}</div>
//           <RevenueChart />
//         </section>

//         {/* --- SERVICE USAGE & MECHANIC PERFORMANCE CHARTS --- */}
//         <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//             <BarChartComponent 
//                 title="Service Usage" 
//                 data={serviceUsageData} 
//                 dataKey="usage" 
//                 yAxisLabel={160}
//             />

//             <BarChartComponent 
//                 title="Mechanic Performance" 
//                 data={mechanicPerformanceData} 
//                 dataKey="performance" 
//                 yAxisLabel={80}
//             />
//         </section>
//           return (
//     <div className="p-6 space-y-10">

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//         {/* Service Usage Chart */}
//         <div className="bg-white shadow rounded-xl p-4">
//           <h2 className="text-lg font-semibold mb-3">Service Usage</h2>
//           <Bar data={serviceData} />
//         </div>

//         {/* Mechanic Performance Chart */}
//         <div className="bg-white shadow rounded-xl p-4">
//           <h2 className="text-lg font-semibold mb-3">Mechanic Performance</h2>
//           <Bar data={mechanicData} />
//         </div>
//       </div>

//       {/* Top Mechanics List */}
//       <div className="bg-white shadow rounded-xl p-4">
//         <h2 className="text-lg font-semibold mb-4">Top Performing Mechanics</h2>

//         <div className="space-y-3">
//           {mechanics.map((m, index) => (
//             <div
//               key={index}
//               className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
//             >
//               <div className="flex items-center gap-4">
//                 <span className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full">
//                   {index + 1}
//                 </span>

//                 <div>
//                   <div className="font-semibold">{m.name}</div>
//                   <div className="text-gray-500 text-sm">{m.jobs} jobs completed</div>
//                 </div>
//               </div>

//               <div className="text-gray-700">
//                 Rating <span className="font-semibold">{m.rating} / 5.0</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//     </div>
//       </main>
//     </div>
//   );
// };

// export default ReportsPage;
