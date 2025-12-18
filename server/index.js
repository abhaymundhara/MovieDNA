import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { analyzeMovieDNA } from "./services/movieDNA.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Movie DNA API is running" });
});

// Main endpoint - Analyze movie DNA
app.post("/api/movie-dna", async (req, res) => {
  try {
    const { movieTitle } = req.body;

    if (!movieTitle) {
      return res.status(400).json({ error: "Movie title is required" });
    }

    console.log(`🎬 Analyzing DNA for: ${movieTitle}`);
    const result = await analyzeMovieDNA(movieTitle);

    res.json(result);
  } catch (error) {
    console.error("Error analyzing movie DNA:", error.message);
    res.status(500).json({
      error: "Failed to analyze movie DNA",
      details: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Movie DNA API running on http://localhost:${PORT}`);
  console.log(
    `✅ TMDB API Key: ${process.env.TMDB_API_KEY ? "Configured" : "Missing"}`
  );
  console.log(
    `✅ Groq API Key: ${process.env.GROQ_API_KEY ? "Configured" : "Missing"}`
  );
});
