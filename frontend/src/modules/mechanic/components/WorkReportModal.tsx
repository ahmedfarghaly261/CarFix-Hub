import React, { useState, useEffect } from 'react';
import { X, FileText, Wrench, DollarSign, AlertCircle } from 'lucide-react';
import { completeJob, addWorkReport } from '@/modules/mechanic/services/mechanic.service';
import { useMechanicsTheme } from '@/context/MechanicsThemeContext';
import { useToast } from '@/components/ui/useToast';

export default function WorkReportModal({ isOpen, onClose, onSuccess, job }) {
  const { isDarkMode } = useMechanicsTheme();
  const toast = useToast();
  const [formData, setFormData] = useState({
    reportDetails: '',
    repairItem: '',
    repairAmount: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && job) {
      setFormData({
        reportDetails: job.reportDetails || '',
        repairItem: '',
        repairAmount: ''
      });
      setError('');
    }
  }, [isOpen, job]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (isCompleting) => {
    setError('');
    setIsSubmitting(true);
    try {
      const jobId = job.id || job._id;
      if (isCompleting) {
        await completeJob(jobId, formData);
      } else {
        await addWorkReport(jobId, formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to submit report';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className={`relative w-full max-w-lg rounded-2xl p-6 shadow-xl ${isDarkMode ? 'bg-[#1E2A38] text-white' : 'bg-white text-gray-900'}`}>
        
        <button 
          onClick={onClose} 
          className={`absolute right-4 top-4 rounded-full p-2 transition ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Work Report</h2>
        <p className={`mb-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Update {job.title || 'job'} for {job.car || `${job.carId?.make || ''} ${job.carId?.model || ''}`.trim() || 'vehicle'}
          {job.plate || job.carId?.licensePlate ? ` (${job.plate || job.carId?.licensePlate})` : ''}
        </p>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-100 p-3 text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className={`mb-1 block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Work Notes / Report Details
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                name="reportDetails"
                rows={3}
                placeholder="Describe the work done so far..."
                value={formData.reportDetails}
                onChange={handleChange}
                className={`w-full rounded-lg border py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'border-gray-700 bg-[#101828] text-white' 
                    : 'border-gray-300 bg-gray-50 text-gray-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`mb-1 block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Parts Used / Specific Repair (Optional)
            </label>
            <div className="relative">
              <Wrench className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="repairItem"
                placeholder="E.g. Brake pads replaced"
                value={formData.repairItem}
                onChange={handleChange}
                className={`w-full rounded-lg border py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'border-gray-700 bg-[#101828] text-white' 
                    : 'border-gray-300 bg-gray-50 text-gray-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`mb-1 block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Cost of this repair (Labor/Parts) (Optional)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="number"
                min="0"
                step="0.01"
                name="repairAmount"
                placeholder="0.00"
                value={formData.repairAmount}
                onChange={handleChange}
                className={`w-full rounded-lg border py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'border-gray-700 bg-[#101828] text-white' 
                    : 'border-gray-300 bg-gray-50 text-gray-900'
                }`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => handleUpdate(false)}
              disabled={isSubmitting}
              className={`px-4 py-2.5 rounded-lg font-medium transition ${
                isDarkMode 
                  ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50 border border-blue-800' 
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              Save Update
            </button>
            <button
              type="button"
              onClick={() => handleUpdate(true)}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-green-600 font-medium text-white transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Complete Job'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
