import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useUserTheme } from '@/context/UserThemeContext';
import API from '@/services/api.service';
import { Star, ArrowLeft } from 'lucide-react';

export default function RepairDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isDarkMode } = useUserTheme();
  
  const [repair, setRepair] = useState(null);
  const [review, setReview] = useState(null);
  const [hasReview, setHasReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    rating: 5,
    workQuality: 5,
    timeliness: 5,
    communication: 5,
    comment: ''
  });

  useEffect(() => {
    fetchRepairDetails();
  }, [id]);

  const fetchRepairDetails = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/users/repair/${id}`);
      setRepair(response.data.repair);
      setReview(response.data.review);
      setHasReview(response.data.hasReview);
    } catch (error) {
      console.error('Error fetching repair details:', error);
      setMessage('Failed to load repair details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'comment' ? value : parseInt(value)
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!formData.comment.trim()) {
      setMessage('Please enter a comment');
      return;
    }

    try {
      setSubmitting(true);
      setMessage('');

      const response = await API.post('/users/reviews', {
        repairRequestId: id,
        ...formData
      });

      setReview(response.data.review);
      setHasReview(true);
      setMessage('Review submitted successfully!');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setMessage(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`px-6 min-h-screen ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
        <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Loading repair details...
        </p>
      </div>
    );
  }

  if (!repair) {
    return (
      <div className={`px-6 min-h-screen ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Repair not found
        </p>
      </div>
    );
  }

  return (
    <div className={`px-6 max-w-4xl mx-auto pb-12 ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.includes('successfully') ? (isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') : (isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800')}`}>
          {message}
        </div>
      )}

      {/* Repair Details */}
      <div className={`rounded-lg shadow p-6 mb-6 transition-colors ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200'}`}>
        <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {repair.title}
        </h1>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Vehicle</p>
            <p className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {repair.carId?.year} {repair.carId?.make} {repair.carId?.model}
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Plate: {repair.carId?.plate}
            </p>
          </div>

          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Cost</p>
            <p className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              ${repair.totalCost || 'TBD'}
            </p>
          </div>

          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Mechanic</p>
            <p className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {repair.assignedTo?.name}
            </p>
          </div>

          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Mechanic Rating</p>
            <div className="flex items-center gap-2">
              <span className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {repair.assignedTo?.rating || 'Not rated'}
              </span>
              <Star size={20} className="text-yellow-500 fill-yellow-500" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
            Mechanic's Summary
          </p>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#27384a]' : 'bg-gray-50'}`}>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              {repair.reportDetails || 'No summary provided'}
            </p>
          </div>
        </div>

        {repair.iterations && repair.iterations.length > 0 && (
          <div className="mb-6">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
              Detailed Work History
            </p>
            <div className="space-y-3">
              {repair.iterations.map((iteration, idx) => (
                <div key={idx} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {iteration.description || `Update #${idx + 1}`}
                    </p>
                    {iteration.cost?.total > 0 && (
                      <span className={`font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                        ${iteration.cost.total}
                      </span>
                    )}
                  </div>
                  {iteration.mechanicNotes && (
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Notes: {iteration.mechanicNotes}
                    </p>
                  )}
                  {iteration.completedAt && (
                    <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {new Date(iteration.completedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
            Description
          </p>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {repair.description}
          </p>
        </div>
      </div>

      {/* Review Section */}
      {hasReview ? (
        <div className={`rounded-lg shadow p-6 transition-colors ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Your Review
          </h2>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Overall Rating</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {review?.rating}
                </span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < review?.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Submitted</p>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {new Date(review?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Work Quality</p>
              <div className="flex gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < review?.workQuality ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Timeliness</p>
              <div className="flex gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < review?.timeliness ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Communication</p>
              <div className="flex gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < review?.communication ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Comment</p>
            <p className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#27384a] text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
              {review?.comment}
            </p>
          </div>
        </div>
      ) : (
        <div className={`rounded-lg shadow p-6 transition-colors ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Rate This Repair
          </h2>

          <form onSubmit={handleSubmitReview}>
            {/* Overall Rating */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Overall Rating
              </label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: value }))}
                    className="transition transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={formData.rating >= value ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Ratings */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Work Quality
                </label>
                <select
                  name="workQuality"
                  value={formData.workQuality}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-[#27384a] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value={5}>⭐ Excellent</option>
                  <option value={4}>⭐ Good</option>
                  <option value={3}>⭐ Average</option>
                  <option value={2}>⭐ Poor</option>
                  <option value={1}>⭐ Very Poor</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Timeliness
                </label>
                <select
                  name="timeliness"
                  value={formData.timeliness}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-[#27384a] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value={5}>⭐ Excellent</option>
                  <option value={4}>⭐ Good</option>
                  <option value={3}>⭐ Average</option>
                  <option value={2}>⭐ Poor</option>
                  <option value={1}>⭐ Very Poor</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Communication
                </label>
                <select
                  name="communication"
                  value={formData.communication}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-[#27384a] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value={5}>⭐ Excellent</option>
                  <option value={4}>⭐ Good</option>
                  <option value={3}>⭐ Average</option>
                  <option value={2}>⭐ Poor</option>
                  <option value={1}>⭐ Very Poor</option>
                </select>
              </div>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Comment
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                rows={5}
                placeholder="Share your experience with this mechanic..."
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-[#27384a] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-500 transition"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
