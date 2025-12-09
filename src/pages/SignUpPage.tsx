import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ParticleBackground from '../components/ui/ParticleBackground';
import GoogleLoginButton from '../components/ui/GoogleLoginButton';
import { showToast } from '../utils/toast';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signUp(name, email, password);
      showToast.success('Account created successfully!');
      navigate('/preferences');
    } catch (err) {
      const errorMessage = 'Failed to create account. Please try again.';
      setError(errorMessage);
      showToast.error(errorMessage);
      console.error('SignUp error:', err);
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
          Create Your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          <Input
            label="Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            minLength={6}
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
            Sign Up
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-cream-300 dark:border-surface-muted" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-cream-100 dark:bg-surface-darker text-text-medium dark:text-stone-400">
              or
            </span>
          </div>
        </div>

        <GoogleLoginButton
          onSuccess={() => navigate('/preferences')}
          mode="signup"
        />

        <p className="mt-6 text-center text-sm md:text-base font-inter text-text-medium dark:text-stone-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
