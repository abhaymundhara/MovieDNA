/**
 * Test script to verify Movie DNA API is working correctly
 * Run with: node test-api.js
 */

const TEST_MOVIE = "Inception";
const API_URL = "http://localhost:3001/api/movie-dna";

console.log("🧪 Testing Movie DNA API...\n");

async function testAPI() {
  try {
    console.log(`📍 Testing endpoint: ${API_URL}`);
    console.log(`🎬 Test movie: "${TEST_MOVIE}"\n`);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movieTitle: TEST_MOVIE }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();

    console.log("✅ API Response Successful!\n");
    console.log("📊 Results:");
    console.log("─────────────────────────────────────────");
    console.log(`Title: ${data.originalMovie.title}`);
    console.log(`Year: ${data.originalMovie.year}`);
    console.log(`Director: ${data.originalMovie.director}`);
    console.log(`Lead Actor: ${data.originalMovie.leadActor}`);
    console.log(`Screenwriter: ${data.originalMovie.screenwriter}`);
    console.log(`Rating: ${data.originalMovie.rating}/10`);

    console.log("\n🤖 AI Analysis:");
    console.log(data.originalMovie.aiAnalysis);

    console.log("\n🎯 Recommendations:");
    console.log("─────────────────────────────────────────");

    if (data.recommendations.byDirector) {
      console.log(
        `\n🎬 By Director (${data.recommendations.byDirector.connection.name}):`
      );
      console.log(
        `   "${data.recommendations.byDirector.title}" (${data.recommendations.byDirector.year})`
      );
      console.log(`   ${data.recommendations.byDirector.connection.insight}`);
    }

    if (data.recommendations.byActor) {
      console.log(
        `\n⭐ By Actor (${data.recommendations.byActor.connection.name}):`
      );
      console.log(
        `   "${data.recommendations.byActor.title}" (${data.recommendations.byActor.year})`
      );
      console.log(`   ${data.recommendations.byActor.connection.insight}`);
    }

    if (data.recommendations.byWriter) {
      console.log(
        `\n✍️  By Writer (${data.recommendations.byWriter.connection.name}):`
      );
      console.log(
        `   "${data.recommendations.byWriter.title}" (${data.recommendations.byWriter.year})`
      );
      console.log(`   ${data.recommendations.byWriter.connection.insight}`);
    }

    console.log("\n✅ All tests passed! 🎉");
  } catch (error) {
    console.error("\n❌ Test failed:");
    console.error(error.message);

    if (error.message.includes("fetch is not defined")) {
      console.error(
        "\n💡 Tip: This test requires Node.js 18+ for built-in fetch support."
      );
    } else if (error.message.includes("ECONNREFUSED")) {
      console.error(
        "\n💡 Tip: Make sure the server is running (npm run server)"
      );
    } else if (error.message.includes("API Key")) {
      console.error(
        "\n💡 Tip: Check your .env file and ensure API keys are configured"
      );
    }

    process.exit(1);
  }
}

// Run the test
testAPI();
