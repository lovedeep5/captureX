"use client";
import { Menu } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import React from 'react';

import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import Sidebar from './Sidebar';

import { cn } from '@/lib/utils';

const MobileNavbar = () => {
  const { userId } = useAuth()
  return (
    <Sheet>
      <SheetTrigger>
        <div className="md:hidden">
          <Menu className={cn("w-7 h-7 cursor-pointer", { hidden: !userId })} />
        </div>
      </SheetTrigger>
      <SheetContent className="p-5 z-[100] bg-gray-900 w-full border-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}

export default MobileNavbar
