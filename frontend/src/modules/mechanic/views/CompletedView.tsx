import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, DollarSign, FileText, Star, Trophy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMechanicsTheme } from '@/context/MechanicsThemeContext';
import { useToast } from '@/components/ui/useToast';
import { getCompletedJobs } from '@/modules/mechanic/services/mechanic.service';

export default function MechanicsCompletedPage() {
  const { user } = useAuth();
  const { isDarkMode } = useMechanicsTheme();
  const toast = useToast();
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      try {
        setLoading(true);
        const response = await getCompletedJobs();

        const mappedJobs = (response.data || []).map((job) => ({
          id: job._id,
          title: job.title,
          customer: job.userId?.name || 'Unknown customer',
          car: job.carId ? `${job.carId.year} ${job.carId.make} ${job.carId.model}` : 'Unknown vehicle',
          completedDate: job.actualCompletionDate
            ? new Date(job.actualCompletionDate).toLocaleDateString()
            : job.updatedAt
              ? new Date(job.updatedAt).toLocaleDateString()
              : 'N/A',
          rating: job.rating || job.review?.rating || 0,
          cost: Number(job.totalCost || 0),
          reportDetails: job.reportDetails || 'No report added',
        }));

        setCompletedJobs(mappedJobs);
        setError(null);
      } catch (err) {
        console.error('Error fetching completed jobs:', err);
        setError('Failed to load completed jobs');
        toast.error('Failed to load completed jobs.');
        setCompletedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCompletedJobs();
    }
  }, [toast, user]);

  const stats = useMemo(() => {
    const totalEarnings = completedJobs.reduce((sum, job) => sum + job.cost, 0);
    const ratedJobs = completedJobs.filter((job) => job.rating > 0);
    const averageRating = ratedJobs.length
      ? (ratedJobs.reduce((sum, job) => sum + job.rating, 0) / ratedJobs.length).toFixed(1)
      : '0.0';

    return {
      totalCompleted: completedJobs.length,
      averageRating,
      totalEarnings: totalEarnings.toFixed(2),
    };
  }, [completedJobs]);

  const cardClass = isDarkMode ? 'bg-[#151f32] border-slate-800' : 'bg-white border-slate-200';
  const mutedText = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`min-h-screen px-4 py-8 sm:px-8 ${isDarkMode ? 'bg-[#0B1120]' : 'bg-slate-50'}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-2 border-b border-slate-200/20 pb-5">
          <p className={`text-sm font-semibold uppercase tracking-wide ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
            Work archive
          </p>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>Completed Jobs</h1>
          <p className={mutedText}>Review finished repairs, earnings, and customer feedback.</p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: 'Total Completed', value: stats.totalCompleted, icon: <CheckCircle2 className="h-5 w-5" />, tone: 'text-emerald-500' },
            { label: 'Average Rating', value: stats.averageRating, icon: <Star className="h-5 w-5" />, tone: 'text-amber-500' },
            { label: 'Total Earnings', value: `$${stats.totalEarnings}`, icon: <DollarSign className="h-5 w-5" />, tone: 'text-blue-500' },
          ].map((item) => (
            <div key={item.label} className={`rounded-lg border p-5 ${cardClass}`}>
              <div className="mb-4 flex items-center justify-between">
                <p className={`text-sm font-medium ${mutedText}`}>{item.label}</p>
                <div className={`rounded-lg p-2 ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'} ${item.tone}`}>{item.icon}</div>
              </div>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{item.value}</p>
            </div>
          ))}
        </div>

        {loading && (
          <div className={`rounded-lg border p-10 text-center ${cardClass}`}>
            <p className={mutedText}>Loading completed jobs...</p>
          </div>
        )}

        {error && (
          <div className={`mb-6 flex items-start gap-3 rounded-lg border p-4 ${isDarkMode ? 'border-red-500/20 bg-red-500/10 text-red-300' : 'border-red-200 bg-red-50 text-red-700'}`}>
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && completedJobs.length === 0 && (
          <div className={`rounded-lg border border-dashed p-12 text-center ${cardClass}`}>
            <Trophy className={`mx-auto mb-4 h-12 w-12 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>No completed jobs yet</h3>
            <p className={`mt-1 text-sm ${mutedText}`}>Finished repair work will appear here.</p>
          </div>
        )}

        {!loading && completedJobs.length > 0 && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {completedJobs.map((job) => (
              <div key={job.id} className={`rounded-lg border p-5 ${cardClass}`}>
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className={`truncate text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{job.title}</h3>
                    <p className={`mt-1 text-sm ${mutedText}`}>{job.customer} - {job.car}</p>
                    <p className={`mt-2 text-xs font-medium uppercase tracking-wide ${mutedText}`}>Completed on {job.completedDate}</p>
                  </div>
                  <p className={`shrink-0 text-xl font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                    ${job.cost.toFixed(2)}
                  </p>
                </div>

                <div className={`mb-4 rounded-lg p-3 text-sm ${isDarkMode ? 'bg-[#0B1120] text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                  <FileText className="mr-2 inline h-4 w-4" />
                  {job.reportDetails}
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      className={`h-4 w-4 ${value <= job.rating ? 'fill-amber-400 text-amber-400' : isDarkMode ? 'text-slate-700' : 'text-slate-300'}`}
                    />
                  ))}
                  <span className={`ml-2 text-sm ${mutedText}`}>{job.rating ? `${job.rating}/5` : 'Not rated'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
