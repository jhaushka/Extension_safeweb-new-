import PopupUI from './ui/popupui';
import React from "react";
import { BrowserRouter as Router } from "react-router-dom"; 
import "./popup.css"; // Import the styles

function IndexPopup() {
  return (
    <Router>
      <div className="popup-container">
        <PopupUI />
      </div>
    </Router>
  );
}

export default IndexPopup;