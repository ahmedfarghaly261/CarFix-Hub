import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Eye,
  User,
  Wrench,
  MapPin,
  Filter
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { getAllJobs } from '@/modules/admin/services/admin.service';

const statusClasses = {
  'completed': 'bg-green-100 text-green-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  'assigned': 'bg-blue-100 text-blue-700',
  'pending': 'bg-yellow-100 text-yellow-700',
  'cancelled': 'bg-red-100 text-red-700',
};

export default function JobsPage() {
  const { isDarkMode } = useAdminTheme();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getAllJobs();
      setJobs(res.data || []);
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchQuery === '' ||
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.carId?.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.carId?.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.carId?.licensePlate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.carId?.plate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.assignedTo?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.workshopId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === '' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: jobs.length,
    pending: jobs.filter(j => j.status === 'pending').length,
    assigned: jobs.filter(j => j.status === 'assigned').length,
    'in-progress': jobs.filter(j => j.status === 'in-progress').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    cancelled: jobs.filter(j => j.status === 'cancelled').length,
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      <main className="p-6 sm:p-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Jobs Management
            </h1>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              View all jobs, assigned mechanics, workshops and statuses
            </p>
          </div>
          {/* Search */}
          <div className={`relative w-full sm:w-80 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search jobs, mechanics, workshops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm ${isDarkMode ? 'bg-[#1E2A38] border-gray-700 text-gray-200 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { label: 'All', value: '', count: statusCounts.all },
            { label: 'Pending', value: 'pending', count: statusCounts.pending },
            { label: 'Assigned', value: 'assigned', count: statusCounts.assigned },
            { label: 'In Progress', value: 'in-progress', count: statusCounts['in-progress'] },
            { label: 'Completed', value: 'completed', count: statusCounts.completed },
            { label: 'Cancelled', value: 'cancelled', count: statusCounts.cancelled },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === tab.value
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'bg-[#1E2A38] text-gray-300 border border-gray-700 hover:bg-[#27384a]'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                filterStatus === tab.value
                  ? 'bg-blue-500 text-white'
                  : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Jobs Table */}
        <div className={`rounded-lg shadow-lg overflow-hidden ${isDarkMode ? 'bg-[#1E2A38]' : 'bg-white'}`}>
          <div className={`px-6 py-4 border-b flex items-center gap-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <Briefcase className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} size={20} />
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              All Jobs
            </h2>
            <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
              {filteredJobs.length} jobs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <thead className={isDarkMode ? 'bg-[#27384a]' : 'bg-gray-50'}>
                <tr>
                  {['Job ID', 'Title', 'Customer', 'Vehicle', 'Mechanic', 'Workshop', 'Status', 'Cost', 'Actions'].map((header) => (
                    <th
                      key={header}
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'bg-[#1E2A38] divide-gray-700' : 'bg-white divide-gray-200'}`}>
                {loading ? (
                  <tr><td colSpan={9} className={`px-6 py-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading jobs...</td></tr>
                ) : filteredJobs.length === 0 ? (
                  <tr><td colSpan={9} className={`px-6 py-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No jobs found</td></tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr
                      key={job._id}
                      className={`cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-[#27384a]' : 'hover:bg-gray-50'}`}
                      onClick={() => navigate(`/admin/jobs/${job._id}`)}
                    >
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        #{job._id.slice(-6)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {job.title}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-gray-400" />
                          {job.userId?.name || 'N/A'}
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <div className="flex flex-col">
                          <span>{job.carId ? `${job.carId.year || ''} ${job.carId.make || ''} ${job.carId.model || ''}`.trim() : 'N/A'}</span>
                          <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>
                            {job.carId?.licensePlate || job.carId?.plate || 'No plate'}
                          </span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <div className="flex items-center gap-2">
                          <Wrench size={14} className="text-gray-400" />
                          {job.assignedTo?.name || <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>Not assigned</span>}
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gray-400" />
                          {job.workshopId?.name || <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>N/A</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusClasses[job.status] || (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700')}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        ${job.billingAmount ?? job.totalCost ?? 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/jobs/${job._id}`);
                          }}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded transition-colors"
                        >
                          <Eye size={16} />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
