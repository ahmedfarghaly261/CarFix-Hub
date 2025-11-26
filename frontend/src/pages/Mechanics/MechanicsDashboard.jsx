import { useState } from "react";
import { JobDetailsModal } from "../../components/shared";

export default function Dashboard() {
  const [selectedJob, setSelectedJob] = useState(null);

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
    <div className="pt-24 px-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-blue-600 text-white rounded-xl px-6 py-5 mb-6">
        <h2 className="text-xl font-semibold">Welcome back, Mike Johnson!</h2>
        <p>You have 2 pending requests and 1 job in progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500">Total Requests</p>
          <h3 className="text-2xl font-bold">5</h3>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500">Pending</p>
          <h3 className="text-2xl font-bold">2</h3>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500">In Progress</p>
          <h3 className="text-2xl font-bold">1</h3>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500">Completed</p>
          <h3 className="text-2xl font-bold">2</h3>
        </div>
      </div>

      {/* Requests List */}
      <h3 className="text-xl font-semibold mb-4">All Requests</h3>

      {/* Request Cards */}
      {requests.map((request) => (
        <div key={request.id} className="bg-white rounded-lg shadow p-5 mb-4">
          <div className="flex justify-between">
            <div>
              <h4 className="text-lg font-semibold">{request.title}</h4>
              <p className="text-gray-500">{request.customer} • {request.car} • {request.plate}</p>
              <p className="text-sm mt-2">
                {request.description}
              </p>
              <p className="text-gray-500 text-sm mt-2">{request.date} • {request.time} • Est. {request.duration}</p>
              <div className="flex gap-2 mt-3">
                <button 
                  className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
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

            <div className="flex flex-col items-end gap-2">
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                request.priority === 'high' ? 'bg-red-200 text-red-600' :
                request.priority === 'medium' ? 'bg-orange-200 text-orange-600' :
                'bg-green-200 text-green-600'
              }`}>
                {request.priority} priority
              </span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                request.status === 'completed' ? 'bg-green-200 text-green-700' :
                request.status === 'in-progress' ? 'bg-yellow-200 text-yellow-700' :
                'bg-blue-200 text-blue-700'
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
