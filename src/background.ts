const storage = new Storage();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleRealTimeProtection") {
    const isEnabled = message.value;
    storage.set("isRealTimeProtectionEnabled", isEnabled);
    console.log("Real-time protection toggled:", isEnabled);
    sendResponse({ success: true });
  }

  if (message.type === "NEW_MESSAGE") {
    console.log("Received new message:", message.text);
    console.log("Toxicity score:", message.toxicityScore);

    // Show a notification for toxic messages
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon48.png",
      title: "Toxic Message Detected",
      message: `Toxicity: ${message.toxicityScore.toFixed(2)}\nMessage: ${message.text}`,
    });
  }
});