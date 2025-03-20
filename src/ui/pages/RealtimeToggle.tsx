import React, { useState, useEffect } from "react";
import { Storage } from "@plasmohq/storage";
import "~popup.css"; // Import the styles

const RealtimeToggle = () => {
  const [isRealTimeProtectionEnabled, setIsRealTimeProtectionEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const storage = new Storage();

  // Load saved preference from storage
  useEffect(() => {
    storage.get<boolean>("isRealTimeProtectionEnabled").then((value) => {
      setIsRealTimeProtectionEnabled(value || false);
    });
  }, []);

  // Toggle real-time protection
  const toggleRealTimeProtection = () => {
    const newValue = !isRealTimeProtectionEnabled;
    setIsRealTimeProtectionEnabled(newValue);
    setIsLoading(true); // Start loading

    // Save the preference to storage
    storage.set("isRealTimeProtectionEnabled", newValue).then(() => {
      // Send message to background script
      chrome.runtime.sendMessage(
        { action: "toggleRealTimeProtection", value: newValue },
        (response) => {
          setIsLoading(false); // Stop loading
          if (response?.success) {
            console.log("Real-time protection toggled:", newValue);
          } else {
            console.error("Failed to toggle real-time protection.");
          }
        }
      );
    });
  };

  return (
    <div className="realtime-toggle-container">
      <label className="realtime-toggle">
        <input
          type="checkbox"
          checked={isRealTimeProtectionEnabled}
          onChange={toggleRealTimeProtection}
          disabled={isLoading} // Disable toggle while loading
        />
        <span className="slider"></span>
      </label>
      <span className="toggle-label">
        {isLoading ? (
          <span className="loading-spinner">Loading...</span>
        ) : (
          isRealTimeProtectionEnabled ? "Real-Time Protection: ON" : "Real-Time Protection: OFF"
        )}
      </span>
    </div>
  );
};

export default RealtimeToggle;