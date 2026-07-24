import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserTheme } from '@/context/UserThemeContext';
import API from '@/services/api.service';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Car, Calendar, CheckCircle, Clock, Wrench, AlertCircle,
  ExternalLink, ChevronRight, DollarSign, Search
} from 'lucide-react';
import InvoiceModal from '@/components/common/InvoiceModal';
import ReportModal from '@/components/common/ReportModal';

const statusConfig = {
  completed: { icon: CheckCircle, label: 'Completed', lightBg: 'bg-green-50', lightText: 'text-green-700', lightBorder: 'border-green-200', darkBg: 'bg-green-900/30', darkText: 'text-green-300', darkBorder: 'border-green-800', accent: 'from-green-500 to-emerald-500' },
  'in-progress': { icon: Clock, label: 'In Progress', lightBg: 'bg-amber-50', lightText: 'text-amber-700', lightBorder: 'border-amber-200', darkBg: 'bg-amber-900/30', darkText: 'text-amber-300', darkBorder: 'border-amber-800', accent: 'from-amber-500 to-yellow-500' },
  assigned: { icon: Wrench, label: 'Assigned', lightBg: 'bg-blue-50', lightText: 'text-blue-700', lightBorder: 'border-blue-200', darkBg: 'bg-blue-900/30', darkText: 'text-blue-300', darkBorder: 'border-blue-800', accent: 'from-blue-500 to-cyan-500' },
  pending: { icon: AlertCircle, label: 'Pending', lightBg: 'bg-gray-50', lightText: 'text-gray-600', lightBorder: 'border-gray-200', darkBg: 'bg-gray-800/40', darkText: 'text-gray-400', darkBorder: 'border-gray-700', accent: 'from-gray-400 to-gray-500' },
  cancelled: { icon: AlertCircle, label: 'Cancelled', lightBg: 'bg-red-50', lightText: 'text-red-700', lightBorder: 'border-red-200', darkBg: 'bg-red-900/30', darkText: 'text-red-300', darkBorder: 'border-red-800', accent: 'from-red-500 to-rose-500' },
};

export default function RepairHistory() {
  const { user } = useAuth();
  const { isDarkMode } = useUserTheme();
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceRepair, setInvoiceRepair] = useState(null);
  const [reportRepair, setReportRepair] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserCars();
    }
  }, [user]);

  const fetchUserCars = async () => {
    try {
      setLoading(true);
      const response = await API.get('/cars');
      setCars(response.data);
      if (response.data.length > 0) {
        setSelectedCar(response.data[0]._id);
        fetchRepairsForCar(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRepairsForCar = async (carId) => {
    try {
      setLoading(true);
      const response = await API.get(`/users/repairs-history/${carId}`);
      setRepairs(response.data);
    } catch (error) {
      console.error('Error fetching repair history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCarSelect = (carId) => {
    setSelectedCar(carId);
    fetchRepairsForCar(carId);
  };

  const selectedCarData = cars.find(c => c._id === selectedCar);

  const filtered = repairs.filter(r =>
    searchQuery === '' ||
    r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.assignedTo?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusCounts = {
    total: repairs.length,
    completed: repairs.filter(r => r.status === 'completed').length,
    'in-progress': repairs.filter(r => r.status === 'in-progress').length,
    pending: repairs.filter(r => r.status === 'pending' || r.status === 'assigned').length,
  };

  if (loading && cars.length === 0) {
    return (
      <div className={`px-6 min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
        <div className="flex flex-col items-center gap-3">
          <div className={`w-10 h-10 border-4 rounded-full animate-spin ${isDarkMode ? 'border-gray-700 border-t-blue-400' : 'border-gray-200 border-t-blue-600'}`} />
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Loading repair history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`px-4 sm:px-6 max-w-6xl mx-auto pb-12 pt-2 ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Repair History
        </h1>
        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Track all repairs across your vehicles
        </p>
      </div>

      {cars.length === 0 ? (
        <div className={`rounded-2xl p-12 text-center ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <Car size={28} className={isDarkMode ? 'text-gray-600' : 'text-gray-400'} />
          </div>
          <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>No cars found</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Add a car first to view its repair history.
          </p>
        </div>
      ) : (
        <>
          {/* Car Selection Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
            {cars.map((car) => {
              const isSelected = selectedCar === car._id;
              return (
                <button
                  key={car._id}
                  onClick={() => handleCarSelect(car._id)}
                  className={`relative p-4 rounded-xl text-left transition-all duration-200 group overflow-hidden ${
                    isSelected
                      ? isDarkMode
                        ? 'bg-blue-600/20 border-2 border-blue-500 shadow-lg shadow-blue-900/20'
                        : 'bg-blue-50 border-2 border-blue-500 shadow-md shadow-blue-100'
                      : isDarkMode
                        ? 'bg-[#1E2A38] border border-gray-700 hover:border-gray-600 hover:bg-[#27384a]'
                        : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  {isSelected && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />}
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg shrink-0 ${isSelected ? (isDarkMode ? 'bg-blue-600/30' : 'bg-blue-100') : (isDarkMode ? 'bg-gray-800' : 'bg-gray-100')}`}>
                      <Car size={18} className={isSelected ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')} />
                    </div>
                    <div className="min-w-0">
                      <p className={`font-bold text-sm truncate ${isSelected ? (isDarkMode ? 'text-blue-300' : 'text-blue-700') : (isDarkMode ? 'text-white' : 'text-gray-900')}`}>
                        {car.year} {car.make}
                      </p>
                      <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{car.model}</p>
                      {car.plate && (
                        <span className={`inline-block mt-1 text-xs font-mono px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-gray-800/80 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                          {car.plate}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stats row for selected car */}
          {repairs.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className={`rounded-xl p-3 flex items-center gap-3 ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'}`}>
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900/40' : 'bg-blue-100'}`}>
                  <Wrench size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                </div>
                <div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Total</p>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{statusCounts.total}</p>
                </div>
              </div>
              <div className={`rounded-xl p-3 flex items-center gap-3 ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'}`}>
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-900/40' : 'bg-green-100'}`}>
                  <CheckCircle size={16} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
                </div>
                <div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Done</p>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{statusCounts.completed}</p>
                </div>
              </div>
              <div className={`rounded-xl p-3 flex items-center gap-3 ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'}`}>
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-amber-900/40' : 'bg-amber-100'}`}>
                  <Clock size={16} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />
                </div>
                <div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Active</p>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{statusCounts['in-progress'] + statusCounts.pending}</p>
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          {repairs.length > 0 && (
            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search repairs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm transition-colors ${isDarkMode ? 'bg-[#1E2A38] border-gray-700 text-gray-200 placeholder-gray-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
            </div>
          )}

          {/* Repairs List */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className={`w-8 h-8 border-4 rounded-full animate-spin ${isDarkMode ? 'border-gray-700 border-t-blue-400' : 'border-gray-200 border-t-blue-600'}`} />
            </div>
          ) : repairs.length === 0 ? (
            <div className={`rounded-2xl p-12 text-center ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <Wrench size={28} className={isDarkMode ? 'text-gray-600' : 'text-gray-400'} />
              </div>
              <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>No repairs found</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {selectedCarData ? `No repair history for your ${selectedCarData.year} ${selectedCarData.make} ${selectedCarData.model}` : 'Select a car above to view repairs.'}
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className={`rounded-2xl p-8 text-center ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No repairs match your search.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((repair) => {
                const cfg = statusConfig[repair.status] || statusConfig.pending;
                const StatusIcon = cfg.icon;
                return (
                  <div
                    key={repair._id}
                    className={`group rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md ${isDarkMode ? 'bg-[#1E2A38] border border-gray-700 hover:border-gray-600' : 'bg-white border border-gray-200 hover:border-gray-300'}`}
                  >
                    {/* Accent bar */}
                    <div className={`h-1 bg-gradient-to-r ${cfg.accent}`} />

                    <div className="p-4 sm:p-5">
                      {/* Top row */}
                      <div className="flex items-start gap-4">
                        {/* Status icon */}
                        <div className={`shrink-0 p-2.5 rounded-xl ${isDarkMode ? cfg.darkBg : cfg.lightBg}`}>
                          <StatusIcon size={20} className={isDarkMode ? cfg.darkText : cfg.lightText} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className={`font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {repair.title}
                              </h3>
                              <p className={`text-sm mt-0.5 line-clamp-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {repair.description}
                              </p>
                            </div>
                            <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${isDarkMode ? `${cfg.darkBg} ${cfg.darkText} ${cfg.darkBorder}` : `${cfg.lightBg} ${cfg.lightText} ${cfg.lightBorder}`}`}>
                              <StatusIcon size={12} />
                              {cfg.label}
                            </span>
                          </div>

                          {/* Meta row */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5">
                            <span className={`flex items-center gap-1 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              <Calendar size={12} />
                              {new Date(repair.createdAt).toLocaleDateString()}
                            </span>
                            {repair.actualCompletionDate && (
                              <span className={`flex items-center gap-1 text-xs ${isDarkMode ? 'text-green-500' : 'text-green-600'}`}>
                                <CheckCircle size={12} />
                                {new Date(repair.actualCompletionDate).toLocaleDateString()}
                              </span>
                            )}
                            {repair.assignedTo && (
                              <span className={`flex items-center gap-1 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                <Wrench size={12} />
                                {repair.assignedTo.name}
                              </span>
                            )}
                            {repair.totalCost > 0 && (
                              <span className={`flex items-center gap-1 text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <DollarSign size={12} />
                                {repair.totalCost}
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          {repair.status === 'completed' && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReportRepair(repair);
                                }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${isDarkMode ? 'bg-blue-900/30 text-blue-300 border-blue-800 hover:bg-blue-900/50' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'}`}
                              >
                                <FileText size={13} />
                                Report
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/repairs/${repair._id}`);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                              >
                                <ExternalLink size={13} />
                                View Details
                              </button>
                              {repair.invoiceSent && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setInvoiceRepair(repair);
                                  }}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${isDarkMode ? 'bg-green-900/30 text-green-300 border-green-800 hover:bg-green-900/50' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`}
                                >
                                  <FileText size={13} />
                                  Invoice
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
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
