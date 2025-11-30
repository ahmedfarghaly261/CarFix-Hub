import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  CalendarDays, 
  Gift, 
  Star, 
  Settings, 
  FileText ,
  LogOut,
  Sun,
  Moon,
  Hammer
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAdminTheme } from "../../context/AdminThemeContext";

const Sidebar = () => {
  
  const [active, setActive] = useState("Dashboard");
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useAdminTheme();
  

  // Add a `to` route for each menu item so NavLink can navigate
  const menuItems = [
    { name: "Dashboard", to: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Users", to: "/admin/users", icon: <Users size={20} /> },
    { name: "Mechanics", to: "/admin/mechanics", icon: <Wrench size={20} /> },
    { name: "Workshops", to: "/admin/workshops", icon: <Hammer size={20} /> },
    { name: "Bookings", to: "/admin/bookings", icon: <CalendarDays size={20} /> },
    { name: "Services", to: "/admin/services", icon: <Gift size={20} /> },
    { name: "Reviews", to: "/admin/reviews", icon: <Star size={20} /> },
    { name: "Settings", to: "/admin/settings", icon: <Settings size={20} /> },
    { name: "Reports", to: "/admin/reports", icon: <FileText size={20} /> },
  ];

  return (
    <div className={`h-screen w-64 flex flex-col border-r sticky top-0 transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] text-gray-300 border-gray-700' : 'bg-white text-gray-700 border-gray-200 shadow-sm'}`}>
      {/* Logo Section */}
      <div className={`flex items-center gap-3 px-6 py-5 border-b transition-colors ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="bg-orange-500 p-2 rounded-lg">
          <Wrench className="text-white" size={22} />
        </div>
        <div>
          <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>CarFix</h2>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Admin Panel</p>
        </div>
      </div>

      {/* Menu Section */}
      <nav className="flex-1 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            onClick={() => setActive(item.name)}
            className={({ isActive }) =>
              `flex items-center w-full gap-3 px-6 py-3 text-sm font-medium transition-all ${
                isActive 
                  ? isDarkMode
                    ? "bg-orange-900 text-orange-200 border-r-4 border-orange-500"
                    : "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                  : isDarkMode
                    ? "text-gray-300 hover:bg-[#27384a] hover:text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Theme Toggle Section */}
      <div className={`border-t transition-colors ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </span>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDarkMode ? 'bg-orange-600' : 'bg-gray-300'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
            <span className="absolute inset-0 flex items-center justify-center">
              {isDarkMode ? (
                <Moon size={14} className="text-orange-600 -ml-6" />
              ) : (
                <Sun size={14} className="text-gray-400 ml-6" />
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Logout Section */}
      <div className={`border-t transition-colors ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>
        <button
          onClick={logout}
          className={`flex items-center w-full gap-3 transition-all ${
            isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'
          }`}
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
