import type { Movie } from "../types/movie";

type MovieModalProps = {
  movie: Movie;
  onClose: () => void;
};

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function MovieModal({ movie, onClose }: MovieModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close-button" onClick={onClose}>
          ×
        </button>

        <div className="modal-layout">
          {movie.poster_path ? (
            <img
              src={`${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              className="modal-poster"
            />
          ) : (
            <div className="modal-poster-placeholder">Kein Poster verfügbar</div>
          )}

          <div className="modal-info">
            <h2 className="modal-title">{movie.title}</h2>

            <p className="modal-meta">
              <strong>Release Date:</strong> {movie.release_date || "Unbekannt"}
            </p>

            <p className="modal-meta">
              <strong>Rating:</strong> {movie.vote_average}
            </p>

            <p className="modal-overview">
              {movie.overview || "Keine Beschreibung vorhanden."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;