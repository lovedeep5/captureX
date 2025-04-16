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
        <div>{children}</div>
      </div>
    </div>
  );
};

export default PagesLayout;
