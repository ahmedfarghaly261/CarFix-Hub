import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// Themes
import { AdminThemeProvider } from '@/context/AdminThemeContext'
import { MechanicsThemeProvider } from '@/context/MechanicsThemeContext'
import { UserThemeProvider } from '@/context/UserThemeContext'

// Layouts
import AdminLayout from '@/layouts/AdminLayout'
import MechanicsLayout from '@/layouts/MechanicsLayout'
import UserLayout from '@/layouts/UserLayout'

// Auth views
import LoginView from '@/modules/auth/views/LoginView'
import RegisterView from '@/modules/auth/views/RegisterView'

// Admin views
import AdminDashboardView from '@/modules/admin/views/DashboardView'
import UsersView from '@/modules/admin/views/UsersView'
import UserDetailView from '@/modules/admin/views/UserDetailView'
import AdminMechanicsView from '@/modules/admin/views/MechanicsView'
import WorkshopsView from '@/modules/admin/views/WorkshopsView'
import BookingsView from '@/modules/admin/views/BookingsView'
import AdminServicesView from '@/modules/admin/views/ServicesView'
import AdminReviewsView from '@/modules/admin/views/ReviewsView'
import AdminSettingsView from '@/modules/admin/views/SettingsView'
import AdminJobsView from '@/modules/admin/views/JobsView'
import AdminJobDetailView from '@/modules/admin/views/JobDetailView'

// Mechanic views
import MechanicDashboardView from '@/modules/mechanic/views/DashboardView'
import MechanicJobsView from '@/modules/mechanic/views/JobsView'
import MechanicRepairRequestDetailsView from '@/modules/mechanic/views/RepairRequestDetailsView'
import MechanicCompletedView from '@/modules/mechanic/views/CompletedView'
import MechanicInProgressView from '@/modules/mechanic/views/InProgressView'
import MechanicReviewsView from '@/modules/mechanic/views/ReviewsView'
import MechanicProfileView from '@/modules/mechanic/views/ProfileView'
import MechanicSettingsView from '@/modules/mechanic/views/SettingsView'

// User views
import UserHomeView from '@/modules/user/views/HomeView'
import UserProfileView from '@/modules/user/views/ProfileView'
import ShopView from '@/modules/user/views/ShopView'
import AppointmentsView from '@/modules/user/views/AppointmentsView'
import AddCarView from '@/modules/user/views/AddCarView'
import CompletedRepairsView from '@/modules/user/views/CompletedRepairsView'
import RepairHistoryView from '@/modules/user/views/RepairHistoryView'
import RepairDetailsView from '@/modules/user/views/RepairDetailsView'

/**
 * Root router — switches between role-based route trees based on auth state.
 */
const RootRouter: React.FC = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  // Unauthenticated
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/sign-in" element={<RegisterView />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // Admin
  if (user.role === 'admin') {
    return (
      <AdminThemeProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardView />} />
            <Route path="users" element={<UsersView />} />
            <Route path="users/:userId" element={<UserDetailView />} />
            <Route path="mechanics" element={<AdminMechanicsView />} />
            <Route path="workshops" element={<WorkshopsView />} />
            <Route path="jobs" element={<AdminJobsView />} />
            <Route path="jobs/:jobId" element={<AdminJobDetailView />} />
            <Route path="bookings" element={<BookingsView />} />
            <Route path="services" element={<AdminServicesView />} />
            <Route path="reviews" element={<AdminReviewsView />} />
            <Route path="settings" element={<AdminSettingsView />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </AdminThemeProvider>
    )
  }

  // Mechanic
  if (user.role === 'mechanic') {
    return (
      <MechanicsThemeProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/mechanics/dashboard" replace />} />
          <Route path="/mechanics/*" element={<MechanicsLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<MechanicDashboardView />} />
            <Route path="jobs" element={<MechanicJobsView />} />
            <Route path="jobs/:jobId" element={<MechanicRepairRequestDetailsView />} />
            <Route path="completed" element={<MechanicCompletedView />} />
            <Route path="in-progress" element={<MechanicInProgressView />} />
            <Route path="reviews" element={<MechanicReviewsView />} />
            <Route path="profile" element={<MechanicProfileView />} />
            <Route path="settings" element={<MechanicSettingsView />} />
          </Route>
          <Route path="*" element={<Navigate to="/mechanics/dashboard" replace />} />
        </Routes>
      </MechanicsThemeProvider>
    )
  }

  // User (default role)
  return (
    <UserThemeProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/user/home" replace />} />
        <Route path="/user/*" element={<UserLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<UserHomeView />} />
          <Route path="profile" element={<UserProfileView />} />
          <Route path="shop" element={<ShopView />} />
          <Route path="appointments" element={<AppointmentsView />} />
          <Route path="addCar" element={<AddCarView />} />
          <Route path="completed-repairs" element={<CompletedRepairsView />} />
          <Route path="repair-history" element={<RepairHistoryView />} />
        </Route>
        <Route path="/repairs/:id" element={<RepairDetailsView />} />
        <Route path="*" element={<Navigate to="/user/home" replace />} />
      </Routes>
    </UserThemeProvider>
  )
}

export default RootRouter
