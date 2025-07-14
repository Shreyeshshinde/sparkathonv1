const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3002 });

// Store active connections by pod
const podConnections = new Map();

console.log("WebSocket server running on ws://localhost:3002");

wss.on("connection", (ws, req) => {
  const url = new URL(req.url, "http://localhost");
  const podId = url.searchParams.get("podId");
  const userId = url.searchParams.get("userId");

  if (!podId || !userId) {
    console.log("WebSocket: Missing podId or userId, closing connection");
    ws.close(1008, "Missing podId or userId");
    return;
  }

  console.log(`WebSocket connected: ${podId}-${userId}`);

  // Add connection to pod room
  if (!podConnections.has(podId)) {
    podConnections.set(podId, new Set());
  }
  podConnections.get(podId).add(ws);

  // Store user info on connection
  ws.podId = podId;
  ws.userId = userId;

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log("WebSocket message received:", message);

      // Broadcast message to all connections in the same pod
      const podConnections = wss.getPodConnections(podId);
      if (podConnections) {
        const messageToSend = JSON.stringify({
          ...message,
          timestamp: new Date().toISOString(),
        });

        podConnections.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(messageToSend);
          }
        });
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
    }
  });

  ws.on("close", (code, reason) => {
    console.log(
      `WebSocket disconnected: ${podId}-${userId} (${code}: ${reason})`
    );

    // Remove connection from pod room
    const podConnections = wss.getPodConnections(podId);
    if (podConnections) {
      podConnections.delete(ws);

      // Clean up empty pod rooms
      if (podConnections.size === 0) {
        wss.cleanupPodConnections(podId);
      }
    }
  });

  ws.on("error", (error) => {
    console.error(`WebSocket error for ${podId}-${userId}:`, error);
  });
});

// Helper methods
wss.getPodConnections = function (podId) {
  return podConnections.get(podId);
};

wss.cleanupPodConnections = function (podId) {
  podConnections.delete(podId);
  console.log(`Cleaned up connections for pod: ${podId}`);
};

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down WebSocket server...");
  wss.close(() => {
    console.log("WebSocket server closed");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("Shutting down WebSocket server...");
  wss.close(() => {
    console.log("WebSocket server closed");
    process.exit(0);
  });
});
