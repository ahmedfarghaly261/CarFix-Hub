import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Bell, LogOut, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useMechanicsTheme } from "../../context/MechanicsThemeContext";
import API from "../../services/api";

export default function MechanicsHeader() {
  const { user, logout } = useAuth();
  const { isDarkMode } = useMechanicsTheme();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const notificationRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 10 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    // Close notification panel when clicking outside
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotificationPanel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data || []);
      
      // Count unread notifications
      const unread = res.data?.filter(n => !n.read).length || 0;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      setNotifications(
        notifications.map(n =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <header className={`sticky top-0 z-50 shadow transition-colors ${isDarkMode ? 'bg-[#1E2A38] text-gray-100 border-b border-gray-700' : 'bg-white text-gray-900 border-b border-gray-200'}`}>
      <div className="flex items-center justify-between px-6 py-4">
     

        {/* Center: Search Bar */}
        <div className="flex-1 mx-8">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="🔍 Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${isDarkMode ? 'bg-[#27384a] text-white border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
            />
          </div>
        </div>

        {/* Right: Menu and Notifications */}
        <nav className="flex items-center gap-6">
          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotificationPanel(!showNotificationPanel)}
              className={`relative p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-[#27384a]' : 'hover:bg-gray-100'}`}
              title="Notifications"
            >
              <Bell className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotificationPanel && (
              <div className={`absolute right-0 mt-2 w-96 rounded-lg shadow-2xl border z-50 max-h-96 overflow-y-auto transition-colors ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                  <button
                    onClick={() => setShowNotificationPanel(false)}
                    className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-[#27384a]' : 'hover:bg-gray-100'}`}
                  >
                    <X size={16} />
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <div className={`p-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No notifications yet
                  </div>
                ) : (
                  <div>
                    {notifications.slice(0, 15).map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() => handleMarkAsRead(notification._id)}
                        className={`p-4 border-b cursor-pointer transition-colors ${isDarkMode ? 'border-gray-700 hover:bg-[#27384a]' : 'border-gray-100 hover:bg-gray-50'} ${
                          !notification.read ? (isDarkMode ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50') : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {notification.title}
                            </p>
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {notification.message}
                            </p>
                            <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile Section */}
          <div className={`flex items-center gap-3 pl-6 border-l ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="text-right">
              <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {user?.name || "Mechanic"}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {user?.email || "mechanic@carfix.com"}
              </p>
            </div>
            <img
              src={user?.profileImage || "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"}
              alt="Mechanic"
              className={`w-8 h-8 rounded-full border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
            />
            <button
              onClick={handleLogout}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-red-900 text-gray-300 hover:text-red-400' : 'hover:bg-red-50 text-gray-600 hover:text-red-600'}`}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}