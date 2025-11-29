import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute: Checks if user is authenticated and has required role
 * If not redirects to login page.
 */
export const ProtectedRoute = ({ element, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If specific role is required, check it
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
