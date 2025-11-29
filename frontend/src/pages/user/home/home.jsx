import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Zap, Star, Wrench, Calendar, Clock, ExternalLink,
  Droplet, Battery, Snowflake, Search, MapPin, ArrowRight, Plus, Car
} from 'lucide-react';
import BookAppointmentModal from './BookAppointmentModal';
import { useAuth } from '../../../context/AuthContext';
import { getAllAppointments, getUserCars } from '../../../services/userService';

// --- STATIC DATA ---
const featureCards = [
  { icon: ShieldCheck, title: "Certified Mechanics", description: "ASE certified professionals" },
  { icon: Zap, title: "Quick Service", description: "Same-day appointments available" },
  { icon: Star, title: "5-Star Rated", description: "Trusted by 10,000+ customers" },
];

const defaultAppointments = [
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCarPrompt, setShowAddCarPrompt] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appointments
        const appointRes = await getAllAppointments();
        setAppointments(appointRes.data || []);
        
        // Fetch user's cars
        const carsRes = await getUserCars();
        const userCars = carsRes.data || [];
        setCars(userCars);
        
        // Show add car prompt if no cars exist
        if (userCars.length === 0) {
          setShowAddCarPrompt(true);
        }
      } catch (err) {
        console.error('Failed to load data', err);
        setAppointments(defaultAppointments);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      {/* ADD CAR PROMPT - Show if user has no cars */}
      {showAddCarPrompt && (
        <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-orange-100 rounded-full">
                <Car size={32} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Add Your First Vehicle</h3>
                <p className="text-sm text-gray-600 mt-1">Get started by adding your vehicle to receive personalized service recommendations</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/user/addCar')}
              className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition whitespace-nowrap flex items-center gap-2"
            >
              <Plus size={20} />
              Add Vehicle
            </button>
          </div>
        </div>
      )}

      {/* YOUR VEHICLES SECTION - Show added cars */}
      {cars.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Your Vehicles</h2>
            <button
              onClick={() => navigate('/user/addCar')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
            >
              <Plus size={18} />
              Add Another
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cars.map((car) => (
              <div key={car._id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Car size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {car.year} {car.make} {car.model}
                      </h3>
                      <p className="text-sm text-gray-500">{car.licensePlate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color:</span>
                    <span className="font-semibold text-gray-800">{car.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mileage:</span>
                    <span className="font-semibold text-gray-800">{car.mileage || 0} miles</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuel Type:</span>
                    <span className="font-semibold text-gray-800">{car.fuelType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* WELCOME BANNER */}
      <div className="p-8 mb-8 rounded-xl bg-blue-600 shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back, {user?.name || 'User'}!</h1>
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
