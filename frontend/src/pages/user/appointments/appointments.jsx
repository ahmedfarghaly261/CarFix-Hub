import React from 'react';
import { CalendarDays, MapPin, Mail, Phone } from "lucide-react";

const Appointments = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Appointments</h1>
      <div className="p-6 max-w-5xl mx-auto font-sans">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold">My Appointments</h1>
      <p className="text-gray-500 mb-6">Manage your service appointments</p>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {["All Appointments", "Upcoming", "Completed", "Cancelled"].map(
          (tab, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full border ${
                index === 0
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Appointment Card */}
      <div className="bg-white shadow rounded-xl p-5 border">
        {/* Title Section */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold">Oil Change &amp; Inspection</h2>
            <span className="px-2 py-1 text-sm bg-blue-100 text-blue-600 rounded-full">
              upcoming
            </span>
            <p className="text-gray-500 mt-1">Toyota Camry 2020</p>
          </div>

          <div className="text-right">
            <p className="text-blue-600 font-semibold">$54.99</p>
            <p className="text-gray-400 text-sm">30–45 min</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="bg-gray-50 p-4 rounded-lg mt-4 grid md:grid-cols-2 gap-4">
          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <CalendarDays className="text-blue-600 mt-1" />
            <div>
              <p className="font-medium">Date &amp; Time</p>
              <p className="text-gray-600">Nov 27, 2025 at 10:00 AM</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPin className="text-blue-600 mt-1" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-gray-600">
                123 Auto Service Drive, Mechanic City, MC 12345
              </p>
            </div>
          </div>

          {/* Mechanic */}
          <div className="flex items-start gap-3">
            <Phone className="text-blue-600 mt-1" />
            <div>
              <p className="font-medium">Mechanic</p>
              <p className="text-gray-600">Mike Johnson</p>
              <p className="text-gray-600">(555) 123-4567</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <Mail className="text-blue-600 mt-1" />
            <div>
              <p className="font-medium">Contact Email</p>
              <p className="text-gray-600">mike@carfix.com</p>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="bg-yellow-50 border border-yellow-300 p-3 rounded-lg text-gray-700 text-sm mt-4">
          <strong>Note:</strong> Please check tire pressure as well
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button className="flex-grow bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
            Get Directions
          </button>

          <button className="ml-3 px-5 py-3 border border-gray-300 rounded-lg hover:bg-gray-100">
            Reschedule
          </button>

          <button className="ml-3 px-5 py-3 bg-red-100 text-red-600 border border-red-300 rounded-lg hover:bg-red-200">
            Cancel
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Appointments;
