import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{
      padding: '1rem 2rem',
      background: '#121212',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '1.5rem',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={{
          background: '#f5c518',
          color: 'black',
          fontWeight: '900',
          padding: '0.2rem 0.5rem',
          borderRadius: '4px',
          textDecoration: 'none',
          fontSize: '1.2rem'
        }}>
          IMDb
        </Link>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        {user && (
          <Link to="/watchlist" style={{ color: 'white', textDecoration: 'none' }}>My Watchlist</Link>
        )}
      </div>

      <SearchBar />

      <div>
        {user ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>Welcome, <strong>{user.name}</strong>!</span>
            <button onClick={logout} style={{
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              background: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}>
              Log Out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', padding: '0.3rem 0' }}>
              Log In
            </Link>
            <Link to="/register" style={{
              background: '#f5c518',
              color: 'black',
              textDecoration: 'none',
              padding: '0.3rem 0.8rem',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}