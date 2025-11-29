import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sideBar";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
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
