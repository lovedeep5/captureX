import { SignOutButton } from "@clerk/nextjs";
import React from "react";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";

const PagesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full relative bg-[#0F172A]">
      <Navbar />
      <div className="w-full pt-14">
        <div className="hidden md:flex md:flex-col md:w-72 md:fixed md:top-14 md:bottom-0 md:px-4 bg-[#1E293B] border-r border-gray-800">
          <Sidebar />
        </div>
        <div className="md:pl-72">{children}</div>
      </div>
    </div>
  );
};

export default PagesLayout;
