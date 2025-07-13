async function testAPI() {
  try {
    const fetch = (await import("node-fetch")).default;

    console.log("Testing pod creation API...");

    const response = await fetch("http://localhost:3000/api/pod/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test Pod",
        ownerId: "user1",
        ownerName: "John Doe",
        ownerAvatar: "👤",
      }),
    });

    const data = await response.json();
    console.log("Response status:", response.status);
    console.log("Response data:", data);

    if (response.ok) {
      console.log("✅ API test successful");
    } else {
      console.log("❌ API test failed");
    }
  } catch (error) {
    console.error("❌ API test error:", error.message);
  }
}

testAPI();
