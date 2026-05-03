import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMechanicsTheme } from '../../context/MechanicsThemeContext';
import { getMechanicJobs, startJob } from '../../services/mechanicService';
import API from '../../services/api';
import { X } from 'lucide-react';

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
        case 'high': return 'bg-red-900 text-red-200';
        case 'medium': return 'bg-orange-900 text-orange-200';
        case 'low': return 'bg-green-900 text-green-200';
        default: return 'bg-gray-700 text-gray-300';
      }
    } else {
      switch(priority) {
        case 'high': return 'bg-red-200 text-red-600';
        case 'medium': return 'bg-orange-200 text-orange-600';
        case 'low': return 'bg-green-200 text-green-600';
        default: return 'bg-gray-200 text-gray-600';
      }
    }
  };

  const getStatusColor = (status, isDarkMode) => {
    if (isDarkMode) {
      switch(status) {
        case 'completed': return 'bg-green-900 text-green-200';
        case 'in-progress': return 'bg-yellow-900 text-yellow-200';
        case 'assigned': return 'bg-blue-900 text-blue-200';
        case 'pending': return 'bg-blue-900 text-blue-200';
        default: return 'bg-gray-700 text-gray-300';
      }
    } else {
      switch(status) {
        case 'completed': return 'bg-green-200 text-green-700';
        case 'in-progress': return 'bg-yellow-200 text-yellow-700';
        case 'assigned': return 'bg-blue-200 text-blue-700';
        case 'pending': return 'bg-blue-200 text-blue-700';
        default: return 'bg-gray-200 text-gray-600';
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

  const handleCompleteJob = async () => {
    if (!selectedJob) return;

    if (!confirm('Are you sure you want to mark this job as completed?')) return;

    setModalLoading(true);
    try {
      await API.put(`/mechanics/jobs/${selectedJob.id}/complete`, {});
      
      // Update local state - remove from jobs list or change status
      setJobs(jobs.map(job =>
        job.id === selectedJob.id
          ? { ...job, status: 'completed' }
          : job
      ).filter(job => job.status !== 'completed'));
      
      setIsModalOpen(false);
      setSelectedJob(null);
      alert('Job marked as completed!');
    } catch (err) {
      console.error('Error completing job:', err);
      alert(err.response?.data?.message || 'Failed to complete job');
    } finally {
      setModalLoading(false);
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
    <div className={`pt-6 px-6 max-w-6xl transition-colors duration-300 ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Jobs</h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Manage and track all your repair jobs</p>
        </div>
        <button
          onClick={async () => {
            console.log('=== SIMPLE DEBUG ===');
            try {
              const response = await API.get('/mechanics/debug/simple');
              console.log('Simple Debug:', JSON.stringify(response.data, null, 2));
            } catch (err) {
              console.error('Debug error:', err.message);
            }
          }}
          className={`px-3 py-1 text-xs rounded ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
        >
          🔍 Debug
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading jobs...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className={`border px-4 py-3 rounded mb-6 ${isDarkMode ? 'bg-red-900 border-red-700 text-red-100' : 'bg-red-100 border-red-300 text-red-800'}`}>
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-12">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No jobs assigned to you yet</p>
        </div>
      )}

      {/* Jobs List */}
      {!loading && jobs.length > 0 && (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className={`rounded-lg shadow p-5 border transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{job.title}</h3>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{job.customer} • {job.car} • {job.plate}</p>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.description}</p>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{job.date} • {job.time} • Est. {job.duration}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-xs">
                    <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      <span className="font-semibold">Service:</span> {job.serviceType}
                    </div>
                    <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      <span className="font-semibold">Workshop:</span> {job.workshop}
                    </div>
                    <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      <span className="font-semibold">Cost:</span> ${job.totalCost}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button 
                      onClick={() => handleViewDetails(job)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
                      View Details
                    </button>
                    {(job.status === 'in-progress' || job.status === 'assigned') && (
                      <>
                        <button 
                          onClick={() => {
                            setSelectedJob(job);
                            handleAddReport(job);
                          }}
                          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition text-sm">
                          Add Report
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedJob(job);
                            handleCompleteJob();
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm">
                          Complete
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                  <span className={`px-3 py-1 rounded text-sm font-medium capitalize ${getPriorityColor(job.priority, isDarkMode)}`}>
                    {job.priority} priority
                  </span>
                  <span className={`px-3 py-1 rounded text-sm font-medium capitalize ${getStatusColor(job.status, isDarkMode)}`}>
                    {job.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job Details Modal */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg shadow-xl max-w-md w-full transition-colors duration-300 ${isDarkMode ? 'bg-[#1E2A38]' : 'bg-white'}`}>
            {/* Modal Header */}
            <div className={`flex justify-between items-center p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Job Details</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className={`p-1 rounded hover:opacity-70 transition ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Service Title</label>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedJob.title}</p>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Customer</label>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedJob.customer}</p>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Vehicle</label>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedJob.car} ({selectedJob.plate})</p>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Workshop</label>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedJob.workshop || 'Unassigned'}</p>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Service Type</label>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedJob.serviceType}</p>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedJob.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date</label>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedJob.date}</p>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Duration</label>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedJob.duration}</p>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedJob.status.replace('-', ' ')}</p>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Cost</label>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>${selectedJob.totalCost}</p>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Priority</label>
                <span className={`inline-block px-3 py-1 rounded text-sm font-medium capitalize ${getPriorityColor(selectedJob.priority, isDarkMode)}`}>
                  {selectedJob.priority} priority
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`flex gap-3 p-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`flex-1 px-4 py-2 rounded font-medium text-sm transition ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
              >
                Close
              </button>
              {selectedJob.status !== 'completed' && (
                <>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      handleAddReport(selectedJob);
                    }}
                    className="flex-1 px-4 py-2 rounded font-medium text-sm bg-orange-600 text-white hover:bg-orange-700 transition"
                  >
                    Add Report
                  </button>
                  <button
                    onClick={handleCompleteJob}
                    disabled={modalLoading}
                    className={`flex-1 px-4 py-2 rounded font-medium text-sm text-white transition ${modalLoading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} disabled:opacity-50`}
                  >
                    {modalLoading ? 'Completing...' : 'Complete Job'}
                  </button>
                </>
              )}
              {selectedJob.status === 'pending' && (
                <button
                  onClick={() => handleJobChoice('work-now')}
                  disabled={modalLoading}
                  className={`flex-1 px-4 py-2 rounded font-medium text-sm text-white transition ${modalLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-50`}
                >
                  {modalLoading ? 'Starting...' : 'Start Work'}
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
                  rows="5"
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
    </div>
  );
}
