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
  LogOut
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  
  const [active, setActive] = useState("Dashboard");
   const { user, logout } = useAuth();
  

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
    <div className="h-screen w-64 bg-white text-gray-700 flex flex-col border-r border-gray-200 shadow-sm">
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
        <div className="bg-orange-500 p-2 rounded-lg">
          <Wrench className="text-white" size={22} />
        </div>
        <div>
          <h2 className="text-gray-900 text-lg font-bold">CarFix</h2>
          <p className="text-xs text-gray-500">Admin Panel</p>
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
                  ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
           <button
                onClick={logout}
                className="ml-4 p-2 text-gray-600 hover:text-red-600 transition flex items-center gap-3"
                title="Logout"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
      </nav>
    </div>
  );
};

export default Sidebar;
