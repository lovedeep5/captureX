import React from "react";

const clearkLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex justify-center items-center bg-teal-50">
      {children}
    </div>
  );
};

export default clearkLayout;
