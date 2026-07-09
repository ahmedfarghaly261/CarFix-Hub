import { useState, useEffect } from "react";
import { JobDetailsModal } from "@/components/common";
import { useMechanicsTheme } from "@/context/MechanicsThemeContext";
import { useAuth } from "@/context/AuthContext";
import { getMechanicDashboard, getMechanicJobs } from "@/modules/mechanic/services/mechanic.service";
import API from "@/services/api.service";
import { Bell } from "lucide-react";

export default function MechanicsDashboard() {
  const { user } = useAuth();
  const { isDarkMode } = useMechanicsTheme();
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dashboard stats
  const [stats, setStats] = useState({
    totalJobs: 0,
    pendingJobs: 0,
    inProgressJobs: 0,
    completedJobs: 0
  });
  
  // Jobs list
  const [jobs, setJobs] = useState([]);
  
  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchNotifications();
      
      // Poll for new notifications every 10 seconds
      const interval = setInterval(() => {
        fetchNotifications();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const dashboardRes = await getMechanicDashboard();
      setStats(dashboardRes.data);
      
      // Fetch all jobs
      const jobsRes = await getMechanicJobs();
      const filteredJobs = jobsRes.data
        .filter(job => !['completed', 'cancelled'].includes(job.status))
        .map(job => ({
          id: job._id,
          title: job.title,
          customer: job.userId?.name || 'Unknown',
          phone: job.userId?.phone || 'N/A',
          car: job.carId ? `${job.carId.year} ${job.carId.make} ${job.carId.model}` : 'Unknown',
          plate: job.carId?.licensePlate || 'N/A',
          mileage: job.carId?.mileage ? `${job.carId.mileage} miles` : 'N/A',
          description: job.description,
          date: job.requestedDate || 'Not set',
          time: 'TBD',
          duration: '1 hr',
          priority: job.priority || 'medium',
          status: job.status,
          parts: [],
          notes: job.description
        }));
      
      setJobs(filteredJobs);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

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

  const handleStartWork = (jobId) => {
    console.log("Starting work on job:", jobId);
    setSelectedJob(null);
  };

  const handleSendUpdate = (jobId, message) => {
    console.log("Sending update for job", jobId, ":", message);
  };

  if (loading) {
    return (
      <div className={`pt-6 px-6 max-w-7xl mx-auto transition-colors duration-300 ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
        <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className={`pt-6 px-6 max-w-7xl mx-auto transition-colors duration-300 ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      {/* Welcome Banner */}
      <div className="bg-blue-600 text-white rounded-xl px-6 py-5 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Welcome back, {user?.name || 'Mechanic'}!</h2>
          <p>You have {stats.pendingJobs} pending requests and {stats.inProgressJobs} job(s) in progress</p>
        </div>
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg">
            <Bell size={20} />
            <span className="font-semibold">{unreadCount} new request{unreadCount !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className={`rounded-lg shadow p-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] text-gray-300' : 'bg-white text-gray-700'}`}>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Total Requests</p>
          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {stats.totalJobs}
          </h3>
        </div>
        <div className={`rounded-lg shadow p-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] text-gray-300' : 'bg-white text-gray-700'}`}>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Pending</p>
          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {stats.pendingJobs}
          </h3>
        </div>
        <div className={`rounded-lg shadow p-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] text-gray-300' : 'bg-white text-gray-700'}`}>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>In Progress</p>
          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {stats.inProgressJobs}
          </h3>
        </div>
        <div className={`rounded-lg shadow p-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] text-gray-300' : 'bg-white text-gray-700'}`}>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Completed</p>
          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {stats.completedJobs}
          </h3>
        </div>
      </div>

      {/* Recent Notifications */}
      {notifications.length > 0 && (
        <div className={`rounded-lg shadow p-5 mb-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
          <div className="flex items-center gap-2 mb-4">
            <Bell className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} size={20} />
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-900'}`}>
              Recent Notifications
            </h3>
          </div>
          <div className="space-y-2">
            {notifications.slice(0, 3).map((notif) => (
              <div key={notif._id} className={`p-3 rounded ${isDarkMode ? 'bg-[#27384a]' : 'bg-white'}`}>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {notif.title}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {notif.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Requests List */}
      <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Active Requests ({jobs.length})
      </h3>

      {/* Request Cards */}
      {jobs.length > 0 ? (
        jobs.map((request) => (
          <div key={request.id} className={`rounded-lg shadow p-5 mb-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex justify-between">
              <div className="flex-1">
                <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{request.title}</h4>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{request.customer} • {request.car} • {request.plate}</p>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {request.description}
                </p>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {request.date} • {request.time} • Est. {request.duration}
                </p>
                <div className="flex gap-2 mt-3">
                  <button 
                    className={`px-4 py-2 rounded hover:opacity-80 transition ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                    onClick={() => setSelectedJob(request)}
                  >
                    View Details
                  </button>
                  {request.status === 'in-progress' && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 ml-4">
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  request.priority === 'high' ? (isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-200 text-red-600') :
                  request.priority === 'medium' ? (isDarkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-200 text-orange-600') :
                  isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-200 text-green-600'
                }`}>
                  {request.priority} priority
                </span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  request.status === 'completed' ? (isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-200 text-green-700') :
                  request.status === 'in-progress' ? (isDarkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-200 text-yellow-700') :
                  isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-200 text-blue-700'
                }`}>
                  {request.status}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className={`rounded-lg p-8 text-center ${isDarkMode ? 'bg-[#1E2A38]' : 'bg-white'}`}>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No active requests at the moment</p>
        </div>
      )}

      {/* Job Details Modal */}
      <JobDetailsModal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        job={selectedJob}
        onStartWork={handleStartWork}
        onSendUpdate={handleSendUpdate}
      />
    </div>
  );
}
