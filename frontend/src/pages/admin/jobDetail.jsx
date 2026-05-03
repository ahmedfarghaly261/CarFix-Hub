import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Wrench,
  MapPin,
  Car,
  FileText,
  Send,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';
import { useAdminTheme } from '../../context/AdminThemeContext';
import { getJobById, sendInvoice, setMechanicSalary } from '../../services/adminService';

const statusClasses = {
  'completed': 'bg-green-100 text-green-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  'assigned': 'bg-blue-100 text-blue-700',
  'pending': 'bg-yellow-100 text-yellow-700',
  'cancelled': 'bg-red-100 text-red-700',
};

export default function JobDetailPage() {
  const { isDarkMode } = useAdminTheme();
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salary, setSalary] = useState('');
  const [savingSalary, setSavingSalary] = useState(false);
  const [sendingInvoice, setSendingInvoice] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState('');

  const fetchJob = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getJobById(jobId);
      setJob(res.data);
      setSalary(res.data.mechanicSalary || '');
      setInvoiceAmount(res.data.billingAmount ?? '');
    } catch (err) {
      console.error('Failed to load job', err);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const handleSendInvoice = async () => {
    if (!job) return;
    const hasAmount = invoiceAmount !== '' && invoiceAmount != null;
    const parsedAmount = hasAmount ? Number(invoiceAmount) : null;
    if (hasAmount && (!Number.isFinite(parsedAmount) || parsedAmount < 0)) {
      alert('Please enter a valid invoice amount');
      return;
    }
    setSendingInvoice(true);
    try {
      const res = await sendInvoice(job._id, parsedAmount);
      setJob(res.data.job);
      setInvoiceAmount(res.data.job.billingAmount ?? '');
      alert('Invoice sent to customer successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send invoice');
    } finally {
      setSendingInvoice(false);
    }
  };

  const handleSaveSalary = async () => {
    if (!job) return;
    const amount = parseFloat(salary);
    if (isNaN(amount) || amount < 0) {
      alert('Please enter a valid salary amount');
      return;
    }
    setSavingSalary(true);
    try {
      const res = await setMechanicSalary(job._id, amount);
      setJob(res.data.job);
      alert('Mechanic salary saved successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save salary');
    } finally {
      setSavingSalary(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Job not found</p>
      </div>
    );
  }

  const cardClass = `rounded-lg shadow-md ${isDarkMode ? 'bg-[#1E2A38]' : 'bg-white'}`;
  const labelClass = `text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`;
  const valueClass = `text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`;
  const subValueClass = `text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`;
  const formatMoney = (value) => (Number.isFinite(value) ? value.toFixed(2) : '0.00');
  const reportedRepairs = (job.iterations || [])
    .filter((iteration) => Number.isFinite(iteration?.cost?.total))
    .map((iteration, index) => ({
      id: iteration._id || `iteration-${index}`,
      description: iteration.description || `Repair item ${index + 1}`,
      total: iteration.cost.total
    }));
  const reportedTotal = reportedRepairs.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      <main className="p-6 sm:p-8">
        {/* Back Button & Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/jobs')}
            className={`flex items-center gap-2 text-sm mb-4 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <ArrowLeft size={16} />
            Back to Jobs
          </button>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {job.title}
              </h1>
              <p className={`text-sm mt-1 font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Job #{job._id.slice(-6)}
              </p>
            </div>
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${statusClasses[job.status] || (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700')}`}>
              {job.status === 'completed' && <CheckCircle size={16} className="mr-1" />}
              {job.status === 'in-progress' && <Clock size={16} className="mr-1" />}
              {job.status === 'pending' && <AlertCircle size={16} className="mr-1" />}
              {job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Job Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Details Card */}
            <div className={cardClass}>
              <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Job Details</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className={labelClass}>Service Type</p>
                    <p className={valueClass}>{job.serviceType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className={labelClass}>Priority</p>
                    <p className={valueClass}>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        job.priority === 'high' ? 'bg-red-100 text-red-700' :
                        job.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {job.priority || 'medium'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className={labelClass}>Requested Date</p>
                    <p className={subValueClass}>
                      <Calendar size={14} className="inline mr-1" />
                      {job.requestedDate || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className={labelClass}>Completed Date</p>
                    <p className={subValueClass}>
                      <Calendar size={14} className="inline mr-1" />
                      {job.actualCompletionDate ? new Date(job.actualCompletionDate).toLocaleDateString() : 'Not completed'}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className={labelClass}>Description</p>
                    <p className={subValueClass}>{job.description}</p>
                  </div>
                  {job.notes && (
                    <div className="sm:col-span-2">
                      <p className={labelClass}>Notes</p>
                      <p className={subValueClass}>{job.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mechanic Report Card */}
            <div className={cardClass}>
              <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2">
                  <FileText className={isDarkMode ? 'text-orange-400' : 'text-orange-600'} size={20} />
                  <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Mechanic Report</h2>
                </div>
              </div>
              <div className="p-6">
                {job.reportDetails ? (
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#27384a]' : 'bg-gray-50'}`}>
                    <p className={`text-sm whitespace-pre-wrap ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      {job.reportDetails}
                    </p>
                  </div>
                ) : (
                  <p className={`text-sm italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    No report submitted by the mechanic yet.
                  </p>
                )}
                {reportedRepairs.length > 0 && (
                  <div className="mt-4">
                    <p className={labelClass}>Reported Repairs</p>
                    <div className={`mt-2 rounded-lg border p-3 space-y-2 ${isDarkMode ? 'border-gray-700 bg-[#27384a]' : 'border-gray-200 bg-gray-50'}`}>
                      {reportedRepairs.map((item) => (
                        <div key={item.id} className={`flex items-center justify-between text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          <span className="pr-4">{item.description}</span>
                          <span className={`font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>${formatMoney(item.total)}</span>
                        </div>
                      ))}
                      <div className={`pt-2 border-t flex items-center justify-between text-sm font-semibold ${isDarkMode ? 'border-gray-700 text-gray-100' : 'border-gray-200 text-gray-800'}`}>
                        <span>Reported Total</span>
                        <span className={isDarkMode ? 'text-green-300' : 'text-green-600'}>${formatMoney(reportedTotal)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Iterations / Work History */}
            {job.iterations && job.iterations.length > 0 && (
              <div className={cardClass}>
                <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Work History</h2>
                </div>
                <div className="p-6 space-y-3">
                  {job.iterations.map((iteration, index) => (
                    <div key={iteration._id || index} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-[#27384a] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                          Iteration #{index + 1}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded ${statusClasses[iteration.status] || 'bg-gray-100 text-gray-600'}`}>
                          {iteration.status}
                        </span>
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{iteration.description}</p>
                      {iteration.mechanicNotes && (
                        <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Notes: {iteration.mechanicNotes}
                        </p>
                      )}
                      {iteration.cost?.total > 0 && (
                        <p className={`text-xs mt-1 font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          Cost: ${iteration.cost.total}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Info Cards + Actions */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className={cardClass}>
              <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2">
                  <User className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} size={18} />
                  <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Customer</h3>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <p className={valueClass}>{job.userId?.name || 'N/A'}</p>
                <p className={subValueClass}>
                  <Mail size={14} className="inline mr-1 text-gray-400" />
                  {job.userId?.email || 'N/A'}
                </p>
                <p className={subValueClass}>
                  <Phone size={14} className="inline mr-1 text-gray-400" />
                  {job.userId?.phone || 'N/A'}
                </p>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className={cardClass}>
              <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2">
                  <Car className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} size={18} />
                  <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Vehicle</h3>
                </div>
              </div>
              <div className="p-6 space-y-2">
                <p className={valueClass}>
                  {job.carId?.year} {job.carId?.make} {job.carId?.model}
                </p>
                <p className={subValueClass}>Plate: {job.carId?.licensePlate || job.carId?.plate || 'N/A'}</p>
                {job.carId?.mileage && <p className={subValueClass}>Mileage: {job.carId.mileage} km</p>}
              </div>
            </div>

            {/* Mechanic Info */}
            <div className={cardClass}>
              <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2">
                  <Wrench className={isDarkMode ? 'text-orange-400' : 'text-orange-600'} size={18} />
                  <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Assigned Mechanic</h3>
                </div>
              </div>
              <div className="p-6 space-y-2">
                {job.assignedTo ? (
                  <>
                    <p className={valueClass}>{job.assignedTo.name}</p>
                    <p className={subValueClass}>
                      <Mail size={14} className="inline mr-1 text-gray-400" />
                      {job.assignedTo.email}
                    </p>
                    {job.assignedTo.phone && (
                      <p className={subValueClass}>
                        <Phone size={14} className="inline mr-1 text-gray-400" />
                        {job.assignedTo.phone}
                      </p>
                    )}
                    {job.assignedTo.specializations?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {job.assignedTo.specializations.map((s, i) => (
                          <span key={i} className={`text-xs px-2 py-0.5 rounded ${isDarkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-700'}`}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {job.assignedTo.rating > 0 && (
                      <p className={`text-sm ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        ★ {job.assignedTo.rating.toFixed(1)}
                      </p>
                    )}
                  </>
                ) : (
                  <p className={`text-sm italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Not assigned</p>
                )}
              </div>
            </div>

            {/* Workshop Info */}
            <div className={cardClass}>
              <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2">
                  <MapPin className={isDarkMode ? 'text-green-400' : 'text-green-600'} size={18} />
                  <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Workshop</h3>
                </div>
              </div>
              <div className="p-6 space-y-2">
                {job.workshopId ? (
                  <>
                    <p className={valueClass}>{job.workshopId.name}</p>
                    {job.workshopId.address && <p className={subValueClass}>{job.workshopId.address}</p>}
                    {job.workshopId.phone && (
                      <p className={subValueClass}>
                        <Phone size={14} className="inline mr-1 text-gray-400" />
                        {job.workshopId.phone}
                      </p>
                    )}
                  </>
                ) : (
                  <p className={`text-sm italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No workshop assigned</p>
                )}
              </div>
            </div>

            {/* Cost & Invoice Card */}
            <div className={cardClass}>
              <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2">
                  <DollarSign className={isDarkMode ? 'text-green-400' : 'text-green-600'} size={18} />
                  <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Billing</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {/* Total Cost */}
                <div>
                  <p className={labelClass}>Total Cost</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    ${job.totalCost || 0}
                  </p>
                </div>

                {/* Invoice Amount */}
                <div>
                  <p className={labelClass}>Invoice Amount</p>
                  <div className="relative mt-2">
                    <DollarSign size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input
                      type="number"
                      min="0"
                      value={invoiceAmount}
                      onChange={(e) => setInvoiceAmount(e.target.value)}
                      disabled={job.invoiceSent}
                      placeholder={String(job.totalCost || 0)}
                      className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm ${isDarkMode ? 'bg-[#27384a] border-gray-700 text-gray-200 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  {reportedRepairs.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setInvoiceAmount(String(reportedTotal))}
                      disabled={job.invoiceSent}
                      className={`mt-2 text-xs font-medium px-3 py-1 rounded transition-colors ${
                        job.invoiceSent
                          ? isDarkMode
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : isDarkMode
                            ? 'bg-[#1f2f3f] text-blue-300 hover:bg-[#2b3c50]'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      Use reported total (${formatMoney(reportedTotal)})
                    </button>
                  )}
                  <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Leave empty to use the calculated total.
                  </p>
                </div>

                {/* Invoice Status */}
                <div>
                  <p className={labelClass}>Invoice Status</p>
                  {job.invoiceSent ? (
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle size={16} className="text-green-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                        Sent {job.invoiceSentAt ? `on ${new Date(job.invoiceSentAt).toLocaleDateString()}` : ''}
                      </span>
                    </div>
                  ) : (
                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Not sent</p>
                  )}
                </div>

                {/* Send Invoice Button */}
                <button
                  onClick={handleSendInvoice}
                  disabled={sendingInvoice || job.invoiceSent}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    job.invoiceSent
                      ? isDarkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Send size={16} />
                  {sendingInvoice ? 'Sending...' : job.invoiceSent ? 'Invoice Sent' : 'Send Invoice to Customer'}
                </button>

                {/* Mechanic Salary */}
                <div className={`pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={labelClass}>Mechanic Salary</p>
                  <div className="flex gap-2 mt-2">
                    <div className="relative flex-1">
                      <DollarSign size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <input
                        type="number"
                        min="0"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        placeholder="0.00"
                        className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm ${isDarkMode ? 'bg-[#27384a] border-gray-700 text-gray-200 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    <button
                      onClick={handleSaveSalary}
                      disabled={savingSalary}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                      {savingSalary ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                  {job.mechanicSalary > 0 && (
                    <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Current salary: ${job.mechanicSalary}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
