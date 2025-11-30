import { useState } from "react";
import { JobDetailsModal } from "../../components/shared";
import { useMechanicsTheme } from "../../context/MechanicsThemeContext";

export default function Dashboard() {
  const [selectedJob, setSelectedJob] = useState(null);
  const { isDarkMode } = useMechanicsTheme();

  const requests = [
    {
      id: 1,
      title: "Oil Change & Filter Replacement",
      customer: "John Doe",
      phone: "+1 (555) 123-4567",
      car: "2020 Toyota Camry",
      plate: "ABC-1234",
      mileage: "45,230 miles",
      description: "Regular maintenance - oil change with synthetic 5W-30 and new filter. Customer also mentioned a slight engine noise.",
      date: "Nov 25, 2025",
      time: "9:00 AM",
      duration: "1 hour",
      priority: "medium",
      status: "completed",
      parts: ["Oil Filter", "Synthetic Oil 5W-30 (5 quarts)"],
      notes: "Customer prefers synthetic oil. Check engine noise during inspection."
    },
    {
      id: 2,
      title: "Brake Pad Replacement",
      customer: "Sarah Williams",
      phone: "+1 (555) 987-6543",
      car: "2019 Honda Civic",
      plate: "XYZ-5678",
      mileage: "32,150 miles",
      description: "Front brake pads worn out. Squeaking noise reported.",
      date: "Nov 25, 2025",
      time: "8:30 AM",
      duration: "2 hours",
      priority: "high",
      status: "in-progress",
      parts: ["Front Brake Pads", "Brake Fluid", "Brake Cleaner"],
      notes: "Customer reported squeaking noise and vibration when braking."
    }
  ];

  const handleStartWork = (jobId) => {
    console.log("Starting work on job:", jobId);
    setSelectedJob(null);
  };

  const handleSendUpdate = (jobId, message) => {
    console.log("Sending update for job", jobId, ":", message);
  };

  return (
    <div className={`pt-6 px-6 max-w-7xl mx-auto transition-colors duration-300 ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      {/* Welcome Banner */}
      <div className="bg-blue-600 text-white rounded-xl px-6 py-5 mb-6">
        <h2 className="text-xl font-semibold">Welcome back, Mike Johnson!</h2>
        <p>You have 2 pending requests and 1 job in progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className={`rounded-lg shadow p-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] text-gray-300' : 'bg-white text-gray-700'}`}>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Total Requests</p>
          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>5</h3>
        </div>
        <div className={`rounded-lg shadow p-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] text-gray-300' : 'bg-white text-gray-700'}`}>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Pending</p>
          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>2</h3>
        </div>
        <div className={`rounded-lg shadow p-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] text-gray-300' : 'bg-white text-gray-700'}`}>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>In Progress</p>
          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>1</h3>
        </div>
        <div className={`rounded-lg shadow p-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] text-gray-300' : 'bg-white text-gray-700'}`}>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Completed</p>
          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>2</h3>
        </div>
      </div>

      {/* Requests List */}
      <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>All Requests</h3>

      {/* Request Cards */}
      {requests.map((request) => (
        <div key={request.id} className={`rounded-lg shadow p-5 mb-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="flex justify-between">
            <div className="flex-1">
              <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{request.title}</h4>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{request.customer} • {request.car} • {request.plate}</p>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {request.description}
              </p>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{request.date} • {request.time} • Est. {request.duration}</p>
              <div className="flex gap-2 mt-3">
                <button 
                  className={`px-4 py-2 rounded hover:opacity-80 transition ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                  onClick={() => setSelectedJob(request)}
                >
                  View Details
                </button>
                {request.status === 'in-progress' && (
                  <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 ml-4">
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                request.priority === 'high' ? (isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-200 text-red-600') :
                request.priority === 'medium' ? (isDarkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-200 text-orange-600') :
                isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-200 text-green-600'
              }`}>
                {request.priority} priority
              </span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                request.status === 'completed' ? (isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-200 text-green-700') :
                request.status === 'in-progress' ? (isDarkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-200 text-yellow-700') :
                isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-200 text-blue-700'
              }`}>
                {request.status}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Job Details Modal */}
      <JobDetailsModal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        job={selectedJob}
        onStartWork={handleStartWork}
        onSendUpdate={handleSendUpdate}
      />
    </div>
  );
}
