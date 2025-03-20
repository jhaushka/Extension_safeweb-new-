const storage = new Storage();

console.log("Content script loaded!");

// Function to analyze message toxicity
const analyzeToxicity = async (text: string) => {
  try {
    const response = await fetch("http://localhost:5000/api/analyse-toxicity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze toxicity");
    }

    const data = await response.json();
    return data.toxicity; // Assuming the API returns { toxicity: number }
  } catch (error) {
    console.error("Error analyzing toxicity:", error);
    return null;
  }
};

const observer = new MutationObserver(async (mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach(async (node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const messageElement = node as HTMLElement;
          const messageText = messageElement.innerText.trim();

          if (messageText) {
            console.log("New message detected:", messageText);

            // Check if real-time protection is enabled
            const isEnabled = await storage.get<boolean>("isRealTimeProtectionEnabled");
            console.log("Real-time protection enabled:", isEnabled);

            if (isEnabled) {
              // Analyze toxicity
              const toxicityScore = await analyzeToxicity(messageText);
              console.log("Toxicity score:", toxicityScore);

              if (toxicityScore !== null && toxicityScore > 0.5) {
                // Send the message to the background script
                chrome.runtime.sendMessage({
                  type: "NEW_MESSAGE",
                  text: messageText,
                  toxicityScore,
                });
              }
            }
          }
        }
      });
    }
  });
});

const waitForChatContainer = setInterval(() => {
  const chatContainer = document.querySelector("div[aria-label='Chat list']");
  if (chatContainer) {
    clearInterval(waitForChatContainer);
    observer.observe(chatContainer, { childList: true, subtree: true });
    console.log("Chat container found. Observing for new messages...");
  }
}, 100);