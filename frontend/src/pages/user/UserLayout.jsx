import React from "react";
import { Outlet } from "react-router-dom";
import { Car, ShoppingCart, Bell, User } from 'lucide-react';

const UserLayout = () => {
  const navLinks = [
    { name: 'Home', page: 'home' },
    { name: 'My Profile', page: 'profile' },
    { name: 'Shop', page: 'shop' },
    { name: 'Appointments', page: 'appointments' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ---------------------------------------------------- */}
      {/* --- HEADER --- */}
      {/* ---------------------------------------------------- */}
      <header className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        
        {/* Main Header Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Car size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">CarFix</h1>
              <p className="text-xs text-gray-500">Your trusted auto care partner</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <ShoppingCart size={20} className="text-gray-600 cursor-pointer hover:text-blue-600 transition" />
            <div className="relative cursor-pointer">
              <Bell size={20} className="text-gray-600 hover:text-blue-600 transition" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-3 h-3 text-xs font-bold text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">1</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="p-1 bg-blue-100 rounded-full">
                <User size={24} className="text-blue-600" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">John Doe</p>
                <p className="text-xs text-gray-500">Customer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Bar */}
        <nav className="flex items-center px-6 bg-white">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={`/user/${link.page}`}
              className="py-3 px-4 text-sm font-medium text-gray-600 hover:text-blue-600 transition duration-150"
            >
              {link.name}
            </a>
          ))}
        </nav>
        
        {/* Grey Separator Bar */}
        <div className="w-full h-2 bg-gray-50" />
      </header>

      {/* ---------------------------------------------------- */}
      {/* --- MAIN CONTENT --- */}
      {/* ---------------------------------------------------- */}
      <main className="min-h-[calc(100vh-160px)]">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
