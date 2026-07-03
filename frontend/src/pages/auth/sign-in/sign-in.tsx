import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../../services/userService';
import { Eye, EyeOff, Mail, Lock, User as UserIcon, ArrowRight, CheckCircle } from 'lucide-react';

function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: form.firstName,
        email: form.email,
        password: form.password,
        role: 'user'
      });
      // Redirect to login
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="py-4 px-6 backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">CarFix</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Form Card */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 sm:p-10">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Join CarFix</h2>
              <p className="text-blue-100">Create your account to get started</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Full Name Input */}
              <div className="relative">
                <label htmlFor="firstName" className="block text-sm font-medium text-blue-100 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3.5 w-5 h-5 text-blue-300" />
                  <input
                    id="firstName"
                    type="text"
                    placeholder="John Doe"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-blue-300" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-blue-300" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-blue-300 hover:text-blue-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-blue-200/70 mt-1">At least 6 characters</p>
              </div>

              {/* Confirm Password Input */}
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-100 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-blue-300" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-blue-300 hover:text-blue-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-start space-x-2">
                  <div className="w-5 h-5 rounded-full bg-red-500 flex-shrink-0 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 5.414L16.586 4 10 10.586 3.414 4 2 5.414 8.586 12 2 18.586 3.414 20 10 13.414 16.586 20 18 18.586 12.414 12 18 5.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-red-200 text-sm">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center space-x-2 mt-6"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center space-x-3">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="text-white/60 text-sm">OR</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            {/* Login Link */}
            <p className="text-center text-blue-100">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-semibold text-blue-300 hover:text-blue-200 transition"
              >
                Sign in
              </button>
            </p>

            {/* Footer Note */}
            <p className="text-xs text-white/50 text-center mt-6">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-12 space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-blue-100 text-sm">Quick and easy registration process</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-blue-100 text-sm">Access to exclusive mechanic services</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-blue-100 text-sm">Secure and encrypted data protection</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignIn;
