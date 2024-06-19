import Link from "next/link";
import React from "react";
import { Badge } from "@/components/ui/badge";

const Logo = () => {
  return (
    <div className="text-xl dark:text-white">
      <Link href="/">capturefuse </Link>
      <Badge className="bg-gradient-to-r  from-fuchsia-600 to-pink-600 ">
        Beta
      </Badge>
    </div>
  );
};

export default Logo;
