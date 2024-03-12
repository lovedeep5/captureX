import { cn } from "@/lib/utils";
import { SignOutButton } from "@clerk/nextjs";
import {
  Activity,
  HeartPulse,
  Home,
  Settings,
  Trash,
  VideoIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const routes = [
  {
    label: "Home",
    link: "/",
    icon: Home,
    color: "text-sky-500",
  },
  {
    label: "Library",
    link: "/library",
    icon: VideoIcon,
    color: "text-violet-500",
  },
  {
    label: "Archive",
    link: "/archive",
    icon: Trash,
    color: "text-pink-700",
  },
  {
    label: "Settings",
    link: "/settings",
    icon: Settings,
    color: "text-orange-700",
  },
  {
    label: "Activity",
    link: "/activity",
    icon: Activity,
    color: "text-emerald-500",
  },
];

const Sidebar = () => {
  return (
    <div className="space-y-1 text-white h-full flex flex-col py-5 relative ">
      {routes.map((route) => (
        <Link
          href={route.link}
          className="text-sm group flex group p-3  justify-center items-center font-medium cursor-pointer hover:text-white hover:bg-white/5 rounded-lg transition "
        >
          <div className="flex items-ceter flex-1 text-white/90">
            <route.icon className={cn("w-5 h-5 mr-3", route.color)} />{" "}
            {route.label}
          </div>
        </Link>
      ))}
      <Button asChild className="absolute bottom-5 w-full">
        <SignOutButton />
      </Button>
    </div>
  );
};

export default Sidebar;
