import React from "react";
import { Outlet } from "react-router-dom";
import MechanicsSidebar from "@/modules/mechanic/components/MechanicsSidebar";
import MechanicsHeader from "@/modules/mechanic/components/MechanicsHeader";
import { useMechanicsTheme } from "@/context/MechanicsThemeContext";

const MechanicsLayout = () => {
  const { isDarkMode } = useMechanicsTheme();
  
  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0B1120]' : 'bg-slate-50'}`}>
      <MechanicsSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MechanicsHeader />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MechanicsLayout;
