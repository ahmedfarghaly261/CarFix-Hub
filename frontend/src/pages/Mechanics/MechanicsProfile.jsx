import { useMechanicsTheme } from '../../context/MechanicsThemeContext';

export default function Profile() {
  const { isDarkMode } = useMechanicsTheme();
  
  return (
    <div className={`pt-6 px-6 max-w-4xl mx-auto transition-colors duration-300 ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      <h2 className={`text-2xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Profile</h2>

      <div className={`shadow p-6 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Personal Info</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Name</p>
            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mike Johnson</p>
          </div>

          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Department</p>
            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Engine & Transmission</p>
          </div>

          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>mike.johnson@example.com</p>
          </div>

          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</p>
            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>+1 555 123 4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}
