import { Link } from 'react-router-dom';
import { Sparkles, MessageSquare, TrendingUp } from 'lucide-react';
import Button from '../components/ui/Button';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-roboto font-bold text-text-dark">
            StyleFinder AI
          </h1>
          <Link to="/login">
            <Button variant="primary" size="sm" className="text-sm px-4 md:px-6">
              Log In / Sign Up
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 md:px-6 py-12 md:py-16 lg:py-20 text-center">
        <div className="max-w-3xl mx-auto">

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-roboto font-bold text-text-dark mb-4 md:mb-6 leading-tight">
            Find Your Perfect Outfit <br className="hidden sm:block" />
            <span className="text-primary">in Seconds</span>
          </h2>
          
          <p className="text-base md:text-lg font-inter text-text-medium mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto">
            Tell us what you need in natural language and get AI-powered outfit recommendations
            curated from top e-commerce platforms. Smart, fast, and personalized.
          </p>
          
          <Link to="/chat">
            <Button variant="primary" size="lg" className="text-base md:text-lg px-6 md:px-8 py-3 shadow-lg hover:shadow-xl transition-shadow">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12 md:mt-16 max-w-5xl mx-auto">
          <div className="group bg-white p-6 rounded-xl shadow-sm border border-border hover:shadow-lg hover:border-primary/20 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg md:text-xl font-roboto font-semibold text-text-dark mb-2">Natural Language</h3>
            <p className="font-inter text-sm md:text-base text-text-medium leading-relaxed">
              Just describe what you're looking for - "a casual summer outfit for a picnic, budget under €100"
            </p>
          </div>

          <div className="group bg-white p-6 rounded-xl shadow-sm border border-border hover:shadow-lg hover:border-primary/20 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg md:text-xl font-roboto font-semibold text-text-dark mb-2">AI-Powered</h3>
            <p className="font-inter text-sm md:text-base text-text-medium leading-relaxed">
              Advanced NLP and embeddings understand your style, budget, and occasion perfectly
            </p>
          </div>

          <div className="group bg-white p-6 rounded-xl shadow-sm border border-border hover:shadow-lg hover:border-primary/20 transition-all sm:col-span-2 md:col-span-1">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-lg md:text-xl font-roboto font-semibold text-text-dark mb-2">Personalized</h3>
            <p className="font-inter text-sm md:text-base text-text-medium leading-relaxed">
              Save your preferences and get increasingly accurate recommendations over time
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
