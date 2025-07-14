import Loader from "./Loader";

interface JoinPodModalProps {
  isOpen: boolean;
  joinPodCode: string;
  onJoinPodCodeChange: (code: string) => void;
  onJoinPod: () => void;
  onClose: () => void;
  isJoining?: boolean;
}

export default function JoinPodModal({
  isOpen,
  joinPodCode,
  onJoinPodCodeChange,
  onJoinPod,
  onClose,
  isJoining = false,
}: JoinPodModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Join Pod</h3>
        <input
          type="text"
          placeholder="Enter invite code..."
          value={joinPodCode}
          onChange={(e) => onJoinPodCodeChange(e.target.value.toUpperCase())}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04b7cf] mb-4 font-mono"
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isJoining}
          >
            Cancel
          </button>
          <button
            onClick={onJoinPod}
            className="flex-1 bg-[#04b7cf] text-white py-2 px-4 rounded-lg hover:bg-[#04cf84] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isJoining}
          >
            {isJoining ? (
              <>
                <Loader size={18} /> Joining...
              </>
            ) : (
              "Join"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
