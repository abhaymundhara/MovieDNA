import { useState } from "react";
import PropTypes from "prop-types";
import "./SearchBar.css";

function SearchBar({ onSearch, disabled }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder="Enter a movie you love... (e.g., Inception, The Matrix)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
      />
      <button
        type="submit"
        className="search-button"
        disabled={disabled || !input.trim()}
      >
        {disabled ? "Analyzing..." : "Find DNA"}
      </button>
    </form>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default SearchBar;
