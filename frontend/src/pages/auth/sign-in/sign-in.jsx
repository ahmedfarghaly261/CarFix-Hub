function SignIn() {
  return (
    <>
      <nav className=" py-4 fixed w-full z-10 top-0 left-0">
        <div className="container mx-auto flex justify-center items-center">
          <a href="#">
            <img
              className="w-[140px] object-cover h-16"
              src="public/logo.png"
              alt="Logo"
            />
          </a>
        </div>
      </nav>
<div className="relative">
  {/* Background Car Banner */}
  <img
    src="public/banner.jpg"
    className="absolute inset-0 object-cover w-full h-full"
    alt="Car Banner"
  />

  {/* Overlay */}
  <div className="relative bg-opacity-80 ">
    <svg
      className="absolute inset-x-0 bottom-0 text-white"
      viewBox="0 0 1160 163"
    >
      <path
        fill="currentColor"
        d="M-164 13L-104 39.7C-44 66 76 120 196 141C316 162 436 152 556 119.7C676 88 796 34 916 13C1036 -8 1156 2 1216 7.7L1276 13V162.5H1216C1156 162.5 1036 162.5 916 162.5C796 162.5 676 162.5 556 162.5C436 162.5 316 162.5 196 162.5C76 162.5 -44 162.5 -104 162.5H-164V13Z"
      />
    </svg>

    {/* Content */}
    <div className="relative px-4 py-16 mx-auto overflow-hidden sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div className="flex flex-col items-center justify-between xl:flex-row">
        {/* Left Side Text */}
        <div className="w-full max-w-xl mb-12 xl:mb-0 xl:pr-16 xl:w-7/12">
          <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl sm:leading-none">
            Drive your passion <br className="hidden md:block" />
            with the latest car updates 🚗
          </h2>
          <p className="max-w-xl mb-4 text-base text-gray-200 md:text-lg">
            Stay updated with car trends, reviews, and exclusive offers. Join our
            community today.
          </p>
          <a
            href="/"
            aria-label=""
            className="inline-flex items-center font-semibold tracking-wider transition-colors duration-200 text-[#eb2224] hover:text-[#c72023]"
          >
            Learn more
            <svg
              className="inline-block w-3 ml-2"
              fill="currentColor"
              viewBox="0 0 12 12"
            >
              <path d="M9.707,5.293l-5-5A1,1,0,0,0,3.293,1.707L7.586,6,3.293,10.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,9.707,5.293Z" />
            </svg>
          </a>
        </div>

        {/* Right Side Form */}
        <div className="w-full max-w-xl xl:px-8 xl:w-5/12">
          <div className="bg-white rounded-lg shadow-2xl p-8 sm:p-10">
            <h3 className="mb-6 text-2xl font-bold text-center text-gray-800">
              Sign up
            </h3>
            <form className="space-y-4">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block mb-1 font-medium text-gray-700"
                >
                   Full Name
                </label>
                <input
                  placeholder="John"
                  required
                  type="text"
                  className="w-full h-12 px-4 border border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200"
                  id="firstName"
                  name="firstName"
                />
              </div>

           

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 font-medium text-gray-700"
                >
                  E-mail
                </label>
                <input
                  placeholder="john.doe@example.org"
                  required
                  type="email"
                  className="w-full h-12 px-4 border border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200"
                  id="email"
                  name="email"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  placeholder="••••••••"
                  required
                  type="password"
                  className="w-full h-12 px-4 border border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200"
                  id="password"
                  name="password"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-1 font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  placeholder="••••••••"
                  required
                  type="password"
                  className="w-full h-12 px-4 border border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200"
                  id="confirmPassword"
                  name="confirmPassword"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full h-12 px-6 font-medium text-white rounded-md shadow-md bg-[#eb2224] hover:bg-[#c72023] focus:ring "
                >
                  Log In
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


      <footer class="rounded-lg shadow-sm text-white  m-4 bg-black">
        <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div class="sm:flex sm:items-center sm:justify-between">
            <img
              className="w-[140px] object-cover h-16"
              src="public/logo.png"
              alt="Logo"
            />
            <ul class="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li>
                <a href="#" class="hover:underline me-4 md:me-6">
                  About
                </a>
              </li>
              <li>
                <a href="#" class="hover:underline me-4 md:me-6">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" class="hover:underline me-4 md:me-6">
                  Licensing
                </a>
              </li>
              <li>
                <a href="#" class="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2025{" "}
            <a href="https://flowbite.com/" class="hover:underline">
              Ahmed Farghaly
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    </>
  );
}
export default SignIn;
