import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  User,
  Star,
  Flag,
  Trash2,
  Loader
} from 'lucide-react';
import { useAdminTheme } from '../../context/AdminThemeContext';
import API from '../../services/api';

// Helper object for styling sentiment badges
const sentimentClasses = {
  Positive: 'bg-green-100 text-green-700',
  Neutral: 'bg-yellow-100 text-yellow-700',
  Negative: 'bg-red-100 text-red-700',
};

// Helper function to determine sentiment based on rating
const determineSentiment = (rating) => {
  if (rating >= 4) return 'Positive';
  if (rating === 3) return 'Neutral';
  return 'Negative';
};

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

// --- Single ReviewsPage Component ---
export default function ReviewsPage() {
  const { isDarkMode } = useAdminTheme();
  const maxRating = 5;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState<any>({
    averageRating: 0,
    totalReviews: 0,
    positiveReviews: 0
  });

  // Fetch reviews from API
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all reviews from admin endpoint
      const response = await API.get('/admin/reviews');
      
      console.log('Reviews API Response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        const reviewsWithDetails = response.data.map((review, idx) => {
          // Debug logging for missing data
          if (!review.userId?.name || !review.mechanicId?.name) {
            console.warn(`Review ${review._id}:`, {
              userId: review.userId,
              mechanicId: review.mechanicId,
              repairRequestId: review.repairRequestId
            });
          }
          
          return {
            id: review._id,
            user: review.userId?.name || (review.userId ? `User ${review.userId._id}` : 'Unknown User'),
            mechanic: review.mechanicId?.name || (review.mechanicId ? `Mechanic ${review.mechanicId._id}` : 'Unknown Mechanic'),
            rating: review.rating || 0,
            comment: review.comment || '',
            date: formatDate(review.createdAt),
            sentiment: determineSentiment(review.rating),
            workQuality: review.workQuality,
            timeliness: review.timeliness,
            communication: review.communication
          };
        });
        
        console.log('Processed Reviews:', reviewsWithDetails);
        setReviews(reviewsWithDetails);
        
        // Calculate stats
        if (reviewsWithDetails.length > 0) {
          const avgRating = (reviewsWithDetails.reduce((sum, r) => sum + r.rating, 0) / reviewsWithDetails.length).toFixed(1);
          const positiveCount = reviewsWithDetails.filter(r => r.sentiment === 'Positive').length;
          const positivePercentage = ((positiveCount / reviewsWithDetails.length) * 100).toFixed(0);
          
          setStats({
            averageRating: avgRating,
            totalReviews: reviewsWithDetails.length,
            positiveReviews: `${positiveCount} (${positivePercentage}%)`
          });
        }
      } else {
        setReviews([]);
        setError('No reviews data received from API');
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.response?.data?.message || 'Failed to fetch reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    try {
      await API.delete(`/admin/reviews/${reviewId}`);
      setReviews(reviews.filter(r => r.id !== reviewId));
      // Recalculate stats
      fetchReviews();
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review');
    }
  }

  return (
    // Main container with light gray background
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-[#101828]' : 'bg-slate-100'}`}>
      
      {/* --- Main Content Area --- */}
      <main className="p-6 sm:p-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Reviews & Feedback
          </h1>
          <button
            onClick={fetchReviews}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin mr-2" size={24} />
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Loading reviews...</span>
          </div>
        ) : (
          <>
            {/* --- Reviews Table Card --- */}
            <div className={`rounded-lg shadow-lg overflow-hidden ${isDarkMode ? 'bg-[#1E2A38]' : 'bg-white'}`}>
              
              {/* Card Header */}
              <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700 bg-[#27384a]' : 'border-gray-200 bg-gray-50'}`}>
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  All Reviews ({reviews.length})
                </h2>
              </div>

              {/* Table */}
              {reviews.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    <thead className={isDarkMode ? 'bg-[#27384a]' : 'bg-gray-50'}>
                      <tr>
                        {['User', 'Mechanic', 'Rating', 'Comment', 'Date', 'Sentiment', 'Actions'].map((header) => (
                          <th
                            key={header}
                            scope="col"
                            className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {reviews.map((review) => (
                        <tr key={review.id} className={isDarkMode ? 'hover:bg-[#27384a]' : 'hover:bg-gray-50'}>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {review.user}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {review.mechanic}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            
                            {/* --- Inlined StarRating --- */}
                            <div className="flex items-center">
                              {[...Array(maxRating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < review.rating ? 'text-yellow-400' : isDarkMode ? 'text-gray-600' : 'text-gray-300'
                                  }`}
                                  fill={i < review.rating ? 'currentColor' : 'none'}
                                />
                              ))}
                            </div>
                            {/* --- End of Inlined StarRating --- */}
                            
                          </td>
                          <td className={`px-6 py-4 text-sm max-w-xs truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {review.comment}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {review.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">

                            {/* --- Inlined SentimentBadge --- */}
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                sentimentClasses[review.sentiment] || 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {review.sentiment}
                            </span>
                            {/* --- End of Inlined SentimentBadge --- */}
                            
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                            <button className={`flex items-center space-x-1 px-2 py-1 rounded-md border transition ${
                              isDarkMode
                                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                            }`}>
                              <Flag className="h-4 w-4" />
                              <span>Flag</span>
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={`p-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No reviews yet. Check back when users submit feedback!
                </div>
              )}
            </div>

            {/* --- Stats Cards --- */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Average Rating Card */}
              <div className={`rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-[#1E2A38]' : 'bg-white'}`}>
                <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Average Rating
                </div>
                <div className="flex items-end space-x-2">
                  <div className={`text-3xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.averageRating}
                  </div>
                  <div className={`text-lg ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>/ 5.0</div>
                </div>
                <div className="mt-3">
                  {/* Inlined StarRating for the summary card */}
                  <div className="flex items-center">
                    {[...Array(maxRating)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(parseFloat(stats.averageRating)) ? 'text-yellow-400' : isDarkMode ? 'text-gray-600' : 'text-gray-300'
                        }`}
                        fill={i < Math.round(parseFloat(stats.averageRating)) ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Total Reviews Card */}
              <div className={`rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-[#1E2A38]' : 'bg-white'}`}>
                <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Total Reviews
                </div>
                <div className={`text-3xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalReviews}
                </div>
              </div>

              {/* Positive Reviews Card */}
              <div className={`rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-[#1E2A38]' : 'bg-white'}`}>
                <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Positive Reviews
                </div>
                <div className={`text-3xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.positiveReviews}
                </div>
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  );
}