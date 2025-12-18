import PropTypes from "prop-types";
import { useRef, useState } from "react";
import "./RecommendationCard.css";

function RecommendationCard({ movie, type }) {
  const iconMap = {
    Director: "🎬",
    Actor: "⭐",
    Writer: "✍️",
  };
  const ref = useRef();
  const [style, setStyle] = useState({});

  function handleMove(e) {
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateX = -y * 8;
    const rotateY = x * 10;
    setStyle({
      transform: `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`,
      boxShadow: "0 18px 40px rgba(106,72,255,0.12)",
    });
  }

  function handleLeave() {
    setStyle({ transform: "none", boxShadow: "none" });
  }

  return (
    <div
      ref={ref}
      className="recommendation-card card-3d"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={style}
    >
      <div className="recommendation-badge">
        <span className="badge-icon">{iconMap[type] || "🎬"}</span>
        <span className="badge-text">{movie.connection.type}</span>
      </div>

      <div className="rec-poster-container">
        {movie.posterPath ? (
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="rec-poster"
          />
        ) : (
          <div className="rec-no-poster">🎬</div>
        )}
      </div>

      <div className="rec-info">
        <h4 className="rec-title">{movie.title}</h4>
        <p className="rec-year">{movie.year}</p>
        <p className="rec-connection">{movie.connection.name}</p>

        <div className="rec-rating">
          ⭐ {movie.rating ? movie.rating.toFixed(1) : "N/A"}
        </div>

        {movie.connection.insight && (
          <p className="rec-insight">{movie.connection.insight}</p>
        )}

        {movie.overview && <p className="rec-overview">{movie.overview}</p>}
      </div>
    </div>
  );
}

RecommendationCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    posterPath: PropTypes.string,
    rating: PropTypes.number,
    overview: PropTypes.string,
    connection: PropTypes.shape({
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      insight: PropTypes.string,
    }).isRequired,
  }).isRequired,
  type: PropTypes.string.isRequired,
};

export default RecommendationCard;
