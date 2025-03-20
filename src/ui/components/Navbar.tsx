import React, { useState } from "react";
import { LogOut, User } from "lucide-react";
import logo from "./icons/logo.png";
import "~popup.css"; // Import the styles

interface NavbarProps {
  isLoggedIn: boolean;
  userProfilePic: string | null;
  onLoginClick: () => void;
  onSignUpClick: () => void;
  onLogout: () => void;
  isLoading?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn,
  userProfilePic,
  onLoginClick,
  onSignUpClick,
  onLogout,
  isLoading = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const defaultProfilePic =
    "https://static.vecteezy.com/system/resources/thumbnails/036/594/092/small_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"; // Default profile picture URL
  const profilePic = userProfilePic || defaultProfilePic;

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleViewProfile = () => {
    chrome.tabs.create({
      url: "https://dashboard-azure-one.vercel.app/admin/profile",
    });
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Extension Logo" className="logo" />
      </div>
      <div className="navbar-title">Safeweb</div>
      <div className="navbar-auth">
        {isLoading ? (
          <div>Loading...</div>
        ) : isLoggedIn ? (
          <div className="user-profile" onClick={handleDropdownToggle}>
            <img src={profilePic} alt="Profile" className="profile-pic" />
            {isDropdownOpen && (
              <div className="profile-dropdown">
                <button
                  onClick={handleViewProfile}
                  className="dropdown-item"
                >
                  <User className="icon" />
                  View Profile
                </button>
                <button onClick={onLogout} className="dropdown-item">
                  <LogOut className="icon" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <button onClick={onLoginClick}>Login</button>
            <button onClick={onSignUpClick}>Sign Up</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;