import React, { useState, useEffect } from 'react';
import { 
  X, 
  Car, 
  Wrench, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  Calendar,
  CalendarDays,
  ArrowRight,
  ArrowLeft,
  Loader2,
  DollarSign,
  Timer
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getUserCars } from '../../../services/userService';
import { getServices } from '../../../services/adminService';
import { bookAppointment } from '../../../services/appointmentService';
import { useUserTheme } from '../../../context/UserThemeContext';

interface CarItem {
  _id: string;
  year: number | string;
  make: string;
  model: string;
  licensePlate?: string;
  [key: string]: any;
}

interface ServiceItem {
  _id: string;
  name: string;
  description?: string;
  price: number | string;
  duration?: string;
  category?: string;
  isActive?: boolean;
}

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM"
];

// Helper to generate visual styling and icons dynamically based on category or index
const getServiceVisuals = (service: ServiceItem, index: number) => {
  const cat = (service.category || '').toLowerCase();
  const name = (service.name || '').toLowerCase();

  if (cat === 'maintenance' || name.includes('oil') || name.includes('filter') || name.includes('routine')) {
    return {
      icon: Clock,
      badge: index === 0 ? 'Popular' : undefined,
      gradient: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50/80',
      bgDark: 'bg-emerald-950/30',
      borderLight: 'border-emerald-200',
      borderDark: 'border-emerald-800/50'
    };
  } else if (cat === 'repair' || name.includes('engine') || name.includes('brake') || name.includes('repair')) {
    return {
      icon: Wrench,
      badge: undefined,
      gradient: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50/80',
      bgDark: 'bg-amber-950/30',
      borderLight: 'border-amber-200',
      borderDark: 'border-amber-800/50'
    };
  } else if (cat === 'diagnostics' || name.includes('test') || name.includes('diagnostic') || name.includes('check')) {
    return {
      icon: Activity,
      badge: undefined,
      gradient: 'from-purple-500 to-violet-600',
      bgLight: 'bg-purple-50/80',
      bgDark: 'bg-purple-950/30',
      borderLight: 'border-purple-200',
      borderDark: 'border-purple-800/50'
    };
  } else if (cat === 'customization' || name.includes('paint') || name.includes('body') || name.includes('wash')) {
    return {
      icon: Sparkles,
      badge: undefined,
      gradient: 'from-rose-500 to-pink-600',
      bgLight: 'bg-rose-50/80',
      bgDark: 'bg-rose-950/30',
      borderLight: 'border-rose-200',
      borderDark: 'border-rose-800/50'
    };
  }

  // Default theme
  const defaultThemes = [
    { gradient: 'from-blue-500 to-indigo-600', bgLight: 'bg-blue-50/80', bgDark: 'bg-blue-950/30', borderLight: 'border-blue-200', borderDark: 'border-blue-800/50' },
    { gradient: 'from-cyan-500 to-blue-600', bgLight: 'bg-cyan-50/80', bgDark: 'bg-cyan-950/30', borderLight: 'border-cyan-200', borderDark: 'border-cyan-800/50' },
  ];
  const selectedDefault = defaultThemes[index % defaultThemes.length];
  return {
    icon: ShieldCheck,
    badge: index === 0 ? 'Recommended' : undefined,
    ...selectedDefault
  };
};

export default function BookAppointmentModal({ isOpen, onClose, onSuccess }: BookAppointmentModalProps) {
  const { user } = useAuth();
  const { isDarkMode } = useUserTheme();
  
  const [step, setStep] = useState<number>(1);
  const [vehicles, setVehicles] = useState<CarItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<{
    service: ServiceItem | null;
    vehicle: string | null;
    date: string;
    time: string | null;
    notes: string;
  }>({
    service: null,
    vehicle: null,
    date: '',
    time: null,
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchData();
      setStep(1);
      setError(null);
      setSuccess(false);
      setFormData({
        service: null,
        vehicle: null,
        date: '',
        time: null,
        notes: ''
      });
    }
  }, [isOpen, user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [carsRes, servicesRes] = await Promise.all([
        getUserCars().catch(() => ({ data: [] })),
        getServices().catch(() => ({ data: [] }))
      ]);

      const fetchedCars = carsRes.data || [];
      const fetchedServices = (servicesRes.data || []).filter((s: ServiceItem) => s.isActive !== false);

      setVehicles(fetchedCars);
      setServices(fetchedServices);

      if (fetchedCars.length > 0) {
        setFormData(prev => ({ ...prev, vehicle: fetchedCars[0]._id }));
      }
      if (fetchedServices.length > 0) {
        setFormData(prev => ({ ...prev, service: fetchedServices[0] }));
      }
    } catch (err) {
      console.error('Failed to load modal data:', err);
      setError('Could not load required data from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectService = (service: ServiceItem) => {
    setFormData(prev => ({ ...prev, service }));
    setError(null);
  };

  const handleSelectVehicle = (carId: string) => {
    setFormData(prev => ({ ...prev, vehicle: carId }));
    setError(null);
  };

  const handleSelectTime = (time: string) => {
    setFormData(prev => ({ ...prev, time }));
    setError(null);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, date: e.target.value }));
    setError(null);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, notes: e.target.value }));
  };

  const handleNext = () => {
    if (step === 1 && !formData.service) {
      setError('Please select a service to continue.');
      return;
    }
    if (step === 2 && (!formData.vehicle || !formData.date)) {
      setError('Please select both a vehicle and a preferred date.');
      return;
    }
    if (step === 3 && !formData.time) {
      setError('Please select a preferred time slot.');
      return;
    }
    setError(null);
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.service || !formData.vehicle || !formData.date || !formData.time) {
      setError('Please complete all required fields (Service, Vehicle, Date, and Time).');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const appointmentData = {
        carId: formData.vehicle,
        title: formData.service.name,
        description: `${formData.service.name}${formData.notes ? ' - ' + formData.notes : ''}`,
        serviceType: formData.service.name,
        requestedDate: `${formData.date} ${formData.time}`,
        notes: formData.notes || '',
        priority: 'medium'
      };

      await bookAppointment(appointmentData);
      setSuccess(true);
      if (onSuccess) onSuccess();
      
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const minDate = new Date().toISOString().split('T')[0];
  const selectedServiceVisuals = formData.service ? getServiceVisuals(formData.service, 0) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      {/* Success Modal Screen */}
      {success ? (
        <div className={`relative w-full max-w-md overflow-hidden rounded-3xl p-8 text-center shadow-2xl transition-all duration-300 border animate-in zoom-in-95 duration-300 ${
          isDarkMode ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'
        }`}>
          <div className="h-2 w-full absolute top-0 left-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" />
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/30 animate-bounce">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Appointment Confirmed!
          </h3>
          <p className={`text-sm leading-relaxed mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            We have scheduled your <span className="font-bold text-emerald-500">{formData.service?.name}</span> for <span className="font-semibold">{formData.date}</span> at <span className="font-semibold">{formData.time}</span>.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Redirecting to your appointments...
          </div>
        </div>
      ) : (
        /* Main 3-Step Wizard Modal */
        <div 
          className={`relative w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl transition-all duration-300 border ${
            isDarkMode 
              ? 'bg-[#0F172A]/95 border-slate-800 text-slate-100 shadow-blue-500/5' 
              : 'bg-white/95 border-slate-100 text-slate-900 shadow-xl'
          } backdrop-blur-xl`}
        >
          {/* Top Decorative Gradient Banner */}
          <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

          {/* Header Section */}
          <div className={`flex items-center justify-between px-7 pt-6 pb-4 border-b ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
                <CalendarDays className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  Book Service Appointment
                </h2>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Step {step} of 3 — {step === 1 ? 'Select Service' : step === 2 ? 'Vehicle & Date' : 'Time Slot & Notes'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={onClose} 
              className={`rounded-full p-2 transition-all duration-200 ${
                isDarkMode 
                  ? 'text-slate-400 hover:bg-slate-800 hover:text-white' 
                  : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Step Progress Line */}
          <div className={`flex gap-2 px-7 py-3 border-b ${isDarkMode ? 'border-slate-800/60 bg-slate-900/40' : 'border-slate-100 bg-slate-50/60'}`}>
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                onClick={() => {
                  if (num < step) setStep(num);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 ${
                  num === step
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                    : num < step
                    ? `${isDarkMode ? 'bg-slate-800 text-blue-400 hover:bg-slate-700' : 'bg-blue-100/70 text-blue-700 hover:bg-blue-200/80'} cursor-pointer`
                    : `${isDarkMode ? 'bg-slate-800/40 text-slate-500' : 'bg-slate-100 text-slate-400'} cursor-not-allowed`
                }`}
              >
                {num < step ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                ) : (
                  <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                    num === step ? 'bg-white text-blue-600' : isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-300 text-slate-600'
                  }`}>{num}</span>
                )}
                <span className="hidden sm:inline">{num === 1 ? 'Service' : num === 2 ? 'Date & Vehicle' : 'Time & Notes'}</span>
              </div>
            ))}
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mx-7 mt-5 flex items-start gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-red-600 dark:text-red-400 animate-in fade-in duration-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm font-medium">{error}</div>
            </div>
          )}

          {/* Modal Body */}
          <div className="p-7 max-h-[58vh] overflow-y-auto">
            {/* STEP 1: CHOOSE SERVICE */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <label className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Available Services from Catalog
                  </label>
                  <span className="text-xs text-blue-500 font-medium">Select one option</span>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Loading services from server...
                    </p>
                  </div>
                ) : services.length === 0 ? (
                  <div className={`text-center py-12 rounded-2xl border border-dashed ${isDarkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-slate-50'}`}>
                    <Wrench className="h-10 w-10 mx-auto mb-3 text-slate-400 opacity-50" />
                    <h4 className={`font-bold text-base ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      No Services Available
                    </h4>
                    <p className={`text-xs mt-1 max-w-sm mx-auto ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      The admin catalog currently has no active services listed.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {services.map((service, idx) => {
                      const visuals = getServiceVisuals(service, idx);
                      const IconComponent = visuals.icon;
                      const isSelected = formData.service?._id === service._id;
                      return (
                        <div
                          key={service._id}
                          onClick={() => handleSelectService(service)}
                          className={`group relative cursor-pointer rounded-2xl p-4 transition-all duration-300 border ${
                            isSelected
                              ? `${isDarkMode ? visuals.bgDark : visuals.bgLight} ${isDarkMode ? visuals.borderDark : visuals.borderLight} ring-2 ring-blue-500/50 shadow-lg scale-[1.01]`
                              : `${isDarkMode ? 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700' : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100/80 hover:border-slate-300'} hover:shadow-md`
                          }`}
                        >
                          {visuals.badge && (
                            <span className="absolute top-3 right-3 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-500 dark:text-blue-400 border border-blue-500/20">
                              {visuals.badge}
                            </span>
                          )}
                          <div className="flex items-start gap-3.5">
                            <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${visuals.gradient} text-white shadow-md transition-transform group-hover:scale-110 duration-300`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1 pr-4">
                              <h4 className={`font-bold text-sm ${isSelected ? 'text-blue-600 dark:text-blue-400' : isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                {service.name}
                              </h4>
                              <p className={`mt-1 text-xs line-clamp-2 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                {service.description || 'Standard high-quality vehicle service & maintenance.'}
                              </p>
                              
                              <div className="mt-3 flex items-center gap-3 pt-2.5 border-t border-slate-200/50 dark:border-slate-700/50 text-xs font-semibold">
                                <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                                  <DollarSign className="h-3.5 w-3.5 -mr-0.5" />
                                  {service.price}
                                </span>
                                {service.duration && (
                                  <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-normal">
                                    <Timer className="h-3.5 w-3.5" />
                                    {service.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="absolute bottom-3 right-3 text-blue-500 dark:text-blue-400 animate-in zoom-in duration-200">
                              <CheckCircle2 className="h-5 w-5 fill-blue-500/20" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: VEHICLE & DATE SELECTION */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Selected Service Summary Banner */}
                {formData.service && selectedServiceVisuals && (
                  <div className={`flex items-center justify-between rounded-2xl p-3.5 border ${
                    isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-blue-50/60 border-blue-100'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${selectedServiceVisuals.gradient} text-white`}>
                        <selectedServiceVisuals.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Selected Service</div>
                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {formData.service.name} <span className="text-xs text-emerald-500 font-semibold">(${formData.service.price})</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold text-blue-500 hover:underline px-2.5 py-1 rounded-lg hover:bg-blue-500/10 transition"
                    >
                      Change
                    </button>
                  </div>
                )}

                {/* Vehicle Selector */}
                <div>
                  <label className={`mb-2.5 flex items-center justify-between text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span>Select Your Vehicle</span>
                    <span className="text-xs font-normal text-slate-400">Required</span>
                  </label>
                  
                  {loading ? (
                    <p className="text-sm text-slate-400">Loading vehicles...</p>
                  ) : vehicles.length === 0 ? (
                    <div className={`p-4 rounded-2xl border border-dashed flex items-center gap-3 ${isDarkMode ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' : 'border-amber-300 bg-amber-50 text-amber-800'}`}>
                      <AlertCircle className="h-6 w-6 flex-shrink-0 text-amber-500" />
                      <div>
                        <p className="font-bold text-sm">No Vehicles Registered</p>
                        <p className="text-xs opacity-90">Please add a vehicle in your user profile before booking an appointment.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {vehicles.map((vehicle) => {
                        const isSelected = formData.vehicle === vehicle._id;
                        return (
                          <div
                            key={vehicle._id}
                            onClick={() => handleSelectVehicle(vehicle._id)}
                            className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? 'border-blue-500 bg-blue-500/10 dark:bg-blue-950/40 ring-2 ring-blue-500/30'
                                : `${isDarkMode ? 'border-slate-800 bg-slate-800/40 hover:bg-slate-800' : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100'}`
                            }`}
                          >
                            <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                              isSelected ? 'bg-blue-500 text-white' : isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                            }`}>
                              <Car className="h-5 w-5" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className={`font-bold text-sm truncate ${isSelected ? 'text-blue-600 dark:text-blue-400' : isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                {vehicle.year} {vehicle.make} {vehicle.model}
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                                {vehicle.licensePlate ? `Plate: ${vehicle.licensePlate}` : 'No Plate Added'}
                              </p>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Date Picker Input */}
                <div>
                  <label className={`mb-2 flex items-center justify-between text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span>Select Preferred Date</span>
                    <span className="text-xs font-normal text-slate-400">Required</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-blue-500 pointer-events-none" />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={handleDateChange}
                      min={minDate}
                      className={`w-full appearance-none rounded-2xl border py-3.5 pl-12 pr-4 font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                        isDarkMode 
                          ? 'border-slate-700/80 bg-slate-800/80 text-white focus:border-blue-500' 
                          : 'border-slate-200 bg-slate-50/80 text-slate-900 focus:border-blue-500 focus:bg-white'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 pl-1">
                    Please choose a date from today onwards. Our mechanics operate 7 days a week.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: TIME SLOT & NOTES */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Summary Banner of Service and Date */}
                <div className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl p-3.5 border ${
                  isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-blue-50/60 border-blue-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 text-white">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Booking For</div>
                      <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {formData.service?.name} • <span className="text-slate-700 dark:text-slate-300">{formData.date}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-semibold text-blue-500 hover:underline px-2.5 py-1 rounded-lg hover:bg-blue-500/10 transition"
                  >
                    Change Date
                  </button>
                </div>

                {/* Interactive Time Slots Grid */}
                <div>
                  <label className={`mb-3 flex items-center justify-between text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span>Select Preferred Time Slot</span>
                    <span className="text-xs font-normal text-slate-400">Required</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {timeSlots.map((time) => {
                      const isSelected = formData.time === time;
                      return (
                        <button
                          type="button"
                          key={time}
                          onClick={() => handleSelectTime(time)}
                          className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-500 text-white shadow-md shadow-blue-500/25 scale-105'
                              : `${isDarkMode ? 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800 hover:border-slate-700' : 'border-slate-200 bg-slate-50/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300'}`
                          }`}
                        >
                          <Clock className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-blue-500'}`} />
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Notes Textarea */}
                <div>
                  <label className={`mb-2 flex items-center justify-between text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span>Additional Notes or Symptoms (Optional)</span>
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={handleNotesChange}
                    placeholder="Describe any unusual noises, specific parts to check, or special instructions for our mechanics..."
                    rows={3}
                    className={`w-full rounded-2xl border py-3 px-4 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none ${
                      isDarkMode 
                        ? 'border-slate-700/80 bg-slate-800/80 text-white placeholder-slate-500 focus:border-blue-500' 
                        : 'border-slate-200 bg-slate-50/80 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Navigation Buttons */}
          <div className={`flex items-center justify-between px-7 py-5 border-t ${
            isDarkMode ? 'border-slate-800/80 bg-slate-900/40' : 'border-slate-100 bg-slate-50/50'
          }`}>
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={submitting}
                className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isDarkMode 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 duration-200" />
                Back
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white' 
                    : 'bg-slate-200/70 text-slate-700 hover:bg-slate-300/80'
                }`}
              >
                Cancel
              </button>
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !formData.service) ||
                    (step === 2 && (!formData.vehicle || !formData.date))
                  }
                  className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-2.5 font-bold text-sm text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
                >
                  <span>Next Step</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-200" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !formData.time}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-7 py-2.5 font-bold text-sm text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Confirm Appointment</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
