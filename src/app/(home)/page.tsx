import { Montserrat } from "next/font/google";

import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Medal } from "lucide-react";
import { Button } from "@/components/ui/button";

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

const Home = () => {
  return (
    <div>
      <div className="flex items-center justify-center flex-col">
        <div className="flex items-center justify-center flex-col">
          <div className="mb-4 flex items-center border shadow-sm p-4 bg-amber-100 text-amber-700 rounded-full uppercase">
            <Medal className="w-6 h-6 mr-2" />
            No 1 video sharing platform
          </div>
          <h1 className="text-center mb-6 text-neutral-800 text-3xl md:text-6xl">
            Record and Share conveniently
          </h1>
          <div className="text-center mb-6 text-3xl md:text-6xl text-white bg-gradient-to-r from-fuchsia-600 to-pink-600 px-4 p-2 rounded-md pb-4 w-fit">
            Get Started
          </div>
        </div>
        <div className="text-sm text-neutral-400 max-w-xs md:max-w-2xl text-center m-auto">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt
          vitae ex modi minus maiores quo deleniti perspiciatis cumque dolorem
          tempora.
        </div>
      </div>
    </div>
  );
};

export default Home;
