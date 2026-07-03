import React, { useState, useEffect } from 'react';
import { X, Car, Wrench, AlertCircle } from 'lucide-react';
import { getUserCars, createRepairRequest } from '../../../services/userService';
import { useUserTheme } from '../../../context/UserThemeContext';

export default function CreateAppointmentModal({ isOpen, onClose, onSuccess }) {
  const { isDarkMode } = useUserTheme();
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  
  const [formData, setFormData] = useState({
    carId: '',
    title: '',
    description: '',
    serviceType: 'general',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCars();
      setFormData({ carId: '', title: '', description: '', serviceType: 'general' });
      setError('');
    }
  }, [isOpen]);

  const fetchCars = async () => {
    setLoadingCars(true);
    try {
      const res = await getUserCars();
      setCars(res.data || []);
      if (res.data?.length > 0) {
        setFormData(prev => ({ ...prev, carId: res.data[0]._id }));
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
    } finally {
      setLoadingCars(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.carId) {
      setError('Please select a car. If you do not have one, add it in your profile first.');
      return;
    }
    if (!formData.title || !formData.description) {
      setError('Title and description are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createRepairRequest(formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating request:', err);
      setError(err.response?.data?.message || 'Failed to create repair request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className={`relative w-full max-w-lg rounded-2xl p-6 shadow-xl ${isDarkMode ? 'bg-[#1E2A38] text-white' : 'bg-white text-gray-900'}`}>
        
        <button 
          onClick={onClose} 
          className={`absolute right-4 top-4 rounded-full p-2 transition ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Book a Repair</h2>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-100 p-3 text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`mb-1 block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Select Vehicle
            </label>
            <div className="relative">
              <Car className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                name="carId"
                value={formData.carId}
                onChange={handleChange}
                disabled={loadingCars}
                className={`w-full appearance-none rounded-lg border py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'border-gray-700 bg-[#101828] text-white' 
                    : 'border-gray-300 bg-gray-50 text-gray-900'
                }`}
              >
                {loadingCars ? (
                  <option value="">Loading cars...</option>
                ) : cars.length === 0 ? (
                  <option value="">No cars found - Add a car first</option>
                ) : (
                  cars.map(car => (
                    <option key={car._id} value={car._id}>
                      {car.year} {car.make} {car.model} ({car.licensePlate})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div>
            <label className={`mb-1 block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Service Type
            </label>
            <div className="relative">
              <Wrench className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className={`w-full appearance-none rounded-lg border py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'border-gray-700 bg-[#101828] text-white' 
                    : 'border-gray-300 bg-gray-50 text-gray-900'
                }`}
              >
                <option value="general">General Inspection</option>
                <option value="maintenance">Routine Maintenance</option>
                <option value="repair">Mechanical Repair</option>
                <option value="diagnostic">Diagnostic Test</option>
                <option value="bodywork">Bodywork / Paint</option>
              </select>
            </div>
          </div>

          <div>
            <label className={`mb-1 block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Issue Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="E.g. Brake noise, Oil change"
              value={formData.title}
              onChange={handleChange}
              className={`w-full rounded-lg border py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                isDarkMode 
                  ? 'border-gray-700 bg-[#101828] text-white' 
                  : 'border-gray-300 bg-gray-50 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`mb-1 block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Issue Description
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Please describe the issue in detail..."
              value={formData.description}
              onChange={handleChange}
              className={`w-full rounded-lg border py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                isDarkMode 
                  ? 'border-gray-700 bg-[#101828] text-white' 
                  : 'border-gray-300 bg-gray-50 text-gray-900'
              }`}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`px-5 py-2.5 rounded-lg font-medium transition ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || cars.length === 0}
              className="px-5 py-2.5 rounded-lg bg-blue-600 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Booking...' : 'Book Repair'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
