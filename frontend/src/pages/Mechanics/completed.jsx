export default function MechanicsCompletedPage() {
  const completedJobs = [
    {
      id: 1,
      title: "Oil Change & Filter Replacement",
      customer: "John Doe",
      car: "2020 Toyota Camry",
      completedDate: "Nov 24, 2025",
      rating: 5,
      cost: "$89.99"
    },
    {
      id: 2,
      title: "Battery Replacement",
      customer: "Emily Brown",
      car: "2017 BMW 3 Series",
      completedDate: "Nov 23, 2025",
      rating: 4,
      cost: "$149.99"
    },
    {
      id: 3,
      title: "Tire Rotation",
      customer: "David Lee",
      car: "2021 Mazda CX-5",
      completedDate: "Nov 22, 2025",
      rating: 5,
      cost: "$59.99"
    }
  ];

  return (
    <div className="pt-6 px-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Completed Jobs</h1>
        <p className="text-gray-400">Jobs you have successfully completed</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1E2A38] rounded-lg p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Total Completed</p>
          <h3 className="text-3xl font-bold text-white mt-2">12</h3>
        </div>
        <div className="bg-[#1E2A38] rounded-lg p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Average Rating</p>
          <h3 className="text-3xl font-bold text-yellow-400 mt-2">4.8 ⭐</h3>
        </div>
        <div className="bg-[#1E2A38] rounded-lg p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Total Earnings</p>
          <h3 className="text-3xl font-bold text-green-400 mt-2">$1,299.99</h3>
        </div>
      </div>

      {/* Completed Jobs List */}
      <div className="space-y-4">
        {completedJobs.map((job) => (
          <div key={job.id} className="bg-[#1E2A38] rounded-lg shadow p-5 border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{job.customer} • {job.car}</p>
                <p className="text-gray-500 text-sm mt-2">Completed on {job.completedDate}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-400">{'⭐'.repeat(job.rating)}</span>
                  <span className="text-gray-400 text-sm">({job.rating}/5)</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">{job.cost}</p>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
                  View Invoice
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
