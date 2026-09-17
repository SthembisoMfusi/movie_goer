import { useEffect, useState } from 'react';

interface Movie {
  tconst: string;
  primaryTitle: string;
  startYear: string;
  Rating?: {
    averageRating: number;
    numVotes: number;
  };
}

export  default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const response = await fetch('/api/titles/top-rated?limit=12');
        const data = await response.json();
        
        if (data.success) {
          setMovies(data.topRatedTitles);
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRated();
  }, []); 

  console.log('data', movies)
  if (loading) {
    return <h2>Loading the best movies ever made...</h2>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>🏆 Top Rated Movies</h1>
      
      {/* A simple CSS Grid to make it look like a movie catalog */}
      <div style={{ 
        display: 'grid', 
        gap: '1.5rem', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' 
      }}>
        {movies.map((movie) => (
          <div 
            key={movie.tconst} 
            style={{ 
              border: '1px solid #ddd', 
              padding: '1.5rem', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
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
          </div>
        ))}
      </div>
    </div>
  );
}