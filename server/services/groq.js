import Groq from "groq-sdk";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Use Groq AI to analyze movie and provide insights
 */
export async function analyzeMovieWithAI(movieData, director, actor, writer) {
  try {
    const prompt = `You are a movie expert. Analyze this movie's creative DNA:

Movie: "${movieData.title}" (${movieData.year})
Director: ${director?.name || "Unknown"}
Lead Actor: ${actor?.name || "Unknown"}
Screenwriter: ${writer?.name || "Unknown"}

Provide a brief, engaging 2-3 sentence analysis of what makes this movie's creative team special and why their collaboration creates unique storytelling. Focus on their distinctive styles and contributions.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-70b-versatile",
      temperature: 0.7,
      max_tokens: 200,
    });

    return (
      completion.choices[0]?.message?.content ||
      "This movie brings together a talented creative team."
    );
  } catch (error) {
    console.error("Groq AI analysis error:", error.message);
    return "This movie features a talented creative team that brings their unique vision to the screen.";
  }
}

/**
 * Generate AI-powered recommendation explanation
 */
export async function generateRecommendationInsight(
  originalMovie,
  recommendedMovie,
  connection,
  personName
) {
  try {
    const prompt = `As a movie expert, explain in one engaging sentence why someone who loved "${originalMovie}" would enjoy "${recommendedMovie}" based on their shared ${connection} ${personName}.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 100,
    });

    return (
      completion.choices[0]?.message?.content ||
      `Recommended because it shares the same ${connection}.`
    );
  } catch (error) {
    console.error("Groq recommendation insight error:", error.message);
    return `Recommended because it shares the same ${connection}: ${personName}.`;
  }
}
