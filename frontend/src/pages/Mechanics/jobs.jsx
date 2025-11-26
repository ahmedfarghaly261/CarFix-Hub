export default function MechanicsJobsPage() {
  const jobs = [
    {
      id: 1,
      title: "Oil Change & Filter Replacement",
      customer: "John Doe",
      car: "2020 Toyota Camry",
      plate: "ABC-1234",
      date: "Nov 25, 2025",
      time: "9:00 AM",
      duration: "1 hr",
      priority: "medium",
      status: "completed",
      description: "Regular maintenance - oil change with synthetic 5W-30 and new filter."
    },
    {
      id: 2,
      title: "Brake Pad Replacement",
      customer: "Sarah Williams",
      car: "2019 Honda Civic",
      plate: "XYZ-5678",
      date: "Nov 25, 2025",
      time: "8:30 AM",
      duration: "2 hrs",
      priority: "high",
      status: "in-progress",
      description: "Front brake pads worn out. Squeaking noise reported."
    },
    {
      id: 3,
      title: "Engine Diagnostics",
      customer: "Mike Wilson",
      car: "2018 Ford Focus",
      plate: "LMN-9012",
      date: "Nov 26, 2025",
      time: "10:00 AM",
      duration: "1.5 hrs",
      priority: "high",
      status: "pending",
      description: "Check engine light on. Need full diagnostic."
    }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-200 text-red-600';
      case 'medium': return 'bg-orange-200 text-orange-600';
      case 'low': return 'bg-green-200 text-green-600';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-200 text-green-700';
      case 'in-progress': return 'bg-yellow-200 text-yellow-700';
      case 'pending': return 'bg-blue-200 text-blue-700';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <div className="pt-6 px-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">My Jobs</h1>
        <p className="text-gray-400">Manage and track all your repair jobs</p>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-[#1E2A38] rounded-lg shadow p-5 border border-gray-700">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{job.customer} • {job.car} • {job.plate}</p>
                <p className="text-gray-300 text-sm mt-2">{job.description}</p>
                <p className="text-gray-500 text-sm mt-2">{job.date} • {job.time} • Est. {job.duration}</p>
                <div className="flex gap-2 mt-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
                    View Details
                  </button>
                  {job.status === 'in-progress' && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm">
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 ml-4">
                <span className={`px-3 py-1 rounded text-sm font-medium capitalize ${getPriorityColor(job.priority)}`}>
                  {job.priority} priority
                </span>
                <span className={`px-3 py-1 rounded text-sm font-medium capitalize ${getStatusColor(job.status)}`}>
                  {job.status.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
