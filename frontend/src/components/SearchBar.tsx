import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface TitleResult {
  tconst: string;
  primaryTitle: string;
  startYear: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TitleResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(`/api/titles/search?q=${encodeURIComponent(query)}&limit=8`);
        const data = await res.json();
        if (data.success) {
          setResults(data.results);
          setOpen(true);
        }
      } catch {
        // silently ignore transient search errors
      } finally {
        setLoading(false);
      }
    }, 300); // debounce

    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goToMovie = (tconst: string) => {
    setQuery('');
    setResults([]);
    setOpen(false);
    navigate(`/movie/${tconst}`);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '280px' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="Search movies..."
        style={{
          width: '100%',
          padding: '0.5rem 0.8rem',
          borderRadius: '4px',
          border: 'none',
          boxSizing: 'border-box'
        }}
      />
      {open && (
        <div style={{
          position: 'absolute',
          top: '110%',
          left: 0,
          right: 0,
          background: 'white',
          color: '#121212',
          borderRadius: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          maxHeight: '320px',
          overflowY: 'auto',
          zIndex: 20
        }}>
          {loading && <div style={{ padding: '0.6rem 0.8rem', color: '#888' }}>Searching...</div>}
          {!loading && results.length === 0 && (
            <div style={{ padding: '0.6rem 0.8rem', color: '#888' }}>No results</div>
          )}
          {results.map((r) => (
            <div
              key={r.tconst}
              onClick={() => goToMovie(r.tconst)}
              style={{ padding: '0.6rem 0.8rem', cursor: 'pointer', borderBottom: '1px solid #eee' }}
              onMouseDown={(e) => e.preventDefault()} // avoid losing focus before click registers
            >
              {r.primaryTitle} <span style={{ color: '#888' }}>({r.startYear})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}