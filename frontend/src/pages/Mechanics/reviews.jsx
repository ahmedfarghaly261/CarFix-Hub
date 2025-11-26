export default function MechanicsReviewsPage() {
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
    <div className="pt-6 px-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Customer Reviews</h1>
        <p className="text-gray-400">Feedback from your completed jobs</p>
      </div>

      {/* Overall Rating */}
      <div className="bg-[#1E2A38] rounded-lg p-6 border border-gray-700 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 mb-2">Overall Rating</p>
            <h3 className="text-4xl font-bold text-white">{avgRating} ⭐</h3>
            <p className="text-gray-500 text-sm mt-1">Based on {reviews.length} reviews</p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-[#1E2A38] rounded-lg shadow p-5 border border-gray-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-white">{review.customer}</h3>
                <p className="text-gray-400 text-sm">{review.service}</p>
              </div>
              <span className="text-yellow-400 text-lg">{'⭐'.repeat(review.rating)}</span>
            </div>
            <p className="text-gray-300 mb-3">{review.comment}</p>
            <p className="text-gray-500 text-sm">{review.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
