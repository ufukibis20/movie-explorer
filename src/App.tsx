import { useEffect, useMemo, useState } from "react";
import "./App.css";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids?: number[];
};

type Genre = {
  id: number;
  name: string;
};

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_URL = "https://image.tmdb.org/t/p/original";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"trending" | "popular" | "favorites">("trending");
  const [selectedGenre, setSelectedGenre] = useState<number | "all">("all");
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem("movie-explorer-favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("movie-explorer-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
        );
        const data = await res.json();
        setGenres(data.genres || []);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedMovie(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedMovie ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedMovie]);

  const fetchMovies = async () => {
    setLoading(true);

    try {
      let url = "";

      if (search.trim()) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          search
        )}`;
      } else if (mode === "trending") {
        url =
          selectedGenre === "all"
            ? `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
            : `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&sort_by=popularity.desc`;
      } else if (mode === "popular") {
        url =
          selectedGenre === "all"
            ? `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
            : `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&sort_by=popularity.desc`;
      } else {
        url =
          selectedGenre === "all"
            ? `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
            : `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&sort_by=popularity.desc`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [mode, selectedGenre]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchMovies();
  };

  const clearSearch = async () => {
    setSearch("");
    await fetchMovies();
  };

  const toggleFavorite = (movieId: number) => {
    setFavorites((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId]
    );
  };

  const favoriteMovies = useMemo(() => {
    return movies.filter((movie) => favorites.includes(movie.id));
  }, [movies, favorites]);

  const displayedMovies = useMemo(() => {
    let result = mode === "favorites" ? favoriteMovies : movies;

    if (search.trim() && selectedGenre !== "all") {
      result = result.filter((movie) => movie.genre_ids?.includes(Number(selectedGenre)));
    }

    return result;
  }, [mode, movies, favoriteMovies, search, selectedGenre]);

  const getGenreNames = (movie: Movie) => {
    if (!movie.genre_ids) return [];
    return genres
      .filter((genre) => movie.genre_ids?.includes(genre.id))
      .slice(0, 3)
      .map((genre) => genre.name);
  };

  const heroMovie = displayedMovies[0];

  return (
    <div className="app">
      <div className="background-glow background-glow-1" />
      <div className="background-glow background-glow-2" />

      <header className="hero">
        {heroMovie?.backdrop_path && (
          <div
            className="hero-backdrop"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(7,10,18,0.3), rgba(7,10,18,0.95)), url(${BACKDROP_URL}${heroMovie.backdrop_path})`,
            }}
          />
        )}

        <div className="hero-content">
          <p className="eyebrow">React + TypeScript + TMDB API</p>
          <h1>Movie Explorer</h1>
          <p className="hero-text">
            Suche nach Filmen, entdecke Trends, filtere nach Genres und speichere
            deine Favoriten lokal im Browser.
          </p>

          <div className="hero-actions">
            <button
              className={`tab-button ${mode === "trending" ? "active" : ""}`}
              onClick={() => setMode("trending")}
              type="button"
            >
              Trending
            </button>
            <button
              className={`tab-button ${mode === "popular" ? "active" : ""}`}
              onClick={() => setMode("popular")}
              type="button"
            >
              Popular
            </button>
            <button
              className={`tab-button ${mode === "favorites" ? "active" : ""}`}
              onClick={() => setMode("favorites")}
              type="button"
            >
              Favorites ({favorites.length})
            </button>
          </div>
        </div>
      </header>

      <main className="content">
        <section className="controls-card">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Suche nach einem Film..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">Suchen</button>
            <button type="button" className="secondary-button" onClick={clearSearch}>
              Reset
            </button>
          </form>

          <div className="filters">
            <div className="filter-group">
              <label htmlFor="genre">Genre</label>
              <select
                id="genre"
                value={selectedGenre}
                onChange={(e) =>
                  setSelectedGenre(
                    e.target.value === "all" ? "all" : Number(e.target.value)
                  )
                }
              >
                <option value="all">Alle Genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="stats">
              <div className="stat-card">
                <span className="stat-label">Anzahl</span>
                <strong>{displayedMovies.length}</strong>
              </div>
              <div className="stat-card">
                <span className="stat-label">Favoriten</span>
                <strong>{favorites.length}</strong>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="movie-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="skeleton-card">
                <div className="skeleton-poster" />
                <div className="skeleton-line skeleton-line-lg" />
                <div className="skeleton-line" />
              </div>
            ))}
          </div>
        ) : displayedMovies.length === 0 ? (
          <div className="empty-state">
            <h2>Keine Filme gefunden</h2>
            <p>Versuche eine andere Suche oder ändere den Genre-Filter.</p>
          </div>
        ) : (
          <div className="movie-grid">
            {displayedMovies.map((movie) => {
              const isFavorite = favorites.includes(movie.id);
              const movieGenres = getGenreNames(movie);

              return (
                <article
                  key={movie.id}
                  className="movie-card"
                  onClick={() => setSelectedMovie(movie)}
                >
                  <div className="poster-wrapper">
                    {movie.poster_path ? (
                      <img
                        src={`${IMAGE_URL}${movie.poster_path}`}
                        alt={movie.title}
                        className="movie-poster"
                      />
                    ) : (
                      <div className="poster-fallback">No Image</div>
                    )}

                    <button
                      className={`favorite-button ${isFavorite ? "favorite-active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(movie.id);
                      }}
                      aria-label="Favorit umschalten"
                      type="button"
                    >
                      {isFavorite ? "♥" : "♡"}
                    </button>
                  </div>

                  <div className="movie-info">
                    <div className="movie-top-row">
                      <h3>{movie.title}</h3>
                      <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
                    </div>

                    <p className="release-date">
                      {movie.release_date ? movie.release_date.slice(0, 4) : "Unbekannt"}
                    </p>

                    <div className="genre-list">
                      {movieGenres.map((genre) => (
                        <span key={genre} className="genre-badge">
                          {genre}
                        </span>
                      ))}
                    </div>

                    <p className="overview-preview">
                      {movie.overview
                        ? `${movie.overview.slice(0, 110)}${movie.overview.length > 110 ? "..." : ""}`
                        : "Keine Beschreibung vorhanden."}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-button"
              onClick={() => setSelectedMovie(null)}
              type="button"
            >
              ✕
            </button>

            <div className="modal-grid">
              <div>
                {selectedMovie.poster_path ? (
                  <img
                    src={`${IMAGE_URL}${selectedMovie.poster_path}`}
                    alt={selectedMovie.title}
                    className="modal-poster"
                  />
                ) : (
                  <div className="poster-fallback modal-fallback">No Image</div>
                )}
              </div>

              <div className="modal-details">
                <h2>{selectedMovie.title}</h2>
                <p className="modal-meta">
                  Jahr:{" "}
                  {selectedMovie.release_date
                    ? selectedMovie.release_date.slice(0, 4)
                    : "Unbekannt"}
                </p>
                <p className="modal-meta">
                  Bewertung: ⭐ {selectedMovie.vote_average.toFixed(1)}
                </p>

                <div className="genre-list modal-genre-list">
                  {getGenreNames(selectedMovie).map((genre) => (
                    <span key={genre} className="genre-badge">
                      {genre}
                    </span>
                  ))}
                </div>

                <p className="modal-overview">
                  {selectedMovie.overview || "Keine Beschreibung vorhanden."}
                </p>

                <button
                  type="button"
                  className={`favorite-toggle-large ${
                    favorites.includes(selectedMovie.id) ? "favorite-active" : ""
                  }`}
                  onClick={() => toggleFavorite(selectedMovie.id)}
                >
                  {favorites.includes(selectedMovie.id)
                    ? "Aus Favoriten entfernen"
                    : "Zu Favoriten hinzufügen"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;