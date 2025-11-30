import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AdminThemeProvider } from "./context/AdminThemeContext";
import { MechanicsThemeProvider } from "./context/MechanicsThemeContext";
import { UserThemeProvider } from "./context/UserThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import HomePage from "./pages/Home/Home";
import NavBar from "./components/nav-bar/nav";
import Footer from "./components/footer/footer";
import SignIn from "./pages/auth/sign-in/sign-in";
import Login from "./pages/auth/login/logIn";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/dashboard";
import UsersPage from "./pages/admin/users";
import MechanicsPage from "./pages/admin/mechanics";
import WorkshopsPage from "./pages/admin/workshops";
import BookingsPage from "./pages/admin/bookings";
import ServicesPage from "./pages/admin/services";
import ReviewsPage from "./pages/admin/reviews";
import SettingsPage from "./pages/admin/settings";
import MechanicsLayout from "./pages/Mechanics/MechanicsLayout";
import MechanicsDashboard from "./pages/Mechanics/MechanicsDashboard";
import MechanicsJobsPage from "./pages/Mechanics/jobs";
import MechanicsCompletedPage from "./pages/Mechanics/completed";
import MechanicsInProgressPage from "./pages/Mechanics/in-progress";
import MechanicsReviewsPage from "./pages/Mechanics/reviews";
import MechanicsProfile from "./pages/Mechanics/MechanicsProfile";
import MechanicsSettingsPage from "./pages/Mechanics/settings";
import AddCar from "./pages/user/addCar/addCar";
import UserLayout from "./pages/user/UserLayout";
import Home from "./pages/user/home/home";
import Profile from "./pages/user/profile/profile";
import Shop from "./pages/user/shop/shop";
import Appointments from "./pages/user/appointments/appointments";

// Root router component that handles auth-based redirects
function RootRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // If not logged in, show login page only
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // If logged in user: show role-based routes
  if (user.role === 'admin') {
    return (
      <AdminThemeProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="mechanics" element={<MechanicsPage />} />
            <Route path="workshops" element={<WorkshopsPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </AdminThemeProvider>
    );
  }

  // mechanic role (mechanic)
  if (user.role === 'mechanic') {
    return (
      <MechanicsThemeProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/mechanics/dashboard" replace />} />
          <Route path="/mechanics/*" element={<MechanicsLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<MechanicsDashboard />} />
            <Route path="jobs" element={<MechanicsJobsPage />} />
            <Route path="completed" element={<MechanicsCompletedPage />} />
            <Route path="in-progress" element={<MechanicsInProgressPage />} />
            <Route path="reviews" element={<MechanicsReviewsPage />} />
            <Route path="profile" element={<MechanicsProfile />} />
            <Route path="settings" element={<MechanicsSettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/mechanics/dashboard" replace />} />
        </Routes>
      </MechanicsThemeProvider>
    );
  }

  // User role (default)
  return (
    <UserThemeProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/user/home" replace />} />
        <Route path="/user/*" element={<UserLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="shop" element={<Shop />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="addCar" element={<AddCar />} />
        </Route>
        <Route path="*" element={<Navigate to="/user/home" replace />} />
      </Routes>
    </UserThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RootRouter />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
