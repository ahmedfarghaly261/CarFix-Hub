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
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
