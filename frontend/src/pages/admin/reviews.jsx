import React from 'react';
import {
  Search,
  ShoppingCart,
  User,
  Star,
  Flag,
  Trash2
} from 'lucide-react';

// --- Mock Data ---
const reviewsData = [
  { id: 1, user: 'John Smith', mechanic: 'Tom Wilson', rating: 5, comment: 'Excellent service! Very professional and quick.', date: '2025-10-15', sentiment: 'Positive' },
  { id: 2, user: 'Sarah Johnson', mechanic: 'Sarah Lee', rating: 4, comment: 'Good work, but took a bit longer than expected.', date: '2025-10-14', sentiment: 'Positive' },
  { id: 3, user: 'Mike Williams', mechanic: 'Tom Wilson', rating: 5, comment: 'Tom is amazing! Fixed my car perfectly.', date: '2025-10-12', sentiment: 'Positive' },
  { id: 4, user: 'Emily Davis', mechanic: 'James Martinez', rating: 3, comment: 'Average service, nothing special.', date: '2025-10-10', sentiment: 'Neutral' },
  { id: 5, user: 'David Brown', mechanic: 'Linda Garcia', rating: 5, comment: 'Linda was very knowledgeable and friendly!', date: '2025-10-08', sentiment: 'Positive' },
];

// Helper object for styling sentiment badges
const sentimentClasses = {
  Positive: 'bg-green-100 text-green-700',
  Neutral: 'bg-yellow-100 text-yellow-700',
  Negative: 'bg-red-100 text-red-700',
};

// --- Single ReviewsPage Component ---
export default function ReviewsPage() {
  const maxRating = 5; // Define max rating for stars

  return (
    // Main container with light gray background
    <div className="min-h-screen bg-slate-100">
      
      {/* --- App Header --- */}
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Search Bar */}
            <div className="flex-shrink-0 flex items-center">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-100 rounded-md py-2 pl-10 pr-4 block w-full sm:text-sm border-transparent focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Right Side Icons & User */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  2
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <div className="font-medium text-gray-800">Admin User</div>
                  <div className="text-sm text-gray-500">admin@carfix.com</div>
                </div>
                <div className="h-10 w-10 bg-red-500 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="p-6 sm:p-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Reviews & Feedback
          </h1>
        </div>

        {/* --- Reviews Table Card --- */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">All Reviews</h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['User', 'Mechanic', 'Rating', 'Comment', 'Date', 'Sentiment', 'Actions'].map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviewsData.map((review) => (
                  <tr key={review.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{review.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{review.mechanic}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      
                      {/* --- Inlined StarRating --- */}
                      <div className="flex items-center">
                        {[...Array(maxRating)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill={i < review.rating ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                      {/* --- End of Inlined StarRating --- */}
                      
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{review.comment}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{review.date}</td>
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
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-50">
                        <Flag className="h-4 w-4" />
                        <span>Flag</span>
                      </button>
                      <button className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- Stats Cards --- */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Average Rating Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Average Rating</div>
            <div className="flex items-end space-x-2">
              <div className="text-3xl font-semibold text-gray-900">4.4</div>
              <div className="text-lg text-gray-400">/ 5.0</div>
            </div>
            <div className="mt-3">
              {/* Inlined StarRating for the summary card */}
              <div className="flex items-center">
                {[...Array(maxRating)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < 4 ? 'text-yellow-400' : 'text-gray-300' // Hardcoded to 4 stars as per image
                    }`}
                    fill={i < 4 ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Total Reviews Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Total Reviews</div>
            <div className="text-3xl font-semibold text-gray-900">247</div>
          </div>

          {/* Positive Reviews Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Positive Reviews</div>
            <div className="text-3xl font-semibold text-gray-900">215 <span className="text-lg text-gray-500 font-normal">(87%)</span></div>
          </div>

        </div>
      </main>
    </div>
  );
}