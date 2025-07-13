import Link from "next/link";
import {
  Home,
  Users,
  Search,
  Navigation,
  Github,
  ChevronDown,
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Shopping Pod", href: "/pod", icon: Users },
  { name: "Smart Search", href: "/smart-search", icon: Search },
  { name: "Smart Navigator", href: "/smart-navigator", icon: Navigation },
];

interface SidebarProps {
  currentPath?: string;
}

export default function Sidebar({ currentPath }: SidebarProps) {
  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#04b7cf] to-[#04cf84] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RV</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              RetailVerse
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-[#04cf84]/10 text-[#04cf84] border-r-2 border-[#04cf84]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    isActive
                      ? "text-[#04cf84]"
                      : "text-gray-400 group-hover:text-gray-500"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}

          {/* Profile Section with Clerk UserButton */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center px-2 py-2 text-sm font-medium text-gray-600">
              <div className="mr-3 flex-shrink-0">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-7 h-7",
                      userButtonTrigger: "focus:shadow-none",
                    },
                  }}
                />
              </div>
              <span>Profile</span>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <div className="font-medium">RetailVerse Platform</div>
            <div className="mt-1">Next-Gen Shopping</div>
          </div>
        </div>
      </div>
    </div>
  );
}
