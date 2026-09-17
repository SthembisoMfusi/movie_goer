import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface CastMember {
  nconst: string;
  primaryName: string;
  CastCrew: { category: string; characters: string | null; job: string | null };
}

interface MovieDetail {
  tconst: string;
  primaryTitle: string;
  startYear: string;
  runtimeMinutes: string;
  genres: string;
  Rating?: { averageRating: number; numVotes: number };
  People?: CastMember[];
}

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useContext(AuthContext);

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [watchlistState, setWatchlistState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [watchlistError, setWatchlistError] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/titles/${id}`);
        const data = await res.json();
        if (data.success) {
          setMovie(data.title);
        } else {
          setError(data.error || 'Movie not found');
        }
      } catch {
        setError('A network error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const handleAddToWatchlist = async () => {
    if (!token) return;
    setWatchlistState('saving');
    setWatchlistError('');
    try {
      const res = await fetch(`/api/watchlist/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.status === 201) {
        setWatchlistState('saved');
      } else if (res.status === 409) {
        setWatchlistState('saved');
      } else {
        setWatchlistError(data.error || 'Could not add to watchlist');
        setWatchlistState('idle');
      }
    } catch {
      setWatchlistError('A network error occurred.');
      setWatchlistState('idle');
    }
  };

  if (loading) return <p>Loading movie...</p>;
  if (error || !movie) return <p style={{ color: 'crimson' }}>{error || 'Movie not found'}</p>;

  const cast = (movie.People || []).filter((p) => p.CastCrew?.category === 'actor' || p.CastCrew?.category === 'actress');
  const crew = (movie.People || []).filter((p) => p.CastCrew?.category !== 'actor' && p.CastCrew?.category !== 'actress');

  return (
    <div>
      <Link to="/" style={{ color: '#0066c0' }}>&larr; Back to Home</Link>

      <h1 style={{ marginBottom: '0.25rem' }}>{movie.primaryTitle}</h1>
      <p style={{ color: '#555', marginTop: 0 }}>
        {movie.startYear} &middot; {movie.runtimeMinutes ? `${movie.runtimeMinutes} min` : 'Runtime unknown'} &middot; {movie.genres}
      </p>

      {movie.Rating && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '1rem 0' }}>
          <span style={{ color: '#f5c518', fontSize: '1.4rem' }}>★</span>
          <strong style={{ fontSize: '1.2rem' }}>{movie.Rating.averageRating}</strong>
          <span style={{ color: '#888' }}>({movie.Rating.numVotes.toLocaleString()} votes)</span>
        </div>
      )}

      {user ? (
        <button
          onClick={handleAddToWatchlist}
          disabled={watchlistState !== 'idle'}
          style={{
            background: watchlistState === 'saved' ? '#4caf50' : '#f5c518',
            color: watchlistState === 'saved' ? 'white' : 'black',
            fontWeight: 'bold',
            padding: '0.6rem 1.2rem',
            border: 'none',
            borderRadius: '4px',
            cursor: watchlistState === 'idle' ? 'pointer' : 'default',
            marginBottom: '1.5rem',
          }}
        >
          {watchlistState === 'saved' ? '✓ In Your Watchlist' : watchlistState === 'saving' ? 'Adding...' : '+ Add to Watchlist'}
        </button>
      ) : (
        <p>
          <Link to="/login">Log in</Link> to add this to your watchlist.
        </p>
      )}
      {watchlistError && <p style={{ color: 'crimson' }}>{watchlistError}</p>}

      {cast.length > 0 && (
        <>
          <h2>Cast</h2>
          <ul>
            {cast.map((p) => (
              <li key={p.nconst}>
                {p.primaryName}
                {p.CastCrew.characters ? ` as ${p.CastCrew.characters.replace(/[[\]"]/g, '')}` : ''}
              </li>
            ))}
          </ul>
        </>
      )}

      {crew.length > 0 && (
        <>
          <h2>Crew</h2>
          <ul>
            {crew.map((p) => (
              <li key={p.nconst}>
                {p.primaryName} — {p.CastCrew.job || p.CastCrew.category}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}