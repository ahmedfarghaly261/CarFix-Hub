import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Bell,
  CheckCircle,
  Clock,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  Star,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMechanicsTheme } from "@/context/MechanicsThemeContext";
import { useToast } from "@/components/ui/useToast";
import API from "@/services/api.service";

type NotificationItem = {
  _id: string
  title: string
  message: string
  read?: boolean
  createdAt?: string
}

const mobileNavItems = [
  { name: "Dashboard", to: "/mechanics/dashboard", icon: <LayoutDashboard size={17} /> },
  { name: "Jobs", to: "/mechanics/jobs", icon: <Wrench size={17} /> },
  { name: "Active", to: "/mechanics/in-progress", icon: <Clock size={17} /> },
  { name: "Done", to: "/mechanics/completed", icon: <CheckCircle size={17} /> },
  { name: "Reviews", to: "/mechanics/reviews", icon: <Star size={17} /> },
  { name: "Profile", to: "/mechanics/profile", icon: <UserRound size={17} /> },
  { name: "Settings", to: "/mechanics/settings", icon: <Settings size={17} /> },
];

export default function MechanicsHeader() {
  const { user, logout } = useAuth();
  const { isDarkMode } = useMechanicsTheme();
  const toast = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const notificationFetchFailed = useRef(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await API.get<NotificationItem[]>("/notifications");
      const items = res.data || [];
      setNotifications(items);
      setUnreadCount(items.filter((notification) => !notification.read).length);
      notificationFetchFailed.current = false;
    } catch (err) {
      console.error("Error fetching notifications:", err);
      if (!notificationFetchFailed.current) {
        toast.error("Notifications could not be loaded.");
        notificationFetchFailed.current = true;
      }
    }
  }, [toast]);

  useEffect(() => {
    fetchNotifications();

    const interval = window.setInterval(fetchNotifications, 10000);

    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotificationPanel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification._id === notificationId ? { ...notification, read: true } : notification,
      ),
    );
    setUnreadCount((count) => Math.max(0, count - 1));
  };

  const handleLogout = async () => {
    await logout();
    toast.info("You have been signed out.");
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b shadow-sm backdrop-blur transition-colors ${
        isDarkMode
          ? "border-slate-800 bg-[#101827]/95 text-slate-100"
          : "border-slate-200 bg-white/95 text-slate-950"
      }`}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? "text-blue-300" : "text-blue-600"}`}>
            Mechanic panel
          </p>
          <h1 className="truncate text-lg font-semibold leading-6 sm:text-xl">
            {user?.name ? `Welcome, ${user.name}` : "Mechanic workspace"}
          </h1>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <label className="relative w-full max-w-md">
            <Search className={`absolute left-3 top-2.5 h-4 w-4 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`} />
            <input
              type="text"
              placeholder="Search jobs, customers, plates"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`h-10 w-full rounded-lg border pl-9 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                isDarkMode
                  ? "border-slate-700 bg-[#0B1120] text-white placeholder:text-slate-500"
                  : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
              }`}
            />
          </label>
        </div>

        <nav className="flex shrink-0 items-center gap-3">
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setShowNotificationPanel((current) => !current)}
              className={`relative rounded-lg p-2 transition-colors ${
                isDarkMode ? "hover:bg-white/5" : "hover:bg-slate-100"
              }`}
              title="Notifications"
            >
              <Bell className={isDarkMode ? "text-slate-300" : "text-slate-600"} size={20} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showNotificationPanel && (
              <div
                className={`absolute right-0 mt-3 max-h-[28rem] w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-lg border shadow-2xl sm:w-96 ${
                  isDarkMode ? "border-slate-800 bg-[#101827]" : "border-slate-200 bg-white"
                }`}
              >
                <div className={`flex items-center justify-between border-b p-4 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-slate-950"}`}>Notifications</h3>
                    <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{unreadCount} unread</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNotificationPanel(false)}
                    className={`rounded-lg p-1.5 transition-colors ${isDarkMode ? "hover:bg-white/5" : "hover:bg-slate-100"}`}
                    aria-label="Close notifications"
                  >
                    <X size={16} />
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <div className={`p-6 text-center text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    No notifications yet
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.slice(0, 15).map((notification) => (
                      <button
                        type="button"
                        key={notification._id}
                        onClick={() => handleMarkAsRead(notification._id)}
                        className={`block w-full border-b p-4 text-left transition-colors ${
                          isDarkMode ? "border-slate-800 hover:bg-white/5" : "border-slate-100 hover:bg-slate-50"
                        } ${!notification.read ? (isDarkMode ? "bg-blue-500/10" : "bg-blue-50") : ""}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`mt-1 h-2 w-2 rounded-full ${notification.read ? "bg-transparent" : "bg-blue-500"}`} />
                          <div className="min-w-0">
                            <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-950"}`}>
                              {notification.title}
                            </p>
                            <p className={`mt-1 text-xs leading-5 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                              {notification.message}
                            </p>
                            {notification.createdAt && (
                              <p className={`mt-2 text-xs ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <img
            src={user?.profileImage || "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"}
            alt="Mechanic"
            className={`hidden h-9 w-9 rounded-lg border object-cover sm:block ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
          />
          <button
            type="button"
            onClick={handleLogout}
            className={`rounded-lg p-2 transition-colors ${
              isDarkMode ? "text-slate-300 hover:bg-red-500/10 hover:text-red-300" : "text-slate-600 hover:bg-red-50 hover:text-red-600"
            }`}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </nav>
      </div>

      <nav className={`flex gap-2 overflow-x-auto border-t px-4 py-2 lg:hidden ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : isDarkMode
                    ? "text-slate-400 hover:bg-white/5 hover:text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
