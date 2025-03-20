import React from "react";
import "~popup.css"

const ChatBot = () => {
  return (
    <div className="chatbot-container">
      <iframe
        src="https://www.chatbase.co/chatbot-iframe/jNud_OpwY69gB1hmYl1Bn"
        width="100%"
        style={{ minHeight: "550px" }}
        frameBorder="0" // Use camelCase for React (frameBorder instead of frameborder)
      ></iframe>
    </div>
  );
};

export default ChatBot;