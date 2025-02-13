import { Montserrat } from "next/font/google";
import {
  Medal,
  CheckCircle,
  Sparkles,
  Users,
  Video,
  ShieldCheck,
  TrendingUp,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

const Home = () => {
  return (
    <div className="dark:bg-gray-900 bg-white min-h-screen text-gray-900 dark:text-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="flex items-center border shadow-sm p-4 bg-amber-100 text-amber-700 rounded-full uppercase">
          <Medal className="w-6 h-6 mr-2" /> No. 1 Video Sharing Platform
        </div>

        <h1 className="text-center mb-6 text-neutral-800 text-4xl md:text-6xl font-bold mt-6 leading-tight dark:text-neutral-100">
          Easy Screen Recording and Sharing
        </h1>
        <p className="text-lg text-neutral-400 mt-4 max-w-2xl">
          Record and share your screen instantly without installations. Empower
          communication with AI-enhanced sharing.
        </p>
        <Button
          asChild
          className="mt-6 px-8 py-4 text-lg bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white rounded-lg shadow-lg hover:scale-105 transition-transform"
        >
          <Link href="/library">Get Started</Link>
        </Button>
      </div>

      {/* How It Works */}
      <div className="container mx-auto py-20 px-6 grid md:grid-cols-3 gap-12 text-center">
        <div className="flex flex-col items-center">
          <CheckCircle className="w-14 h-14 text-green-500" />
          <h3 className="mt-4 font-semibold text-xl">1. Start Recording</h3>
          <p className="text-neutral-400 mt-2">
            Capture your screen effortlessly with a single click.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Video className="w-14 h-14 text-blue-500" />
          <h3 className="mt-4 font-semibold text-xl">2. Save &amp; Share</h3>
          <p className="text-neutral-400 mt-2">
            Instantly generate a sharable link and streamline communication.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Users className="w-14 h-14 text-purple-500" />
          <h3 className="mt-4 font-semibold text-xl">3. Collaborate</h3>
          <p className="text-neutral-400 mt-2">
            Engage your audience, collect feedback, and boost productivity.
          </p>
        </div>
      </div>

      {/* AI-Powered Features */}
      <div className="bg-gray-100 dark:bg-gray-800 py-20 px-6 text-center">
        <h2 className="text-4xl font-bold">AI-Powered Enhancements</h2>
        <p className="text-neutral-400 mt-4 max-w-3xl mx-auto">
          Enjoy auto-generated summaries, AI-assisted captions, and intelligent
          sharing suggestions that simplify your workflow.
        </p>
      </div>

      {/* Security & Performance */}
      <div className="container mx-auto py-20 px-6 grid md:grid-cols-3 gap-12 text-center">
        <div className="flex flex-col items-center">
          <ShieldCheck className="w-14 h-14 text-indigo-500" />
          <h3 className="mt-4 font-semibold text-xl">Secure &amp; Private</h3>
          <p className="text-neutral-400 mt-2">
            Your recordings are encrypted, ensuring your data stays safe.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <TrendingUp className="w-14 h-14 text-emerald-500" />
          <h3 className="mt-4 font-semibold text-xl">Optimized for Speed</h3>
          <p className="text-neutral-400 mt-2">
            Lightning-fast uploads and seamless playback experience.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Globe className="w-14 h-14 text-orange-500" />
          <h3 className="mt-4 font-semibold text-xl">Global Accessibility</h3>
          <p className="text-neutral-400 mt-2">
            Access and share your videos from anywhere in the world.
          </p>
        </div>
      </div>

      {/* Use Cases */}
      <div className="container mx-auto py-20 px-6 grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold">For Educators</h3>
          <p className="text-neutral-400 mt-3">
            Deliver engaging lessons and tutorials with ease.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold">For Businesses</h3>
          <p className="text-neutral-400 mt-3">
            Enhance team collaboration with seamless screen recordings.
          </p>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-100 dark:bg-gray-800 py-20 px-6 text-center">
        <h2 className="text-4xl font-bold">What Our Users Say</h2>
        <p className="text-neutral-400 mt-4 max-w-3xl mx-auto italic">
          This platform revolutionized how I share content with my team! Highly
          recommended. &#45; Jane Doe
        </p>
      </div>
    </div>
  );
};

export default Home;
