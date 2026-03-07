import { useState } from "react";
import { searchMovies } from "../services/api";
import type { Movie } from "../types/movie";

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
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>Movie Explorer</h1>

      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Film suchen..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
          style={{
            padding: "12px",
            width: "300px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={handleSearch}
          style={{
            padding: "12px 18px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Suchen
        </button>
      </div>

      {loading && <p>Filme werden geladen...</p>}
      {error && <p>{error}</p>}

      <div style={{ display: "grid", gap: "16px" }}>
        {movies.map((movie) => (
          <div
            key={movie.id}
            style={{
              padding: "16px",
              border: "1px solid #ddd",
              borderRadius: "10px",
            }}
          >
            <h2 style={{ marginTop: 0 }}>{movie.title}</h2>
            <p>
              <strong>Release Date:</strong> {movie.release_date || "Unbekannt"}
            </p>
            <p>
              <strong>Rating:</strong> {movie.vote_average}
            </p>
            <p>{movie.overview || "Keine Beschreibung vorhanden."}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;