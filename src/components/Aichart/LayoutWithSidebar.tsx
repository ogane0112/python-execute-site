import React from "react";
import { SidebarProvider } from "./SidebarContext";
import { AIChatSidebar } from "./AiChartSidebar";
import { SidebarToggleButton } from "./SidebarToggleButton";

export const LayoutWithSidebar: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-900">
        {children}
        <AIChatSidebar />
        <div className="fixed bottom-4 right-4 z-50">
          <SidebarToggleButton />
        </div>
      </div>
    </SidebarProvider>
  );
};
