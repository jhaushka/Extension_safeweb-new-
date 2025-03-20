import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link for navigation
import { UserData, LoginProps } from "./types";

const LoginPage: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error message

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      console.log("Login response:", response.data); // Log the response

      if (response.data && response.data.user) {
        // Save user data to chrome.storage
        chrome.storage.sync.set(
          { isLoggedIn: true, user: response.data.user },
          () => {
            console.log("User data saved to chrome.storage");
          }
        );

        // Pass user data to the parent component
        onLogin(response.data.user);
      } else {
        setError("Invalid response from server");
      }
    } catch (error) {
      console.error("Error during login:", error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        New user? <Link to="/signup">Sign up here</Link> {/* Add Signup link */}
      </p>
    </div>
  );
};

export default LoginPage;