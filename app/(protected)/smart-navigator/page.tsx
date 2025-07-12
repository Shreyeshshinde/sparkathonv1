import { Navigation } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import MobileNav from "../../components/MobileNav";
import StoreNavigationApp from "../../components/StoreNavigationApp";

export default function SmartNavigatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MobileNav />

      <div className="lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#04b7cf] to-[#04cf84] rounded-lg flex items-center justify-center">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Smart Store Navigator
              </h1>
            </div>
            <p className="text-gray-600">
              Navigate your store with intelligent pathfinding and voice
              guidance
            </p>
          </div>

          <StoreNavigationApp />
        </div>
      </div>
    </div>
  );
}
