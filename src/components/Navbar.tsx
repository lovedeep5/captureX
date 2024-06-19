import React from "react";
import Link from "next/link";
import { auth, UserButton } from "@clerk/nextjs";
import { MonitorStop, Menu } from "lucide-react";

import MobileNavbar from "./MobileNavbar";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import ModeToggle from "@/components/ModeToggle";

const Navbar = () => {
  const { userId } = auth();
  return (
    <div className="fixed w-full h-14 px-4 bg-white border-b shadow-sm flex items-center z-[99] dark:bg-secondary">
      <div className="md:max-w-screen-2xl mx-auto flex justify-between item-center  w-full ">
        <Logo />
        <div className=" flex md:w-auto justify-between items-center space-x-4">
          <div className="space-x-4 w-full md:w-auto flex items-center justify-between ">
            <ModeToggle />
            <Button
              className={cn({ hidden: !userId })}
              variant="outline"
              asChild
            >
              <Link href="/library">
                <MonitorStop className="w-5 h-5 mr-2" /> Library
              </Link>
            </Button>

            <div className={cn({ hidden: !userId })}>
              <UserButton />
            </div>

            <div className={cn({ hidden: userId })}>
              <Button variant="default" size="sm" asChild>
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
