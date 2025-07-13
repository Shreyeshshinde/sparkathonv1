interface CreatePodModalProps {
  isOpen: boolean;
  podName: string;
  onPodNameChange: (name: string) => void;
  onCreatePod: () => void;
  onClose: () => void;
}

export default function CreatePodModal({
  isOpen,
  podName,
  onPodNameChange,
  onCreatePod,
  onClose,
}: CreatePodModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Create New Pod
        </h3>
        <input
          type="text"
          placeholder="Enter pod name..."
          value={podName}
          onChange={(e) => onPodNameChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04b7cf] mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onCreatePod}
            className="flex-1 bg-[#04b7cf] text-white py-2 px-4 rounded-lg hover:bg-[#04cf84] transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
