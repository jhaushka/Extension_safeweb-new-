const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Connection pool size
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if the connection fails
  }
};

// Connect to MongoDB
connectDB();

// Routes
const userRoutes = require("./routes/UserRoutes");
const reportRoutes = require("./routes/reportRoutes");
const toxicityRoutes = require("./routes/toxicityRoutes");

//express app routes
app.use("/api/users", userRoutes); // User-related routes
app.use("/api/reports", reportRoutes); // Report-related routes
app.use("/api/analyze-toxicity", toxicityRoutes); // Toxicity analysis route


// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the SafeWeb Backend!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});