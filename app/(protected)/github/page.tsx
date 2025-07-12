"use client";

import { Github, ExternalLink } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import MobileNav from "../../components/MobileNav";

export default function GitHubPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MobileNav />

      <div className="lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Github className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                GitHub Repository
              </h1>
              <p className="text-gray-600">Open source RetailVerse platform</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <Github className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Open Source
              </h2>
              <p className="text-gray-600 mb-6">
                RetailVerse is built with modern web technologies and is
                available on GitHub.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                View on GitHub
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
