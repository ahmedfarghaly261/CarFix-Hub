
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Car, ShoppingCart, Bell, User, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import { useUserTheme } from "../../context/UserThemeContext";
import { CartModal } from "../../components/shared";

const UserLayout = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useUserTheme();
  const navLinks = [
    { name: 'Home', page: 'home' },
    { name: 'My Profile', page: 'profile' },
    { name: 'Add Car', page: 'addCar' },
    { name: 'Shop', page: 'shop' },
    { name: 'Appointments', page: 'appointments' },
  ];

  // --- Cart modal state and handlers ---
  const [cartOpen, setCartOpen] = useState(false);
  // Example cart items (replace with real state/logic as needed)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Synthetic Motor Oil 5W-30",
      price: 29.99,
      qty: 2,
      image: "https://cdn-icons-png.flaticon.com/512/1048/1048314.png", // Example image
    },
  ]);

  const handleUpdateQty = (id, qty) => {
    setCartItems(items => items.map(item => item.id === id ? { ...item, qty: Math.max(1, qty) } : item));
  };
  const handleRemove = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };
  const handleCheckout = () => {
    // Implement checkout logic here
    alert("Proceeding to checkout!");
    setCartOpen(false);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      {/* ---------------------------------------------------- */}
      {/* --- HEADER --- */}
      {/* ---------------------------------------------------- */}
      <header className={`w-full shadow-sm border-b sticky top-0 z-50 transition-colors ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
        
        {/* Main Header Bar */}
        <div className={`flex items-center justify-between px-6 py-3 border-b transition-colors ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Car size={24} className="text-white" />
            </div>
            <div>
              <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>CarFix</h1>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your trusted auto care partner</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <ShoppingCart
                size={20}
                className={`cursor-pointer transition ${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => setCartOpen(true)}
              />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                  {cartItems.length}
                </span>
              )}
            </div>
            <div className="relative cursor-pointer">
              <Bell size={20} className={`transition ${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`} />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-3 h-3 text-xs font-bold text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">1</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-[#27384a] hover:bg-[#2f3d52]' : 'bg-gray-100 hover:bg-gray-200'}`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-gray-600" />
              )}
            </button>

            <div className="flex items-center space-x-2">
              <div className="p-1 bg-blue-100 rounded-full">
                <User size={24} className="text-blue-600" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'customer@example.com'}</p>
              </div>
              <button
                onClick={logout}
                className="ml-4 p-2 text-gray-600 hover:text-red-600 transition"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
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

      {/* Cart Modal */}
      <CartModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default UserLayout;
