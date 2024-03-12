import React from "react";
import Link from "next/link";

import { Button } from "../../../components/ui/button";

import Logo from "@/components/Logo";

const Footer = () => {
  return (
    <div className="fixed bottom-0 w-full h-14 px-4 bg-slate-100 border-t flex items-center">
      <div className="md:max-w-screen-2xl mx-auto flex justify-between item-center  w-full ">
        <Logo />

        <div className="space-x-4  w-auto">
          <Button variant="ghost">Privacy Policy</Button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
