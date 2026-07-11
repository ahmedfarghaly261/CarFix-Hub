import { NavLink } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  LayoutDashboard,
  LogOut,
  Moon,
  Settings,
  Star,
  Sun,
  UserRound,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMechanicsTheme } from "@/context/MechanicsThemeContext";
import { useToast } from "@/components/ui/useToast";

const MechanicsSidebar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useMechanicsTheme();
  const toast = useToast();

  const menuItems = [
    { name: "Dashboard", to: "/mechanics/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "My Jobs", to: "/mechanics/jobs", icon: <Wrench size={20} /> },
    { name: "In Progress", to: "/mechanics/in-progress", icon: <Clock size={20} /> },
    { name: "Completed", to: "/mechanics/completed", icon: <CheckCircle size={20} /> },
    { name: "Reviews", to: "/mechanics/reviews", icon: <Star size={20} /> },
    { name: "Profile", to: "/mechanics/profile", icon: <UserRound size={20} /> },
    { name: "Settings", to: "/mechanics/settings", icon: <Settings size={20} /> },
  ];

  const handleLogout = async () => {
    await logout();
    toast.info("You have been signed out.");
  };

  return (
    <aside
      className={`sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r px-4 py-5 transition-colors duration-300 lg:flex ${
        isDarkMode ? "border-slate-800 bg-[#101827] text-slate-300" : "border-slate-200 bg-white text-slate-700"
      }`}
    >
      <div className={`mb-5 flex items-center gap-3 rounded-lg px-3 py-3 ${isDarkMode ? "bg-white/5" : "bg-slate-50"}`}>
        <div className="rounded-lg bg-blue-600 p-2.5 shadow-lg shadow-blue-900/20">
          <Wrench className="text-white" size={22} />
        </div>
        <div className="min-w-0">
          <h2 className={`text-lg font-semibold leading-6 ${isDarkMode ? "text-white" : "text-slate-950"}`}>CarFix</h2>
          <p className={`truncate text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Mechanic workspace</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-950/20"
                  : isDarkMode
                    ? "text-slate-400 hover:bg-white/5 hover:text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className={`rounded-lg border p-4 ${isDarkMode ? "border-slate-800 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
        <div className="mb-4">
          <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-950"}`}>{user?.name || "Mechanic"}</p>
          <p className={`truncate text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            {user?.email || "mechanic@carfix.com"}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
            {isDarkMode ? "Dark Mode" : "Light Mode"}
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isDarkMode ? "bg-blue-600" : "bg-slate-300"
            }`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDarkMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
            <span className="absolute inset-0 flex items-center justify-center">
              {isDarkMode ? (
                <Moon size={14} className="text-blue-600 -ml-6" />
              ) : (
                <Sun size={14} className="text-slate-400 ml-6" />
              )}
            </span>
          </button>
        </div>

        <button
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
            isDarkMode ? "bg-red-500/10 text-red-300 hover:bg-red-500/15" : "bg-red-50 text-red-600 hover:bg-red-100"
          }`}
          onClick={handleLogout}
          type="button"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default MechanicsSidebar;
