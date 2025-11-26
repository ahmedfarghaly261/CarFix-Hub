export default function MechanicsSettingsPage() {
  return (
    <div className="pt-6 px-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account settings</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Account Settings */}
        <div className="bg-[#1E2A38] rounded-lg shadow p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Full Name</label>
              <input type="text" placeholder="Mike Johnson" className="w-full bg-[#27384a] text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Email</label>
              <input type="email" placeholder="mike@example.com" className="w-full bg-[#27384a] text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Phone Number</label>
              <input type="tel" placeholder="+1 (555) 123-4567" className="w-full bg-[#27384a] text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
        </div>

        {/* Work Hours */}
        <div className="bg-[#1E2A38] rounded-lg shadow p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Work Hours</h3>
          <div className="space-y-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
              <div key={day} className="flex items-center justify-between">
                <span className="text-gray-300">{day}</span>
                <div className="flex gap-2">
                  <input type="time" defaultValue="09:00" className="bg-[#27384a] text-white px-3 py-1 rounded border border-gray-600 text-sm" />
                  <span className="text-gray-400">to</span>
                  <input type="time" defaultValue="17:00" className="bg-[#27384a] text-white px-3 py-1 rounded border border-gray-600 text-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specializations */}
        <div className="bg-[#1E2A38] rounded-lg shadow p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Specializations</h3>
          <div className="space-y-2">
            {['Engine Repair', 'Brake Service', 'Oil Changes', 'Tire Service', 'Electrical'].map((spec) => (
              <label key={spec} className="flex items-center text-gray-300">
                <input type="checkbox" defaultChecked className="mr-2 w-4 h-4" />
                {spec}
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition">
          Save Changes
        </button>
      </div>
    </div>
  );
}
