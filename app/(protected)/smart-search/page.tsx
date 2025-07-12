"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import MobileNav from "../../components/MobileNav";

export default function SmartSearchPage() {
  const [userQuery, setUserQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(0);
  const [cart, setCart] = useState<any[]>([]); // 🛒 Cart state

  const handleSmartSearch = async () => {
    if (!userQuery.trim()) return;

    setLoading(true);
    setError("");
    setSuggestions({});

    try {
      const response = await fetch("/api/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery }),
      });

      const raw = await response.text();
      const data = JSON.parse(raw);
      console.log("✅ Final suggestions to render:", data.products);

      if (!data.products || Object.keys(data.products).length === 0) {
        setSuggestions({});
        setError("No suggestions found.");
      } else {
        setSuggestions(data.products);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Something went wrong while fetching suggestions.");
    }

    setLoading(false);
  };

  const handleAddToCart = (item: any) => {
    setCart((prev) => [...prev, item]);
    console.log("🛒 Cart Updated:", [...cart, item]);
  };

  const filteredSuggestions = Object.fromEntries(
    Object.entries(suggestions)
      .map(([type, items]) => [
        type,
        items.filter(
          (item) =>
            !maxPriceFilter ||
            (item.price !== undefined && item.price <= maxPriceFilter)
        ),
      ])
      .filter(([_, items]) => items.length > 0)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MobileNav />

      <div className="lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2">🛒 AI Smart Cart</h1>
              <p className="text-gray-600">
                Describe your trip or purpose and get AI-powered suggestions.
              </p>
              <p className="text-gray-700 mt-2">
                Cart Items:{" "}
                <span className="font-semibold text-blue-600">
                  {cart.length}
                </span>
              </p>
            </div>

            {/* Input Section */}
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <input
                type="text"
                placeholder="e.g. Goa trip essentials"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="w-full p-3 border rounded-lg mb-4"
              />
              <button
                onClick={handleSmartSearch}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Loading..." : "Get Suggestions"}
              </button>
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>

            {/* Filter UI */}
            {Object.keys(suggestions).length > 0 && (
              <div className="flex justify-end mt-6 mb-2">
                <label className="text-sm text-gray-700 mr-2">Max Price:</label>
                <select
                  onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                  className="border px-2 py-1 rounded"
                >
                  <option value={0}>No Filter</option>
                  <option value={10}>Under ₹10</option>
                  <option value={20}>Under ₹20</option>
                  <option value={50}>Under ₹50</option>
                  <option value={100}>Under ₹100</option>
                  <option value={200}>Under ₹200</option>
                </select>
              </div>
            )}

            {/* No suggestions yet */}
            {!loading && !error && Object.keys(suggestions).length === 0 && (
              <div className="text-center text-gray-500 mt-6">
                🤖 No suggestions yet. Try describing your trip!
              </div>
            )}

            {/* Render Filtered Suggestions */}
            {Object.keys(filteredSuggestions).length > 0 && (
              <div className="mt-4 bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Suggested Items
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(filteredSuggestions).map(
                    ([type, items]: any) => (
                      <div
                        key={type}
                        className="border p-4 rounded-lg shadow-sm"
                      >
                        <h3 className="text-lg font-bold text-blue-600 mb-2 capitalize">
                          {type}
                        </h3>
                        <ul className="space-y-2 text-gray-800">
                          {items.map((item: any, index: number) => (
                            <li
                              key={index}
                              className="bg-gray-100 p-3 rounded-lg"
                            >
                              <div className="flex items-start gap-4">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.title || item.name}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                )}
                                <div>
                                  <p className="font-medium">
                                    {item.title || item.name}
                                  </p>
                                  {item.price !== undefined && (
                                    <p className="text-sm text-green-700 font-semibold">
                                      ₹{item.price}
                                    </p>
                                  )}
                                  {item.quantity !== undefined && (
                                    <p className="text-sm text-gray-500">
                                      In Stock: {item.quantity}
                                    </p>
                                  )}
                                  <button
                                    onClick={() => handleAddToCart(item)}
                                    className="mt-2 bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
                                  >
                                    Add to Cart
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
