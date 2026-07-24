import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Car, CheckCircle, ClipboardList, DollarSign,
  MapPin, Plus, Trash2, User, Wrench
} from 'lucide-react';
import { useMechanicsTheme } from '@/context/MechanicsThemeContext';
import { useToast } from '@/components/ui/useToast';
import { completeJob, getJobById, startJob } from '@/modules/mechanic/services/mechanic.service';

const emptyLineItem = () => ({ name: '', quantity: 1, cost: '' });

export default function RepairRequestDetailsView() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isDarkMode } = useMechanicsTheme();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [starting, setStarting] = useState(false);
  const [reportDetails, setReportDetails] = useState('');
  const [lineItems, setLineItems] = useState([emptyLineItem()]);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const response = await getJobById(jobId);
        setJob(response.data);
        setReportDetails(response.data.reportDetails || '');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load repair request.');
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [jobId, toast]);

  const total = useMemo(
    () => lineItems.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.cost) || 0), 0),
    [lineItems]
  );

  const updateLineItem = (index, field, value) => {
    setLineItems((current) => current.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: value } : item
    )));
  };

  const handleStart = async () => {
    setStarting(true);
    try {
      const response = await startJob(job._id);
      setJob(response.data);
      toast.success('Repair work started.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start this repair.');
    } finally {
      setStarting(false);
    }
  };

  const handleComplete = async (event) => {
    event.preventDefault();
    if (!reportDetails.trim()) {
      toast.error('Please write the overall repair report.');
      return;
    }

    const normalizedItems = lineItems.map((item) => ({
      name: item.name.trim(),
      quantity: Number(item.quantity),
      cost: Number(item.cost)
    }));
    const invalidItem = normalizedItems.some((item) => (
      !item.name || !Number.isInteger(item.quantity) || item.quantity < 1 ||
      !Number.isFinite(item.cost) || item.cost < 0
    ));
    if (invalidItem) {
      toast.error('Complete the item name, quantity, and cost for every line item.');
      return;
    }

    setSubmitting(true);
    try {
      await completeJob(job._id, { reportDetails: reportDetails.trim(), lineItems: normalizedItems });
      toast.success('Repair report submitted and job completed.');
      navigate('/mechanics/completed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete this repair.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-[#0B1120] text-gray-300' : 'bg-gray-50 text-gray-600'}`}>Loading repair request...</div>;
  }

  if (!job) {
    return <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-[#0B1120] text-gray-300' : 'bg-gray-50 text-gray-600'}`}>Repair request not found.</div>;
  }

  const card = isDarkMode ? 'bg-[#162236] border-gray-800' : 'bg-white border-gray-200';
  const input = isDarkMode
    ? 'bg-[#101a2a] border-gray-700 text-white placeholder-gray-600'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400';
  const details = [
    { label: 'Customer', value: job.userId?.name || 'N/A', icon: User },
    { label: 'Vehicle', value: job.carId ? `${job.carId.year} ${job.carId.make} ${job.carId.model}` : 'N/A', icon: Car },
    { label: 'License Plate', value: job.carId?.licensePlate || job.carId?.plate || 'N/A', icon: Car },
    { label: 'Workshop', value: job.workshopId?.name || 'N/A', icon: MapPin },
    { label: 'Requested Date', value: job.requestedDate || 'Not specified', icon: Calendar },
    { label: 'Service Type', value: job.serviceType || 'General repair', icon: Wrench }
  ];

  return (
    <div className={`min-h-screen px-4 py-8 sm:px-8 ${isDarkMode ? 'bg-[#0B1120]' : 'bg-gray-50'}`}>
      <main className="mx-auto max-w-6xl">
        <button onClick={() => navigate('/mechanics/jobs')} className={`mb-5 flex items-center gap-2 text-sm font-medium ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
          <ArrowLeft size={17} /> Back to assigned jobs
        </button>

        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-blue-500">Repair Request Details</p>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{job.title}</h1>
            <p className={`mt-2 max-w-3xl leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{job.description}</p>
          </div>
          <span className={`self-start rounded-full px-4 py-2 text-sm font-semibold ${
            job.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
            job.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
          }`}>{job.status?.replace('-', ' ')}</span>
        </div>

        <section className={`mb-6 rounded-2xl border p-6 shadow-sm ${card}`}>
          <h2 className={`mb-5 flex items-center gap-2 text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <ClipboardList size={20} className="text-blue-500" /> Initial request information
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {details.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex gap-3">
                <Icon size={18} className="mt-0.5 shrink-0 text-blue-500" />
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{label}</p>
                  <p className={`mt-1 text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{value}</p>
                </div>
              </div>
            ))}
          </div>
          {job.notes && (
            <div className={`mt-5 rounded-xl p-4 ${isDarkMode ? 'bg-[#101a2a] text-gray-300' : 'bg-blue-50 text-gray-700'}`}>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-500">Customer notes</p>
              <p className="text-sm">{job.notes}</p>
            </div>
          )}
        </section>

        {job.status === 'completed' ? (
          <section className={`rounded-2xl border p-8 text-center shadow-sm ${card}`}>
            <CheckCircle className="mx-auto mb-3 text-green-500" size={42} />
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>This repair is complete</h2>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>The report and line items have already been submitted.</p>
          </section>
        ) : job.status !== 'in-progress' ? (
          <section className={`rounded-2xl border p-8 text-center shadow-sm ${card}`}>
            <Wrench className="mx-auto mb-3 text-blue-500" size={42} />
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Ready to begin?</h2>
            <button onClick={handleStart} disabled={starting} className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
              {starting ? 'Starting...' : 'Start Repair'}
            </button>
          </section>
        ) : (
          <form onSubmit={handleComplete} className="space-y-6">
            <section className={`rounded-2xl border p-6 shadow-sm ${card}`}>
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-500">Section 1</p>
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>The Report</h2>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Write a clear overall summary of the diagnosis and work completed.</p>
              </div>
              <textarea value={reportDetails} onChange={(event) => setReportDetails(event.target.value)} rows={7} placeholder="Describe the issue found, repairs performed, testing completed, and any recommendations..." className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${input}`} />
            </section>

            <section className={`rounded-2xl border p-6 shadow-sm ${card}`}>
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-500">Section 2</p>
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Line Items</h2>
                  <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Add every part installed or repair performed. Cost is per item.</p>
                </div>
                <button type="button" onClick={() => setLineItems((current) => [...current, emptyLineItem()])} className="flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                  <Plus size={16} /> Add item
                </button>
              </div>

              <div className="space-y-3">
                {lineItems.map((item, index) => (
                  <div key={index} className={`grid gap-3 rounded-xl border p-4 sm:grid-cols-[minmax(0,1fr)_110px_150px_40px] ${isDarkMode ? 'border-gray-700 bg-[#101a2a]' : 'border-gray-200 bg-gray-50'}`}>
                    <label className="text-xs font-semibold text-gray-500">Item Name
                      <input value={item.name} onChange={(event) => updateLineItem(index, 'name', event.target.value)} placeholder="e.g. Front brake pad" className={`mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${input}`} />
                    </label>
                    <label className="text-xs font-semibold text-gray-500">Quantity
                      <input type="number" min="1" step="1" value={item.quantity} onChange={(event) => updateLineItem(index, 'quantity', event.target.value)} className={`mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${input}`} />
                    </label>
                    <label className="text-xs font-semibold text-gray-500">Cost each
                      <div className="relative mt-1">
                        <DollarSign size={15} className="absolute left-3 top-3 text-gray-400" />
                        <input type="number" min="0" step="0.01" value={item.cost} onChange={(event) => updateLineItem(index, 'cost', event.target.value)} placeholder="0.00" className={`w-full rounded-lg border py-2.5 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${input}`} />
                      </div>
                    </label>
                    <button type="button" aria-label={`Remove item ${index + 1}`} disabled={lineItems.length === 1} onClick={() => setLineItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="mt-5 flex h-10 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <div className={`mt-5 flex justify-end border-t pt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mechanic total: <span className="text-green-500">${total.toFixed(2)}</span></p>
              </div>
            </section>

            <div className="flex justify-end">
              <button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-xl bg-green-600 px-7 py-3 font-semibold text-white shadow-lg shadow-green-600/20 hover:bg-green-700 disabled:opacity-50">
                <CheckCircle size={18} /> {submitting ? 'Submitting...' : 'Submit Report & Complete Job'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
