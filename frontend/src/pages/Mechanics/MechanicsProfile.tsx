import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMechanicsTheme } from '../../context/MechanicsThemeContext';
import API from '../../services/api';
import { Save, X, Edit2 } from 'lucide-react';

export default function MechanicsProfile() {
  const { user } = useAuth();
  const { isDarkMode } = useMechanicsTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    address: '',
    city: '',
    specializations: [],
    rating: 0,
    totalJobs: 0,
    completedJobs: 0,
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    address: '',
    city: '',
    specializations: '',
  });

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await API.get('/mechanics/profile');
      setProfile(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email || '',
        phone: response.data.phone || '',
        bio: response.data.bio || '',
        address: response.data.address || '',
        city: response.data.city || '',
        specializations: response.data.specializations?.join(', ') || '',
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setMessage('Failed to load profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setMessage('');

      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        address: formData.address,
        city: formData.city,
        specializations: formData.specializations
          .split(',')
          .map(s => s.trim())
          .filter(s => s)
      };

      const response = await API.put('/mechanics/profile', updateData);
      setProfile(response.data);
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name,
      email: profile.email || '',
      phone: profile.phone || '',
      bio: profile.bio || '',
      address: profile.address || '',
      city: profile.city || '',
      specializations: profile.specializations?.join(', ') || '',
    });
    setIsEditing(false);
    setMessage('');
  };

  return (
    <div className={`pt-6 px-6 max-w-4xl mx-auto transition-colors duration-300 ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          >
            <Edit2 size={18} />
            Edit Profile
          </button>
        )}
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.includes('successfully') ? (isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') : (isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800')}`}>
          {message}
        </div>
      )}

      {/* Profile Card */}
      <div className={`shadow rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200'}`}>
        
        {/* Personal Info Section */}
        <div className="p-6 border-b border-gray-700">
          <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Personal Information</h3>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isDarkMode ? 'bg-[#27384a] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              ) : (
                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {profile.name || 'Not set'}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isDarkMode ? 'bg-[#27384a] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              ) : (
                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {profile.email || 'Not set'}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isDarkMode ? 'bg-[#27384a] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              ) : (
                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {profile.phone || 'Not set'}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                City
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isDarkMode ? 'bg-[#27384a] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              ) : (
                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {profile.city || 'Not set'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="p-6 border-b border-gray-700">
          <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Address
          </label>
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isDarkMode ? 'bg-[#27384a] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          ) : (
            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {profile.address || 'Not set'}
            </p>
          )}
        </div>

        {/* Bio Section */}
        <div className="p-6 border-b border-gray-700">
          <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Bio
          </label>
          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              placeholder="Tell us about yourself..."
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isDarkMode ? 'bg-[#27384a] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          ) : (
            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {profile.bio || 'Not set'}
            </p>
          )}
        </div>

        {/* Specializations Section */}
        <div className="p-6 border-b border-gray-700">
          <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Specializations (comma separated)
          </label>
          {isEditing ? (
            <input
              type="text"
              name="specializations"
              value={formData.specializations}
              onChange={handleInputChange}
              placeholder="e.g., Engine Repair, Brake Service, Oil Changes"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isDarkMode ? 'bg-[#27384a] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.specializations && profile.specializations.length > 0 ? (
                profile.specializations.map((spec, idx) => (
                  <span key={idx} className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                    {spec}
                  </span>
                ))
              ) : (
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Not set</p>
              )}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="p-6 grid grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg text-center ${isDarkMode ? 'bg-[#27384a]' : 'bg-gray-50'}`}>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {profile.rating || 0}
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rating</p>
          </div>
          <div className={`p-4 rounded-lg text-center ${isDarkMode ? 'bg-[#27384a]' : 'bg-gray-50'}`}>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {profile.totalJobs || 0}
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Jobs</p>
          </div>
          <div className={`p-4 rounded-lg text-center ${isDarkMode ? 'bg-[#27384a]' : 'bg-gray-50'}`}>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {profile.completedJobs || 0}
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Completed Jobs</p>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="p-6 border-t border-gray-700 flex gap-4 justify-end">
            <button
              onClick={handleCancel}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-900'}`}
            >
              <X size={18} />
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
