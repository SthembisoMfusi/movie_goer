import { useEffect, useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface WatchlistMovie {
  tconst: string;
  primaryTitle: string;
  startYear: string;
  genres: string;
  Rating?: { averageRating: number; numVotes: number };
}

export default function Watchlist() {
  const { token, user, loading: authLoading } = useContext(AuthContext);
  const [movies, setMovies] = useState<WatchlistMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const fetchWatchlist = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/watchlist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setMovies(data.watchlist);
        } else {
          setError(data.error || 'Could not load your watchlist.');
        }
      } catch {
        setError('A network error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, [token]);

  const handleRemove = async (tconst: string) => {
    if (!token) return;
    setRemovingId(tconst);
    try {
      const res = await fetch(`/api/watchlist/${tconst}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMovies((prev) => prev.filter((m) => m.tconst !== tconst));
      }
    } catch {
      // leave the item in place if the request failed
    } finally {
      setRemovingId(null);
    }
  };

  if (authLoading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (loading) return <p>Loading your watchlist...</p>;
  if (error) return <p style={{ color: 'crimson' }}>{error}</p>;

  return (
    <div>
      <h1>My Watchlist</h1>
      {movies.length === 0 ? (
        <p>Your watchlist is empty. <Link to="/">Browse movies</Link> to add some.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {movies.map((movie) => (
            <div
              key={movie.tconst}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem 1.5rem'
              }}
            >
              <div>
                <Link to={`/movie/${movie.tconst}`} style={{ fontWeight: 'bold', color: '#121212', textDecoration: 'none' }}>
                  {movie.primaryTitle}
                </Link>
                <p style={{ margin: '0.25rem 0 0', color: '#555' }}>
                  {movie.startYear} &middot; {movie.genres}
                  {movie.Rating && ` \u00b7 ★ ${movie.Rating.averageRating}`}
                </p>
              </div>
              <button
                onClick={() => handleRemove(movie.tconst)}
                disabled={removingId === movie.tconst}
                style={{
                  background: '#eee',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {removingId === movie.tconst ? 'Removing...' : 'Remove'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}