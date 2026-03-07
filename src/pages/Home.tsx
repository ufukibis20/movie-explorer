import { useState } from "react";
import { searchMovies } from "../services/api";
import type { Movie } from "../types/movie";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

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
      <h1 style={{ marginBottom: "24px" }}>Movie Explorer</h1>

      <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
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
            width: "320px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />

        <button
          onClick={handleSearch}
          style={{
            padding: "12px 18px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            backgroundColor: "#111827",
            color: "white",
            fontSize: "14px",
          }}
        >
          Suchen
        </button>
      </div>

      {loading && <p>Filme werden geladen...</p>}
      {error && <p>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              overflow: "hidden",
              backgroundColor: "white",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.06)",
            }}
          >
            {movie.poster_path ? (
              <img
                src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                alt={movie.title}
                style={{
                  width: "100%",
                  height: "330px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "330px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f3f4f6",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Kein Poster verfügbar
              </div>
            )}

            <div style={{ padding: "16px" }}>
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "12px",
                  fontSize: "18px",
                  lineHeight: 1.3,
                }}
              >
                {movie.title}
              </h2>

              <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                <strong>Release Date:</strong>{" "}
                {movie.release_date || "Unbekannt"}
              </p>

              <p style={{ margin: "0 0 12px 0", fontSize: "14px" }}>
                <strong>Rating:</strong> {movie.vote_average}
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#374151",
                  lineHeight: 1.5,
                }}
              >
                {movie.overview
                  ? movie.overview.slice(0, 140) + "..."
                  : "Keine Beschreibung vorhanden."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;