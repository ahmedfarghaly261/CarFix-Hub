import React, { useState, useEffect } from 'react';
import { X, Wrench, Car, Clock, AlertCircle } from 'lucide-react';
import { Droplet, Battery, Snowflake, Search, Wrench as WrenchIcon } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getUserCars } from '../../../services/userService';
import { getServices } from '../../../services/adminService';
import { bookAppointment } from '../../../services/appointmentService';

const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM"
];

const BookAppointmentModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    service: null,
    vehicle: null,
    date: '',
    time: null,
    notes: ''
  });

  useEffect(() => {
    if (isOpen && user) {
      fetchUserCars();
      fetchServices();
    }
  }, [isOpen, user]);

  const fetchUserCars = async () => {
    try {
      setLoading(true);
      const res = await getUserCars();
      setVehicles(res.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch cars:', err);
      setError('Could not load your vehicles');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await getServices();
      setServices(res.data || []);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      // Use empty array if fetch fails
      setServices([]);
    }
  };

  if (!isOpen) return null;

  const handleSelectService = (service) => {
    setFormData({ ...formData, service });
  };

  const handleSelectVehicle = (carId) => {
    setFormData({ ...formData, vehicle: carId });
  };

  const handleSelectTime = (time) => {
    setFormData({ ...formData, time });
  };

  const handleDateChange = (e) => {
    setFormData({ ...formData, date: e.target.value });
  };

  const handleNotesChange = (e) => {
    setFormData({ ...formData, notes: e.target.value });
  };

  const handleNext = () => {
    if (step === 1 && !formData.service) {
      setError('Please select a service');
      return;
    }
    if (step === 2 && (!formData.vehicle || !formData.date)) {
      setError('Please select a vehicle and date');
      return;
    }
    if (step === 3 && !formData.time) {
      setError('Please select a time');
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
      setError('Please complete all required fields');
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

      console.log('Sending appointment data:', appointmentData);
      await bookAppointment(appointmentData);
      setSuccess(true);
      
      setTimeout(() => {
        setFormData({
          service: null,
          vehicle: null,
          date: '',
          time: null,
          notes: ''
        });
        setStep(1);
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
      console.error('Booking error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const Step1 = () => (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
          <Wrench size={20} className="text-blue-600 mr-2" />
          Select Service
        </h3>
        <p className="text-gray-500">Choose the service you need</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {loading ? (
          <p className="text-gray-500 col-span-2">Loading services...</p>
        ) : services.length > 0 ? (
          services.map((service) => (
            <div
              key={service._id}
              onClick={() => handleSelectService(service)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition duration-200 ${
                formData.service?._id === service._id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <Wrench size={24} className="text-blue-600" />
                <span className="text-sm font-semibold text-red-500">${service.price}</span>
              </div>
              <h4 className="text-sm font-semibold text-gray-800">{service.name}</h4>
              <p className="text-xs text-gray-500">{service.duration}</p>
              {service.description && (
                <p className="text-xs text-gray-600 mt-1">{service.description}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-2">No services available</p>
        )}
      </div>
    </div>
  );

  const Step2 = () => (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
          <Car size={20} className="text-blue-600 mr-2" />
          Vehicle & Date
        </h3>
        <p className="text-gray-500">Select your vehicle and preferred date</p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Select Vehicle</h4>
          {loading ? (
            <p className="text-gray-500">Loading your vehicles...</p>
          ) : vehicles.length > 0 ? (
            <div className="space-y-2">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  onClick={() => handleSelectVehicle(vehicle._id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition duration-200 flex items-center ${
                    formData.vehicle === vehicle._id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <Car size={20} className="text-blue-600 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                    <p className="text-sm text-gray-500">{vehicle.licensePlate || 'No plate'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="text-yellow-600" size={20} />
              <div>
                <p className="font-semibold text-yellow-800">No vehicles found</p>
                <p className="text-sm text-yellow-700">Please add a vehicle first</p>
              </div>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Select Date</h4>
          <input
            type="date"
            value={formData.date}
            onChange={handleDateChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
    </div>
  );

  const Step3 = () => (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
          <Clock size={20} className="text-blue-600 mr-2" />
          Time & Notes
        </h3>
        <p className="text-gray-500">Choose a time slot and add any notes</p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Select Time</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => handleSelectTime(time)}
                className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition duration-200 ${
                  formData.time === time
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Additional Notes (Optional)</h4>
          <textarea
            value={formData.notes}
            onChange={handleNotesChange}
            placeholder="Any specific concerns or requests?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            rows="4"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Appointment Booked Successfully!</h3>
            <p className="text-gray-600 mb-6">
              The admin will review your appointment request and assign a mechanic. You'll be notified soon.
            </p>
            <div className="text-sm text-gray-500">
              Redirecting...
            </div>
          </div>
        </div>
      )}

      {/* Main Modal */}
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Book an Appointment</h2>
            <p className="text-gray-500 text-sm">Step {step} of 3</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-6 pt-6 pb-0">
            <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex gap-2">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`flex-1 h-2 rounded-full transition duration-300 ${
                  num <= step ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-4 justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1 || submitting}
            className={`px-6 py-2 font-semibold rounded-lg transition duration-200 ${
              step === 1 || submitting
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Back
          </button>
          <button
            onClick={step === 3 ? handleSubmit : handleNext}
            disabled={submitting}
            className={`px-8 py-2 font-semibold rounded-lg transition duration-200 flex items-center gap-2 ${
              submitting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {submitting ? 'Booking...' : step === 3 ? 'Confirm Appointment' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentModal;
