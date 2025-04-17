import React from "react";

import Navbar from "@/components/Navbar";

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
