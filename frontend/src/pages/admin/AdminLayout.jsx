import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sideBar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#101828]">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
