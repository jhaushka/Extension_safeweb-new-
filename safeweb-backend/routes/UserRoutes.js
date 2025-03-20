const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + "-" + file.originalname;
    console.log("Saving file:", fileName); 
    cb(null, fileName);
  },
});



const upload = multer({ storage });

// Sign Up
router.post("/signup", upload.single("profilePic"), async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password
    const profilePic = req.file ? req.file.path : null; // Saving the file path

    const newUser = new User({ email, password: hashedPassword, profilePic });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Return the user data 
    const userData = {
      email: user.email,
      profilePic: user.profilePic,
    };

    res.status(200).json({ message: "Login successful", user: userData });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




// Update Profile
router.put("/profile/:id", upload.single("profilePic"), async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;
    const profilePic = req.file ? req.file.path : null;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update email
    if (email) user.email = email;

    // Update password if provided
    if (password) user.password = await bcrypt.hash(password, 10);

    // Update profile picture 
    if (profilePic) user.profilePic = profilePic;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Profile
router.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;