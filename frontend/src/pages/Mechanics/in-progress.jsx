import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMechanicsTheme } from '../../context/MechanicsThemeContext';
import { getMechanicJobs } from '../../services/mechanicService';
import API from '../../services/api';
import { X, Clock, Car, DollarSign, MapPin, CheckCircle, FileText, AlertCircle, TrendingUp } from 'lucide-react';

export default function MechanicsInProgressPage() {
  const { user } = useAuth();
  const { isDarkMode } = useMechanicsTheme();
  const [inProgressJobs, setInProgressJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [completeReportText, setCompleteReportText] = useState('');
  const [completeRepairItem, setCompleteRepairItem] = useState('');
  const [completeRepairAmount, setCompleteRepairAmount] = useState('');
  const [completeLoading, setCompleteLoading] = useState(false);

  useEffect(() => {
    const fetchInProgressJobs = async () => {
      try {
        setLoading(true);
        const response = await getMechanicJobs();
        
        // Filter for in-progress mapped jobs
        const filteredJobs = response.data
          .filter(job => job.status === 'in-progress')
          .map(job => ({
            id: job._id,
            title: job.title,
            customer: job.userId?.name || 'Unknown',
            car: job.carId ? `${job.carId.year} ${job.carId.make} ${job.carId.model}` : 'Unknown',
            plate: job.carId?.licensePlate || job.carId?.plate || 'N/A',
            startTime: job.requestedDate || 'Not set',
            estimatedCompletion: 'TBD',
            progress: 60,
            description: job.description
          }));
        
        setInProgressJobs(filteredJobs);
        setError(null);
      } catch (err) {
        console.error('Error fetching in-progress jobs:', err);
        setError('Failed to load in-progress jobs');
        setInProgressJobs([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchInProgressJobs();
    }
  }, [user]);

  const handleOpenCompleteModal = (job) => {
    setSelectedJob(job);
    setCompleteReportText('');
    setCompleteRepairItem('');
    setCompleteRepairAmount('');
    setIsCompleteModalOpen(true);
  };

  const handleMarkComplete = async () => {
    if (!selectedJob) return;

    if (!completeRepairItem.trim()) {
      alert('Please enter what was repaired');
      return;
    }

    const parsedAmount = Number(completeRepairAmount);
    if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
      alert('Please enter a valid repair amount');
      return;
    }

    setCompleteLoading(true);
    try {
      await API.put(`/mechanics/jobs/${selectedJob.id}/complete`, {
        reportDetails: completeReportText,
        repairItem: completeRepairItem,
        repairAmount: parsedAmount
      });
      
      setInProgressJobs(inProgressJobs.filter(job => job.id !== selectedJob.id));
      setIsCompleteModalOpen(false);
      setSelectedJob(null);
      alert('Job successfully marked as completed!');
    } catch (err) {
      console.error('Error marking job as complete:', err);
      alert(err.response?.data?.message || 'Failed to merge completion details');
    } finally {
      setCompleteLoading(false);
    }
  };

  return (
    <div className={`min-h-screen pt-8 px-4 sm:px-8 max-w-7xl mx-auto transition-colors duration-300 ${isDarkMode ? 'bg-[#0B1120]' : 'bg-gray-50'}`}>
      {/* Header section with gradient line */}
      <div className="mb-8 relative">
        <div className="flex justify-between items-end pb-4">
          <div>
            <h1 className={`text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <TrendingUp className={`w-8 h-8 ${isDarkMode ? 'text-amber-400' : 'text-amber-500'}`} /> In Progress
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Focus on jobs currently being worked on
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-amber-500 via-orange-500 to-transparent opacity-50"></div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 opacity-70">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
          <p className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading tasks...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className={`p-4 rounded-xl flex items-start gap-4 mb-8 shadow-sm border ${isDarkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
          <AlertCircle className={`w-6 h-6 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
          <div>
            <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-red-400' : 'text-red-800'}`}>Error</h3>
            <p className={`text-sm ${isDarkMode ? 'text-red-400/80' : 'text-red-600'}`}>{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && inProgressJobs.length === 0 && (
        <div className={`text-center py-24 rounded-2xl border border-dashed ${isDarkMode ? 'bg-[#151f32] border-gray-700' : 'bg-white border-gray-300'}`}>
          <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No Active Work</h3>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>You don't have any jobs currently in progress.</p>
        </div>
      )}

      {/* In Progress Jobs */}
      {!loading && inProgressJobs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
          {inProgressJobs.map((job) => (
            <div key={job.id} className={`rounded-2xl p-6 transition-all duration-300 shadow-md border flex flex-col justify-between ${
              isDarkMode 
                ? 'bg-[#1A2639] border-amber-900/30' 
                : 'bg-white border-amber-100 shadow-amber-900/5'
            }`}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{job.title}</h3>
                    <p className={`text-sm flex items-center gap-1 mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Car className="w-3.5 h-3.5" />
                      <span>{job.customer} • {job.car} • {job.plate}</span>
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                    In Progress
                  </span>
                </div>

                <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {job.description}
                </p>

                <div className={`flex items-center gap-4 text-xs font-medium mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> Started at {job.startTime}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Progress</span>
                    <span className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{job.progress}%</span>
                  </div>
                  <div className={`w-full rounded-full h-2 overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all" 
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className={`pt-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <button 
                  onClick={() => handleOpenCompleteModal(job)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:from-emerald-500 hover:to-green-500 transition shadow-lg shadow-emerald-500/20 flex justify-center items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" /> Mark Complete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Complete Job Modal */}
      {isCompleteModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className={`rounded-2xl shadow-2xl max-w-md w-full transition-colors duration-300 border ${isDarkMode ? 'bg-[#15202B] border-gray-800' : 'bg-white border-gray-100'}`}>
            {/* Modal Header */}
            <div className={`flex justify-between items-center p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
              <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <CheckCircle className="w-5 h-5 text-emerald-500" /> Complete Job
              </h2>
              <button
                onClick={() => {
                  setIsCompleteModalOpen(false);
                  setCompleteReportText('');
                  setCompleteRepairItem('');
                  setCompleteRepairAmount('');
                }}
                className={`p-2 rounded-full hover:bg-gray-500/10 transition ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className={`p-4 rounded-xl flex items-start gap-4 mb-2 ${isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                <FileText className={`w-5 h-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-500'}`} />
                <div>
                  <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>Finishing Duty</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-amber-200/70' : 'text-amber-600'}`}>{selectedJob.title}</p>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  What was replaced or repaired? *
                </label>
                <input
                  type="text"
                  value={completeRepairItem}
                  onChange={(e) => setCompleteRepairItem(e.target.value)}
                  placeholder="e.g., Brake pads replacement"
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow ${
                    isDarkMode
                      ? 'bg-[#1A2639] border-gray-700 text-white placeholder-gray-600'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Repair Cost ($) *
                </label>
                <div className="relative">
                  <DollarSign className={`absolute left-3 top-3 w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="number"
                    min="0"
                    value={completeRepairAmount}
                    onChange={(e) => setCompleteRepairAmount(e.target.value)}
                    placeholder="0.00"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow ${
                      isDarkMode
                        ? 'bg-[#1A2639] border-gray-700 text-white placeholder-gray-600'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Additional Notes
                </label>
                <textarea
                  value={completeReportText}
                  onChange={(e) => setCompleteReportText(e.target.value)}
                  placeholder="Summary of work completed (optional)"
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow ${
                    isDarkMode
                      ? 'bg-[#1A2639] border-gray-700 text-white placeholder-gray-600'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                  rows="3"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`flex gap-3 p-6 border-t bg-gray-50/50 rounded-b-2xl ${isDarkMode ? 'bg-[#15202B]/80 border-gray-800' : 'border-gray-100'}`}>
              <button
                onClick={() => {
                  setIsCompleteModalOpen(false);
                  setCompleteReportText('');
                  setCompleteRepairItem('');
                  setCompleteRepairAmount('');
                }}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition ${isDarkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleMarkComplete}
                disabled={completeLoading || !completeRepairItem.trim() || completeRepairAmount === ''}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm text-white transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 ${completeLoading ? 'bg-emerald-400' : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500'} disabled:opacity-50`}
              >
                {completeLoading ? 'Processing...' : 'Complete Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
