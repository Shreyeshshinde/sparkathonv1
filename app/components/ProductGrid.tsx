import { ShoppingCart, Plus, Minus, Share2, Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
  aisle?: string;
  image?: string;
  rating?: number;
  description?: string;
}

interface PodItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  addedBy: {
    id: string;
    name: string;
    avatar: string;
  };
  addedAt: Date;
}

interface ProductGridProps {
  products: Product[];
  currentPod: {
    id: string;
    name: string;
    items: PodItem[];
  } | null;
  onAddItem: (productId: string) => void;
  onUpdateQuantity: (itemId: string, change: number) => void;
  onShowInvite: () => void;
  onDeletePod?: () => void;
}

export default function ProductGrid({
  products,
  currentPod,
  onAddItem,
  onUpdateQuantity,
  onShowInvite,
  onDeletePod,
}: ProductGridProps) {
  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as { [key: string]: Product[] });

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-[#04b7cf]" />
          <h2 className="text-xl font-semibold text-gray-800">
            Available Products
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onShowInvite}
            className="flex items-center gap-2 bg-[#04b7cf] text-white px-3 py-2 rounded-lg hover:bg-[#04cf84] transition-colors text-sm"
          >
            <Share2 className="w-4 h-4" />
            Invite
          </button>
          {onDeletePod && (
            <button
              onClick={onDeletePod}
              className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm"
              title="Delete this pod"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Products by Category */}
      <div className="space-y-8">
        {Object.entries(productsByCategory).map(
          ([category, categoryProducts]) => (
            <div key={category} className="category-section">
              <h3 className="text-xl font-bold text-[#04b7cf] mb-4 capitalize flex items-center gap-2">
                <span className="w-2 h-2 bg-[#04b7cf] rounded-full"></span>
                {category}
              </h3>

              {/* Horizontal Scrolling Container */}
              <div className="relative">
                {/* Gradient fade indicators */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide horizontal-scroll">
                  {categoryProducts.map((product) => {
                    const existingItem = currentPod?.items.find(
                      (item) => item.productId === product.id
                    );
                    return (
                      <div
                        key={product.id}
                        className="flex-shrink-0 w-72 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow flex flex-col"
                      >
                        <div className="p-4 flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 text-sm leading-tight mb-1">
                                {product.name}
                              </h4>
                              <p className="text-lg font-bold text-[#04b7cf] mb-1">
                                ₹{product.price.toFixed(2)}
                              </p>
                              {product.rating && (
                                <div className="flex items-center gap-1">
                                  <span className="text-yellow-500 text-xs">
                                    ★
                                  </span>
                                  <span className="text-xs text-gray-600">
                                    {product.rating}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Uniform Add to Pod Button */}
                        <div className="px-4 pb-4">
                          {existingItem ? (
                            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-2">
                              <span className="text-xs text-green-700 font-medium">
                                Qty: {existingItem.quantity}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    onUpdateQuantity(existingItem.id, -1)
                                  }
                                  className="w-6 h-6 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() =>
                                    onUpdateQuantity(existingItem.id, 1)
                                  }
                                  className="w-6 h-6 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => onAddItem(product.id)}
                              className="w-full bg-[#04b7cf] text-white text-xs px-3 py-2 rounded-lg hover:bg-[#04cf84] transition-colors font-medium"
                            >
                              Add to Pod
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
