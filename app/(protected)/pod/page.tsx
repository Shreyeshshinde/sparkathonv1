"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus, Trash2, Package } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import MobileNav from "../../components/MobileNav";

const PRODUCTS = [
  { id: "rice", name: "Basmati Rice (5kg)", price: 320 },
  { id: "milk", name: "Cow Milk (1L)", price: 45 },
  { id: "eggs", name: "Free‑Range Eggs (12 pcs)", price: 120 },
  { id: "soap", name: "Herbal Bath Soap", price: 60 },
  { id: "bread", name: "Whole Wheat Bread", price: 40 },
];

export default function ShoppingPodPage() {
  const [cartItems, setCartItems] = useState<Record<string, number>>({});

  const addToPod = (productId: string) => {
    setCartItems((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const updateQuantity = (productId: string, change: number) => {
    setCartItems((prev) => {
      const newQuantity = (prev[productId] || 0) + change;
      if (newQuantity <= 0) {
        const { [productId]: removed, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [productId]: newQuantity,
      };
    });
  };

  const clearPod = () => {
    setCartItems({});
  };

  const cartItemsArray = Object.entries(cartItems)
    .map(([productId, quantity]) => {
      const product = PRODUCTS.find((p) => p.id === productId);
      return product ? { ...product, quantity } : null;
    })
    .filter(Boolean);

  const totalItems = Object.values(cartItems).reduce(
    (sum, qty) => sum + qty,
    0
  );
  const totalPrice = cartItemsArray.reduce(
    (sum, item) => sum + item!.price * item!.quantity,
    0
  );

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
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-8 w-32 h-32 bg-[#51c995] rounded-full opacity-10 animate-pulse"></div>
            <div
              className="absolute bottom-32 right-12 w-24 h-24 bg-[#04b7cf] rounded-full opacity-10 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#04cf84] rounded-full opacity-10 animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

          {/* Header */}
          <div className="relative px-4 sm:px-6 lg:px-8 pt-8 pb-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-8 h-8 text-[#04b7cf]" />
                <h1 className="text-3xl font-bold text-gray-900">
                  Shopping Pod
                </h1>
              </div>
              <p className="text-gray-600">
                Collaborate with friends in real-time shopping
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="relative px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Product List */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-md p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <ShoppingCart className="w-6 h-6 text-[#04b7cf]" />
                      <h2 className="text-xl font-semibold text-gray-800">
                        Available Products
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {PRODUCTS.map((product) => (
                        <div
                          key={product.id}
                          className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-[#04b7cf] transition-all duration-200 hover:shadow-lg"
                        >
                          <div className="flex flex-col h-full">
                            <div className="flex-1 mb-4">
                              <h3 className="font-semibold text-gray-800 mb-2">
                                {product.name}
                              </h3>
                              <p className="text-2xl font-bold text-[#04b7cf]">
                                ₹{product.price}
                              </p>
                            </div>

                            <div className="flex items-center justify-between">
                              {cartItems[product.id] ? (
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() =>
                                      updateQuantity(product.id, -1)
                                    }
                                    className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="font-semibold text-gray-800 min-w-[2rem] text-center">
                                    {cartItems[product.id]}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(product.id, 1)
                                    }
                                    className="w-8 h-8 rounded-full bg-[#04cf84] text-white hover:bg-[#04b7cf] flex items-center justify-center transition-colors"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToPod(product.id)}
                                  className="w-full bg-[#04b7cf] text-white py-2 px-4 rounded-lg hover:bg-[#04cf84] transition-colors font-medium"
                                >
                                  Add to Pod
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Shopping Cart */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-md p-6 sticky top-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Your Pod
                      </h2>
                      {totalItems > 0 && (
                        <span className="bg-[#04cf84] text-white px-3 py-1 rounded-full text-sm font-medium">
                          {totalItems} items
                        </span>
                      )}
                    </div>

                    {cartItemsArray.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 mb-2">Your pod is empty</p>
                        <p className="text-sm text-gray-400">
                          Add products to get started
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Cart Items */}
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {cartItemsArray.map((item) => (
                            <div
                              key={item!.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800 text-sm">
                                  {item!.name}
                                </h4>
                                <p className="text-[#04b7cf] font-semibold">
                                  ₹{item!.price} × {item!.quantity}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item!.id, -1)}
                                  className="w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-semibold text-gray-800 min-w-[1.5rem] text-center text-sm">
                                  {item!.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item!.id, 1)}
                                  className="w-6 h-6 rounded-full bg-[#04cf84] text-white hover:bg-[#04b7cf] flex items-center justify-center transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Total */}
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold text-gray-800">
                              Total
                            </span>
                            <span className="text-2xl font-bold text-[#04b7cf]">
                              ₹{totalPrice}
                            </span>
                          </div>

                          {/* Clear Pod Button */}
                          <button
                            onClick={clearPod}
                            className="w-full bg-red-100 text-red-600 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors font-medium flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Clear Pod
                          </button>
                        </div>

                        {/* Future Integration Placeholder */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                          <p className="text-blue-800 font-medium text-sm mb-1">
                            🚀 Coming Soon
                          </p>
                          <p className="text-blue-700 text-xs">
                            Real-time sync, shared pods, and smart
                            recommendations
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
