import React, { useState } from 'react';

import { Search, ShoppingCart, Star } from "lucide-react";
import { useUserTheme } from '../../../context/UserThemeContext';
function Shop() {

const { isDarkMode } = useUserTheme();
const categories = [
  "All Products",
  "Oils & Fluids",
  "Filters",
  "Brake Parts",
  "Batteries",
  "Tires",
  "Accessories",
];

const products = [
  {
    id: 1,
    name: "Synthetic Motor Oil 5W-30",
    desc: "Premium synthetic motor oil for optimal engine performance",
    price: 29.99,
    rating: 4.8,
    reviews: 245,
    category: "Oils & Fluids",
    stock: "In Stock",
    icon: "🛢️",
  },
  {
    id: 2,
    name: "High-Performance Oil Filter",
    desc: "Advanced filtration technology for cleaner oil",
    price: 12.99,
    rating: 4.6,
    reviews: 189,
    category: "Filters",
    stock: "In Stock",
    icon: "🔧",
  },
  {
    id: 3,
    name: "Ceramic Brake Pads (Front)",
    desc: "Low-dust ceramic brake pads for superior stopping power",
    price: 89.99,
    rating: 4.9,
    reviews: 312,
    category: "Brake Parts",
    stock: "In Stock",
    icon: "🛑",
  },
  {
    id: 4,
    name: "Premium Car Battery 650 CCA",
    desc: "Reliable starting power in all weather conditions",
    price: 149.99,
    rating: 4.7,
    reviews: 156,
    category: "Batteries",
    stock: "Limited Stock",
    icon: "🔋",
  },
];
 const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === "All Products" ||
      p.category === selectedCategory;

    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

    return (
        <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
<div className={`p-6 max-w-7xl mx-auto font-sans ${isDarkMode ? 'bg-[#101828]' : ''}`}>
      {/* Heading */}
      <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Auto Parts & Accessories Shop</h1>
      <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Quality parts and accessories for your vehicle
      </p>

      {/* Search + Category Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Bar */}
        <div className={`flex items-center border rounded-xl px-3 py-2 shadow-sm w-full max-w-sm ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white'}`}>
          <Search className={isDarkMode ? 'text-gray-500' : 'text-gray-500'} />
          <input
            type="text"
            placeholder="Search products..."
            className={`ml-2 w-full focus:outline-none ${isDarkMode ? 'bg-[#1E2A38] text-white placeholder-gray-500' : 'bg-white'}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full border transition ${isDarkMode ? selectedCategory === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-[#1E2A38] text-gray-300 border-gray-700 hover:bg-[#27384a]"
                : selectedCategory === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className={`border rounded-xl shadow-sm p-5 flex flex-col transition ${isDarkMode ? 'bg-[#1E2A38] border-gray-700 hover:shadow-lg' : 'bg-white hover:shadow-lg'}`}
          >
            {/* Product Icon */}
            <div className="text-6xl mx-auto">{p.icon}</div>

            {/* Title */}
            <h3 className={`mt-4 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{p.name}</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{p.desc}</p>

            {/* Rating */}
            <div className={`flex items-center mt-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
              <Star className="text-orange-500 w-4 h-4 fill-orange-500 mr-1" />
              {p.rating}
              <span className={`ml-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>({p.reviews} reviews)</span>
            </div>

            {/* Price + Stock */}
            <div className="flex justify-between items-center mt-3">
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${p.price}</p>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  p.stock === "In Stock"
                    ? isDarkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
                    : isDarkMode ? "bg-yellow-900/30 text-yellow-400" : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {p.stock}
              </span>
            </div>

            {/* Add to Cart */}
            <button className={`mt-4 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition ${
              isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
        </div>
    );
}

export default Shop;
