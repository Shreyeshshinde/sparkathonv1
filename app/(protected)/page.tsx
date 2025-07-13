import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import FeatureCard from "../components/FeatureCard";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <Sidebar />

      {/* Mobile navigation */}
      <MobileNav />

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="relative">
          {/* Pulsing background blobs */}
          {/* <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-8 w-32 h-32 bg-[#51c995] rounded-full opacity-10 animate-pulse"></div>
            <div
              className="absolute bottom-32 right-12 w-24 h-24 bg-[#04b7cf] rounded-full opacity-10 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#04cf84] rounded-full opacity-10 animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div> */}

          {/* Hero Section */}
          <div className="relative px-4 sm:px-6 lg:px-8 pt-8 lg:pt-16 pb-12">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Revolutionize{" "}
                <span className="bg-gradient-to-r from-[#04b7cf] to-[#04cf84] bg-clip-text text-transparent">
                  Retail Shopping
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Choose your preferred shopping experience: collaborate with
                friends in real-time or discover products with AI-powered
                intelligence.
              </p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="relative px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Shopping Pod */}
                <FeatureCard
                  title="Shopping Pods"
                  description="Create shared virtual carts where authenticated users can collaborate in real-time, chat, and manage products together. Perfect for hostels, families, or festivals."
                  features={[
                    "Real-time collaboration",
                    "Shared virtual carts",
                    "Group chat integration",
                  ]}
                  buttonText="Start a Pod"
                  href="/pod"
                  iconName="Users"
                  tag="Collaborative"
                  tagColor="cyan"
                />

                {/* AI Smart Search */}
                <FeatureCard
                  title="AI Smart Search"
                  description="Dynamic, seasonal-aware product search that shows trending items based on festivals, weather, and time of year. Get smart suggestions with brand options and quantity control."
                  features={[
                    "Seasonal awareness",
                    "Festival-based suggestions",
                    "Brand & quantity control",
                  ]}
                  buttonText="Try Smart Search"
                  href="/smart-search"
                  iconName="Search"
                  tag="Intelligent"
                  tagColor="green"
                />

                {/* Smart Store Navigator */}
                <FeatureCard
                  title="Smart Store Navigator"
                  description="Navigate your store with ease using aisle-aware, voice-guided indoor navigation. Features turn-by-turn directions and accessibility support for visually impaired users."
                  features={[
                    "Turn-by-turn store navigation",
                    "Accessibility support",
                    "Voice prompts for visually impaired",
                  ]}
                  buttonText="Launch Navigator"
                  href="/smart-navigator"
                  iconName="Navigation"
                  tag="Accessible"
                  tagColor="cyan"
                />
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="relative px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Complete{" "}
                <span className="bg-gradient-to-r from-[#04b7cf] to-[#04cf84] bg-clip-text text-transparent">
                  Shopping Ecosystem
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience the future of retail with our integrated platform
                that combines collaboration, intelligence, and accessibility in
                one seamless experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
