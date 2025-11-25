// 1. Lucide Icons Imports
import { 
DollarSign, 
LineChart, 
Users, 
Wrench, 
Bell,
User,
Search,
LayoutDashboard
} from 'lucide-react';

// 2. Recharts Imports for the Charts
import { 
LineChart as RechartsLineChart, 
BarChart as RechartsBarChart, 
Line, 
Bar, 
XAxis, 
YAxis, 
CartesianGrid, 
Tooltip, 
ResponsiveContainer 
} from 'recharts';

// --- DATA ---
const statData = [
  // Mapped to Lucide Icons
  { title: "Total Revenue", value: "$103,500", change: "+12.5%", icon: DollarSign, bgColor: "bg-green-500" },
  { title: "Monthly Growth", value: "18.2%", change: "+3.1%", icon: LineChart, bgColor: "bg-blue-500" },
  { title: "Active Customers", value: "1,248", change: "+8.3%", icon: Users, bgColor: "bg-purple-500" },
  { title: "Mechanic Efficiency", value: "94.2%", change: "+2.1%", icon: Wrench, bgColor: "bg-orange-500" },
];

const revenueChartData = [
  { name: 'Jan', revenue: 11000 },
  { name: 'Feb', revenue: 14500 },
  { name: 'Mar', revenue: 18000 },
  { name: 'Apr', revenue: 16500 },
  { name: 'May', revenue: 19000 },
  { name: 'Jun', revenue: 20000 },
];

const serviceUsageData = [
    { name: 'Service A', usage: 150, color: 'rgb(249, 115, 22)' }, 
    { name: 'Service B', usage: 120, color: 'rgb(209, 213, 219)' }, 
    { name: 'Service C', usage: 80, color: 'rgb(209, 213, 219)' }, 
];

const mechanicPerformanceData = [
    { name: 'Mech 1', performance: 75, color: 'rgb(37, 99, 235)' }, 
    { name: 'Mech 2', performance: 85, color: 'rgb(37, 99, 235)' }, 
    { name: 'Mech 3', performance: 60, color: 'rgb(37, 99, 235)' }, 
];
  const serviceData = {
    labels: [
      "Oil Change",
      "Brake Repair",
      "Tire Replacement",
      "Engine Diagnostic",
      "Battery Service",
    ],
    datasets: [
      {
        label: "Usage",
        data: [140, 85, 70, 55, 40],
        backgroundColor: "#ff8c2a",
      },
    ],
  };

  // Mechanic performance chart
  const mechanicData = {
    labels: ["Tom Wilson", "Sarah Lee", "James Martinez", "Linda Garcia", "Maria Rodriguez"],
    datasets: [
      {
        label: "Completed",
        data: [80, 65, 72, 58, 61],
        backgroundColor: "#2d6cdf",
      },
    ],
  };

  // Mechanic list
  const mechanics = [
    { name: "Tom Wilson", jobs: 78, rating: 4.8 },
    { name: "Sarah Lee", jobs: 65, rating: 4.6 },
    { name: "James Martinez", jobs: 72, rating: 4.9 },
    { name: "Linda Garcia", jobs: 58, rating: 4.7 },
    { name: "Maria Rodriguez", jobs: 61, rating: 4.5 },
  ];

const StatCard = ({ title, value, change, icon: Icon, bgColor }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md w-full transition duration-300 hover:shadow-lg">
    <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
            {change}
        </p>
    </div>
    <div className={`p-3 rounded-xl ${bgColor} flex items-center justify-center`}>
        {/* Lucide icons accept size and strokeWidth props */}
        <Icon size={24} strokeWidth={2.5} className="text-white" />
    </div>
  </div>
);

const RevenueChart = () => (
    <div className="p-6 bg-white rounded-xl shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Revenue Overview (Last 6 Months)</h2>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <RechartsLineChart
                    data={revenueChartData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                    <XAxis dataKey="name" stroke="#a0a0a0" />
                    <YAxis 
                        domain={[0, 22000]} 
                        ticks={[0, 5500, 11000, 16500, 22000]} 
                        tickFormatter={(value) => (value === 0 ? '' : value.toLocaleString())}
                        stroke="#a0a0a0"
                    />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                    <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        strokeWidth={3} 
                        dot={false}
                        name="revenue"
                    />
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
            <span className="inline-block w-3 h-1 bg-blue-500 rounded-full mr-1"></span>
            revenue
        </div>
    </div>
);

const BarChartComponent = ({ title, data, dataKey, yAxisLabel }) => (
    <div className="p-6 bg-white rounded-xl shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">{title}</h2>
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
                <RechartsBarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                    <XAxis dataKey="name" stroke="#a0a0a0" />
                    <YAxis domain={[0, yAxisLabel]} ticks={[0, yAxisLabel / 2, yAxisLabel]} stroke="#a0a0a0" />
                    <Tooltip />
                    {data.map((entry, index) => (
                        <Bar 
                            key={index}
                            dataKey={dataKey} 
                            fill={entry.color} 
                            radius={[6, 6, 0, 0]}
                        />
                    ))}
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    </div>
);


// 6. Main Dashboard Component
const ReportsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      
      {/* --- HEADER --- */}
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
            <Search className="w-5 h-5 text-gray-500" />
            <div className="w-64 p-2 bg-gray-100 rounded-lg text-gray-500 text-sm">Search...</div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notification Icon */}
          <div className="relative cursor-pointer">
            <Bell className="w-6 h-6 text-gray-500" />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
              3
            </span>
          </div>
  
          {/* User Info */}
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">Admin User</p>
            <p className="text-xs text-gray-500">admin@cartix.com</p>
          </div>
          
          {/* User Avatar - using the User icon for simplicity */}
          <User className="w-10 h-10 p-1 bg-gray-200 rounded-full text-gray-500" />
        </div>
      </header>
      
      <main className="p-6">
        
        {/* --- REPORTS & ANALYTICS --- */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Reports & Analytics</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {statData.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
          </div>
        </section>

        {/* --- REVENUE OVERVIEW CHART --- */}
        <section className="mb-8">
          <RevenueChart />
        </section>

        {/* --- SERVICE USAGE & MECHANIC PERFORMANCE CHARTS --- */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <BarChartComponent 
                title="Service Usage" 
                data={serviceUsageData} 
                dataKey="usage" 
                yAxisLabel={160}
            />

            <BarChartComponent 
                title="Mechanic Performance" 
                data={mechanicPerformanceData} 
                dataKey="performance" 
                yAxisLabel={80}
            />
        </section>
          return (
    <div className="p-6 space-y-10">

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Service Usage Chart */}
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">Service Usage</h2>
          <Bar data={serviceData} />
        </div>

        {/* Mechanic Performance Chart */}
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">Mechanic Performance</h2>
          <Bar data={mechanicData} />
        </div>
      </div>

      {/* Top Mechanics List */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-4">Top Performing Mechanics</h2>

        <div className="space-y-3">
          {mechanics.map((m, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <span className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full">
                  {index + 1}
                </span>

                <div>
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-gray-500 text-sm">{m.jobs} jobs completed</div>
                </div>
              </div>

              <div className="text-gray-700">
                Rating <span className="font-semibold">{m.rating} / 5.0</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
      </main>
    </div>
  );
};

export default ReportsPage;
