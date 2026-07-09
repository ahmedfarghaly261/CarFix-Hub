import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sideBar";
import AdminHeader from "./AdminHeader";
import { useAdminTheme } from "../../context/AdminThemeContext";

const AdminLayout = () => {
  const { isDarkMode } = useAdminTheme();
  
  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
