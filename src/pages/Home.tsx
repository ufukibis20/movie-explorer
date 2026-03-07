import { useState } from "react";
import MovieCard from "../components/MovieCard";
import { searchMovies } from "../services/api";
import type { Movie } from "../types/movie";
import "./Home.css";

function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError("");

      const results = await searchMovies(query);
      setMovies(results);
    } catch (err) {
      setError("Fehler beim Laden der Filme.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <h1 className="home-title">Movie Explorer</h1>

      <div className="search-bar">
        <input
          className="search-input"
          type="text"
          placeholder="Film suchen..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <button className="search-button" onClick={handleSearch}>
          Suchen
        </button>
      </div>

      {loading && <p className="status-text">Filme werden geladen...</p>}
      {error && <p className="status-text">{error}</p>}

      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default Home;