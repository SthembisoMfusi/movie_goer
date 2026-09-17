import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App(){
  return (
    <BrowserRouter>
      <div>
        <nav style={{ padding: '1rem', background: '#f0c14b', fontWeight: 'bold'}}>
          IMDb Clone
        </nav>

        <main style={{ padding: '2rem'}}>
          <Routes>
            <Route path="/" element={<h1>Welcome to  the IMDb Clone</h1>}/>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App;