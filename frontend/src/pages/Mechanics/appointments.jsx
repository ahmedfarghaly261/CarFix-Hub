export default function MechanicsAppointmentsPage() {
  const appointments = [
    {
      id: 1,
      customer: "John Doe",
      car: "2020 Toyota Camry",
      service: "Oil Change",
      date: "Nov 25, 2025",
      time: "9:00 AM",
      phone: "+1 (555) 123-4567"
    },
    {
      id: 2,
      customer: "Sarah Williams",
      car: "2019 Honda Civic",
      service: "Brake Inspection",
      date: "Nov 25, 2025",
      time: "10:30 AM",
      phone: "+1 (555) 987-6543"
    },
    {
      id: 3,
      customer: "Mike Wilson",
      car: "2018 Ford Focus",
      service: "Engine Diagnostics",
      date: "Nov 26, 2025",
      time: "2:00 PM",
      phone: "+1 (555) 456-7890"
    }
  ];

  return (
    <div className="pt-6 px-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Appointments</h1>
        <p className="text-gray-400">Your scheduled appointments</p>
      </div>

      {/* Appointments Table */}
      <div className="bg-[#1E2A38] rounded-lg shadow border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#27384a] border-b border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Vehicle</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Service</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Date & Time</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Contact</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-[#27384a] transition">
                <td className="px-6 py-4 text-sm text-white">{apt.customer}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{apt.car}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{apt.service}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{apt.date} at {apt.time}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{apt.phone}</td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-blue-400 hover:text-blue-300 transition mr-4">Confirm</button>
                  <button className="text-red-400 hover:text-red-300 transition">Decline</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
