import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMechanicsTheme } from '../../context/MechanicsThemeContext';
import { getMechanicJobs, startJob } from '../../services/mechanicService';
import API from '../../services/api';
import { X, Clock, Calendar, Car, Wrench, DollarSign, MapPin, Search, AlertCircle, FileText, CheckCircle, PlayCircle, AlertTriangle } from 'lucide-react';

export default function MechanicsJobsPage() {
  const { user } = useAuth();
  const { isDarkMode } = useMechanicsTheme();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [repairItem, setRepairItem] = useState('');
  const [repairAmount, setRepairAmount] = useState('');
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [completeReportText, setCompleteReportText] = useState('');
  const [completeRepairItem, setCompleteRepairItem] = useState('');
  const [completeRepairAmount, setCompleteRepairAmount] = useState('');
  const [completeLoading, setCompleteLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        console.log('📍 Fetching jobs for mechanic:', {
          id: user?._id,
          name: user?.name,
          workshopId: user?.workshopId
        });
        
        const response = await getMechanicJobs();
        console.log('📦 API Response - Total jobs returned:', response.data?.length);
        
        if (response.data && response.data.length > 0) {
          console.log('📋 Job details:');
          response.data.forEach((job, idx) => {
            console.log(`  ${idx + 1}. ${job.title} (${job.status}) - assignedTo: ${job.assignedTo}, workshop: ${job.workshopId}`);
          });
        } else {
          console.log('⚠️ No jobs returned from API');
        }
        
        // Filter for all non-completed jobs (pending, assigned, in-progress)
        const filteredJobs = response.data
          .filter(job => !['completed', 'cancelled'].includes(job.status))
          .map(job => ({
            id: job._id,
            title: job.title,
            customer: job.userId?.name || 'Unknown',
            car: job.carId ? `${job.carId.year} ${job.carId.make} ${job.carId.model}` : 'Unknown',
            plate: job.carId?.licensePlate || job.carId?.plate || 'N/A',
            date: job.requestedDate || 'Not set',
            time: 'TBD',
            duration: '1 hr',
            priority: job.priority || 'medium',
            status: job.status,
            description: job.description,
            serviceType: job.serviceType || 'General Repair',
            workshop: job.workshopId?.name || 'Unassigned',
            totalCost: job.totalCost || 0,
            reportDetails: job.reportDetails || ''
          }));
        
        console.log('✅ After filtering:', filteredJobs.length, 'jobs');
        setJobs(filteredJobs);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching jobs:', err);
        setError('Failed to load jobs');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchJobs();
    }
  }, [user]);

  const getPriorityColor = (priority, isDarkMode) => {
    if (isDarkMode) {
      switch(priority) {
        case 'high': return 'bg-red-500/20 text-red-400 border border-red-500/30';
        case 'medium': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
        case 'low': return 'bg-green-500/20 text-green-400 border border-green-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
      }
    } else {
      switch(priority) {
        case 'high': return 'bg-red-50 text-red-700 border border-red-200';
        case 'medium': return 'bg-orange-50 text-orange-700 border border-orange-200';
        case 'low': return 'bg-green-50 text-green-700 border border-green-200';
        default: return 'bg-gray-50 text-gray-700 border border-gray-200';
      }
    }
  };

  const getStatusColor = (status, isDarkMode) => {
    if (isDarkMode) {
      switch(status) {
        case 'completed': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
        case 'in-progress': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
        case 'assigned': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
        case 'pending': return 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
      }
    } else {
      switch(status) {
        case 'completed': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
        case 'in-progress': return 'bg-amber-50 text-amber-700 border border-amber-200';
        case 'assigned': return 'bg-blue-50 text-blue-700 border border-blue-200';
        case 'pending': return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
        default: return 'bg-gray-50 text-gray-700 border border-gray-200';
      }
    }
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleAddReport = (job = null) => {
    const targetJob = job || selectedJob;
    if (!targetJob) return;
    setSelectedJob(targetJob);
    setReportText('');
    setRepairItem('');
    setRepairAmount('');
    setIsReportModalOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!reportText.trim()) {
      alert('Please enter a report');
      return;
    }
    if (!repairItem.trim()) {
      alert('Please enter what was repaired');
      return;
    }

    const parsedAmount = Number(repairAmount);
    if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
      alert('Please enter a valid repair amount');
      return;
    }

    setReportLoading(true);
    try {
      // Update job with report
      const res = await API.put(`/mechanics/jobs/${selectedJob.id}/update`, {
        reportDetails: reportText,
        repairItem,
        repairAmount: parsedAmount
      });
      const updatedJob = res.data?.job;
      
      // Update local state
      setJobs(jobs.map(job =>
        job.id === selectedJob.id
          ? {
              ...job,
              reportDetails: updatedJob?.reportDetails || reportText,
              totalCost: updatedJob?.totalCost ?? job.totalCost
            }
          : job
      ));
      
      setReportText('');
      setRepairItem('');
      setRepairAmount('');
      setIsReportModalOpen(false);
      alert('Report added successfully!');
    } catch (err) {
      console.error('Error adding report:', err);
      alert(err.response?.data?.message || 'Failed to add report');
    } finally {
      setReportLoading(false);
    }
  };

  const handleOpenCompleteModal = (job = null) => {
    const targetJob = job || selectedJob;
    if (!targetJob) return;
    setSelectedJob(targetJob);
    setCompleteReportText('');
    setCompleteRepairItem('');
    setCompleteRepairAmount('');
    setIsCompleteModalOpen(true);
  };

  const handleSubmitCompleteJob = async () => {
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
      
      // Update local state - remove from jobs list or change status
      setJobs(jobs.map(job =>
        job.id === selectedJob.id
          ? { ...job, status: 'completed' }
          : job
      ).filter(job => job.status !== 'completed'));
      
      setIsCompleteModalOpen(false);
      setIsModalOpen(false);
      setSelectedJob(null);
      alert('Job marked as completed!');
    } catch (err) {
      console.error('Error completing job:', err);
      alert(err.response?.data?.message || 'Failed to complete job');
    } finally {
      setCompleteLoading(false);
    }
  };

  const handleJobChoice = async (choice) => {
    setModalLoading(true);
    try {
      if (choice === 'work-now') {
        // Use the startJob endpoint for mechanics
        await startJob(selectedJob.id);
        const newStatus = 'in-progress';
        
        // Update local state
        setJobs(jobs.map(job => 
          job.id === selectedJob.id ? { ...job, status: newStatus } : job
        ));
        
        alert('Job started successfully!');
      }
      
      setIsModalOpen(false);
      setSelectedJob(null);
    } catch (err) {
      console.error('Error updating job status:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update job status';
      
      // Provide more helpful error messages
      let displayMsg = errorMsg;
      if (errorMsg.includes('Workshop information missing')) {
        displayMsg = 'This job is not properly assigned. Please contact an administrator.';
      } else if (errorMsg.includes('Not authorized')) {
        displayMsg = 'You are not authorized to work on this job.';
      }
      
      alert(displayMsg);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className={`min-h-screen pt-8 px-4 sm:px-8 max-w-7xl mx-auto transition-colors duration-300 ${isDarkMode ? 'bg-[#0B1120]' : 'bg-gray-50'}`}>
      {/* Header section with gradient line */}
      <div className="mb-8 relative">
        <div className="flex justify-between items-end pb-4">
          <div>
            <h1 className={`text-4xl font-extrabold tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Assigned Jobs
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Review and manage your pending mechanical tasks
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-blue-500 via-purple-500 to-transparent opacity-50"></div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 opacity-70">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Retrieving assignments...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className={`p-4 rounded-xl flex items-start gap-4 mb-8 shadow-sm border ${isDarkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
          <AlertCircle className={`w-6 h-6 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
          <div>
            <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-red-400' : 'text-red-800'}`}>Failed to load jobs</h3>
            <p className={`text-sm ${isDarkMode ? 'text-red-400/80' : 'text-red-600'}`}>{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && jobs.length === 0 && (
        <div className={`text-center py-24 rounded-2xl border border-dashed ${isDarkMode ? 'bg-[#151f32] border-gray-700' : 'bg-white border-gray-300'}`}>
          <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>All Caught Up!</h3>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>You don't have any pending jobs at the moment.</p>
        </div>
      )}

      {/* Jobs List Grid */}
      {!loading && jobs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 pb-12">
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-lg border flex flex-col justify-between ${
                isDarkMode 
                  ? 'bg-[#1A2639] border-gray-800 hover:border-blue-500/30' 
                  : 'bg-white border-gray-200 hover:border-blue-200 hover:shadow-blue-900/5'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                      <Wrench className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{job.title}</h3>
                      <p className={`text-sm flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span>{job.customer}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(job.status, isDarkMode)}`}>
                      {job.status.replace('-', ' ')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getPriorityColor(job.priority, isDarkMode)}`}>
                      {job.priority} Priority
                    </span>
                  </div>
                </div>

                <p className={`text-sm mb-6 leading-relaxed line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {job.description}
                </p>

                <div className={`grid grid-cols-2 gap-y-3 gap-x-4 p-4 rounded-xl mb-6 text-sm ${isDarkMode ? 'bg-[#131c2b]' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2">
                    <Car className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`truncate font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.car} ({job.plate})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`truncate font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.workshop || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`truncate font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`truncate font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Est. ${job.totalCost}</span>
                  </div>
                </div>
              </div>

              <div className={`flex gap-3 pt-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <button 
                  onClick={() => handleViewDetails(job)}
                  className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition flex justify-center items-center gap-2 text-sm ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}>
                  <Search className="w-4 h-4" /> View Details
                </button>
                
                {(job.status === 'in-progress' || job.status === 'assigned') && (
                  <button 
                    onClick={() => {
                      setSelectedJob(job);
                      handleOpenCompleteModal(job);
                    }}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-indigo-500 transition shadow-lg shadow-blue-500/20 flex justify-center items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4" /> Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job Details Modal */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className={`rounded-2xl shadow-2xl max-w-lg w-full transition-colors duration-300 border ${isDarkMode ? 'bg-[#15202B] border-gray-800' : 'bg-white border-gray-100'}`}>
            {/* Modal Header */}
            <div className={`flex justify-between items-center p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
              <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <FileText className="w-5 h-5 text-blue-500" /> Job Details
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className={`p-2 rounded-full hover:bg-gray-500/10 transition ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#1A2639]' : 'bg-blue-50/50'}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedJob.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(selectedJob.status, isDarkMode)}`}>
                    {selectedJob.status.replace('-', ' ')}
                  </span>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedJob.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Customer</label>
                  <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedJob.customer}</p>
                </div>
                <div>
                  <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Vehicle</label>
                  <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedJob.car} ({selectedJob.plate})</p>
                </div>
                <div>
                  <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Workshop</label>
                  <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedJob.workshop || 'Unassigned'}</p>
                </div>
                <div>
                  <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Service Type</label>
                  <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedJob.serviceType}</p>
                </div>
              </div>

              <div className={`grid grid-cols-2 gap-4 pt-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <div>
                  <label className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Calendar className="w-3.5 h-3.5" /> Date
                  </label>
                  <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedJob.date}</p>
                </div>
                <div>
                  <label className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Clock className="w-3.5 h-3.5" /> Duration
                  </label>
                  <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedJob.duration}</p>
                </div>
                <div>
                  <label className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <AlertTriangle className="w-3.5 h-3.5" /> Priority
                  </label>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase ${getPriorityColor(selectedJob.priority, isDarkMode)}`}>
                    {selectedJob.priority}
                  </span>
                </div>
                <div>
                  <label className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <DollarSign className="w-3.5 h-3.5" /> Est. Cost
                  </label>
                  <p className={`font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>${selectedJob.totalCost}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`flex gap-3 p-6 border-t bg-gray-50/50 rounded-b-2xl ${isDarkMode ? 'bg-[#15202B]/80 border-gray-800' : 'border-gray-100'}`}>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition ${isDarkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                Close
              </button>
              {selectedJob.status !== 'completed' && (
                <>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      handleOpenCompleteModal(selectedJob);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20"
                  >
                    Complete Job
                  </button>
                </>
              )}
              {selectedJob.status === 'pending' && (
                <button
                  onClick={() => handleJobChoice('work-now')}
                  disabled={modalLoading}
                  className={`flex-1 px-4 py-2.5 flex items-center justify-center gap-2 rounded-xl font-semibold text-sm text-white transition ${modalLoading ? 'bg-blue-400' : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-md hover:shadow-blue-500/20'} disabled:opacity-50`}
                >
                  {modalLoading ? 'Starting...' : <><PlayCircle className="w-4 h-4" /> Start Work</>}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {isReportModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg shadow-xl max-w-md w-full transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38]' : 'bg-white'}`}>
            {/* Modal Header */}
            <div className={`flex justify-between items-center p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add Work Report</h2>
              <button 
                onClick={() => {
                  setIsReportModalOpen(false);
                  setReportText('');
                }}
                className={`p-1 rounded hover:opacity-70 transition ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Job: {selectedJob.title}
                </label>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Work Report *
                </label>
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Describe the work done, issues found, parts replaced, etc..."
                  className={`w-full px-4 py-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-[#27384a] border-gray-600 text-white placeholder-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  rows={5}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Repaired Item *
                </label>
                <input
                  type="text"
                  value={repairItem}
                  onChange={(e) => setRepairItem(e.target.value)}
                  placeholder="e.g., Brake pads replacement"
                  className={`w-full px-4 py-2.5 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-[#27384a] border-gray-600 text-white placeholder-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Repair Amount *
                </label>
                <input
                  type="number"
                  min="0"
                  value={repairAmount}
                  onChange={(e) => setRepairAmount(e.target.value)}
                  placeholder="0.00"
                  className={`w-full px-4 py-2.5 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-[#27384a] border-gray-600 text-white placeholder-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`flex gap-3 p-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => {
                  setIsReportModalOpen(false);
                  setReportText('');
                  setRepairItem('');
                  setRepairAmount('');
                }}
                className={`flex-1 px-4 py-2 rounded font-medium text-sm transition ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReport}
                disabled={reportLoading || !reportText.trim() || !repairItem.trim() || repairAmount === ''}
                className={`flex-1 px-4 py-2 rounded font-medium text-sm text-white transition ${reportLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-50`}
              >
                {reportLoading ? 'Saving...' : 'Save Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Job Modal */}
      {isCompleteModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className={`rounded-2xl shadow-2xl max-w-md w-full transition-colors duration-300 border ${isDarkMode ? 'bg-[#15202B] border-gray-800' : 'bg-white border-gray-100'}`}>
            {/* Modal Header */}
            <div className={`flex justify-between items-center p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
              <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <CheckCircle className="w-5 h-5 text-indigo-500" /> Complete Job
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
              <div className={`p-4 rounded-xl flex items-start gap-4 mb-2 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                <FileText className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                <div>
                  <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>Target Job</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-blue-200/70' : 'text-blue-600'}`}>{selectedJob.title}</p>
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
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow ${
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
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow ${
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
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow ${
                    isDarkMode
                      ? 'bg-[#1A2639] border-gray-700 text-white placeholder-gray-600'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                  rows={3}
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
                onClick={handleSubmitCompleteJob}
                disabled={completeLoading || !completeRepairItem.trim() || completeRepairAmount === ''}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm text-white transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 ${completeLoading ? 'bg-indigo-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'} disabled:opacity-50`}
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
