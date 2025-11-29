import React, { useEffect, useState, useRef } from "react";
import { Bell, LogOut, Settings, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getAdminNotifications, markNotificationAsRead } from "../../services/adminService";

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const notificationRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 15 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000);

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
      setLoading(true);
      const res = await getAdminNotifications();
      const allNotifications = res.data || [];
      setNotifications(allNotifications);
      
      // Count unread notifications
      const unread = allNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(
        notifications.map(n =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const handleRefreshNotifications = () => {
    fetchNotifications();
  };

  return (
    <header className="flex justify-between items-center bg-white text-gray-900 shadow-md p-4 border-b border-gray-200 sticky top-0 z-40">
      {/* Left: Search Bar */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="🔍 Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
          />
        </div>
      </div>

      {/* Right: Notifications and User Profile */}
      <div className="flex items-center gap-6">
        {/* Refresh Button */}
        <button
          onClick={handleRefreshNotifications}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh notifications"
        >
          <span className="text-gray-600 text-lg">🔄</span>
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotificationPanel(!showNotificationPanel)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Notifications"
          >
            <Bell className="text-gray-600" size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown Panel */}
          {showNotificationPanel && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <button
                  onClick={() => setShowNotificationPanel(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={16} />
                </button>
              </div>

              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No notifications yet</div>
              ) : (
                <div>
                  {notifications.slice(0, 15).map((notification) => (
                    <div
                      key={notification._id}
                      onClick={() => handleMarkAsRead(notification._id)}
                      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 text-sm">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                            )}
                          </div>
                          <p className="text-gray-600 text-xs mt-1">
                            {notification.message}
                          </p>
                          <p className="text-gray-400 text-xs mt-2">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 text-center">
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Section */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="text-right">
            <p className="font-semibold text-gray-900 text-sm">
              {user?.name || "Admin User"}
            </p>
            <p className="text-xs text-gray-500">{user?.email || "admin@carfix.com"}</p>
          </div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
            alt="Admin"
            className="w-8 h-8 rounded-full border border-gray-300"
          />
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-600 hover:text-red-600"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
