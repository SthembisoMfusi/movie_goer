import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>404</h1>
      <p>We couldn't find that page.</p>
      <Link to="/" style={{ color: '#0066c0' }}>Back to Home</Link>
    </div>
  );
}