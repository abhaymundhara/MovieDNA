import PropTypes from "prop-types";
import { useRef, useState } from "react";
import "./MovieCard.css";

function MovieCard({ movie }) {
  const ref = useRef();
  const [style, setStyle] = useState({});

  function handleMove(e) {
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateX = -y * 8;
    const rotateY = x * 12;
    setStyle({
      transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`,
      boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
    });
  }

  function handleLeave() {
    setStyle({ transform: "none", boxShadow: "none" });
  }

  return (
    <div
      ref={ref}
      className="movie-card original-card card-3d"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={style}
    >
      <div className="movie-poster-container">
        {movie.posterPath ? (
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="movie-poster"
          />
        ) : (
          <div className="no-poster">🎬</div>
        )}
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-year">{movie.year}</p>

        <div className="movie-rating">
          ⭐ {movie.rating ? movie.rating.toFixed(1) : "N/A"} / 10
        </div>

        <div className="creative-team">
          <div className="team-member">
            <span className="team-label">🎬 Director:</span>
            <span className="team-name">{movie.director}</span>
          </div>
          <div className="team-member">
            <span className="team-label">⭐ Lead Actor:</span>
            <span className="team-name">{movie.leadActor}</span>
          </div>
          <div className="team-member">
            <span className="team-label">✍️ Screenwriter:</span>
            <span className="team-name">{movie.screenwriter}</span>
          </div>
        </div>

        {movie.aiAnalysis && (
          <div className="ai-analysis">
            <p className="ai-label">🤖 AI Analysis:</p>
            <p className="ai-text">{movie.aiAnalysis}</p>
          </div>
        )}

        {movie.overview && <p className="movie-overview">{movie.overview}</p>}
      </div>
    </div>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    posterPath: PropTypes.string,
    rating: PropTypes.number,
    director: PropTypes.string,
    leadActor: PropTypes.string,
    screenwriter: PropTypes.string,
    aiAnalysis: PropTypes.string,
    overview: PropTypes.string,
  }).isRequired,
};

export default MovieCard;
