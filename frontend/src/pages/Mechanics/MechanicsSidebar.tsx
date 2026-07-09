import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Wrench, 
  CheckCircle,
  Clock,
  Star,
  Settings,
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useMechanicsTheme } from "../../context/MechanicsThemeContext";

const MechanicsSidebar = () => {
  const [active, setActive] = useState("Dashboard");
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useMechanicsTheme();


  const menuItems = [
    { name: "Dashboard", to: "/mechanics/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "My Jobs", to: "/mechanics/jobs", icon: <Wrench size={20} /> },
    { name: "In Progress", to: "/mechanics/in-progress", icon: <Clock size={20} /> },
    { name: "Completed", to: "/mechanics/completed", icon: <CheckCircle size={20} /> },
    { name: "Reviews", to: "/mechanics/reviews", icon: <Star size={20} /> },
    { name: "Profile", to: "/mechanics/profile", icon: <Wrench size={20} /> },
    { name: "Settings", to: "/mechanics/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className={`h-screen w-64 ${isDarkMode ? 'bg-[#1E2A38] text-gray-300' : 'bg-white text-gray-700'} flex flex-col transition-colors duration-300`}>
      {/* Logo Section */}
      <div className={`flex items-center gap-3 px-6 py-5 ${isDarkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
        <div className="bg-blue-500 p-2 rounded-lg">
          <Wrench className="text-white" size={22} />
        </div>
        <div>
          <h2 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-lg font-semibold`}>CarFix</h2>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Mechanic Panel</p>
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
                  ? "bg-blue-600 text-white" 
                  : isDarkMode 
                    ? "hover:bg-[#27384a] hover:text-white" 
                    : "hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Theme Toggle Section */}
      <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </span>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
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
                <Moon size={14} className="text-blue-600 -ml-6" />
              ) : (
                <Sun size={14} className="text-gray-400 ml-6" />
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Logout Section */}
      <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
        <button className={`flex items-center w-full gap-3 transition-all ${
          isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'
        }`}
                        onClick={logout}
>
          
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default MechanicsSidebar;
