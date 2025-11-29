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
import { getUserCars, getRepairRequests, updateUserProfile } from "../../../services/userService";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-12 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-5xl border-4 border-white/30 shadow-lg">
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
        <div className="flex gap-8 border-b border-gray-200 mb-8 overflow-x-auto">
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
                  : "text-gray-600 hover:text-gray-900 border-b-4 border-transparent"
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Contact Information
                </h2>
              </div>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <Mail className="text-blue-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">Email Address</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {user?.email || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                    <Phone className="text-green-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">Phone Number</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {user?.phone ? (
                        <a href={`tel:${user.phone}`} className="hover:text-blue-600">
                          {user.phone}
                        </a>
                      ) : (
                        <span className="text-gray-400">Not provided</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                    <MapPin className="text-red-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">Street Address</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {user?.address || 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* City */}
                {user?.city && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                      <MapPin className="text-purple-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 font-medium">City</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {user.city}
                      </p>
                    </div>
                  </div>
                )}

                {/* Member Since */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                    <Calendar className="text-orange-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">Member Since</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                {user?.bio && (
                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0 mt-1">
                      <span className="text-purple-600 text-lg">ℹ️</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 font-medium">Bio</p>
                      <p className="text-lg font-semibold text-gray-800 mt-1">
                        {user.bio}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditingProfile(true)}
                className="w-full mt-6 px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold flex items-center justify-center gap-2"
              >
                <Edit2 size={18} />
                Edit Contact Information
              </button>
            </div>

            {/* Maintenance Reminders Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <AlertCircle className="text-amber-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Maintenance Reminders
                  </h2>
                </div>
                <button className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition flex items-center gap-2 font-semibold">
                  <Plus size={18} />
                  Add Reminder
                </button>
              </div>

              <div className="space-y-3">
                {/* Reminder 1 - Due Soon */}
                <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-lg hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Wrench size={18} className="text-red-600" />
                        <p className="font-bold text-red-700">Oil Change</p>
                        <span className="px-2 py-0.5 bg-red-200 text-red-700 text-xs font-semibold rounded">
                          Urgent
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">
                        Toyota Camry 2020
                      </p>
                      <p className="text-sm font-semibold text-red-600 ml-6 mt-1">
                        Due: Feb 15, 2026
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-1">
                      Schedule <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Reminder 2 - Due Soon */}
                <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-lg hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Wrench size={18} className="text-yellow-600" />
                        <p className="font-bold text-yellow-700">
                          Tire Rotation
                        </p>
                        <span className="px-2 py-0.5 bg-yellow-200 text-yellow-700 text-xs font-semibold rounded">
                          Soon
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">
                        Honda Civic 2019
                      </p>
                      <p className="text-sm font-semibold text-yellow-600 ml-6 mt-1">
                        Due: Dec 28, 2025
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold flex items-center gap-1">
                      Schedule <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Reminder 3 - Due Immediately */}
                <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-lg hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Wrench size={18} className="text-orange-600" />
                        <p className="font-bold text-orange-700">
                          Brake Inspection
                        </p>
                        <span className="px-2 py-0.5 bg-orange-200 text-orange-700 text-xs font-semibold rounded">
                          Critical
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">
                        Toyota Camry 2020
                      </p>
                      <p className="text-sm font-semibold text-orange-600 ml-6 mt-1">
                        Due: Dec 1, 2025
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold flex items-center gap-1">
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
              <h2 className="text-2xl font-bold text-gray-800">
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
                <div key={car._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Car className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {car.year} {car.make} {car.model}
                        </h3>
                        <p className="text-sm text-gray-500">{car.licensePlate}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Edit2
                        className="text-gray-400 hover:text-blue-600"
                        size={18}
                      />
                    </button>
                  </div>

                  <div className="space-y-2 mb-6 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">VIN:</span>
                      <span className="font-semibold text-gray-800">
                        {car.vin || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Mileage:</span>
                      <span className="font-semibold text-gray-800">
                        {car.mileage || 0} miles
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Fuel Type:</span>
                      <span className="font-semibold text-gray-800">
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
                  <p className="text-gray-500">No vehicles added yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SERVICE HISTORY TAB */}
        {tab === "history" && (
          <div className="space-y-4 mb-8">
            {repairs.length > 0 ? repairs.map((repair) => (
              <div key={repair._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {repair.serviceType || 'Service Request'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
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

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold text-gray-800 mb-2">Details:</p>
                  <p className="text-sm text-gray-600">{repair.description || 'No description'}</p>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold flex items-center justify-center gap-2">
                    <FileText size={18} />
                    View Details
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No service history yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {editError && (
                <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-red-600 text-sm">
                  {editError}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditFormChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={editForm.address}
                  onChange={handleEditFormChange}
                  placeholder="123 Main St"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={editForm.city}
                  onChange={handleEditFormChange}
                  placeholder="New York"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleEditFormChange}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsEditingProfile(false)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold"
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
      )}
    </div>
  );
}
