import React, { useState } from 'react';
import { 
  ShieldCheck, Zap, Star, Wrench, Calendar, Clock, ExternalLink,
  Droplet, Battery, Snowflake, Search, MapPin, ArrowRight
} from 'lucide-react';
import BookAppointmentModal from './BookAppointmentModal';

// --- DATA ---
const featureCards = [
  { icon: ShieldCheck, title: "Certified Mechanics", description: "ASE certified professionals" },
  { icon: Zap, title: "Quick Service", description: "Same-day appointments available" },
  { icon: Star, title: "5-Star Rated", description: "Trusted by 10,000+ customers" },
];

const appointments = [
  { service: "Oil Change & Inspection", date: "Nov 27, 2025", time: "10:00 AM", mechanic: "Mike Johnson", status: "confirmed" },
  { service: "Brake Pad Replacement", date: "Dec 5, 2025", time: "2:00 PM", mechanic: "Sarah Williams", status: "pending" },
];

const services = [
  { icon: Droplet, name: "Oil Change", duration: "30 min", price: "$49.99", color: "text-blue-600" },
  { icon: Wrench, name: "Tire Rotation", duration: "45 min", price: "$29.99", color: "text-red-500" },
  { icon: Battery, name: "Brake Service", duration: "1-2 hrs", price: "$149.99", color: "text-purple-500" },
  { icon: Search, name: "Battery Check", duration: "20 min", price: "$19.99", color: "text-green-600" },
  { icon: Snowflake, name: "AC Service", duration: "1 hr", price: "$89.99", color: "text-cyan-500" },
  { icon: Search, name: "Engine Diagnostic", duration: "1 hr", price: "$79.99", color: "text-orange-500" },
];

const locationInfo = {
  address: "123 Auto Service Drive, Mechanic City, MC 12345",
  hours: { weekdays: "Mon-Fri: 8AM-6PM", saturday: "Sat: 9AM-4PM", sunday: "Sun: Closed" },
};

// Service Card Component
const ServiceCard = ({ icon: Icon, name, duration, price, color }) => (
  <div className="flex flex-col p-5 bg-white rounded-xl shadow-md border border-gray-200 transition duration-300 hover:shadow-lg">
    <div className="flex items-start justify-between mb-4">
      <Icon size={32} className={color} />
      <span className="text-lg font-semibold text-red-500">{price}</span>
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-1">{name}</h3>
    <div className="flex items-center text-sm text-gray-500 mb-6">
      <Clock size={16} className="mr-1" />
      <span>{duration}</span>
    </div>
    <button className="mt-auto px-4 py-2 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition duration-150">
      Book Now
    </button>
  </div>
);

// Location Card Component
const LocationCard = ({ address, hours }) => (
  <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Visit Our Location</h2>
    <div className="flex items-start mb-3">
      <MapPin size={20} className="text-blue-600 flex-shrink-0 mt-1 mr-3" />
      <p className="text-gray-700">{address}</p>
    </div>
    <div className="flex items-start mb-4">
      <Clock size={20} className="text-blue-600 flex-shrink-0 mt-1 mr-3" />
      <p className="text-gray-700">
        <span className="font-semibold">Hours:</span> {hours.weekdays}, {hours.saturday}, {hours.sunday}
      </p>
    </div>
    <button className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition mt-2">
      Get Directions
      <ArrowRight size={16} className="ml-2" />
    </button>
  </div>
);

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6">
      {/* WELCOME BANNER */}
      <div className="p-8 mb-8 rounded-xl bg-blue-600 shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back, John!</h1>
        <p className="text-lg text-blue-100 mb-6 max-w-2xl">
          Keep your vehicle running smoothly with professional maintenance and repair services
        </p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-orange-500 text-white text-base font-semibold rounded-lg hover:bg-orange-600 transition duration-200 shadow-lg"
        >
          Book an Appointment
        </button>
      </div>

      {/* FEATURE CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {featureCards.map((card, index) => (
          <div key={index} className="flex p-6 bg-white rounded-xl shadow-md border border-gray-100 transition duration-300 hover:shadow-lg">
            <div className="p-3 bg-white border border-gray-200 rounded-lg mr-4">
              <card.icon size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{card.title}</h3>
              <p className="text-sm text-gray-500">{card.description}</p>
            </div>
          </div>
        ))}
      </section>

      {/* UPCOMING APPOINTMENTS */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Upcoming Appointments</h2>
          <button className="flex items-center text-blue-600 text-sm font-medium hover:text-blue-700 transition">
            View All
            <ExternalLink size={16} className="ml-1" />
          </button>
        </div>
        
        <div className="divide-y divide-gray-100">
          {appointments.map((appointment, index) => (
            <div key={index} className="flex items-center justify-between p-4 mb-4 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-start space-x-4">
                <Wrench size={24} className="text-blue-500 flex-shrink-0" />
                <div>
                  <h4 className="text-base font-semibold text-gray-800">{appointment.service}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1 text-gray-400" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1 text-gray-400" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {appointment.status}
                </span>
                <p className="text-sm text-gray-600 mt-1">with {appointment.mechanic}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR SERVICES */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Popular Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </section>

      {/* VISIT OUR LOCATION */}
      <section className="max-w-4xl">
        <LocationCard address={locationInfo.address} hours={locationInfo.hours} />
      </section>

      {/* MODAL */}
      <BookAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Home;
