import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroSection from '../components/landing/HeroSection';
import BrandsSection from '../components/landing/BrandsSection';
import ValueProposition from '../components/landing/ValueProposition';
import HowItWorks from '../components/landing/HowItWorks';
import CallToAction from '../components/landing/CallToAction';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // If user is already authenticated, redirect to /chat
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark font-inter">
      <main>
        <HeroSection />
        <BrandsSection />
        <ValueProposition />
        <HowItWorks />
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
