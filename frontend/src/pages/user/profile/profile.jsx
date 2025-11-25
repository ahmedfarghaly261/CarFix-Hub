import { useState } from "react";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Car,
  Clock,
  CheckCircle,
  AlertCircle,
  Wrench,
  ChevronRight,
  Edit2,
  FileText,
  Plus,
} from "lucide-react";

export default function Profile() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-12 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-5xl border-4 border-white/30 shadow-lg">
              👤
            </div>

            {/* User Info */}
            <div className="flex-1 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">John Doe</h1>
                  <p className="text-blue-100 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} /> Member since Jan 2023
                    </span>
                    <span className="flex items-center gap-1">
                      <Car size={16} /> 24 visits
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle size={16} /> $2,847.50 spent
                    </span>
                  </p>
                </div>
                <button className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition flex items-center gap-2">
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="flex gap-8 border-b border-gray-200 mb-8 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: "📋" },
            { id: "vehicles", label: "My Vehicles", icon: "🚗" },
            { id: "history", label: "Service History", icon: "📝" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`pb-4 px-2 whitespace-nowrap text-lg font-medium transition duration-200 flex items-center gap-2 ${
                tab === item.id
                  ? "border-b-4 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900 border-b-4 border-transparent"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        {tab === "overview" && (
          <div className="space-y-6 mb-8">
            {/* Contact Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Contact Information
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                  <Mail className="text-blue-600" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="text-lg font-semibold text-gray-800">
                      john.doe@email.com
                    </p>
                  </div>
                  <Edit2
                    className="text-gray-400 hover:text-blue-600"
                    size={20}
                  />
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                  <Phone className="text-green-600" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="text-lg font-semibold text-gray-800">
                      +1 (555) 123-4567
                    </p>
                  </div>
                  <Edit2
                    className="text-gray-400 hover:text-blue-600"
                    size={20}
                  />
                </div>
              </div>
            </div>

            {/* Maintenance Reminders Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <AlertCircle className="text-amber-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Maintenance Reminders
                  </h2>
                </div>
                <button className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition flex items-center gap-2 font-semibold">
                  <Plus size={18} />
                  Add Reminder
                </button>
              </div>

              <div className="space-y-3">
                {/* Reminder 1 - Due Soon */}
                <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-lg hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Wrench size={18} className="text-red-600" />
                        <p className="font-bold text-red-700">Oil Change</p>
                        <span className="px-2 py-0.5 bg-red-200 text-red-700 text-xs font-semibold rounded">
                          Urgent
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">
                        Toyota Camry 2020
                      </p>
                      <p className="text-sm font-semibold text-red-600 ml-6 mt-1">
                        Due: Feb 15, 2026
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-1">
                      Schedule <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Reminder 2 - Due Soon */}
                <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-lg hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Wrench size={18} className="text-yellow-600" />
                        <p className="font-bold text-yellow-700">
                          Tire Rotation
                        </p>
                        <span className="px-2 py-0.5 bg-yellow-200 text-yellow-700 text-xs font-semibold rounded">
                          Soon
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">
                        Honda Civic 2019
                      </p>
                      <p className="text-sm font-semibold text-yellow-600 ml-6 mt-1">
                        Due: Dec 28, 2025
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold flex items-center gap-1">
                      Schedule <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Reminder 3 - Due Immediately */}
                <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-lg hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Wrench size={18} className="text-orange-600" />
                        <p className="font-bold text-orange-700">
                          Brake Inspection
                        </p>
                        <span className="px-2 py-0.5 bg-orange-200 text-orange-700 text-xs font-semibold rounded">
                          Critical
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">
                        Toyota Camry 2020
                      </p>
                      <p className="text-sm font-semibold text-orange-600 ml-6 mt-1">
                        Due: Dec 1, 2025
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold flex items-center gap-1">
                      Schedule <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MY VEHICLES TAB */}
        {tab === "vehicles" && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Your Vehicles
              </h2>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2">
                <Plus size={20} />
                Add Vehicle
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vehicle Card 1 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Car className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        2020 Toyota Camry
                      </h3>
                      <p className="text-sm text-gray-500">ABC-1234</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <Edit2
                      className="text-gray-400 hover:text-blue-600"
                      size={18}
                    />
                  </button>
                </div>

                <div className="space-y-2 mb-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VIN:</span>
                    <span className="font-semibold text-gray-800">
                      1HGBH41JXMN109186
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mileage:</span>
                    <span className="font-semibold text-gray-800">
                      45,230 miles
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Service:</span>
                    <span className="font-semibold text-green-600">
                      Nov 15, 2025
                    </span>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2">
                  <FileText size={18} />
                  View Service History
                </button>
              </div>

              {/* Vehicle Card 2 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Car className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        2019 Honda Civic
                      </h3>
                      <p className="text-sm text-gray-500">XYZ-5678</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <Edit2
                      className="text-gray-400 hover:text-blue-600"
                      size={18}
                    />
                  </button>
                </div>

                <div className="space-y-2 mb-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VIN:</span>
                    <span className="font-semibold text-gray-800">
                      2HGFC2F59HH123456
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mileage:</span>
                    <span className="font-semibold text-gray-800">
                      32,100 miles
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Service:</span>
                    <span className="font-semibold text-green-600">
                      Oct 28, 2025
                    </span>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2">
                  <FileText size={18} />
                  View Service History
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SERVICE HISTORY TAB */}
        {tab === "history" && (
          <div className="space-y-4 mb-8">
            {/* Service Item 1 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Oil Change & Filter Replacement
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Nov 15, 2025 • Toyota Camry 2020 • Mechanic: Mike Johnson
                    </p>
                  </div>
                </div>
                <span className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg text-sm">
                  Completed
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-gray-800 mb-2">
                  Services Included:
                </p>
                <ul className="space-y-1">
                  <li className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-blue-600">✓</span> Synthetic oil 5W-30
                    (5 quarts)
                  </li>
                  <li className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-blue-600">✓</span> Oil filter
                  </li>
                  <li className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-blue-600">✓</span> Multi-point
                    inspection
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold flex items-center justify-center gap-2">
                  <FileText size={18} />
                  View Invoice
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2">
                  <Plus size={18} />
                  Book Service
                </button>
              </div>
            </div>

            {/* Service Item 2 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Brake Pad Replacement
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Oct 28, 2025 • Honda Civic 2019 • Mechanic: Sarah Williams
                    </p>
                  </div>
                </div>
                <span className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg text-sm">
                  Completed
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-gray-800 mb-2">
                  Services Included:
                </p>
                <ul className="space-y-1">
                  <li className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-blue-600">✓</span> Front brake pads
                  </li>
                  <li className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-blue-600">✓</span> Brake fluid top-off
                  </li>
                  <li className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-blue-600">✓</span> Rotor inspection
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold flex items-center justify-center gap-2">
                  <FileText size={18} />
                  View Invoice
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2">
                  <Plus size={18} />
                  Book Service
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
