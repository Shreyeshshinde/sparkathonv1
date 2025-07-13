import { QrCode, Download, Share2 } from "lucide-react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  upiId: string;
}

export default function QRCodeModal({
  isOpen,
  onClose,
  amount,
  upiId,
}: QRCodeModalProps) {
  if (!isOpen) return null;

  // Generate a mock QR code data (in real implementation, this would be a proper UPI QR code)
  const qrData = `upi://pay?pa=${upiId}&pn=Shopping%20Pod&am=${amount}&cu=INR`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Scan QR Code</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* QR Code */}
        <div className="text-center">
          <div className="bg-gray-100 rounded-lg p-8 mb-4">
            <div className="w-48 h-48 mx-auto bg-white rounded-lg border-2 border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <QrCode className="w-32 h-32 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Mock QR Code</p>
                <p className="text-xs text-gray-400 mt-1">
                  Amount: ₹{amount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold">₹{amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">UPI ID:</span>
              <span className="font-mono text-xs">{upiId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Merchant:</span>
              <span>Shopping Pod</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-800 mb-2">How to pay:</h3>
            <ol className="text-sm text-blue-700 space-y-1 text-left">
              <li>1. Open your UPI app (PhonePe, Google Pay, etc.)</li>
              <li>2. Tap on "Scan QR Code"</li>
              <li>3. Point camera at this QR code</li>
              <li>4. Enter UPI PIN and confirm</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:border-[#04b7cf] transition-colors">
              <Download className="w-4 h-4" />
              Download QR
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:border-[#04b7cf] transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
