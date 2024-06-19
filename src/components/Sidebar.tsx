import { SignOutButton } from "@clerk/nextjs";
import { Activity, Home, Settings, Trash, VideoIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "./ui/button";

import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

const routes = [
  {
    label: "Home",
    link: "/",
    icon: Home,
    color: "text-sky-500",
    commingSoon: false,
  },
  {
    label: "Library",
    link: "/library",
    icon: VideoIcon,
    color: "text-violet-500",
    commingSoon: false,
  },
  {
    label: "Archive",
    link: "#",
    icon: Trash,
    color: "text-pink-700",
    commingSoon: true,
  },
  {
    label: "Settings",
    link: "#",
    icon: Settings,
    color: "text-orange-700",
    commingSoon: true,
  },
  {
    label: "Activity",
    link: "#",
    icon: Activity,
    color: "text-emerald-500",
    commingSoon: true,
  },
];

const Sidebar = () => {
  return (
    <div className="space-y-1 text-white h-full flex flex-col py-5 relative ">
      {routes.map((route) => (
        <Link
          key={route.link}
          href={route.link}
          className="text-sm group flex group p-3  justify-center items-center font-medium cursor-pointer hover:text-white hover:bg-white/5 rounded-lg transition "
        >
          <div className="flex items-ceter flex-1 text-white/90">
            <route.icon className={cn("w-5 h-5 mr-3", route.color)} />{" "}
            {route.label}
          </div>
          {route.commingSoon && (
            <Badge className="bg-sky-800 dark:text-white/80">
              Comming Soon
            </Badge>
          )}
        </Link>
      ))}
      <Button asChild className="absolute bottom-5 w-full">
        <SignOutButton />
      </Button>
    </div>
  );
};

export default Sidebar;
