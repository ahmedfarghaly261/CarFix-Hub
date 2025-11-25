import React, { useState } from 'react';
import { X, Wrench, Car, Clock } from 'lucide-react';
import { Droplet, Battery, Snowflake, Search, Wrench as WrenchIcon } from 'lucide-react';

const services = [
  { icon: Droplet, name: "Oil Change", duration: "30 min", price: "$49.99", color: "text-blue-600" },
  { icon: WrenchIcon, name: "Tire Rotation", duration: "45 min", price: "$29.99", color: "text-red-500" },
  { icon: Battery, name: "Brake Service", duration: "1-2 hrs", price: "$149.99", color: "text-purple-500" },
  { icon: Search, name: "Battery Check", duration: "20 min", price: "$19.99", color: "text-green-600" },
  { icon: Snowflake, name: "AC Service", duration: "1 hr", price: "$89.99", color: "text-cyan-500" },
  { icon: Search, name: "Engine Diagnostic", duration: "1 hr", price: "$79.99", color: "text-orange-500" },
  { icon: WrenchIcon, name: "Full Vehicle Inspection", duration: "2 hrs", price: "$99.99", color: "text-indigo-600" },
];

const vehicles = [
  { name: "Toyota Camry 2020", plate: "ABC-1234" },
  { name: "Honda Civic 2019", plate: "XYZ-5678" },
];

const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM"
];

const BookAppointmentModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: null,
    vehicle: null,
    date: '',
    time: null,
    notes: ''
  });

  if (!isOpen) return null;

  const handleSelectService = (serviceName) => {
    setFormData({ ...formData, service: serviceName });
  };

  const handleSelectVehicle = (vehicleName) => {
    setFormData({ ...formData, vehicle: vehicleName });
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
      alert('Please select a service');
      return;
    }
    if (step === 2 && (!formData.vehicle || !formData.date)) {
      alert('Please select a vehicle and date');
      return;
    }
    if (step === 3 && !formData.time) {
      alert('Please select a time');
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Appointment booked:', formData);
    alert('Appointment booked successfully!');
    onClose();
  };

  // --- STEP 1: Select Service ---
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
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.name}
              onClick={() => handleSelectService(service.name)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition duration-200 ${
                formData.service === service.name
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <Icon size={24} className={service.color} />
                <span className="text-sm font-semibold text-red-500">{service.price}</span>
              </div>
              <h4 className="text-sm font-semibold text-gray-800">{service.name}</h4>
              <p className="text-xs text-gray-500">{service.duration}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  // --- STEP 2: Vehicle & Date ---
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
        {/* Vehicle Selection */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Select Vehicle</h4>
          <div className="space-y-2">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.plate}
                onClick={() => handleSelectVehicle(vehicle.name)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition duration-200 flex items-center ${
                  formData.vehicle === vehicle.name
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <Car size={20} className="text-blue-600 mr-3" />
                <div>
                  <p className="font-semibold text-gray-800">{vehicle.name}</p>
                  <p className="text-sm text-gray-500">{vehicle.plate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Select Date</h4>
          <input
            type="date"
            value={formData.date}
            onChange={handleDateChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="mm/dd/yyyy"
          />
        </div>
      </div>
    </div>
  );

  // --- STEP 3: Time & Notes ---
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
        {/* Time Selection */}
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

        {/* Additional Notes */}
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
            disabled={step === 1}
            className={`px-6 py-2 font-semibold rounded-lg transition duration-200 ${
              step === 1
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Back
          </button>
          <button
            onClick={step === 3 ? handleSubmit : handleNext}
            className="px-8 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {step === 3 ? 'Confirm Appointment' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentModal;
