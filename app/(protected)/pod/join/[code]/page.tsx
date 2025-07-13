"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Users, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Sidebar from "../../../../components/Sidebar";
import MobileNav from "../../../../components/MobileNav";

interface PodInfo {
  id: string;
  name: string;
  memberCount: number;
  inviteCode: string;
}

export default function JoinPodPage() {
  const params = useParams();
  const router = useRouter();
  const inviteCode = params.code as string;

  const [podInfo, setPodInfo] = useState<PodInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  // Mock current user
  const currentUser = {
    id: "user1",
    name: "John Doe",
    avatar: "👤",
  };

  useEffect(() => {
    validateInviteCode();
  }, [inviteCode]);

  const validateInviteCode = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/pod/invite?code=${inviteCode}`);
      const data = await response.json();

      if (data.success) {
        setPodInfo(data.pod);
      } else {
        setError(data.error || "Invalid invite code");
      }
    } catch (error) {
      console.error("Error validating invite code:", error);
      setError("Failed to validate invite code");
    } finally {
      setLoading(false);
    }
  };

  const joinPod = async () => {
    try {
      setJoining(true);
      setError(null);

      const response = await fetch("/api/pod/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "join_pod",
          inviteCode,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setJoined(true);
        // Redirect to the pod after a short delay
        setTimeout(() => {
          router.push("/pod");
        }, 2000);
      } else {
        setError(data.error || "Failed to join pod");
      }
    } catch (error) {
      console.error("Error joining pod:", error);
      setError("Failed to join pod");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <MobileNav />
        <div className="lg:pl-64">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#04b7cf] mx-auto mb-4" />
              <p className="text-gray-600">Validating invite code...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <MobileNav />
        <div className="lg:pl-64">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Invalid Invite
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => router.push("/pod")}
                className="bg-[#04b7cf] text-white px-6 py-3 rounded-lg hover:bg-[#04cf84] transition-colors"
              >
                Back to Pods
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (joined) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <MobileNav />
        <div className="lg:pl-64">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Successfully Joined!
              </h2>
              <p className="text-gray-600 mb-6">
                You've joined {podInfo?.name}. Redirecting...
              </p>
              <Loader2 className="w-6 h-6 animate-spin text-[#04b7cf] mx-auto" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MobileNav />
      <div className="lg:pl-64">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-4">
            <div className="text-center mb-6">
              <Users className="w-16 h-16 text-[#04b7cf] mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Join Shopping Pod
              </h1>
              <p className="text-gray-600">
                You've been invited to join a collaborative shopping pod
              </p>
            </div>

            {podInfo && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {podInfo.name}
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Members:</span>
                    <span className="font-semibold">
                      {podInfo.memberCount} people
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Invite Code:</span>
                    <code className="bg-white px-2 py-1 rounded font-mono text-sm">
                      {podInfo.inviteCode}
                    </code>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={joinPod}
                disabled={joining}
                className="w-full bg-[#04b7cf] text-white py-3 px-4 rounded-lg hover:bg-[#04cf84] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {joining ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Pod"
                )}
              </button>

              <button
                onClick={() => router.push("/pod")}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-700 font-medium">
                  Real-time collaboration
                </span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Once joined, you'll see live updates from other members
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
