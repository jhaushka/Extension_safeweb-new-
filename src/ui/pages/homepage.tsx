import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [blurIntensity, setBlurIntensity] = useState(5); // Default blur intensity
  const [isBlurEnabled, setIsBlurEnabled] = useState(true); // Enable blur by default
  const [message, setMessage] = useState("");

  // Load saved preferences when the component mounts
  useEffect(() => {
    chrome.storage.local.get(["blurIntensity", "isBlurEnabled"], (result) => {
      if (result.blurIntensity !== undefined) {
        setBlurIntensity(result.blurIntensity);
      }
      if (result.isBlurEnabled !== undefined) {
        setIsBlurEnabled(result.isBlurEnabled);
      }
    });
  }, []);

  // Save preferences to chrome.storage.local
  const handleSavePreferences = () => {
    chrome.storage.local.set(
      {
        blurIntensity,
        isBlurEnabled,
      },
      () => {
        setMessage("Preferences Saved Successfully!");
        setTimeout(() => setMessage(""), 3000);

        // Apply blur effect to the current page
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];
          if (activeTab.id) {
            chrome.scripting.executeScript({
              target: { tabId: activeTab.id },
              func: (blurIntensity, isBlurEnabled) => {
                const toxicElements = document.querySelectorAll(".toxic-text");
                toxicElements.forEach((el) => {
                  el.style.filter = isBlurEnabled ? `blur(${blurIntensity}px)` : "none";
                });
              },
              args: [blurIntensity, isBlurEnabled],
            });
          }
        });
      }
    );
  };

  return (
    <div className="home-container">
      {/* Blur Filter Settings */}
      <section className="filter-settings">
        <h2>Blur Settings </h2>
        <div className="control">
          <label>Blur Intensity: {blurIntensity}</label>
          <input
            type="range"
            min="0"
            max="10"
            value={blurIntensity}
            onChange={(e) => setBlurIntensity(Number(e.target.value))}
          />
        </div>
        <div className="control">
          <label>Enable Blur</label>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isBlurEnabled}
              onChange={() => setIsBlurEnabled(!isBlurEnabled)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {/* Preview Area */}
        <div className="preview-container">
          <h3>Preview of Blurred Text:</h3>
          <div
            className="toxic-text preview"
            style={{
              filter: isBlurEnabled ? `blur(${blurIntensity}px)` : "none",
            }}
          >
            This is how blurred toxic content will appear.
          </div>
        </div>

        <button className="save-button" onClick={handleSavePreferences}>
          Save Preferences
        </button>
        {message && <p className="success-message">{message}</p>}
      </section>
    </div>
  );
};

export default HomePage;