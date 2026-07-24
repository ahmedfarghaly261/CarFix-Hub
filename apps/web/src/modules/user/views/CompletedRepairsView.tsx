import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useUserTheme } from '@/context/UserThemeContext';
import API from '@/services/api.service';
import {
  Star, FileText, CheckCircle, Wrench, Car, Calendar,
  DollarSign, ClipboardList, ExternalLink, Search, SlidersHorizontal
} from 'lucide-react';
import InvoiceModal from '@/components/common/InvoiceModal';
import ReportModal from '@/components/common/ReportModal';

export default function CompletedRepairs() {
  const { user } = useAuth();
  const { isDarkMode } = useUserTheme();
  const navigate = useNavigate();
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceRepair, setInvoiceRepair] = useState(null);
  const [reportRepair, setReportRepair] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchCompletedRepairs();
  }, [user]);

  const fetchCompletedRepairs = async () => {
    try {
      setLoading(true);
      const response = await API.get('/users/completed-repairs');
      setRepairs(response.data);
    } catch (error) {
      console.error('[CompletedRepairs] Error fetching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (repair) => {
    navigate(`/repairs/${repair._id}`);
  };

  const filtered = repairs
    .filter(r => searchQuery === '' ||
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.carId?.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.assignedTo?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.actualCompletionDate || b.updatedAt).getTime() - new Date(a.actualCompletionDate || a.updatedAt).getTime();
      if (sortBy === 'oldest') return new Date(a.actualCompletionDate || a.updatedAt).getTime() - new Date(b.actualCompletionDate || b.updatedAt).getTime();
      if (sortBy === 'costHigh') return (b.totalCost || 0) - (a.totalCost || 0);
      if (sortBy === 'costLow') return (a.totalCost || 0) - (b.totalCost || 0);
      return 0;
    });

  const totalSpent = repairs.reduce((sum, r) => sum + (r.totalCost || 0), 0);

  if (loading) {
    return (
      <div className={`px-6 min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
        <div className="flex flex-col items-center gap-3">
          <div className={`w-10 h-10 border-4 rounded-full animate-spin ${isDarkMode ? 'border-gray-700 border-t-blue-400' : 'border-gray-200 border-t-blue-600'}`} />
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Loading completed repairs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`px-4 sm:px-6 max-w-6xl mx-auto pb-12 pt-2 ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Completed Repairs
          </h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            All your finished repair jobs in one place
          </p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'}`}>
          <CheckCircle size={18} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
            {repairs.length} completed
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      {repairs.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'}`}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-blue-900/40' : 'bg-blue-100'}`}>
                <ClipboardList size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
              </div>
              <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Jobs</span>
            </div>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{repairs.length}</p>
          </div>
          <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'}`}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-green-900/40' : 'bg-green-100'}`}>
                <DollarSign size={16} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
              </div>
              <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Spent</span>
            </div>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${totalSpent.toFixed(0)}</p>
          </div>
          <div className={`rounded-xl p-4 col-span-2 sm:col-span-1 ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'}`}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-purple-900/40' : 'bg-purple-100'}`}>
                <FileText size={16} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
              </div>
              <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Invoices</span>
            </div>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{repairs.filter(r => r.invoiceSent).length}</p>
          </div>
        </div>
      )}

      {/* Search & Sort Bar */}
      {repairs.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className={`relative flex-1`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by title, car, or mechanic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm transition-colors ${isDarkMode ? 'bg-[#1E2A38] border-gray-700 text-gray-200 placeholder-gray-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`pl-9 pr-8 py-2.5 rounded-xl border text-sm appearance-none cursor-pointer transition-colors ${isDarkMode ? 'bg-[#1E2A38] border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-700'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="costHigh">Cost: High → Low</option>
              <option value="costLow">Cost: Low → High</option>
            </select>
          </div>
        </div>
      )}

      {/* Repairs List */}
      {repairs.length === 0 ? (
        <div className={`rounded-2xl p-12 text-center ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <CheckCircle size={28} className={isDarkMode ? 'text-gray-600' : 'text-gray-400'} />
          </div>
          <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>No completed repairs yet</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Your finished repairs will appear here once completed.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className={`rounded-2xl p-8 text-center ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No repairs match your search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((repair) => (
            <div
              key={repair._id}
              className={`group rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700 hover:border-gray-600' : 'bg-white border border-gray-200 hover:border-gray-300'}`}
            >
              {/* Top accent bar */}
              <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />

              <div className="p-5 sm:p-6">
                {/* Row 1: Title + Cost */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-lg font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {repair.title}
                      </h3>
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 whitespace-nowrap">
                        <CheckCircle size={12} /> Completed
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      <span className={`flex items-center gap-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Car size={14} className="shrink-0" />
                        {repair.carId?.year} {repair.carId?.make} {repair.carId?.model}
                      </span>
                      {repair.carId?.plate && (
                        <span className={`text-xs px-2 py-0.5 rounded font-mono ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                          {repair.carId.plate}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`text-right ml-4 shrink-0 px-4 py-2 rounded-xl ${isDarkMode ? 'bg-[#27384a]' : 'bg-gray-50'}`}>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      ${repair.totalCost || 0}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Total Cost</p>
                  </div>
                </div>

                {/* Row 2: Info chips */}
                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 p-3 rounded-xl ${isDarkMode ? 'bg-[#111B2B]' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900/40' : 'bg-blue-100'}`}>
                      <Wrench size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Mechanic</p>
                      <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {repair.assignedTo?.name || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-yellow-900/40' : 'bg-yellow-100'}`}>
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    </div>
                    <div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Rating</p>
                      <div className="flex items-center gap-1">
                        <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {repair.assignedTo?.rating ? `${Number(repair.assignedTo.rating).toFixed(1)} / 5` : 'Not rated'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-900/40' : 'bg-purple-100'}`}>
                      <Calendar size={16} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
                    </div>
                    <div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Completed</p>
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {repair.actualCompletionDate ? new Date(repair.actualCompletionDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Row 3: Report */}
                {repair.reportDetails && (
                  <div className={`mb-4 p-3 rounded-xl border-l-4 ${isDarkMode ? 'bg-[#111B2B] border-blue-500' : 'bg-blue-50 border-blue-500'}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Mechanic Report</p>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {repair.reportDetails}
                    </p>
                  </div>
                )}

                {/* Row 4: Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setReportRepair(repair)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isDarkMode ? 'bg-blue-900/40 text-blue-300 hover:bg-blue-900/60 border border-blue-800' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'}`}
                  >
                    <ClipboardList size={16} />
                    View Report
                  </button>
                  {repair.invoiceSent && (
                    <button
                      onClick={() => setInvoiceRepair(repair)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isDarkMode ? 'bg-green-900/40 text-green-300 hover:bg-green-900/60 border border-green-800' : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'}`}
                    >
                      <FileText size={16} />
                      View Invoice
                    </button>
                  )}
                  <button
                    onClick={() => handleViewDetails(repair)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow"
                  >
                    <ExternalLink size={16} />
                    View Details & Rate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {invoiceRepair && (
        <InvoiceModal
          repair={invoiceRepair}
          onClose={() => setInvoiceRepair(null)}
          isDarkMode={isDarkMode}
        />
      )}
      {reportRepair && (
        <ReportModal
          repair={reportRepair}
          onClose={() => setReportRepair(null)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}
