import { useMechanicsTheme } from '../../context/MechanicsThemeContext';

export default function MechanicsReviewsPage() {
  const { isDarkMode } = useMechanicsTheme();
  const reviews = [
    {
      id: 1,
      customer: "John Doe",
      rating: 5,
      date: "Nov 24, 2025",
      comment: "Excellent work! The oil change was done quickly and professionally. Highly recommended!",
      service: "Oil Change & Filter Replacement"
    },
    {
      id: 2,
      customer: "Sarah Williams",
      rating: 5,
      date: "Nov 23, 2025",
      comment: "Perfect! Fixed the brake issue immediately. Very knowledgeable mechanic.",
      service: "Brake Inspection"
    },
    {
      id: 3,
      customer: "Emily Brown",
      rating: 4,
      date: "Nov 22, 2025",
      comment: "Good service, but took a bit longer than expected. Still satisfied overall.",
      service: "Battery Replacement"
    }
  ];

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className={`pt-6 px-6 max-w-6xl transition-colors duration-300 ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Customer Reviews</h1>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Feedback from your completed jobs</p>
      </div>

      {/* Overall Rating */}
      <div className={`rounded-lg p-6 border mb-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Overall Rating</p>
            <h3 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{avgRating} ⭐</h3>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Based on {reviews.length} reviews</p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className={`rounded-lg shadow p-5 border transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{review.customer}</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{review.service}</p>
              </div>
              <span className={isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}>{'⭐'.repeat(review.rating)}</span>
            </div>
            <p className={`mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{review.comment}</p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>{review.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
