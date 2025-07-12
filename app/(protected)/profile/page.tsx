"use client";

import { User, Settings } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import MobileNav from "../../components/MobileNav";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MobileNav />

      <div className="lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#04b7cf] to-[#04cf84] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                User Profile
              </h1>
              <p className="text-gray-600">Manage your RetailVerse account</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <Settings className="w-12 h-12 text-[#04b7cf] mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Profile Settings
              </h2>
              <p className="text-gray-600">
                User authentication and profile management coming soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
