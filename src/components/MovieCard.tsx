import type { Movie } from "../types/movie";

type MovieCardProps = {
  movie: Movie;
};

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="movie-card">
      {movie.poster_path ? (
        <img
          src={`${IMAGE_BASE_URL}${movie.poster_path}`}
          alt={movie.title}
          className="movie-poster"
        />
      ) : (
        <div className="movie-poster-placeholder">Kein Poster verfügbar</div>
      )}

      <div className="movie-card-content">
        <h2 className="movie-title">{movie.title}</h2>

        <p className="movie-meta">
          <strong>Release Date:</strong> {movie.release_date || "Unbekannt"}
        </p>

        <p className="movie-meta">
          <strong>Rating:</strong> {movie.vote_average}
        </p>

        <p className="movie-overview">
          {movie.overview
            ? movie.overview.slice(0, 140) + "..."
            : "Keine Beschreibung vorhanden."}
        </p>
      </div>
    </div>
  );
}

export default MovieCard;