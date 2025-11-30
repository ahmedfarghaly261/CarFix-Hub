import React from "react";
import { Outlet } from "react-router-dom";
import MechanicsSidebar from "./MechanicsSidebar";
import { useMechanicsTheme } from "../../context/MechanicsThemeContext";

const MechanicsLayout = () => {
  const { isDarkMode } = useMechanicsTheme();
  
  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-[#101828]' : 'bg-gray-50'}`}>
      <MechanicsSidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default MechanicsLayout;
