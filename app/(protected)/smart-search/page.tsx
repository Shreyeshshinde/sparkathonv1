"use client";

import { Search, Sparkles } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import MobileNav from "../../components/MobileNav";

export default function SmartSearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MobileNav />

      <div className="lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#04cf84] to-[#04b7cf] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                AI Smart Search
              </h1>
              <p className="text-gray-600">
                Coming soon - Intelligent product discovery
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <Sparkles className="w-12 h-12 text-[#04cf84] mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Under Development
              </h2>
              <p className="text-gray-600">
                We're building an intelligent search system that understands
                context, seasons, and preferences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
