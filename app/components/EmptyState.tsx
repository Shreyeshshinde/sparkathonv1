import { Package } from "lucide-react";

interface EmptyStateProps {
  onCreatePod: () => void;
  onJoinPod: () => void;
}

export default function EmptyState({
  onCreatePod,
  onJoinPod,
}: EmptyStateProps) {
  return (
    <div className="relative px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-16">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Pod Selected
          </h3>
          <p className="text-gray-500 mb-6">
            Create a new pod or join an existing one to get started
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onCreatePod}
              className="bg-[#04b7cf] text-white px-6 py-3 rounded-lg hover:bg-[#04cf84] transition-colors font-medium"
            >
              Create Pod
            </button>
            <button
              onClick={onJoinPod}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Join Pod
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
