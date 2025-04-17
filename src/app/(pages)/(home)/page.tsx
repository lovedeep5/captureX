import { Montserrat } from "next/font/google";
import {
  Video,
  Mic,
  Monitor,
  Share2,
  Play,
  Clock,
  Zap,
  Shield,
  Globe2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const Home = () => {
  return (
    <div className="bg-[#0F172A] min-h-screen text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="inline-flex items-center px-4 py-2 mb-8 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-full">
            <span className="text-purple-400 text-sm font-medium">
              Professional Screen Recording Made Simple
            </span>
          </div>

          <h1
            className={cn(
              "text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 mb-6",
              montserrat.className
            )}
          >
            Capture. Create. Share.
            <br />
            In Seconds.
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Record your screen, camera, and voice with one click. Create
            professional presentations and tutorials that leave an impact. Share
            instantly with anyone, anywhere.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              className="px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              <Link href="/library">Start Recording Now →</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#1E293B] p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                <Monitor className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Screen Recording</h3>
              <p className="text-gray-400">
                Capture your screen in HD quality with optional webcam overlay.
              </p>
            </div>

            <div className="bg-[#1E293B] p-6 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                <Mic className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Crystal Clear Audio
              </h3>
              <p className="text-gray-400">
                Professional voice recording with background noise reduction.
              </p>
            </div>

            <div className="bg-[#1E293B] p-6 rounded-2xl border border-gray-700/50 hover:border-green-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                <Share2 className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Sharing</h3>
              <p className="text-gray-400">
                Share your recordings instantly with a generated link.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-[#1E293B] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Professionals Choose Recoording.com
            </h2>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-gray-400">
                  Start recording in seconds, no downloads needed
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Enterprise Security</h3>
                <p className="text-gray-400">
                  End-to-end encryption for your content
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                  <Globe2 className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Cloud Storage</h3>
                <p className="text-gray-400">Access your recordings anywhere</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="font-semibold mb-2">Premium Quality</h3>
                <p className="text-gray-400">4K recording with perfect sync</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-r from-[#1E293B] to-[#0F172A] rounded-2xl p-12 text-center border border-gray-800">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Communication?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who use Recoording.com to create
              engaging content daily.
            </p>
            <Button
              asChild
              className="px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg rounded-xl shadow-lg transition-all duration-300"
            >
              <Link href="/library">Get Started For Free →</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
