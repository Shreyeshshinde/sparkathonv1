"use client";
import { useState, useRef } from "react";
import { Navigation, Image as ImageIcon, Loader2 } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import MobileNav from "../../components/MobileNav";
import StoreNavigationApp from "../../components/StoreNavigationApp";

export default function SmartNavigatorPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [added, setAdded] = useState<string[]>([]);
  const navRef = useRef<any>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setResults([]);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setResults([]);
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target?.result as string;
        const res = await fetch("/api/gemini-analyze-photo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64 }),
        });
        const data = await res.json();
        setResults(data.products || []);
        setLoading(false);
      };
      reader.readAsDataURL(image);
    } catch (e) {
      setLoading(false);
      setResults([]);
      alert("Failed to analyze photo.");
    }
  };

  const handleAddProduct = (product: string) => {
    if (!navRef.current) return;
    // Find product ID by name (case-insensitive)
    const productObj = require("../../data/storeData").products.find(
      (p: any) => p.name.toLowerCase() === product.toLowerCase()
    );
    if (productObj) {
      navRef.current.addProductsToList([productObj.id]);
      navRef.current.generateRoute();
      setAdded((prev) => [...prev, product]);
    }
  };

  const handleAddAll = () => {
    if (!navRef.current) return;
    const storeProducts = require("../../data/storeData").products;
    const idsToAdd: string[] = [];
    const namesToAdd: string[] = [];
    results.forEach((product) => {
      const productObj = storeProducts.find(
        (p: any) => p.name.toLowerCase() === product.toLowerCase()
      );
      if (productObj && !added.includes(product)) {
        idsToAdd.push(productObj.id);
        namesToAdd.push(product);
      }
    });
    if (idsToAdd.length > 0) {
      navRef.current.addProductsToList(idsToAdd);
      navRef.current.generateRoute();
      setAdded((prev) => [...prev, ...namesToAdd]);
    }
  };

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

          {/* Photo Analysis UI */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <label className="flex flex-col items-center cursor-pointer">
                <span className="flex items-center gap-2 text-[#04b7cf] font-medium mb-2">
                  <ImageIcon className="w-5 h-5" /> Upload Photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded-lg border"
                  />
                )}
              </label>
              <button
                onClick={handleAnalyze}
                disabled={!image || loading}
                className="bg-[#04b7cf] text-white px-6 py-2 rounded-lg hover:bg-[#04cf84] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Analyze Photo
              </button>
            </div>
            {results.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Suggested Products:
                </h3>
                <button
                  onClick={handleAddAll}
                  disabled={results.every((p) => added.includes(p))}
                  className="mb-4 bg-[#04b7cf] text-white px-4 py-2 rounded-lg hover:bg-[#04cf84] transition-colors disabled:opacity-50"
                >
                  Add All to Route
                </button>
                <ul className="list-disc pl-6 text-gray-700">
                  {results.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 mb-2">
                      <span>{item}</span>
                      <button
                        onClick={() => handleAddProduct(item)}
                        disabled={added.includes(item)}
                        className="bg-[#04b7cf] text-white px-2 py-1 rounded hover:bg-[#04cf84] text-xs disabled:opacity-50"
                      >
                        {added.includes(item) ? "Added" : "Add"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <StoreNavigationApp ref={navRef} />
        </div>
      </div>
    </div>
  );
}
