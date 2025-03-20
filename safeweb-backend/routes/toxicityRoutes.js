const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");

// POST /api/analyze-toxicity
router.post("/", (req, res) => {
  const { sentences } = req.body;

  console.log("Request received at /api/analyze-toxicity");
  console.log("Request body:", req.body);

  if (!sentences || !Array.isArray(sentences)) {
    console.error("Sentences are required and must be an array");
    return res.status(400).json({ error: "Sentences are required and must be an array" });
  }

  console.log("Running Python script...");

  // Determine the correct Python interpreter path based on the OS
  const isWindows = process.platform === "win32";
  const pythonInterpreter = isWindows
    ? path.join(__dirname, "../.venv/Scripts/python.exe") // Windows
    : path.join(__dirname, "../.venv/bin/python"); // macOS/Linux

  // Path to the Python script
  const pythonScriptPath = path.join(__dirname, "../toxicity_models/detoxify_analysis.py");

  console.log(`Python interpreter path: ${pythonInterpreter}`);
  console.log(`Python script path: ${pythonScriptPath}`);
  console.log(`Input sent to Python script: ${JSON.stringify({ sentences })}`);

  // Spawn a Python process
  const pythonProcess = spawn(pythonInterpreter, [pythonScriptPath]);

  let outputData = "";
  let errorData = "";

  // Send input to the Python script
  pythonProcess.stdin.write(JSON.stringify({ sentences }));
  pythonProcess.stdin.end();

  // Collect data from the Python script
  pythonProcess.stdout.on("data", (data) => {
    outputData += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    errorData += data.toString();
  });

  // Handle process errors
  pythonProcess.on("error", (err) => {
    console.error("Failed to start Python process:", err);
    return res.status(500).json({ error: "Failed to start Python process" });
  });

  // Handle process completion
  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error(`Python script exited with code ${code}: ${errorData}`);
      return res.status(500).json({ error: "Failed to analyze toxicity" });
    }

    try {
      const output = JSON.parse(outputData);

      // Check for errors in the Python script output
      if (output.error) {
        console.error("Python script error:", output.error);
        return res.status(500).json({ error: output.error });
      }

      // Extract the results
      const results = output.results;
      console.log("Analysis results:", results);

      // Send the results back to the client
      res.json({
        success: true,
        results: results,
        timestamp: output.timestamp,
      });
    } catch (parseError) {
      console.error("Error parsing Python script output:", parseError);
      res.status(500).json({ error: "Failed to parse results" });
    }
  });
});

module.exports = router;