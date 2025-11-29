import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Wrench, 
  CalendarDays, 
  CheckCircle,
  Clock,
  Star,
  Settings,
  LogOut
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const MechanicsSidebar = () => {
  const [active, setActive] = useState("Dashboard");
     const { user, logout } = useAuth();


  const menuItems = [
    { name: "Dashboard", to: "/mechanics/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "My Jobs", to: "/mechanics/jobs", icon: <Wrench size={20} /> },
    { name: "Appointments", to: "/mechanics/appointments", icon: <CalendarDays size={20} /> },
    { name: "Completed", to: "/mechanics/completed", icon: <CheckCircle size={20} /> },
    { name: "In Progress", to: "/mechanics/in-progress", icon: <Clock size={20} /> },
    { name: "Reviews", to: "/mechanics/reviews", icon: <Star size={20} /> },
    { name: "Profile", to: "/mechanics/profile", icon: <Wrench size={20} /> },
    { name: "Settings", to: "/mechanics/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-[#1E2A38] text-gray-300 flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
        <div className="bg-blue-500 p-2 rounded-lg">
          <Wrench className="text-white" size={22} />
        </div>
        <div>
          <h2 className="text-white text-lg font-semibold">CarFix</h2>
          <p className="text-xs text-gray-400">Mechanic Panel</p>
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
                isActive ? "bg-blue-600 text-white" : "hover:bg-[#27384a] hover:text-white"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="border-t border-gray-700 p-6">
        <button className="flex items-center w-full gap-3 text-red-400 hover:text-red-300 transition-all"
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
