import Groq from "groq-sdk";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

async function searchMovie(title) {
  const res = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      title
    )}`
  );
  const data = await res.json();
  if (!data.results?.length) throw new Error(`Movie "${title}" not found`);
  return data.results[0];
}

async function getMovieDetails(id) {
  const res = await fetch(
    `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits`
  );
  return res.json();
}

const extractDirector = (credits) =>
  credits?.crew?.find((p) => p.job === "Director") || null;
const extractLeadActor = (credits) => credits?.cast?.[0] || null;
const extractScreenwriter = (credits) =>
  credits?.crew?.find(
    (p) => p.job === "Screenplay" || p.job === "Writer" || p.job === "Story"
  ) || null;

async function discoverMoviesByPerson(personId, type, excludeId, limit = 2) {
  const url =
    type === "actor"
      ? `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_cast=${personId}&sort_by=popularity.desc`
      : `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_crew=${personId}&sort_by=popularity.desc`;
  const res = await fetch(url);
  const data = await res.json();
  return (data.results || []).filter((m) => m.id !== excludeId).slice(0, limit);
}

async function getSimilarMovies(movieId, limit = 3) {
  const res = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`
  );
  const data = await res.json();
  return (data.results || []).slice(0, limit);
}

async function getMoviesByGenre(genres, excludeId, limit = 3) {
  if (!genres?.length) return [];
  const ids = genres.map((g) => g.id).join(",");
  const res = await fetch(
    `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${ids}&sort_by=vote_average.desc&vote_count.gte=1000`
  );
  const data = await res.json();
  return (data.results || []).filter((m) => m.id !== excludeId).slice(0, limit);
}

const formatMovie = (movie) => ({
  id: movie.id,
  title: movie.title,
  year: movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A",
  overview: movie.overview,
  posterPath: movie.poster_path
    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
    : null,
  rating: movie.vote_average,
});

const groq = new Groq({ apiKey: GROQ_API_KEY });

async function analyzeMovieWithAI(movieData, director, actor, writer) {
  const prompt = `You are a movie expert. Analyze this movie's creative DNA:

Movie: "${movieData.title}" (${movieData.year})
Director: ${director?.name || "Unknown"}
Lead Actor: ${actor?.name || "Unknown"}
Screenwriter: ${writer?.name || "Unknown"}

Provide a brief, engaging 2-3 sentence analysis of what makes this movie's creative team special and why their collaboration creates unique storytelling. Focus on their distinctive styles and contributions.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.1-70b-versatile",
    temperature: 0.7,
    max_tokens: 200,
  });
  return completion.choices?.[0]?.message?.content?.trim() || "";
}

async function generateInsight(originalTitle, recTitle, reason, name) {
  const prompt = `You recommend "${recTitle}" to fans of "${originalTitle}" because of shared ${reason} (${name}). In 1 short sentence, explain the connection clearly.`;
  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.1-8b-instant",
    temperature: 0.6,
    max_tokens: 60,
  });
  return completion.choices?.[0]?.message?.content?.trim() || "";
}

function buildRecommendations(original, director, actor, writer, genres) {
  return {
    byDirector:
      director?.map((m) => ({
        ...formatMovie(m.movie),
        connection: { type: "Director", name: m.name, insight: m.insight },
      })) || [],
    byActor:
      actor?.map((m) => ({
        ...formatMovie(m.movie),
        connection: { type: "Lead Actor", name: m.name, insight: m.insight },
      })) || [],
    byWriter:
      writer?.map((m) => ({
        ...formatMovie(m.movie),
        connection: { type: "Screenwriter", name: m.name, insight: m.insight },
      })) || [],
    similarMovies:
      original.similar?.map((m) => ({
        ...formatMovie(m.movie),
        connection: {
          type: "Similar Theme",
          name: "Story & Audience Match",
          insight: m.insight,
        },
      })) || [],
    byGenre:
      genres?.map((m) => ({
        ...formatMovie(m.movie),
        connection: { type: "Same Genre", name: m.name, insight: m.insight },
      })) || [],
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  if (!TMDB_API_KEY || !GROQ_API_KEY) {
    return res.status(500).json({ error: "Missing API keys" });
  }

  const { movieTitle } = req.body || {};
  if (!movieTitle)
    return res.status(400).json({ error: "Movie title is required" });

  try {
    const searchResult = await searchMovie(movieTitle);
    const details = await getMovieDetails(searchResult.id);

    const director = extractDirector(details.credits);
    const leadActor = extractLeadActor(details.credits);
    const screenwriter = extractScreenwriter(details.credits);

    const aiAnalysis = await analyzeMovieWithAI(
      formatMovie(details),
      director,
      leadActor,
      screenwriter
    );

    // Parallel fetches for recs
    const [directorRecs, actorRecs, writerRecs, similarRecs, genreRecs] =
      await Promise.all([
        director
          ? discoverMoviesByPerson(director.id, "director", details.id, 2)
          : [],
        leadActor
          ? discoverMoviesByPerson(leadActor.id, "actor", details.id, 2)
          : [],
        screenwriter
          ? discoverMoviesByPerson(screenwriter.id, "writer", details.id, 2)
          : [],
        getSimilarMovies(details.id, 3),
        getMoviesByGenre(details.genres, details.id, 3),
      ]);

    // Add insights
    const directorWithInsight = await Promise.all(
      directorRecs.map(async (m) => ({
        movie: m,
        name: director.name,
        insight: await generateInsight(
          details.title,
          m.title,
          "director",
          director.name
        ),
      }))
    );
    const actorWithInsight = await Promise.all(
      actorRecs.map(async (m) => ({
        movie: m,
        name: leadActor.name,
        insight: await generateInsight(
          details.title,
          m.title,
          "lead actor",
          leadActor.name
        ),
      }))
    );
    const writerWithInsight = await Promise.all(
      writerRecs.map(async (m) => ({
        movie: m,
        name: screenwriter.name,
        insight: await generateInsight(
          details.title,
          m.title,
          "screenwriter",
          screenwriter.name
        ),
      }))
    );
    const similarWithInsight = await Promise.all(
      similarRecs.map(async (m) => ({
        movie: m,
        insight: await generateInsight(
          details.title,
          m.title,
          "similar theme and story",
          "TMDB algorithm"
        ),
      }))
    );
    const genreNames = details.genres?.map((g) => g.name).join(", ") || "";
    const genreWithInsight = await Promise.all(
      genreRecs.map(async (m) => ({
        movie: m,
        name: genreNames,
        insight: await generateInsight(
          details.title,
          m.title,
          "genre",
          genreNames
        ),
      }))
    );

    const recommendations = buildRecommendations(
      { similar: similarWithInsight },
      directorWithInsight,
      actorWithInsight,
      writerWithInsight,
      genreWithInsight
    );

    const response = {
      originalMovie: {
        ...formatMovie(details),
        director: director?.name || "Unknown",
        leadActor: leadActor?.name || "Unknown",
        screenwriter: screenwriter?.name || "Unknown",
        aiAnalysis,
      },
      recommendations,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error analyzing movie DNA:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
}
