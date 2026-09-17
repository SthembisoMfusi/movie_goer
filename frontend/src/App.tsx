// frontend/src/App.tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav style={{ 
          padding: '1rem 2rem', 
          background: '#121212', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
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
        </nav>
        
        <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App;