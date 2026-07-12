import { MessageSquare, Star, TrendingUp } from 'lucide-react';
import { useMechanicsTheme } from '@/context/MechanicsThemeContext';

export default function MechanicsReviewsPage() {
  const { isDarkMode } = useMechanicsTheme();
  const reviews = [
    {
      id: 1,
      customer: 'John Doe',
      rating: 5,
      date: 'Nov 24, 2025',
      comment: 'Excellent work. The oil change was done quickly and professionally. Highly recommended.',
      service: 'Oil Change & Filter Replacement',
    },
    {
      id: 2,
      customer: 'Sarah Williams',
      rating: 5,
      date: 'Nov 23, 2025',
      comment: 'Fixed the brake issue immediately and explained the repair clearly.',
      service: 'Brake Inspection',
    },
    {
      id: 3,
      customer: 'Emily Brown',
      rating: 4,
      date: 'Nov 22, 2025',
      comment: 'Good service, but took a bit longer than expected. Still satisfied overall.',
      service: 'Battery Replacement',
    },
  ];

  const avgRating = (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1);
  const cardClass = isDarkMode ? 'bg-[#151f32] border-slate-800' : 'bg-white border-slate-200';
  const mutedText = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`min-h-screen px-4 py-8 sm:px-8 ${isDarkMode ? 'bg-[#0B1120]' : 'bg-slate-50'}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-2 border-b border-slate-200/20 pb-5">
          <p className={`text-sm font-semibold uppercase tracking-wide ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
            Customer feedback
          </p>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>Reviews</h1>
          <p className={mutedText}>Track customer satisfaction across completed work.</p>
        </div>

        <div className={`mb-6 rounded-lg border p-6 ${cardClass}`}>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className={`text-sm font-medium ${mutedText}`}>Overall Rating</p>
              <div className="mt-2 flex items-end gap-3">
                <p className={`text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{avgRating}</p>
                <div className="mb-2 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star key={value} className={`h-5 w-5 ${value <= Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  ))}
                </div>
              </div>
              <p className={`mt-2 text-sm ${mutedText}`}>Based on {reviews.length} reviews</p>
            </div>
            <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
              <TrendingUp className={`mb-3 h-6 w-6 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`} />
              <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>High satisfaction</p>
              <p className={`mt-1 text-sm ${mutedText}`}>Recent jobs are trending positively.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className={`rounded-lg border p-5 ${cardClass}`}>
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className={`truncate text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{review.customer}</h3>
                  <p className={`mt-1 text-sm ${mutedText}`}>{review.service}</p>
                </div>
                <MessageSquare className={`h-5 w-5 shrink-0 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
              </div>

              <div className="mb-4 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    className={`h-4 w-4 ${value <= review.rating ? 'fill-amber-400 text-amber-400' : isDarkMode ? 'text-slate-700' : 'text-slate-300'}`}
                  />
                ))}
              </div>

              <p className={`min-h-20 text-sm leading-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{review.comment}</p>
              <p className={`mt-5 text-xs font-medium uppercase tracking-wide ${mutedText}`}>{review.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
