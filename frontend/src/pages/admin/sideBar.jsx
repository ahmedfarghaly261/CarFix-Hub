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
  FileText 
} from "lucide-react";

const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");

  // Add a `to` route for each menu item so NavLink can navigate
  const menuItems = [
    { name: "Dashboard", to: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Users", to: "/admin/users", icon: <Users size={20} /> },
    { name: "Mechanics", to: "/admin/mechanics", icon: <Wrench size={20} /> },
    { name: "Bookings", to: "/admin/bookings", icon: <CalendarDays size={20} /> },
    { name: "Services", to: "/admin/services", icon: <Gift size={20} /> },
    { name: "Reviews", to: "/admin/reviews", icon: <Star size={20} /> },
    { name: "Settings", to: "/admin/settings", icon: <Settings size={20} /> },
    { name: "Reports", to: "/admin/reports", icon: <FileText size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-[#1E2A38] text-gray-300 flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
        <div className="bg-orange-500 p-2 rounded-lg">
          <Wrench className="text-white" size={22} />
        </div>
        <div>
          <h2 className="text-white text-lg font-semibold">CarFix</h2>
          <p className="text-xs text-gray-400">Admin Panel</p>
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
    </div>
  );
};

export default Sidebar;
