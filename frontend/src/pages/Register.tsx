import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        navigate('/login');
      } else {
        setError(data.error || data.message || 'Registration failed');
      }
    } catch (err) {
        console.error(err)
      setError('A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white border border-gray-300 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900">Create Account</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="block mb-1 font-semibold text-gray-900 text-sm">Your Name</label>
          <input 
          id='name'
            type="text" 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-400 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-imdb-yellow focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-semibold text-gray-900 text-sm">Email</label>
          <input 
            id="email"
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-400 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-imdb-yellow focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block mb-1 font-semibold text-gray-900 text-sm">Password</label>
          <input 
          id="password"
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full p-2 border border-gray-400 rounded bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-imdb-yellow focus:border-transparent"
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`mt-4 bg-imdb-yellow text-black font-bold py-2 px-4 rounded transition-colors duration-200 
            ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-yellow-500'}`}
        >
          {isLoading ? 'Creating Account...' : 'Create your IMDb account'}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-gray-700">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:text-blue-800 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}