import { Link } from "react-router-dom";

export default function MechanicsHeader() {
  return (
    <header className="w-full shadow bg-white fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white font-bold w-10 h-10 rounded-full flex items-center justify-center">
            CF
          </div>
          <div>
            <h1 className="font-semibold text-lg">CarFix</h1>
            <p className="text-xs text-gray-500 -mt-1">Mechanic Portal</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex items-center gap-6">
          <Link to="/" className="hover:text-blue-600">Dashboard</Link>
          <Link to="/profile" className="hover:text-blue-600">My Profile</Link>

          <div className="flex items-center gap-3">
            <span className="relative">
              <i className="fa-regular fa-bell text-xl"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">3</span>
            </span>
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          </div>
        </nav>
      </div>
    </header>
  );
}