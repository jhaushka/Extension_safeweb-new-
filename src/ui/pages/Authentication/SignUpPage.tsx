import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 

const SignUpPage = ({ onSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      console.error("Email and password are required.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    if (profilePic) formData.append("profilePic", profilePic);

    try {
      const response = await axios.post("http://localhost:5000/api/users/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Signup successful:", response.data);
      onSignUp(); 
    } catch (error) {
      console.error("Error during signup:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="signup-page">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
        />
        <button type="submit" >Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link> 
      </p>
    </div>
  );
};

export default SignUpPage;