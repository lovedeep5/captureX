import React from "react";
import Link from "next/link";
import { auth, UserButton } from "@clerk/nextjs";
import { FolderOpen } from "lucide-react";

import MobileNavbar from "./MobileNavbar";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const Navbar = () => {
  const { userId } = auth();
  return (
    <div className="fixed w-full h-14 px-4 bg-[#0F172A] border-b border-gray-800 flex items-center z-[99]">
      <div className="md:max-w-screen-2xl mx-auto flex justify-between items-center w-full">
        <Logo />
        <div className="flex md:w-auto justify-between items-center space-x-4">
          <div className="space-x-4 w-full md:w-auto flex items-center justify-between">
            <Button
              className={cn(
                "bg-purple-600/10 text-purple-400 hover:bg-purple-600/20 hover:text-purple-300 border-purple-500/20",
                "transition-all duration-200 ease-in-out",
                { hidden: !userId }
              )}
              variant="outline"
              size="sm"
              asChild
            >
              <Link href="/library" className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                <span>Library</span>
              </Link>
            </Button>

            <div className={cn({ hidden: !userId })}>
              <UserButton />
            </div>

            <div className={cn({ hidden: userId })}>
              <Button
                variant="default"
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                asChild
              >
                <Link href="/sign-in">Login</Link>
              </Button>
            </div>
          </div>
          <MobileNavbar />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
