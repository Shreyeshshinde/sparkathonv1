import {
  Copy,
  Check,
  Share2,
  QrCode,
  MessageCircle,
  Mail,
  Link,
} from "lucide-react";
import { useState } from "react";
import PodInviteQRCodeModal from "./PodInviteQRCodeModal";

interface InviteModalProps {
  isOpen: boolean;
  podName: string;
  inviteCode: string;
  copiedInvite: string | null;
  onCopyInvite: (inviteCode: string) => void;
  onClose: () => void;
}

export default function InviteModal({
  isOpen,
  podName,
  inviteCode,
  copiedInvite,
  onCopyInvite,
  onClose,
}: InviteModalProps) {
  const [showQR, setShowQR] = useState(false);
  const [shareMethod, setShareMethod] = useState<string | null>(null);

  if (!isOpen) return null;

  const inviteLink = `${window.location.origin}/pod/join/${inviteCode}`;

  const shareViaWhatsApp = () => {
    const text = `Join my shopping pod "${podName}"! Use this invite code: ${inviteCode}\n\nOr click this link: ${inviteLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareViaEmail = () => {
    const subject = `Join my shopping pod: ${podName}`;
    const body = `Hi! I'd like to invite you to join my shopping pod "${podName}".\n\nUse this invite code: ${inviteCode}\n\nOr click this link: ${inviteLink}\n\nLooking forward to shopping together!`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const shareViaSMS = () => {
    const text = `Join my shopping pod "${podName}"! Use invite code: ${inviteCode} or visit: ${inviteLink}`;
    const smsUrl = `sms:?body=${encodeURIComponent(text)}`;
    window.open(smsUrl);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    onCopyInvite(inviteCode);
  };

  const generateQRCode = () => {
    // In a real app, you'd use a QR code library like qrcode.react
    // For now, we'll show a placeholder
    setShowQR(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Invite to {podName}
        </h3>

        {/* Invite Code Section */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Invite Code:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-gray-100 px-3 py-2 rounded-lg font-mono text-lg">
              {inviteCode}
            </code>
            <button
              onClick={() => onCopyInvite(inviteCode)}
              className="p-2 bg-[#04b7cf] text-white rounded-lg hover:bg-[#04cf84] transition-colors"
            >
              {copiedInvite === inviteCode ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Invite Link Section */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Invite Link:</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="flex-1 bg-gray-100 px-3 py-2 rounded-lg text-sm"
            />
            <button
              onClick={copyInviteLink}
              className="p-2 bg-[#04b7cf] text-white rounded-lg hover:bg-[#04cf84] transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Share Options */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">Share via:</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={shareViaWhatsApp}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
            <button
              onClick={shareViaEmail}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              onClick={shareViaSMS}
              className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              SMS
            </button>
            <button
              onClick={copyInviteLink}
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Link className="w-4 h-4" />
              Copy Link
            </button>
          </div>
        </div>

        {/* Real-time Status */}
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-700 font-medium">
              Real-time updates enabled
            </span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Members will see updates instantly when they join
          </p>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Share this code or link with friends to invite them to your pod
        </p>

        <button
          onClick={onClose}
          className="w-full bg-[#04b7cf] text-white py-2 px-4 rounded-lg hover:bg-[#04cf84] transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}
