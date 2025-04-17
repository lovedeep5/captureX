import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import Logo from "@/components/Logo";

const Footer = () => {
  return (
    <div className="w-full h-14 px-4 bg-[#0F172A] border-t border-gray-800 flex items-center">
      <div className="md:max-w-screen-2xl mx-auto flex justify-between items-center w-full">
        <Logo />

        <div className="space-x-4  w-auto">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white"
            asChild
          >
            <Link href="/privacy-policy">Privacy Policy</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
