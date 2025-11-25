import React, { useState } from 'react';
import { searchMovies, getMovieDetails } from './api';

function App() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        try {
            setLoading(true);
            setError('');
            setSelectedMovie(null);
            setSelectedId(null);
            const data = await searchMovies(query.trim());
            setResults(data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch movies. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectMovie = async (tmdbId) => {
        try {
            setDetailsLoading(true);
            setError('');
            setSelectedId(tmdbId);
            const data = await getMovieDetails(tmdbId);
            setSelectedMovie(data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch movie details. Please try again.');
        } finally {
            setDetailsLoading(false);
        }
    };

    return (
        <div className="app-shell">
            <div className="glass-card p-4 p-md-5">
                {/* Header */}
                <div className="mb-4 text-center">
                    <h1 className="app-header fw-semibold">
                        🎬 Movie OTT Finder
                    </h1>
                    <p className="app-subtitle mb-0">
                        Search any movie and see where it&apos;s streaming (based on TMDB watch providers – region IN)
                    </p>
                </div>

                {/* Search */}
                <form className="mb-4" onSubmit={handleSearch}>
                    <div className="row g-2">
                        <div className="col-12 col-md-9">
                            <input
                                type="text"
                                className="form-control search-input"
                                placeholder="Try: Leo, Kantara, KGF, Interstellar..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <div className="col-12 col-md-3 d-grid">
                            <button className="btn btn-primary" type="submit" disabled={loading}>
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </div>
                </form>

                {error && (
                    <div className="alert alert-danger py-2" role="alert">
                        {error}
                    </div>
                )}

                <div className="row g-4">
                    {/* Left: Results */}
                    <div className="col-md-5">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="details-label">Results</span>
                            {results.length > 0 && (
                                <span className="badge bg-secondary">
                                    {results.length}
                                </span>
                            )}
                        </div>

                        {results.length === 0 && !loading && (
                            <p className="placeholder-text">
                                No results yet. Start by searching for a movie above.
                            </p>
                        )}

                        <div className="results-list">
                            <ul className="list-group">
                                {results.map((movie) => (
                                    <li
                                        key={movie.tmdbId}
                                        className={
                                            'list-group-item movie-item mb-2 ' +
                                            (selectedId === movie.tmdbId ? 'active' : '')
                                        }
                                        onClick={() => handleSelectMovie(movie.tmdbId)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="d-flex">
                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between">
                                                    <span className="movie-title fw-semibold">
                                                        {movie.title}
                                                    </span>
                                                    <small className="movie-meta">
                                                        ⭐{' '}
                                                        {movie.rating != null
                                                            ? Number(movie.rating).toFixed(1)
                                                            : 'N/A'}
                                                    </small>
                                                </div>
                                                <small className="movie-meta">
                                                    {movie.releaseDate || 'Unknown year'}
                                                </small>
                                                <div className="movie-overview mt-1">
                                                    <small>
                                                        {movie.overview
                                                            ? movie.overview.slice(0, 80) + '...'
                                                            : 'No description'}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="col-md-7">
                        <div className="details-card p-3 p-md-4 h-100">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="details-label">Details</span>
                                {detailsLoading && (
                                    <span className="spinner-border spinner-border-sm text-light" />
                                )}
                            </div>

                            {!detailsLoading && !selectedMovie && (
                                <p className="placeholder-text mb-0">
                                    Select a movie from the left to see its details &amp; OTT platforms.
                                </p>
                            )}

                            {!detailsLoading && selectedMovie && (
                                <>
                                    <div className="row g-3">
                                        {selectedMovie.posterUrl && (
                                            <div className="col-4 col-md-4">
                                                <img
                                                    src={selectedMovie.posterUrl}
                                                    alt={selectedMovie.title}
                                                    className="img-fluid rounded-3"
                                                    style={{ objectFit: 'cover', width: '100%' }}
                                                />
                                            </div>
                                        )}
                                        <div className={selectedMovie.posterUrl ? 'col-8 col-md-8' : 'col-12'}>
                                            <h4 className="fw-semibold mb-1">{selectedMovie.title}</h4>
                                            <div className="movie-meta mb-2">
                                                {selectedMovie.releaseDate || 'Unknown date'}
                                                {selectedMovie.runtime && ` • ${selectedMovie.runtime} min`}
                                                {selectedMovie.rating != null && (
                                                    <>
                                                        {' '}• ⭐ {Number(selectedMovie.rating).toFixed(1)}
                                                    </>
                                                )}
                                            </div>
                                            <p className="mb-2" style={{ fontSize: '0.95rem', color: '#d1d5db' }}>
                                                {selectedMovie.overview || 'No description available.'}
                                            </p>
                                            <p className="mb-1">
                                                <span className="details-label me-1">Genres</span>
                                                <span className="details-value">
                                                    {selectedMovie.genres && selectedMovie.genres.length > 0
                                                        ? selectedMovie.genres.join(', ')
                                                        : 'N/A'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <hr className="my-3" />

                                    <div>
                                        <div className="details-label mb-2">OTT Platforms (Region: IN)</div>
                                        {selectedMovie.providers && selectedMovie.providers.length > 0 ? (
                                            <div className="d-flex flex-wrap gap-2">
                                                {selectedMovie.providers.map((p, idx) => (
                                                    <span key={idx} className="badge badge-ott">
                                                        {p.providerName} • {p.type}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="placeholder-text mb-0">
                                                No OTT provider information available for this movie in your region.
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
