import fetch from "node-fetch";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

/**
 * Search for a movie by title
 */
export async function searchMovie(title) {
  const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
    title
  )}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`Movie "${title}" not found`);
  }

  return data.results[0]; // Return the first result
}

/**
 * Get detailed movie information including credits
 */
export async function getMovieDetails(movieId) {
  const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits`;

  const response = await fetch(url);
  const data = await response.json();

  return data;
}

/**
 * Extract director from credits
 */
export function extractDirector(credits) {
  if (!credits || !credits.crew) return null;

  const director = credits.crew.find((person) => person.job === "Director");
  return director || null;
}

/**
 * Extract lead actor (first in cast list)
 */
export function extractLeadActor(credits) {
  if (!credits || !credits.cast || credits.cast.length === 0) return null;

  return credits.cast[0]; // First actor is typically the lead
}

/**
 * Extract screenwriter
 */
export function extractScreenwriter(credits) {
  if (!credits || !credits.crew) return null;

  // Look for Screenplay, Writer, or Story credit
  const writer = credits.crew.find(
    (person) =>
      person.job === "Screenplay" ||
      person.job === "Writer" ||
      person.job === "Story"
  );

  return writer || null;
}

/**
 * Discover movies by a specific person
 */
export async function discoverMoviesByPerson(
  personId,
  personType,
  excludeMovieId,
  limit = 2
) {
  let url;

  if (personType === "actor") {
    url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_cast=${personId}&sort_by=popularity.desc`;
  } else {
    url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_crew=${personId}&sort_by=popularity.desc`;
  }

  const response = await fetch(url);
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return [];
  }

  // Filter out the original movie and return multiple results
  const otherMovies = data.results.filter(
    (movie) => movie.id !== excludeMovieId
  );
  return otherMovies.slice(0, limit);
}

/**
 * Get similar movies based on TMDB's recommendation algorithm
 */
export async function getSimilarMovies(movieId, limit = 3) {
  const url = `${TMDB_BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return [];
  }

  return data.results.slice(0, limit);
}

/**
 * Get movies by genre
 */
export async function getMoviesByGenre(genreIds, excludeMovieId, limit = 3) {
  if (!genreIds || genreIds.length === 0) {
    return [];
  }

  const genreQuery = genreIds.join(",");
  const url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreQuery}&sort_by=vote_average.desc&vote_count.gte=1000`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return [];
  }

  const otherMovies = data.results.filter(
    (movie) => movie.id !== excludeMovieId
  );
  return otherMovies.slice(0, limit);
}

/**
 * Format movie data for response
 */
export function formatMovieData(movie) {
  return {
    id: movie.id,
    title: movie.title,
    year: movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : "N/A",
    overview: movie.overview,
    posterPath: movie.poster_path
      ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
      : null,
    rating: movie.vote_average,
    voteCount: movie.vote_count,
  };
}
