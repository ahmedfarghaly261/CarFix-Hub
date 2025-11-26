import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/Home/Home";
import NavBar from "./components/nav-bar/nav";
import Footer from "./components/footer/footer";
import SignIn from "./pages/auth/sign-in/sign-in";
import Login from "./pages/auth/login/logIn";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/dashboard";
import UsersPage from "./pages/admin/users";
import MechanicsPage from "./pages/admin/mechanics";
import BookingsPage from "./pages/admin/bookings";
import ServicesPage from "./pages/admin/services";
import ReviewsPage from "./pages/admin/reviews";
import SettingsPage from "./pages/admin/settings";
import ReportsPage from "./pages/admin/reports";
import MechanicsLayout from "./pages/Mechanics/MechanicsLayout";
import MechanicsDashboard from "./pages/Mechanics/MechanicsDashboard";
import MechanicsJobsPage from "./pages/Mechanics/jobs";
import MechanicsAppointmentsPage from "./pages/Mechanics/appointments";
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

function App() {
  return (
    <>
      <div className="">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/nav" element={<NavBar />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/login" element={<Login />} />
            <Route path="/addCar" element={<AddCar />} />

            {/* User routes use UserLayout so the Header stays persistent */}
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<Navigate to="/user/home" replace />} />
              <Route path="home" element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="shop" element={<Shop />} />
              <Route path="appointments" element={<Appointments />} />
            </Route>

            {/* Admin routes use AdminLayout so the Sidebar stays persistent */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="mechanics" element={<MechanicsPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="reports" element={<ReportsPage />} />
            </Route>

            {/* Mechanics routes use MechanicsLayout so the Sidebar stays persistent */}
            <Route path="/mechanics" element={<MechanicsLayout />}>
              <Route index element={<Navigate to="/mechanics/dashboard" replace />} />
              <Route path="dashboard" element={<MechanicsDashboard />} />
              <Route path="jobs" element={<MechanicsJobsPage />} />
              <Route path="appointments" element={<MechanicsAppointmentsPage />} />
              <Route path="completed" element={<MechanicsCompletedPage />} />
              <Route path="in-progress" element={<MechanicsInProgressPage />} />
              <Route path="reviews" element={<MechanicsReviewsPage />} />
              <Route path="profile" element={<MechanicsProfile />} />
              <Route path="settings" element={<MechanicsSettingsPage />} />
            </Route>
          </Routes>
          
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
