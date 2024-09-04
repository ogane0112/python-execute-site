"use client";
import React from "react";
import { useSidebar } from "./SidebarContext";

export const SidebarToggleButton: React.FC = () => {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg focus:outline-none focus:shadow-outline transition-colors"
    >
      {isOpen ? "AIチャットを閉じる" : "AIチャットを開く"}
    </button>
  );
};
