const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const authMiddleware = require("../middleware/authMiddleware"); // Middleware to verify JWT token

// Create a Report
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const newReport = new Report({
      title,
      description,
      user: req.user.id, 
    });

    await newReport.save();

    res.status(201).json({ message: "Report created successfully", newReport });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Reports (with pagination and filtering)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      user: req.user.id, // Fetch reports only for the logged-in user
      ...(search && { title: { $regex: search, $options: "i" } }), // Filter by title
    };

    const reports = await Report.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }); // Sort by latest first

    const count = await Report.countDocuments(query);

    res.status(200).json({
      reports,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;