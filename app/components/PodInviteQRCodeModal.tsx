import React from "react";
import { QrCode, X, Copy } from "lucide-react";
import QRCode from "qrcode.react";

interface PodInviteQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteUrl: string;
}

export default function PodInviteQRCodeModal({
  isOpen,
  onClose,
  inviteUrl,
}: PodInviteQRCodeModalProps) {
  const [copied, setCopied] = React.useState(false);
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Invite to Pod</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X />
          </button>
        </div>

        {/* QR Code */}
        <div className="text-center">
          <div className="bg-gray-100 rounded-lg p-8 mb-4">
            <div className="w-48 h-48 mx-auto bg-white rounded-lg border-2 border-gray-300 flex items-center justify-center">
              <QRCode value={inviteUrl} size={180} fgColor="#04b7cf" />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-xs break-all">{inviteUrl}</span>
              <button
                onClick={handleCopy}
                className="ml-2 p-1 rounded hover:bg-gray-100 border border-gray-200"
                title="Copy link"
              >
                <Copy className="w-4 h-4" />
              </button>
              {copied && (
                <span className="text-green-600 text-xs ml-2">Copied!</span>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Scan this QR code or use the link to join the pod.
          </p>
        </div>
      </div>
    </div>
  );
}
