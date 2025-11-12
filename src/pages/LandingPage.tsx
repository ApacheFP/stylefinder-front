import { Link } from 'react-router-dom';
import { Sparkles, MessageSquare, TrendingUp } from 'lucide-react';
import Button from '../components/ui/Button';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center bg-white border-b border-border">
        <h1 className="text-2xl font-roboto font-bold text-text-dark">StyleFinder AI</h1>
        <Link to="/login">
          <Button variant="primary">Log In / Sign Up</Button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-roboto font-bold text-text-dark mb-6">
            Find Your Perfect Outfit in Seconds
          </h2>
          <p className="text-xl font-inter text-text-medium mb-8">
            Tell us what you need in natural language and get AI-powered outfit recommendations
            curated from top e-commerce platforms. Smart, fast, and personalized.
          </p>
          <Link to="/chat">
            <Button variant="primary" size="lg" className="text-lg px-8">
              Get Started Free
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-md border border-border">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 mx-auto">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-roboto font-semibold text-text-dark mb-3">Natural Language</h3>
            <p className="font-inter text-text-medium">
              Just describe what you're looking for - "a casual summer outfit for a picnic, budget under €100"
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md border border-border">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-roboto font-semibold text-text-dark mb-3">AI-Powered</h3>
            <p className="font-inter text-text-medium">
              Advanced NLP and embeddings understand your style, budget, and occasion perfectly
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md border border-border">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 mx-auto">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-roboto font-semibold text-text-dark mb-3">Personalized</h3>
            <p className="font-inter text-text-medium">
              Save your preferences and get increasingly accurate recommendations over time
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
