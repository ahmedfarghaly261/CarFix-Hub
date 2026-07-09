

function NavBar() {
  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900 sticky top-0 z-50 shadow-md">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 relative">
          {/* Logo - Responsive sizing */}
        <a href="#">
            <img
              className="text-xl sm:h-12 w-[110px] h-[70px] object-cover"  
              src="public/logo.png" 
              alt=""
            />
          </a>
            

          {/* Right Section: Profile & Mobile Menu */}
          <div className="flex items-center gap-2 md:gap-4 order-2">
            {/* Notifications Bell - Hidden on mobile */}
            <button 
              type="button"
              className="hidden md:flex items-center justify-center p-2 text-gray-700 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-300"
            >
              <span className="sr-only">View notifications</span>
              <div className="relative">
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-xs text-white rounded-full flex items-center justify-center">
                  3
                </span>
              </div>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                type="button" 
                data-dropdown-toggle="profile-dropdown-menu" 
                className="flex items-center gap-2 p-2 text-sm text-gray-900 rounded-full hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 group transition-all duration-300"
              >
                <span className="sr-only">Open user menu</span>
                {/* Profile Picture */}
                <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 group-hover:ring-2 group-hover:ring-blue-500">
                  <svg className="absolute w-10 h-10 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                  </svg>
                </div>
                {/* User Name - Hidden on mobile */}
                <span className="hidden md:block text-sm font-medium">John Doe</span>
              </button>

              {/* Profile Dropdown Menu */}
              <div 
                id="profile-dropdown-menu" 
                className="z-50 hidden absolute right-0 mt-2 w-64 origin-top-right bg-white divide-y divide-gray-100 rounded-xl shadow-lg dark:bg-gray-700 dark:divide-gray-600 transform opacity-0 scale-95 transition-all duration-200"
              >
                <div className="px-4 py-3 space-y-1">
                  <span className="block text-sm font-semibold text-gray-900 dark:text-white">John Doe</span>
                  <span className="block text-sm text-gray-500 truncate dark:text-gray-400">john.doe@example.com</span>
                </div>
                <ul className="py-2" role="none">
                  <li>
                    <a 
                      href="/profile" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/dashboard" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/settings" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </a>
                  </li>
                  <li className="border-t dark:border-gray-600">
                    <a 
                      href="/logout" 
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-600/10 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Mobile menu button */}
            <button 
              data-collapse-toggle="navbar-menu" 
              type="button" 
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-menu" 
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>

          {/* Main Navigation Menu */}
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-menu">
            <ul className="flex flex-col w-full font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-1 lg:space-x-2 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
              <li className="w-full md:w-auto">
                <a 
                  href="/" 
                  className="block py-2.5 px-4 text-blue-600 rounded-lg md:bg-transparent md:hover:bg-blue-50 md:p-2 md:hover:text-blue-700 transition-all duration-200" 
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li className="w-full md:w-auto">
                <a 
                  href="/cars" 
                  className="block py-2.5 px-4 text-gray-900 rounded-lg hover:bg-gray-100 md:hover:bg-gray-50 md:p-2 md:hover:text-blue-700 dark:text-white dark:hover:text-white transition-all duration-200"
                >
                  My Cars
                </a>
              </li>
              <li className="w-full md:w-auto">
                <a 
                  href="/repairs" 
                  className="block py-2.5 px-4 text-gray-900 rounded-lg hover:bg-gray-100 md:hover:bg-gray-50 md:p-2 md:hover:text-blue-700 dark:text-white dark:hover:text-white transition-all duration-200"
                >
                  Repairs
                </a>
              </li>
              <li className="w-full md:w-auto">
                <a 
                  href="/workshops" 
                  className="block py-2.5 px-4 text-gray-900 rounded-lg hover:bg-gray-100 md:hover:bg-gray-50 md:p-2 md:hover:text-blue-700 dark:text-white dark:hover:text-white transition-all duration-200"
                >
                  Workshops
                </a>
              </li>
              <li className="w-full md:w-auto">
                <a 
                  href="/contact" 
                  className="block py-2.5 px-4 text-gray-900 rounded-lg hover:bg-gray-100 md:hover:bg-gray-50 md:p-2 md:hover:text-blue-700 dark:text-white dark:hover:text-white transition-all duration-200"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;