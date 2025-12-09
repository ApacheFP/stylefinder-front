import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ParticleBackground from '../components/ui/ParticleBackground';
import { showToast } from '../utils/toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      showToast.success('Welcome back!');
      navigate('/chat');
    } catch (err) {
      const errorMessage = 'Invalid email or password';
      setError(errorMessage);
      showToast.error(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-surface-dark px-4 py-8 relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />

      <div className="max-w-md w-full bg-cream-100/95 dark:bg-surface-darker/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-cream-300 dark:border-surface-muted relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-text-medium dark:text-stone-300 hover:text-primary dark:hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-inter">Back</span>
        </button>

        <h1 className="text-xl md:text-2xl font-roboto font-bold text-center text-text-dark dark:text-white mb-6">
          Log In to StyleFinder AI
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Log In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm md:text-base font-inter text-text-medium dark:text-stone-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
