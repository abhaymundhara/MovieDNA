import "./LoadingSpinner.css";

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">Analyzing movie DNA...</p>
      <p className="loading-subtext">
        Finding director, actor, and screenwriter...
      </p>
    </div>
  );
}

export default LoadingSpinner;
