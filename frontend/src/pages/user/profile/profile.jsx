import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Car,
  Clock,
  CheckCircle,
  AlertCircle,
  Wrench,
  ChevronRight,
  Edit2,
  FileText,
  Plus,
  X,
  Save,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useUserTheme } from "../../../context/UserThemeContext";
import { getUserCars, getRepairRequests, updateUserProfile } from "../../../services/userService";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useUserTheme();
  const [tab, setTab] = useState("overview");
  const [cars, setCars] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    bio: user?.bio || '',
  });
  const [editError, setEditError] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carsRes = await getUserCars();
        setCars(carsRes.data || []);
        const repairsRes = await getRepairRequests();
        setRepairs(repairsRes.data || []);
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setEditLoading(true);
    setEditError(null);
    try {
      await updateUserProfile(editForm);
      alert('Profile updated successfully!');
      setIsEditingProfile(false);
      // Optionally refresh user data
      window.location.reload();
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      {/* Profile Header */}
      <div className={`text-white px-6 py-12 shadow-lg ${isDarkMode ? 'bg-gradient-to-r from-blue-800 to-blue-900' : 'bg-gradient-to-r from-blue-600 to-blue-700'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl border-4 shadow-lg ${isDarkMode ? 'bg-blue-900/40 border-blue-400/30' : 'bg-white/20 border-white/30'}`}>
              👤
            </div>

            {/* User Info */}
            <div className="flex-1 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{user?.name || 'User'}</h1>
                  <p className="text-blue-100 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} /> Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Car size={16} /> {cars.length} vehicles
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle size={16} /> {repairs.length} service requests
                    </span>
                  </p>
                </div>
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition flex items-center gap-2">
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className={`flex gap-8 mb-8 overflow-x-auto ${isDarkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
          {[
            { id: "overview", label: "Overview", icon: "📋" },
            { id: "vehicles", label: "My Vehicles", icon: "🚗" },
            { id: "history", label: "Service History", icon: "📝" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`pb-4 px-2 whitespace-nowrap text-lg font-medium transition duration-200 flex items-center gap-2 ${
                tab === item.id
                  ? "border-b-4 border-blue-600 text-blue-600"
                  : isDarkMode ? "text-gray-400 hover:text-gray-300 border-b-4 border-transparent" : "text-gray-600 hover:text-gray-900 border-b-4 border-transparent"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        {tab === "overview" && (
          <div className="space-y-6 mb-8">
            {/* Contact Information Card */}
            <div className={`rounded-2xl shadow-sm p-8 hover:shadow-md transition ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-100'}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/40' : 'bg-blue-100'}`}>
                  <Mail className="text-blue-600" size={24} />
                </div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Contact Information
                </h2>
              </div>

              <div className="space-y-4">
                {/* Email */}
                <div className={`flex items-center gap-4 p-4 rounded-lg transition ${isDarkMode ? 'bg-[#27384a] hover:bg-[#2d3f52]' : 'bg-gray-50 hover:bg-gray-100'}`}>
                  <div className={`p-2 rounded-lg flex-shrink-0 ${isDarkMode ? 'bg-blue-900/40' : 'bg-blue-100'}`}>
                    <Mail className="text-blue-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email Address</p>
                    <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {user?.email || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className={`flex items-center gap-4 p-4 rounded-lg transition ${isDarkMode ? 'bg-[#27384a] hover:bg-[#2d3f52]' : 'bg-gray-50 hover:bg-gray-100'}`}>
                  <div className={`p-2 rounded-lg flex-shrink-0 ${isDarkMode ? 'bg-green-900/40' : 'bg-green-100'}`}>
                    <Phone className="text-green-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone Number</p>
                    <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {user?.phone ? (
                        <a href={`tel:${user.phone}`} className="hover:text-blue-600">
                          {user.phone}
                        </a>
                      ) : (
                        <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>Not provided</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className={`flex items-center gap-4 p-4 rounded-lg transition ${isDarkMode ? 'bg-[#27384a] hover:bg-[#2d3f52]' : 'bg-gray-50 hover:bg-gray-100'}`}>
                  <div className={`p-2 rounded-lg flex-shrink-0 ${isDarkMode ? 'bg-red-900/40' : 'bg-red-100'}`}>
                    <MapPin className="text-red-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Street Address</p>
                    <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {user?.address || 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* City */}
                {user?.city && (
                  <div className={`flex items-center gap-4 p-4 rounded-lg transition ${isDarkMode ? 'bg-[#27384a] hover:bg-[#2d3f52]' : 'bg-gray-50 hover:bg-gray-100'}`}>
                    <div className={`p-2 rounded-lg flex-shrink-0 ${isDarkMode ? 'bg-purple-900/40' : 'bg-purple-100'}`}>
                      <MapPin className="text-purple-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>City</p>
                      <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {user.city}
                      </p>
                    </div>
                  </div>
                )}

                {/* Member Since */}
                <div className={`flex items-center gap-4 p-4 rounded-lg transition ${isDarkMode ? 'bg-[#27384a] hover:bg-[#2d3f52]' : 'bg-gray-50 hover:bg-gray-100'}`}>
                  <div className={`p-2 rounded-lg flex-shrink-0 ${isDarkMode ? 'bg-orange-900/40' : 'bg-orange-100'}`}>
                    <Calendar className="text-orange-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Member Since</p>
                    <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                {user?.bio && (
                  <div className={`flex items-start gap-4 p-4 rounded-lg border ${isDarkMode ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-100'}`}>
                    <div className={`p-2 rounded-lg flex-shrink-0 mt-1 ${isDarkMode ? 'bg-purple-900/40' : 'bg-purple-100'}`}>
                      <span className="text-purple-600 text-lg">ℹ️</span>
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Bio</p>
                      <p className={`text-lg font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {user.bio}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditingProfile(true)}
                className={`w-full mt-6 px-4 py-3 border-2 rounded-lg transition font-semibold flex items-center justify-center gap-2 ${isDarkMode ? 'border-blue-600 text-blue-400 hover:bg-blue-900/20' : 'border-blue-600 text-blue-600 hover:bg-blue-50'}`}
              >
                <Edit2 size={18} />
                Edit Contact Information
              </button>
            </div>

            {/* Maintenance Reminders Card */}
            <div className={`rounded-2xl shadow-sm p-8 hover:shadow-md transition ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-100'}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-amber-900/40' : 'bg-amber-100'}`}>
                    <AlertCircle className="text-amber-600" size={24} />
                  </div>
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Maintenance Reminders
                  </h2>
                </div>
                <button className={`px-4 py-2 rounded-lg transition flex items-center gap-2 font-semibold ${isDarkMode ? 'bg-amber-900/20 text-amber-400 hover:bg-amber-900/30' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}>
                  <Plus size={18} />
                  Add Reminder
                </button>
              </div>

              <div className="space-y-3">
                {/* Reminder 1 - Due Soon */}
                <div className={`border-l-4 border-red-500 p-4 rounded-lg hover:shadow-md transition ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Wrench size={18} className="text-red-600" />
                        <p className={`font-bold ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>Oil Change</p>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded ${isDarkMode ? 'bg-red-900/40 text-red-400' : 'bg-red-200 text-red-700'}`}>
                          Urgent
                        </span>
                      </div>
                      <p className={`text-sm ml-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Toyota Camry 2020
                      </p>
                      <p className={`text-sm font-semibold ml-6 mt-1 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                        Due: Feb 15, 2026
                      </p>
                    </div>
                    <button className={`px-4 py-2 text-white rounded-lg transition font-semibold flex items-center gap-1 ${isDarkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'}`}>
                      Schedule <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Reminder 2 - Due Soon */}
                <div className={`border-l-4 border-yellow-500 p-4 rounded-lg hover:shadow-md transition ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Wrench size={18} className="text-yellow-600" />
                        <p className={`font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                          Tire Rotation
                        </p>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded ${isDarkMode ? 'bg-yellow-900/40 text-yellow-400' : 'bg-yellow-200 text-yellow-700'}`}>
                          Soon
                        </span>
                      </div>
                      <p className={`text-sm ml-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Honda Civic 2019
                      </p>
                      <p className={`text-sm font-semibold ml-6 mt-1 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        Due: Dec 28, 2025
                      </p>
                    </div>
                    <button className={`px-4 py-2 text-white rounded-lg transition font-semibold flex items-center gap-1 ${isDarkMode ? 'bg-yellow-700 hover:bg-yellow-600' : 'bg-yellow-600 hover:bg-yellow-700'}`}>
                      Schedule <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Reminder 3 - Due Immediately */}
                <div className={`border-l-4 border-orange-500 p-4 rounded-lg hover:shadow-md transition ${isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Wrench size={18} className="text-orange-600" />
                        <p className={`font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-700'}`}>
                          Brake Inspection
                        </p>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded ${isDarkMode ? 'bg-orange-900/40 text-orange-400' : 'bg-orange-200 text-orange-700'}`}>
                          Critical
                        </span>
                      </div>
                      <p className={`text-sm ml-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Toyota Camry 2020
                      </p>
                      <p className={`text-sm font-semibold ml-6 mt-1 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                        Due: Dec 1, 2025
                      </p>
                    </div>
                    <button className={`px-4 py-2 text-white rounded-lg transition font-semibold flex items-center gap-1 ${isDarkMode ? 'bg-orange-700 hover:bg-orange-600' : 'bg-orange-600 hover:bg-orange-700'}`}>
                      Schedule <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MY VEHICLES TAB */}
        {tab === "vehicles" && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Your Vehicles
              </h2>
              <button 
                onClick={() => navigate('/user/addCar')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2">
                <Plus size={20} />
                Add Vehicle
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {cars.length > 0 ? cars.map((car) => (
                <div key={car._id} className={`rounded-2xl shadow-sm p-6 hover:shadow-lg transition ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-100'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/40' : 'bg-blue-100'}`}>
                        <Car className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                          {car.year} {car.make} {car.model}
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{car.licensePlate}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Edit2
                        className="text-gray-400 hover:text-blue-600"
                        size={18}
                      />
                    </button>
                  </div>

                  <div className={`space-y-2 mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-[#27384a]' : 'bg-gray-50'}`}>
                    <div className="flex justify-between text-sm">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>VIN:</span>
                      <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {car.vin || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Mileage:</span>
                      <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {car.mileage || 0} miles
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Fuel Type:</span>
                      <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {car.fuelType || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2">
                    <FileText size={18} />
                    View Service History
                  </button>
                </div>
              )) : (
                <div className="col-span-2 text-center py-8">
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No vehicles added yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SERVICE HISTORY TAB */}
        {tab === "history" && (
          <div className="space-y-4 mb-8">
            {repairs.length > 0 ? repairs.map((repair) => (
              <div key={repair._id} className={`rounded-2xl shadow-sm p-6 hover:shadow-lg transition ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-100'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-green-900/40' : 'bg-green-100'}`}>
                      <CheckCircle className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {repair.serviceType || 'Service Request'}
                      </h3>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(repair.createdAt).toLocaleDateString()} • Status: {repair.status}
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 font-semibold rounded-lg text-sm ${
                    repair.status === 'completed' ? 'bg-green-100 text-green-700' :
                    repair.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {repair.status}
                  </span>
                </div>

                <div className={`p-4 rounded-lg mb-4 ${isDarkMode ? 'bg-[#27384a]' : 'bg-gray-50'}`}>
                  <p className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Details:</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{repair.description || 'No description'}</p>
                </div>

                <div className="flex gap-3">
                  <button className={`flex-1 px-4 py-2 border-2 rounded-lg transition font-semibold flex items-center justify-center gap-2 ${isDarkMode ? 'border-blue-600 text-blue-400 hover:bg-blue-900/20' : 'border-blue-600 text-blue-600 hover:bg-blue-50'}`}>
                    <FileText size={18} />
                    View Details
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No service history yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto ${isDarkMode ? 'bg-[#1E2A38]' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-6 sticky top-0 ${isDarkMode ? 'bg-[#1E2A38] border-b border-gray-700' : 'bg-white border-b border-gray-200'}`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Edit Profile</h2>
              <button
                onClick={() => setIsEditingProfile(false)}
                className={`p-1 rounded-lg transition ${isDarkMode ? 'hover:bg-[#27384a]' : 'hover:bg-gray-100'}`}
              >
                <X size={24} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
              </button>
            </div>

            <div className={`p-6 space-y-4 ${isDarkMode ? 'bg-[#1E2A38]' : ''}`}>
              {editError && (
                <div className={`p-4 border rounded-lg text-sm ${isDarkMode ? 'bg-red-900/20 border-red-700 text-red-400' : 'bg-red-50 border-red-300 text-red-600'}`}>
                  {editError}
                </div>
              )}

              {/* Name */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditFormChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-[#27384a] border-gray-600 text-white' : 'border-gray-300'}`}
                />
              </div>

              {/* Email */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditFormChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-[#27384a] border-gray-600 text-white' : 'border-gray-300'}`}
                />
              </div>

              {/* Phone */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditFormChange}
                  placeholder="+1 (555) 123-4567"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-[#27384a] border-gray-600 text-white' : 'border-gray-300'}`}
                />
              </div>

              {/* Address */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={editForm.address}
                  onChange={handleEditFormChange}
                  placeholder="123 Main St"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-[#27384a] border-gray-600 text-white' : 'border-gray-300'}`}
                />
              </div>

              {/* City */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>City</label>
                <input
                  type="text"
                  name="city"
                  value={editForm.city}
                  onChange={handleEditFormChange}
                  placeholder="New York"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-[#27384a] border-gray-600 text-white' : 'border-gray-300'}`}
                />
              </div>

              {/* Bio */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bio</label>
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleEditFormChange}
                  placeholder="Tell us about yourself..."
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-[#27384a] border-gray-600 text-white' : 'border-gray-300'}`}
                  rows="3"
                />
              </div>
            </div>

            <div className={`flex gap-3 p-6 border-t ${isDarkMode ? 'bg-[#27384a] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <button
                onClick={() => setIsEditingProfile(false)}
                className={`flex-1 px-4 py-2 border-2 rounded-lg transition font-semibold ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-[#1E2A38]' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2 disabled:bg-gray-400"
                disabled={editLoading}
              >
                <Save size={18} />
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}}
    </div>
  );
}
