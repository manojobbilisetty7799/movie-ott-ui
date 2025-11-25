import React, { useState, useRef } from 'react';
import { searchMovies, getMovieDetails } from './api';

function App() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [error, setError] = useState('');

    const detailsRef = useRef(null);

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

            // Scroll to details on mobile
            if (window.innerWidth < 768 && detailsRef.current) {
                detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

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
            <div className="glass-panel p-4 p-md-5 h-100 d-flex flex-column">
                {/* Header */}
                <div className="text-center mb-5">
                    <h1 className="app-header display-4">
                        Movie OTT Finder
                    </h1>
                    <p className="app-subtitle">
                        Discover where to watch your favorite movies in India
                    </p>
                </div>

                {/* Search */}
                <div className="row justify-content-center mb-5">
                    <div className="col-12 col-md-8 col-lg-6">
                        <form onSubmit={handleSearch} className="search-container d-flex gap-2">
                            <input
                                type="text"
                                className="form-control search-input"
                                placeholder="Search for a movie..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button
                                className="btn btn-search text-white"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm" />
                                ) : (
                                    'Search'
                                )}
                            </button>
                        </form>
                        {error && (
                            <div className="alert alert-danger mt-3 bg-danger bg-opacity-10 border-danger border-opacity-25 text-danger rounded-4">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                <div className="row g-4 flex-grow-1">
                    {/* Left: Results List */}
                    <div className="col-md-5 col-lg-4">
                        <div className="d-flex justify-content-between align-items-center mb-3 px-2">
                            <span className="text-secondary small fw-bold text-uppercase tracking-wider">
                                Search Results
                            </span>
                            {results.length > 0 && (
                                <span className="badge bg-primary bg-opacity-25 text-primary rounded-pill">
                                    {results.length}
                                </span>
                            )}
                        </div>

                        <div className="results-container custom-scrollbar">
                            {results.length === 0 && !loading && (
                                <div className="empty-state">
                                    <div className="empty-icon">🔍</div>
                                    <p>Search for a movie to see results here</p>
                                </div>
                            )}

                            {results.map((movie) => (
                                <div
                                    key={movie.tmdbId}
                                    className={`movie-card ${selectedId === movie.tmdbId ? 'active' : ''}`}
                                    onClick={() => handleSelectMovie(movie.tmdbId)}
                                >
                                    <img
                                        src={movie.posterUrl || 'https://via.placeholder.com/70x105?text=No+Img'}
                                        alt={movie.title}
                                        className="movie-poster-thumb"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/70x105?text=No+Img'}
                                    />
                                    <div className="movie-info flex-grow-1">
                                        <h5>{movie.title}</h5>
                                        <div className="movie-meta">
                                            <span>{movie.releaseDate?.split('-')[0] || 'N/A'}</span>
                                            {movie.rating > 0 && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-warning">★ {Number(movie.rating).toFixed(1)}</span>
                                                </>
                                            )}
                                        </div>
                                        <small className="text-muted d-block mt-1 text-truncate" style={{ maxWidth: '200px' }}>
                                            {movie.overview || 'No overview available'}
                                        </small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Details View */}
                    <div className="col-md-7 col-lg-8" ref={detailsRef}>
                        <div className="details-view ps-md-4">
                            {detailsLoading ? (
                                <div className="h-100 d-flex align-items-center justify-content-center min-vh-50">
                                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
                                </div>
                            ) : !selectedMovie ? (
                                <div className="empty-state h-100">
                                    <div className="empty-icon">🎬</div>
                                    <h3>Select a Movie</h3>
                                    <p>Click on a movie from the list to view details and streaming options</p>
                                </div>
                            ) : (
                                <div className="animate-fade-in">
                                    {/* Hero Section */}
                                    <div className="details-hero">
                                        <img
                                            src={selectedMovie.backdropUrl || selectedMovie.posterUrl}
                                            className="hero-backdrop"
                                            alt="Backdrop"
                                        />
                                        <div className="hero-content">
                                            <img
                                                src={selectedMovie.posterUrl}
                                                alt={selectedMovie.title}
                                                className="poster-large d-none d-sm-block"
                                            />
                                            <div>
                                                <h2 className="movie-title-large">{selectedMovie.title}</h2>
                                                <div className="d-flex flex-wrap gap-2 mb-3">
                                                    {selectedMovie.genres?.map(g => (
                                                        <span key={g} className="genre-tag">{g}</span>
                                                    ))}
                                                </div>
                                                <div className="d-flex align-items-center gap-3 text-light opacity-90 fw-medium">
                                                    <span>📅 {selectedMovie.releaseDate?.split('-')[0]}</span>
                                                    <span>•</span>
                                                    <span>⏱️ {selectedMovie.runtime} min</span>
                                                    {selectedMovie.rating > 0 && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="text-warning">★ {Number(selectedMovie.rating).toFixed(1)}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Overview */}
                                    <div className="mb-5 px-2">
                                        <h5 className="text-white mb-3 fw-bold">Overview</h5>
                                        <p className="text-secondary leading-relaxed" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                                            {selectedMovie.overview}
                                        </p>
                                    </div>

                                    {/* OTT Section */}
                                    <div className="p-4 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-10">
                                        <h5 className="text-white mb-4 d-flex align-items-center gap-2 fw-bold">
                                            <span>📺</span> Streaming on (India)
                                        </h5>

                                        {selectedMovie.providers && selectedMovie.providers.length > 0 ? (
                                            <div className="ott-grid">
                                                {selectedMovie.providers.map((p, idx) => (
                                                    <div key={idx} className="ott-badge">
                                                        <span className="provider-name">{p.providerName}</span>
                                                        <span className="provider-type">{p.type}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-5 text-secondary">
                                                <p className="mb-0 fs-5">No streaming information available for this region.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-end mt-4 pt-3 border-top border-white border-opacity-10">
                    <small className="text-secondary opacity-75 font-monospace">Developed by Manoj O</small>
                </div>
            </div>
        </div>
    );
}

export default App;
