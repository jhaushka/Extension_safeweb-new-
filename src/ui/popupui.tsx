import React, { useEffect, useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"

import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import LoginPage from "./pages/Authentication/LoginPage"
import SignUpPage from "./pages/Authentication/SignUpPage"
import ChatBot from "./pages/chatbot"
import HomePage from "./pages/homepage"
import Realtime from "./pages/RealtimeToggle"
import ReportsPage from "./pages/ReportsPage"

import { UserData } from "./pages/Authentication/types"

const PopupUI: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [userProfilePic, setUserProfilePic] = useState<string | null>(null)
  const navigate = useNavigate()

  // Load saved state from chrome.storage when the component mounts
  useEffect(() => {
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.sync
    ) {
      chrome.storage.sync.get(["isLoggedIn", "userProfilePic"], (result) => {
        if (result.isLoggedIn !== undefined) {
          setIsLoggedIn(result.isLoggedIn)
        }
        if (result.userProfilePic !== undefined) {
          setUserProfilePic(result.userProfilePic)
        }
      })
    } else {
      console.warn("chrome.storage is not available.")
    }
  }, [])

  const handleSignUp = () => {
    console.log("Signup successful, navigating to login")
    navigate("/login")
  }

  const handleLogin = (userData: UserData) => {
    console.log("Login successful, navigating to homepage")
    setIsLoggedIn(true) // Set login state to true
    setUserProfilePic(userData.profilePic) // Set the user's profile picture

    // Save login state and profile picture to chrome.storage
    chrome.storage.sync.set(
      { isLoggedIn: true, userProfilePic: userData.profilePic },
      () => {
        console.log("User data saved to chrome.storage")
      }
    )

    navigate("/") // Redirect to homepage after login
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserProfilePic(null)

    // Clear saved state from chrome.storage
    chrome.storage.sync.remove(["isLoggedIn", "userProfilePic"], () => {
      console.log("User data removed from chrome.storage")
    })
  }

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        userProfilePic={userProfilePic}
        onLoginClick={() => navigate("/login")} // Add onLoginClick prop
        onSignUpClick={() => navigate("/signup")}
        onLogout={handleLogout}
      />
      <div className="pt-50">
        <Routes>
          <Route path="*" element={<HomePage />} />
          <Route
            path="/signup"
            element={<SignUpPage onSignUp={handleSignUp} />}
          />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/realtime" element={<Realtime/>} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default PopupUI
