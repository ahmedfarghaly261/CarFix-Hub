import { useMechanicsTheme } from '../../context/MechanicsThemeContext';

export default function MechanicsSettingsPage() {
  const { isDarkMode } = useMechanicsTheme();
  
  return (
    <div className={`pt-6 px-6 max-w-6xl transition-colors duration-300 ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Manage your account settings</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Account Settings */}
        <div className={`rounded-lg shadow p-6 border transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Account Settings</h3>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
              <input type="text" placeholder="Mike Johnson" className={`w-full px-4 py-2 rounded border focus:outline-none focus:border-blue-500 transition-colors ${isDarkMode ? 'bg-[#27384a] text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'}`} />
            </div>
            <div>
              <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
              <input type="email" placeholder="mike@example.com" className={`w-full px-4 py-2 rounded border focus:outline-none focus:border-blue-500 transition-colors ${isDarkMode ? 'bg-[#27384a] text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'}`} />
            </div>
            <div>
              <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number</label>
              <input type="tel" placeholder="+1 (555) 123-4567" className={`w-full px-4 py-2 rounded border focus:outline-none focus:border-blue-500 transition-colors ${isDarkMode ? 'bg-[#27384a] text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'}`} />
            </div>
          </div>
        </div>

        {/* Work Hours */}
        <div className={`rounded-lg shadow p-6 border transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Work Hours</h3>
          <div className="space-y-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
              <div key={day} className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{day}</span>
                <div className="flex gap-2">
                  <input type="time" defaultValue="09:00" className={`px-3 py-1 rounded border text-sm transition-colors ${isDarkMode ? 'bg-[#27384a] text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'}`} />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>to</span>
                  <input type="time" defaultValue="17:00" className={`px-3 py-1 rounded border text-sm transition-colors ${isDarkMode ? 'bg-[#27384a] text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specializations */}
        <div className={`rounded-lg shadow p-6 border transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Specializations</h3>
          <div className="space-y-2">
            {['Engine Repair', 'Brake Service', 'Oil Changes', 'Tire Service', 'Electrical'].map((spec) => (
              <label key={spec} className={`flex items-center cursor-pointer ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
