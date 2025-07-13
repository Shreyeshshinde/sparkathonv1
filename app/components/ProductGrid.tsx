import { ShoppingCart, Plus, Minus, Share2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
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
}

export default function ProductGrid({
  products,
  currentPod,
  onAddItem,
  onUpdateQuantity,
  onShowInvite,
}: ProductGridProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-[#04b7cf]" />
          <h2 className="text-xl font-semibold text-gray-800">
            Available Products
          </h2>
        </div>
        <button
          onClick={onShowInvite}
          className="flex items-center gap-2 bg-[#04b7cf] text-white px-3 py-2 rounded-lg hover:bg-[#04cf84] transition-colors text-sm"
        >
          <Share2 className="w-4 h-4" />
          Invite
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((product) => {
          const existingItem = currentPod?.items.find(
            (item) => item.productId === product.id
          );
          return (
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
                  {existingItem ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onUpdateQuantity(existingItem.id, -1)}
                        className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold text-gray-800 min-w-[2rem] text-center">
                        {existingItem.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(existingItem.id, 1)}
                        className="w-8 h-8 rounded-full bg-[#04cf84] text-white hover:bg-[#04b7cf] flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAddItem(product.id)}
                      className="w-full bg-[#04b7cf] text-white py-2 px-4 rounded-lg hover:bg-[#04cf84] transition-colors font-medium"
                    >
                      Add to Pod
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
