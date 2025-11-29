import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  SquarePen,
  Trash2,
  X
} from 'lucide-react';

import { getServices, createService, updateService, deleteService } from '../../services/adminService';

// --- Single ServicesPage Component ---
export default function ServicesPage() {
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    description: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getServices();
      setServicesData(res.data || []);
    } catch (err) {
      console.error('Failed to load services', err);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  // Functions to open and close the modal
  const openModal = (service = null) => {
    if (service) {
      setIsEditMode(true);
      setEditingService(service);
      setFormData({
        name: service.name || '',
        price: service.price || '',
        duration: service.duration || '',
        description: service.description || ''
      });
    } else {
      setIsEditMode(false);
      setEditingService(null);
      setFormData({
        name: '',
        price: '',
        duration: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingService(null);
    setFormData({
      name: '',
      price: '',
      duration: '',
      description: ''
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.duration) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (isEditMode && editingService) {
        // Update existing service
        await updateService(editingService._id, formData);
        setServicesData(servicesData.map(s => s._id === editingService._id ? { ...editingService, ...formData } : s));
        alert('Service updated successfully!');
      } else {
        // Create new service
        const res = await createService(formData);
        setServicesData([...servicesData, res.data]);
        alert('Service added successfully!');
      }
      closeModal();
      fetchServices();
    } catch (err) {
      console.error('Failed to save service', err);
      alert(err.response?.data?.message || 'Failed to save service');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await deleteService(serviceId);
      setServicesData(servicesData.filter(s => s._id !== serviceId));
      alert('Service deleted successfully!');
    } catch (err) {
      console.error('Failed to delete service', err);
      alert(err.response?.data?.message || 'Failed to delete service');
    }
  };

  const filteredServices = servicesData.filter(service =>
    service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // Main container with light gray background
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* --- Main Content Area --- */}
      
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Services Management
          </h1>
          {/* Updated button to open the modal */}
          <button 
            onClick={() => openModal()}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="h-5 w-5" />
            <span>Add Service</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* --- Services Grid --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-8 text-gray-500">Loading services...</div>
          ) : filteredServices.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-gray-500">No services found</div>
          ) : (
            filteredServices.map((service) => (
            // --- Service Card ---
            <div key={service._id} className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden hover:shadow-md transition-shadow">
              {/* Card Body */}
              <div className="p-6 flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{service.name}</h3>
                <div className="flex justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-500">Price</div>
                    <div className="text-base font-medium text-blue-600">${service.price}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="text-base font-medium text-gray-800">{service.duration}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Description</div>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-3">{service.description || 'N/A'}</p>
                </div>
              </div>
              
              {/* Card Footer with Actions */}
                      <div className="border-t border-gray-200 bg-gray-50 p-4 flex justify-end space-x-3">
                      <button 
                        onClick={() => openModal(service)}
                        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        <SquarePen className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteService(service._id)}
                        className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      </div>
                    </div>
                    )))}
                    </div>

                    {isModalOpen && (
        // Modal Backdrop
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          
          {/* Modal Panel */}
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 m-4">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditMode ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button 
                onClick={closeModal} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body (Form) */}
            <form onSubmit={handleAddService}>
              <div className="space-y-4">
                
                {/* Service Name */}
                <div>
                  <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-1">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    id="serviceName"
                    name="name"
                    placeholder="e.g., Oil Change"
                    value={formData.name}
                    onChange={handleFormChange}
                    autoFocus
                    className="mt-1 block w-full px-3 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Price & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      placeholder="49.99"
                      value={formData.price}
                      onChange={handleFormChange}
                      step="0.01"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                      Duration *
                    </label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      placeholder="30 min"
                      value={formData.duration}
                      onChange={handleFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                    name="description"
                    rows="3"
                    placeholder="Service description..."
                    value={formData.description}
                    onChange={handleFormChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                >
                  {isEditMode ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
            
          </div>
        </div>
      )}
      {/* --- End of Modal --- */}
    </div>
  );
}