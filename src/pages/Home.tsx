import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { searchMovies } from "../services/api";
import type { Movie } from "../types/movie";
import "./Home.css";

function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    const savedFavorites = localStorage.getItem("favoriteMovies");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("favoriteMovies", JSON.stringify(favorites));
  }, [favorites]);

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

  const toggleFavorite = (movie: Movie) => {
    const isAlreadyFavorite = favorites.some((fav) => fav.id === movie.id);

    if (isAlreadyFavorite) {
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.id !== movie.id)
      );
    } else {
      setFavorites((prevFavorites) => [...prevFavorites, movie]);
    }
  };

  const isFavorite = (movieId: number) => {
    return favorites.some((fav) => fav.id === movieId);
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

      <p className="status-text">Favoriten: {favorites.length}</p>

      {loading && <p className="status-text">Filme werden geladen...</p>}
      {error && <p className="status-text">{error}</p>}

      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isFavorite={isFavorite(movie.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;