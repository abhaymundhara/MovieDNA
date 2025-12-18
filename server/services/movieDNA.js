import {
  searchMovie,
  getMovieDetails,
  extractDirector,
  extractLeadActor,
  extractScreenwriter,
  discoverMoviesByPerson,
  getSimilarMovies,
  getMoviesByGenre,
  formatMovieData,
} from "./tmdb.js";
import { analyzeMovieWithAI, generateRecommendationInsight } from "./groq.js";

/**
 * Main function to analyze movie DNA and get recommendations
 */
export async function analyzeMovieDNA(movieTitle) {
  // Step 1: Search for the movie
  console.log(`🔍 Searching for: ${movieTitle}`);
  const searchResult = await searchMovie(movieTitle);

  // Step 2: Get detailed movie info with credits
  console.log(`📊 Fetching details for movie ID: ${searchResult.id}`);
  const movieDetails = await getMovieDetails(searchResult.id);

  // Step 3: Extract creative team
  const director = extractDirector(movieDetails.credits);
  const leadActor = extractLeadActor(movieDetails.credits);
  const screenwriter = extractScreenwriter(movieDetails.credits);

  console.log(`🎬 Director: ${director?.name || "Not found"}`);
  console.log(`⭐ Lead Actor: ${leadActor?.name || "Not found"}`);
  console.log(`✍️ Screenwriter: ${screenwriter?.name || "Not found"}`);

  // Step 4: Get AI analysis of the movie
  const aiAnalysis = await analyzeMovieWithAI(
    formatMovieData(movieDetails),
    director,
    leadActor,
    screenwriter
  );

  // Step 5: Find recommendations
  const recommendations = await getRecommendations(
    searchResult.id,
    movieDetails.title,
    movieDetails.genres,
    director,
    leadActor,
    screenwriter
  );

  // Step 6: Format response
  return {
    originalMovie: {
      ...formatMovieData(movieDetails),
      director: director?.name || "Unknown",
      leadActor: leadActor?.name || "Unknown",
      screenwriter: screenwriter?.name || "Unknown",
      aiAnalysis,
    },
    recommendations,
  };
}

/**
 * Get recommendations based on director, actor, and writer
 */
async function getRecommendations(
  originalMovieId,
  originalTitle,
  genres,
  director,
  leadActor,
  screenwriter
) {
  const recommendations = {
    byDirector: [],
    byActor: [],
    byWriter: [],
    similarMovies: [],
    byGenre: [],
  };

  // Find movies by same director
  if (director) {
    console.log(`🎬 Finding movies by director: ${director.name}`);
    const directorMovies = await discoverMoviesByPerson(
      director.id,
      "director",
      originalMovieId,
      2
    );
    for (const movie of directorMovies) {
      const insight = await generateRecommendationInsight(
        originalTitle,
        movie.title,
        "director",
        director.name
      );
      recommendations.byDirector.push({
        ...formatMovieData(movie),
        connection: {
          type: "Director",
          name: director.name,
          insight,
        },
      });
    }
  }

  // Find movies by same lead actor
  if (leadActor) {
    console.log(`⭐ Finding movies starring: ${leadActor.name}`);
    const actorMovies = await discoverMoviesByPerson(
      leadActor.id,
      "actor",
      originalMovieId,
      2
    );
    for (const movie of actorMovies) {
      const insight = await generateRecommendationInsight(
        originalTitle,
        movie.title,
        "lead actor",
        leadActor.name
      );
      recommendations.byActor.push({
        ...formatMovieData(movie),
        connection: {
          type: "Lead Actor",
          name: leadActor.name,
          insight,
        },
      });
    }
  }

  // Find movies by same screenwriter
  if (screenwriter) {
    console.log(`✍️ Finding movies written by: ${screenwriter.name}`);
    const writerMovies = await discoverMoviesByPerson(
      screenwriter.id,
      "writer",
      originalMovieId,
      2
    );
    for (const movie of writerMovies) {
      const insight = await generateRecommendationInsight(
        originalTitle,
        movie.title,
        "screenwriter",
        screenwriter.name
      );
      recommendations.byWriter.push({
        ...formatMovieData(movie),
        connection: {
          type: "Screenwriter",
          name: screenwriter.name,
          insight,
        },
      });
    }
  }

  // Get similar movies (TMDB's algorithm considers theme, plot, audience)
  console.log(`🔍 Finding similar movies...`);
  const similarMovies = await getSimilarMovies(originalMovieId, 3);
  for (const movie of similarMovies) {
    const insight = await generateRecommendationInsight(
      originalTitle,
      movie.title,
      "similar theme and story",
      "TMDB algorithm"
    );
    recommendations.similarMovies.push({
      ...formatMovieData(movie),
      connection: {
        type: "Similar Theme",
        name: "Story & Audience Match",
        insight,
      },
    });
  }

  // Get genre-based recommendations
  if (genres && genres.length > 0) {
    console.log(`🎭 Finding movies by genre...`);
    const genreIds = genres.map((g) => g.id);
    const genreMovies = await getMoviesByGenre(genreIds, originalMovieId, 3);
    const genreNames = genres.map((g) => g.name).join(", ");

    for (const movie of genreMovies) {
      const insight = await generateRecommendationInsight(
        originalTitle,
        movie.title,
        "genre",
        genreNames
      );
      recommendations.byGenre.push({
        ...formatMovieData(movie),
        connection: {
          type: "Same Genre",
          name: genreNames,
          insight,
        },
      });
    }
  }

  return recommendations;
}
