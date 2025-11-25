import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  User,
  Plus,
  SquarePen,
  Trash2,
  X // Import the X icon for the close button
} from 'lucide-react';

// --- Mock Data ---
const servicesData = [
  { name: 'Oil Change', price: '$49.99', duration: '30 minutes', description: 'Complete oil change with filter replacement' },
  { name: 'Brake Repair', price: '$199.99', duration: '2 hours', description: 'Brake pad replacement and rotor inspection' },
  { name: 'Tire Replacement', price: '$299.99', duration: '1 hour', description: 'Four tire replacement with balancing' },
  { name: 'Engine Diagnostic', price: '$89.99', duration: '45 minutes', description: 'Complete engine diagnostic scan and report' },
  { name: 'Battery Check & Replacement', price: '$149.99', duration: '30 minutes', description: 'Battery testing and replacement if needed' },
  { name: 'Transmission Service', price: '$249.99', duration: '3 hours', description: 'Transmission fluid change and inspection' },
];

// --- Single ServicesPage Component ---
export default function ServicesPage() {
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Functions to open and close the modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    // Main container with light gray background
    <div className="min-h-screen bg-slate-100">
      
      {/* --- App Header --- */}
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Search Bar */}
            <div className="flex-shrink-0 flex items-center">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-100 rounded-md py-2 pl-10 pr-4 block w-full sm:text-sm border-transparent focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Right Side Icons & User */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  2
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <div className="font-medium text-gray-800">Admin User</div>
                  <div className="text-sm text-gray-500">admin@carfix.com</div>
                </div>
                <div className="h-10 w-10 bg-red-500 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="p-6 sm:p-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Services Management
          </h1>
          {/* Updated button to open the modal */}
          <button 
            onClick={openModal}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Service</span>
          </button>
        </div>

        {/* --- Services Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service, index) => (
            // --- Service Card ---
            <div key={index} className="bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
              {/* Card Body */}
              <div className="p-6 flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{service.name}</h3>
                <div className="flex justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-500">Price</div>
                    <div className="text-base font-medium text-blue-600">{service.price}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="text-base font-medium text-gray-800">{service.duration}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Description</div>
                  <p className="text-sm text-gray-700 mt-1">{service.description}</p>
                </div>
              </div>
              
              {/* Card Footer with Actions */}
              <div className="border-t border-gray-200 bg-gray-50 p-4 flex justify-end space-x-3">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors">
                  <SquarePen className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- Add New Service Modal --- */}
      {isModalOpen && (
        // Modal Backdrop
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          
          {/* Modal Panel */}
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 m-4">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add New Service</h2>
              <button 
                onClick={closeModal} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body (Form) */}
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                
                {/* Service Name */}
                <div>
                  <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-1">
                    Service Name
                  </label>
                  <input
                    type="text"
                    id="serviceName"
                    placeholder="e.g., Oil Change"
                    // Added autoFocus and specific styling to match the image
                    autoFocus
                    className="mt-1 block w-full px-3 py-2 border-2 border-blue-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Price & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="text"
                      id="price"
                      placeholder="$49.99"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      id="duration"
                      placeholder="30 minutes"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows="3"
                    placeholder="Service description..."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>

              </div>
            </form>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                // Add your form submission logic here
                onClick={closeModal} // For now, just closes the modal
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Add Service
              </button>
            </div>
            
          </div>
        </div>
      )}
      {/* --- End of Modal --- */}
      
    </div>
  );
}