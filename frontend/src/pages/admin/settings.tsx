import { useAdminTheme } from '../../context/AdminThemeContext';

const SettingsPage = () => {
  const { isDarkMode } = useAdminTheme();
  
  return (
    <div className={`p-6 min-h-screen transition-colors ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
      <div className={`p-4 rounded shadow transition-colors ${isDarkMode ? 'bg-[#1E2A38] text-white' : 'bg-white'}`}>Admin settings</div>
    </div>
  );
};

export default SettingsPage;
