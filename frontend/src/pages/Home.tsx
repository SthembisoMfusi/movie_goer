import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Movie {
  tconst: string;
  primaryTitle: string;
  startYear: string;
  Rating?: {
    averageRating: number;
    numVotes: number;
  };
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const response = await fetch('/api/titles/top-rated?limit=12');
        const data = await response.json();
        if (data.success) {
          setMovies(data.topRatedTitles);
        } else {
          setError('Could not load movies.');
        }
      } catch {
        setError('A network error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchTopRated();
  }, []);

  if (loading) return <h2>Loading the best movies ever made...</h2>;
  if (error) return <p style={{ color: 'crimson' }}>{error}</p>;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Top Rated Movies</h1>
      <div style={{
        display: 'grid',
        gap: '1.5rem',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))'
      }}>
        {movies.map((movie) => (
          <Link
            key={movie.tconst}
            to={`/movie/${movie.tconst}`}
            style={{
              border: '1px solid #ddd',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              color: 'inherit',
              display: 'block'
            }}
          >
            <h3 style={{ marginTop: 0 }}>{movie.primaryTitle}</h3>
            <p style={{ color: '#555' }}>Year: {movie.startYear}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ color: '#f5c518', fontSize: '1.2rem' }}>★</span>
              <strong>{movie.Rating?.averageRating}</strong>
              <span style={{ fontSize: '0.8rem', color: '#888' }}>
                ({movie.Rating?.numVotes.toLocaleString()} votes)
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}