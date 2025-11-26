export default function MechanicsInProgressPage() {
  const inProgressJobs = [
    {
      id: 1,
      title: "Brake Pad Replacement",
      customer: "Sarah Williams",
      car: "2019 Honda Civic",
      plate: "XYZ-5678",
      startTime: "8:30 AM",
      estimatedCompletion: "10:30 AM",
      progress: 65
    },
    {
      id: 2,
      title: "Transmission Fluid Service",
      customer: "Robert Johnson",
      car: "2020 Chevrolet Silverado",
      plate: "DEF-3456",
      startTime: "10:00 AM",
      estimatedCompletion: "12:00 PM",
      progress: 40
    }
  ];

  return (
    <div className="pt-6 px-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">In Progress</h1>
        <p className="text-gray-400">Jobs currently being worked on</p>
      </div>

      {/* In Progress Jobs */}
      <div className="space-y-4">
        {inProgressJobs.map((job) => (
          <div key={job.id} className="bg-[#1E2A38] rounded-lg shadow p-5 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{job.customer} • {job.car} • {job.plate}</p>
                <p className="text-gray-500 text-sm mt-2">Started at {job.startTime} • Est. completion: {job.estimatedCompletion}</p>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm">
                Mark Complete
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Progress</span>
                <span className="text-white font-semibold">{job.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all" 
                  style={{ width: `${job.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
