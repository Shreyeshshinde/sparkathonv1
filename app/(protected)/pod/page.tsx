"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import Sidebar from "../../components/Sidebar";
import MobileNav from "../../components/MobileNav";
import PodHeader from "../../components/PodHeader";
import ProductGrid from "../../components/ProductGrid";
import PodMembers from "../../components/PodMembers";
import PodCart from "../../components/PodCart";
import CreatePodModal from "../../components/CreatePodModal";
import InviteModal from "../../components/InviteModal";
import JoinPodModal from "../../components/JoinPodModal";
import PaymentModal from "../../components/PaymentModal";
import EmptyState from "../../components/EmptyState";
import { useWebSocket } from "../../hooks/useWebSocket";

interface PodMember {
  id: string;
  name: string;
  avatar: string;
  isOwner: boolean;
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

interface Pod {
  id: string;
  name: string;
  inviteCode: string;
  members: PodMember[];
  items: PodItem[];
  createdAt: Date;
  ownerId: string;
}

const PRODUCTS = [
  { id: "rice", name: "Basmati Rice (5kg)", price: 320 },
  { id: "milk", name: "Cow Milk (1L)", price: 45 },
  { id: "eggs", name: "Free‑Range Eggs (12 pcs)", price: 120 },
  { id: "soap", name: "Herbal Bath Soap", price: 60 },
  { id: "bread", name: "Whole Wheat Bread", price: 40 },
  { id: "tomatoes", name: "Fresh Tomatoes (1kg)", price: 80 },
  { id: "onions", name: "Onions (2kg)", price: 60 },
  { id: "potatoes", name: "Potatoes (3kg)", price: 90 },
];

export default function ShoppingPodPage() {
  const { user, isLoaded } = useUser();
  const [pods, setPods] = useState<Pod[]>([]);
  const [currentPod, setCurrentPod] = useState<Pod | null>(null);
  const [showCreatePod, setShowCreatePod] = useState(false);
  const [newPodName, setNewPodName] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState<string | null>(null);
  const [joinPodCode, setJoinPodCode] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState<string>("disconnected");
  const [currentUserDbId, setCurrentUserDbId] = useState<string | null>(null);

  // Ref to track if we're in the middle of creating/joining a pod
  const isCreatingOrJoiningRef = useRef(false);

  // Get current user from Clerk
  const currentUser = user
    ? {
        id: user.id,
        name: user.fullName || user.firstName || "Unknown User",
        avatar: "👤", // Use default avatar instead of Clerk image
        email: user.emailAddresses[0]?.emailAddress || "",
      }
    : null;

  // WebSocket connection - only connect when we have a current pod and user
  const { isConnected, sendMessage } = useWebSocket({
    podId: currentPod?.id || "",
    userId: currentUser?.id || "",
    onMessage: handleWebSocketMessage,
    onConnect: () => setRealtimeStatus("connected"),
    onDisconnect: () => setRealtimeStatus("disconnected"),
  });

  // Initialize with data from database
  useEffect(() => {
    async function fetchPods() {
      if (!currentUser) return;

      try {
        const res = await fetch(`/api/pod/user?userId=${currentUser.id}`);
        const data = await res.json();
        if (data.pods && data.pods.length > 0) {
          console.log(
            "Fetched pods:",
            data.pods.map((p: any) => ({ id: p.id, name: p.name }))
          );
          console.log("Current pod:", currentPod?.id);
          console.log("Is creating/joining:", isCreatingOrJoiningRef.current);

          setPods(data.pods);
          // Only set current pod if none is currently selected and we're not creating/joining
          if (!currentPod && !isCreatingOrJoiningRef.current) {
            console.log("Setting current pod to:", data.pods[0].name);
            setCurrentPod(data.pods[0]);
          }
        } else {
          setPods([]);
          setCurrentPod(null);
        }
      } catch (error) {
        console.error("Failed to fetch pods:", error);
      }
    }

    if (isLoaded && currentUser) {
      fetchPods();

      // Also fetch the current user's database ID
      const fetchCurrentUserDbId = async () => {
        try {
          const res = await fetch(`/api/user/db-id?clerkId=${currentUser.id}`);
          const data = await res.json();
          if (data.dbId) {
            setCurrentUserDbId(data.dbId);
          }
        } catch (error) {
          console.error("Failed to fetch user DB ID:", error);
        }
      };

      fetchCurrentUserDbId();
    }
  }, [isLoaded, currentUser?.id]); // Only depend on the user ID, not the entire user object

  function handleWebSocketMessage(message: any) {
    console.log("WebSocket message received:", message);

    switch (message.type) {
      case "member_joined":
        if (currentPod && message.podId === currentPod.id) {
          const updatedPod = {
            ...currentPod,
            members: [...currentPod.members, message.newMember],
          };
          setCurrentPod(updatedPod);
          setPods((prev) =>
            prev.map((pod) => (pod.id === currentPod.id ? updatedPod : pod))
          );
        }
        break;

      case "item_added":
        if (currentPod && message.podId === currentPod.id) {
          console.log("WebSocket: Adding item with ID:", message.item.id);
          const updatedPod = {
            ...currentPod,
            items: [...currentPod.items, message.item],
          };
          setCurrentPod(updatedPod);
          setPods((prev) =>
            prev.map((pod) => (pod.id === currentPod.id ? updatedPod : pod))
          );
        }
        break;

      case "item_updated":
        if (currentPod && message.podId === currentPod.id) {
          const updatedPod = {
            ...currentPod,
            items: currentPod.items.map((item) =>
              item.id === message.item.id ? message.item : item
            ),
          };
          setCurrentPod(updatedPod);
          setPods((prev) =>
            prev.map((pod) => (pod.id === currentPod.id ? updatedPod : pod))
          );
        }
        break;

      case "item_removed":
        if (currentPod && message.podId === currentPod.id) {
          const updatedPod = {
            ...currentPod,
            items: currentPod.items.filter(
              (item) => item.id !== message.itemId
            ),
          };
          setCurrentPod(updatedPod);
          setPods((prev) =>
            prev.map((pod) => (pod.id === currentPod.id ? updatedPod : pod))
          );
        }
        break;

      case "invite_sent":
        // Handle invite sent notification
        console.log("Invite sent:", message.inviteCode);
        break;

      default:
        console.log("Unknown message type:", message.type);
    }
  }

  const createPod = useCallback(async () => {
    if (!newPodName.trim() || !currentUser) return;

    isCreatingOrJoiningRef.current = true;

    try {
      const response = await fetch("/api/pod/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newPodName,
          ownerId: currentUser.id,
          ownerName: currentUser.name,
          ownerAvatar: currentUser.avatar,
          ownerEmail: currentUser.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const newPod = data.pod;
        console.log("Created new pod:", newPod.name, "ID:", newPod.id);
        setPods((prev) => [...prev, newPod]);
        // Immediately set the new pod as current pod
        console.log("Setting current pod to newly created pod:", newPod.name);
        setCurrentPod(newPod);
        setShowCreatePod(false);
        setNewPodName("");

        // Send WebSocket message about new pod creation
        if (isConnected) {
          sendMessage({
            type: "pod_created",
            podId: newPod.id,
            podName: newPod.name,
          });
        }
      } else {
        console.error("Failed to create pod:", data.error);
      }
    } catch (error) {
      console.error("Error creating pod:", error);
    } finally {
      // Small delay to ensure state updates are processed before allowing pod switching
      setTimeout(() => {
        isCreatingOrJoiningRef.current = false;
      }, 100);
    }
  }, [newPodName, currentUser, isConnected, sendMessage]);

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const addItemToPod = useCallback(
    async (productId: string) => {
      if (!currentPod || !currentUser) return;

      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product) return;

      try {
        const response = await fetch("/api/pod/item", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            podId: currentPod.id,
            productId,
            name: product.name,
            price: product.price,
            quantity: 1,
            addedById: currentUser.id,
          }),
        });

        const data = await response.json();

        if (data.success) {
          console.log("API response item:", data.item);
          // Update local state with the real item data from API response
          const updatedPod = { ...currentPod };
          const existingItem = updatedPod.items.find(
            (item) => item.productId === productId
          );

          if (existingItem) {
            // Update existing item with new quantity
            console.log(
              "Updating existing item:",
              existingItem.id,
              "to quantity:",
              data.item.quantity
            );
            existingItem.quantity = data.item.quantity;
          } else {
            // Add new item with real ID from database
            console.log("Adding new item with ID:", data.item.id);
            updatedPod.items.push({
              id: data.item.id, // Use real ID from database
              productId: data.item.productId,
              name: data.item.name,
              price: data.item.price,
              quantity: data.item.quantity,
              addedBy: data.item.addedBy,
              addedAt: new Date(data.item.addedAt),
            });
          }

          setCurrentPod(updatedPod);
          setPods((prev) =>
            prev.map((pod) => (pod.id === currentPod.id ? updatedPod : pod))
          );

          // Send WebSocket message
          if (isConnected) {
            sendMessage({
              type: "item_added",
              podId: currentPod.id,
              item: data.item,
            });
          }
        }
      } catch (error) {
        console.error("Error adding item to pod:", error);
      }
    },
    [currentPod, currentUser, isConnected, sendMessage]
  );

  const updateItemQuantity = useCallback(
    async (itemId: string, change: number) => {
      if (!currentPod) return;

      try {
        const item = currentPod.items.find((item) => item.id === itemId);
        if (!item) return;

        const newQuantity = item.quantity + change;

        if (newQuantity <= 0) {
          // Remove item
          const response = await fetch(`/api/pod/item/${itemId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            const updatedPod = {
              ...currentPod,
              items: currentPod.items.filter((item) => item.id !== itemId),
            };
            setCurrentPod(updatedPod);
            setPods((prev) =>
              prev.map((pod) => (pod.id === currentPod.id ? updatedPod : pod))
            );

            // Send WebSocket message
            if (isConnected) {
              sendMessage({
                type: "item_removed",
                podId: currentPod.id,
                itemId: itemId,
              });
            }
          }
        } else {
          // Update quantity
          const response = await fetch(`/api/pod/item/${itemId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity: newQuantity }),
          });

          if (response.ok) {
            const updatedPod = {
              ...currentPod,
              items: currentPod.items.map((item) =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
              ),
            };
            setCurrentPod(updatedPod);
            setPods((prev) =>
              prev.map((pod) => (pod.id === currentPod.id ? updatedPod : pod))
            );

            // Send WebSocket message
            if (isConnected) {
              sendMessage({
                type: "item_updated",
                podId: currentPod.id,
                item: updatedPod.items.find((item) => item.id === itemId),
              });
            }
          }
        }
      } catch (error) {
        console.error("Error updating item quantity:", error);
      }
    },
    [currentPod, isConnected, sendMessage]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!currentPod) return;

      try {
        const response = await fetch(`/api/pod/item/${itemId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const updatedPod = {
            ...currentPod,
            items: currentPod.items.filter((item) => item.id !== itemId),
          };
          setCurrentPod(updatedPod);
          setPods((prev) =>
            prev.map((pod) => (pod.id === currentPod.id ? updatedPod : pod))
          );

          // Send WebSocket message
          if (isConnected) {
            sendMessage({
              type: "item_removed",
              podId: currentPod.id,
              itemId: itemId,
            });
          }
        }
      } catch (error) {
        console.error("Error removing item:", error);
      }
    },
    [currentPod, isConnected, sendMessage]
  );

  const copyInviteLink = useCallback(
    async (inviteCode: string) => {
      const inviteLink = `${window.location.origin}/pod/join/${inviteCode}`;
      navigator.clipboard.writeText(inviteLink);
      setCopiedInvite(inviteCode);
      setTimeout(() => setCopiedInvite(null), 2000);

      // Send WebSocket message about invite being shared
      if (isConnected && currentPod && currentUser) {
        sendMessage({
          type: "invite_sent",
          podId: currentPod.id,
          inviteCode: inviteCode,
          sentBy: currentUser.id,
        });
      }
    },
    [isConnected, currentPod, sendMessage, currentUser]
  );

  const joinPod = useCallback(async () => {
    if (!joinPodCode.trim() || !currentUser) return;

    isCreatingOrJoiningRef.current = true;

    try {
      const response = await fetch("/api/pod/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "join_pod",
          inviteCode: joinPodCode,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          userEmail: currentUser.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const joinedPod = data.pod;
        setPods((prev) => [...prev, joinedPod]);
        // Immediately set the joined pod as current pod
        setCurrentPod(joinedPod);
        setShowJoinModal(false);
        setJoinPodCode("");

        // Send WebSocket message about joining
        if (isConnected) {
          sendMessage({
            type: "member_joined",
            podId: joinedPod.id,
            newMember: {
              id: currentUser.id,
              name: currentUser.name,
              avatar: currentUser.avatar,
              isOwner: false,
            },
          });
        }
      } else {
        console.error("Failed to join pod:", data.error);
      }
    } catch (error) {
      console.error("Error joining pod:", error);
    } finally {
      // Small delay to ensure state updates are processed before allowing pod switching
      setTimeout(() => {
        isCreatingOrJoiningRef.current = false;
      }, 100);
    }
  }, [joinPodCode, currentUser, isConnected, sendMessage]);

  const totalItems =
    currentPod?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice =
    currentPod?.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) || 0;

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#04cf84] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show message if user is not authenticated
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">
            Please sign in to access the shopping pod.
          </p>
        </div>
      </div>
    );
  }

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

          {/* Real-time Status Indicator */}
          {currentPod && (
            <div className="absolute top-4 right-4 z-10">
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                  isConnected
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`}
                ></div>
                {isConnected ? "Live" : "Offline"}
              </div>
            </div>
          )}

          {/* Header */}
          <PodHeader
            pods={pods}
            currentPod={currentPod}
            onPodSelect={setCurrentPod}
            onCreatePod={() => setShowCreatePod(true)}
            onJoinPod={() => setShowJoinModal(true)}
          />

          {/* Content */}
          {currentPod ? (
            <div className="relative px-4 sm:px-6 lg:px-8 pb-16">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Product List */}
                  <div className="lg:col-span-2">
                    <ProductGrid
                      products={PRODUCTS}
                      currentPod={currentPod}
                      onAddItem={addItemToPod}
                      onUpdateQuantity={updateItemQuantity}
                      onShowInvite={() => setShowInviteModal(true)}
                    />
                  </div>

                  {/* Shopping Cart */}
                  <div className="lg:col-span-1">
                    <PodCart
                      podName={currentPod.name}
                      items={currentPod.items}
                      totalItems={totalItems}
                      totalPrice={totalPrice}
                      onUpdateQuantity={updateItemQuantity}
                      onRemoveItem={removeItem}
                      onPaymentClick={() => setShowPaymentModal(true)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              onCreatePod={() => setShowCreatePod(true)}
              onJoinPod={() => setShowJoinModal(true)}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <CreatePodModal
        isOpen={showCreatePod}
        podName={newPodName}
        onPodNameChange={setNewPodName}
        onCreatePod={createPod}
        onClose={() => setShowCreatePod(false)}
      />

      <InviteModal
        isOpen={showInviteModal}
        podName={currentPod?.name || ""}
        inviteCode={currentPod?.inviteCode || ""}
        copiedInvite={copiedInvite}
        onCopyInvite={copyInviteLink}
        onClose={() => setShowInviteModal(false)}
      />

      <JoinPodModal
        isOpen={showJoinModal}
        joinPodCode={joinPodCode}
        onJoinPodCodeChange={setJoinPodCode}
        onJoinPod={joinPod}
        onClose={() => setShowJoinModal(false)}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        totalAmount={totalPrice}
        items={currentPod?.items || []}
        currentUser={currentUser}
        currentPod={currentPod}
        currentUserDbId={currentUserDbId}
        onPaymentSuccess={() => {
          console.log("Payment successful!");
          // You can add additional logic here like clearing the cart, etc.
        }}
      />
    </div>
  );
}
