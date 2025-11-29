import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Car, 
  CheckCircle, 
  ChevronLeft, 
  Lightbulb
} from 'lucide-react';
import { addCar } from "../../../services/userService";

function AddCar() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    color: "",
    licensePlate: "",
    vin: "",
    mileage: "",
    fuelType: "",
    transmission: "",
  });

  const years = Array.from({ length: 25 }, (_, i) => 2024 - i);
  const colors = ["Black", "White", "Red", "Blue", "Yellow", "Gray", "Silver"];
  const fuelTypes = ["Gasoline", "Diesel", "Electric", "Hybrid"];
  const transmissions = ["Automatic", "Manual"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const carData = {
        make: form.make,
        model: form.model,
        year: parseInt(form.year),
        color: form.color,
        licensePlate: form.licensePlate,
        vin: form.vin,
        mileage: parseInt(form.mileage) || 0,
        fuelType: form.fuelType,
        transmission: form.transmission,
      };
      await addCar(carData);
      // Reset form and show success
      setStep(1);
      setForm({
        make: "",
        model: "",
        year: "",
        color: "",
        licensePlate: "",
        vin: "",
        mileage: "",
        fuelType: "",
        transmission: "",
      });
      alert('Vehicle added successfully!');
      navigate('/user/home', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  // Component definitions
  const ProgressStep = ({ number, title, isActive, isComplete }) => (
    <div className="flex items-center">
      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition duration-300 
          ${isComplete ? 'bg-blue-600 border-blue-600 text-white' : 
            isActive ? 'bg-white border-blue-600 text-blue-600' : 
            'bg-gray-200 border-gray-400 text-gray-600'
          }`}
      >
        {isComplete ? <CheckCircle size={16} className="text-white" /> : number}
      </div>
      <span className={`ml-2 text-sm font-medium hidden sm:inline ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>
        {title}
      </span>
    </div>
  );

  const FormInput = ({ label, placeholder, name, type = 'text' }) => (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        value={form[name] || ""}
        onChange={handleChange}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
      />
    </div>
  );

  const FormSelect = ({ label, name, options }) => (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        name={name}
        id={name}
        value={form[name] || ""}
        onChange={handleChange}
        className="px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-blue-500 focus:border-blue-500 transition duration-150 cursor-pointer"
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option.toLowerCase().replace(' ', '-')}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      {step === 1 ? (
        // STEP 1: BASIC INFO
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <div className="text-center max-w-xl w-full">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 text-blue-600 p-4 rounded-full text-3xl">
            🚗
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold">Welcome to CarFix!</h2>
        <p className="text-gray-500 mt-1">
          Let’s start by adding your first vehicle to get personalized service and maintenance tracking
        </p>

        {/* Step Indicator */}
        <div className="flex justify-center items-center gap-4 mt-6 mb-6">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
            1
          </div>
          <div className="w-20 h-px bg-gray-300"></div>
          <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-semibold">
            2
          </div>
        </div>

        {/* Card */}
        <div className="bg-white p-8 shadow-md rounded-xl">
          <h3 className="text-left text-gray-800 font-semibold mb-4">
            Vehicle Information
          </h3>

          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Make */}
            <div>
              <label className="block text-gray-700 mb-1">Make *</label>
              <select
                name="make"
                className="w-full rounded-lg border px-3 py-2 bg-gray-50"
                value={form.make}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Ford">Ford</option>
                <option value="Honda">Honda</option>
                <option value="Toyota">Toyota</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="Ram">Ram</option>
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="block text-gray-700 mb-1">Model *</label>
              <input
                type="text"
                name="model"
                placeholder="Enter model"
                className="w-full rounded-lg border px-3 py-2 bg-gray-50"
                value={form.model}
                onChange={handleChange}
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-gray-700 mb-1">Year *</label>
              <select
                name="year"
                className="w-full rounded-lg border px-3 py-2 bg-gray-50"
                value={form.year}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block text-gray-700 mb-1">Color</label>
              <select
                name="color"
                className="w-full rounded-lg border px-3 py-2 bg-gray-50"
                value={form.color}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {colors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

            {/* Buttons */}
            <div className="flex justify-between items-center mt-6">
              <button className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100">
                Skip for Now
              </button>

              <button onClick={handleNextStep} className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                Next Step
              </button>
            </div>
          </div>

          <p className="mt-4 text-gray-500 text-sm">
            You can always add more vehicles later from your profile
          </p>
        </div>
      </div>
      ) : (
        // STEP 2: ADDITIONAL INFO
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
          
          {/* --- WELCOME HEADER --- */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="p-4 bg-blue-100 rounded-full mb-3">
              <Car size={36} className="text-blue-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">Welcome to CarFix!</h1>
            <p className="text-gray-500 max-w-md">
              Let's start by adding your first vehicle to get personalized service and maintenance tracking
            </p>
          </div>

          {/* --- PROGRESS INDICATOR --- */}
          <div className="flex items-center justify-center space-x-4 mb-10 w-full max-w-md">
            <ProgressStep number={1} title="Basic Info" isComplete={true} isActive={false} />
            <div className="flex-1 h-0.5 bg-blue-600 mx-1" />
            <ProgressStep number={2} title="Additional Details" isComplete={false} isActive={true} />
          </div>

          {/* --- FORM CONTAINER --- */}
          <form onSubmit={handleAddVehicle} className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
            
            {/* Back Button and Title */}
            <div className="flex items-center mb-6">
              <ChevronLeft size={20} className="text-gray-600 cursor-pointer mr-2" onClick={handleBack} />
              <h2 className="text-lg font-semibold text-gray-800">Additional Details</h2>
            </div>

            {/* Input Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormInput 
                label="License Plate Number" 
                name="licensePlate" 
                placeholder="e.g., ABC-1234" 
              />
              <FormInput 
                label="VIN (Vehicle Identification Number)" 
                name="vin" 
                placeholder="17-character VIN" 
              />
              <FormInput 
                label="Current Mileage" 
                name="mileage" 
                placeholder="e.g., 45000" 
                type="number" 
              />
              <FormSelect 
                label="Fuel Type" 
                name="fuelType" 
                options={fuelTypes} 
              />
            </div>

            {/* Transmission Dropdown (takes full width) */}
            <div className="mb-6">
              <FormSelect 
                label="Transmission" 
                name="transmission" 
                options={transmissions} 
              />
            </div>

            {/* Tip Box */}
            <div className="flex items-start p-4 bg-blue-50 border border-blue-200 rounded-lg mb-8">
              <Lightbulb size={20} className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Tip:</span> Adding your VIN and license plate helps us provide more accurate service recommendations and faster check-ins.
              </p>
            </div>

            {error && <div className="bg-red-50 border border-red-300 p-3 rounded-lg text-red-600 text-sm mb-4">{error}</div>}

            {/* Action Buttons */}
            <div className="flex justify-between space-x-4">
              <button
                type="button"
                onClick={handleBack}
                className="w-full md:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition duration-150"
                disabled={loading}
              >
                Back
              </button>
              <button
                type="submit"
                className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-150 shadow-md disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Vehicle'}
              </button>
            </div>
          </form>

          {/* Footer Text */}
          <p className="mt-8 text-sm text-gray-500">
            You can always add more vehicles later from your profile
          </p>
        </div>
      )}
    </>
  );
}

export default AddCar;