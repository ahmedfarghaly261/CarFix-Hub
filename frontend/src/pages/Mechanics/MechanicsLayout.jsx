import React from "react";
import { Outlet } from "react-router-dom";
import MechanicsSidebar from "./MechanicsSidebar";

const MechanicsLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#101828]">
      <MechanicsSidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default MechanicsLayout;
