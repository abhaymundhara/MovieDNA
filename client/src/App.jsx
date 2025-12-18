import { useEffect, useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";
import RecommendationCard from "./components/RecommendationCard";
import LoadingSpinner from "./components/LoadingSpinner";
import DnaBackground from "./components/DnaBackground";

const REPO_SLUG = "owner/repo"; // TODO: replace with your repo, e.g., "abhaymundhara/movie-dna"

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [starCount, setStarCount] = useState(null);

  useEffect(() => {
    const fetchStars = async () => {
      if (!REPO_SLUG || REPO_SLUG === "owner/repo") return;
      try {
        const res = await fetch(`https://api.github.com/repos/${REPO_SLUG}`);
        if (!res.ok) throw new Error("Failed to load stars");
        const data = await res.json();
        setStarCount(data.stargazers_count ?? null);
      } catch (e) {
        setStarCount(null);
      }
    };
    fetchStars();
  }, []);

  const handleSearch = async (movieTitle) => {
    setLoading(true);
    setError(null);
    setResult(null);

          <a
            className="github-pill"
            href={`https://github.com/${REPO_SLUG}`}
            target="_blank"
            rel="noreferrer"
            aria-label="View project on GitHub"
          >
      });

      if (!response.ok) {
        throw new Error("Failed to analyze movie");
      }

      const data = await response.json();
            <span className="github-stars" aria-live="polite">
              ★ {starCount !== null ? starCount.toLocaleString() : "—"}
            </span>
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="bg-3d" aria-hidden="true">
        <DnaBackground />
      </div>

      <header className="header">
        <div className="header-inner">
          <a
            className="github-pill"
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="View project on GitHub"
          >
            <span className="github-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.87 10.93c.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.45-2.27 1.2-3.07-.12-.29-.52-1.46.12-3.04 0 0 .98-.31 3.2 1.18a11.2 11.2 0 0 1 5.82 0c2.22-1.49 3.2-1.18 3.2-1.18.64 1.58.24 2.75.12 3.04.75.8 1.2 1.82 1.2 3.07 0 4.4-2.69 5.36-5.26 5.64.41.36.78 1.07.78 2.16v3.2c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
            </span>
            <span className="github-text">GitHub</span>
            <span className="pill-divider" aria-hidden="true" />
            <span className="github-stars" aria-hidden="true">
              ★ 1
            </span>
          </a>
          <h1 className="title">
            🎬 <span className="gradient-text">Movie DNA</span>
          </h1>
          <p className="subtitle">
            Find movies with the same DNA as one you love
          </p>
        </div>
      </header>

      <main className="main-content">
        <SearchBar onSearch={handleSearch} disabled={loading} />

        {loading && <LoadingSpinner />}

        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
          </div>
        )}

        {result && (
          <div className="results-container">
            <section className="original-movie-section">
              <h2 className="section-title">Your Movie</h2>
              <MovieCard movie={result.originalMovie} />
            </section>

            <section className="recommendations-section">
              <h2 className="section-title">
                🧬 DNA Matches - By Creative Team
              </h2>
              <div className="recommendations-grid">
                {result.recommendations.byDirector?.map((movie, index) => (
                  <RecommendationCard
                    key={`director-${index}`}
                    movie={movie}
                    type="Director"
                  />
                ))}
                {result.recommendations.byActor?.map((movie, index) => (
                  <RecommendationCard
                    key={`actor-${index}`}
                    movie={movie}
                    type="Actor"
                  />
                ))}
                {result.recommendations.byWriter?.map((movie, index) => (
                  <RecommendationCard
                    key={`writer-${index}`}
                    movie={movie}
                    type="Writer"
                  />
                ))}
              </div>
            </section>

            {result.recommendations.similarMovies?.length > 0 && (
              <section className="recommendations-section">
                <h2 className="section-title">🎭 Similar Stories & Themes</h2>
                <div className="recommendations-grid">
                  {result.recommendations.similarMovies.map((movie, index) => (
                    <RecommendationCard
                      key={`similar-${index}`}
                      movie={movie}
                      type="Theme"
                    />
                  ))}
                </div>
              </section>
            )}

            {result.recommendations.byGenre?.length > 0 && (
              <section className="recommendations-section">
                <h2 className="section-title">🎬 Same Genre Classics</h2>
                <div className="recommendations-grid">
                  {result.recommendations.byGenre.map((movie, index) => (
                    <RecommendationCard
                      key={`genre-${index}`}
                      movie={movie}
                      type="Genre"
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Powered by TMDB & Groq AI</p>
      </footer>
    </div>
  );
}

export default App;
