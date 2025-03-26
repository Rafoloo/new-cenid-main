"use client";

import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="min-h-screen w-full flex">
      <Sidebar className={isCollapsed ? "w-16" : "w-72"} onCollapseChange={setIsCollapsed} />
      <main
        className="flex-1 w-full p-8 bg-gray-50/80 backdrop-blur-sm min-h-screen transition-all duration-300 ease-in-out"
        style={{ marginLeft: isCollapsed ? "64px" : "288px" }}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ProtectedLayout;