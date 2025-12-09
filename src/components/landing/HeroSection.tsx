import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import { fadeInUp, staggerContainer } from '../../utils/animations';

const HeroSection = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <section className="relative min-h-[90vh] w-full flex flex-col overflow-hidden bg-gradient-to-br from-cream-50 via-cream-100 to-cream-200 dark:from-surface-dark dark:via-surface-darker dark:to-surface-dark">
            {/* Decorative circles */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 dark:bg-primary/5 rounded-full blur-3xl" />

            {/* Sticky Navigation */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="fixed top-0 left-0 right-0 w-full z-[100] py-4 px-4 md:px-8"
            >
                {/* Navbar Container */}
                <div className="max-w-7xl mx-auto flex justify-between items-center bg-cream-50/90 dark:bg-surface-dark/90 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-lg shadow-black/5 dark:shadow-black/20 border border-cream-200/50 dark:border-surface-muted/50">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/25">
                            <span className="text-white font-serif italic font-bold text-lg">S</span>
                        </div>
                        <span className="font-serif font-bold tracking-tight text-text-dark dark:text-white text-xl group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                            StyleFinder
                        </span>
                    </Link>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3 md:gap-4">
                        <ThemeToggle size="sm" />

                        {/* Divider - hidden on mobile */}
                        <div className="hidden md:block w-px h-6 bg-cream-300 dark:bg-surface-muted" />

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-3">
                            <Link to="/login">
                                <Button variant="ghost" size="sm" className="text-xs md:text-sm px-4 md:px-5 border border-cream-300 dark:border-surface-muted hover:border-primary dark:hover:border-primary-light">
                                    Log In
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button variant="primary" size="sm" className="text-xs md:text-sm px-4 md:px-5">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Hamburger Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-cream-200 dark:hover:bg-surface-muted transition-colors"
                            aria-label="Toggle mobile menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5 text-text-dark dark:text-white" />
                            ) : (
                                <Menu className="w-5 h-5 text-text-dark dark:text-white" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden mt-2 max-w-7xl mx-auto bg-cream-50/95 dark:bg-surface-dark/95 backdrop-blur-xl rounded-xl px-4 py-3 shadow-lg border border-cream-200/50 dark:border-surface-muted/50"
                        >
                            <div className="flex flex-col gap-2">
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="ghost" size="sm" className="w-full justify-center text-sm border border-cream-300 dark:border-surface-muted">
                                        Log In
                                    </Button>
                                </Link>
                                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="primary" size="sm" className="w-full justify-center text-sm">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            <div className="flex-1 grid md:grid-cols-2 h-full">
                {/* Text Content - Left Side */}
                <div className="order-2 md:order-1 flex items-center justify-center p-8 md:p-16 lg:p-24 relative z-10">
                    <motion.div
                        className="max-w-xl"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        {/* Badge */}
                        <motion.div variants={fadeInUp} className="mb-6">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-cream-100/80 dark:bg-surface-darker/80 backdrop-blur-sm border border-cream-300 dark:border-surface-muted rounded-full text-text-dark dark:text-stone-200 font-medium text-xs tracking-wide shadow-sm">
                                <Sparkles className="w-3.5 h-3.5 text-primary dark:text-primary-light" />
                                AI Personal Stylist
                            </span>
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-text-dark dark:text-white mb-6 leading-[1.15]"
                        >
                            Curated Style, <br />
                            <span className="italic bg-gradient-to-r from-primary via-secondary to-primary dark:from-primary-light dark:via-primary dark:to-primary-light bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
                                Instantly.
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="text-base md:text-lg text-text-medium dark:text-stone-300 mb-8 leading-relaxed max-w-md"
                        >
                            Experience the new era of personal shopping.
                            Describe your occasion, and let our AI curate the perfect look from top global brands.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                            <Link to="/chat">
                                <motion.button
                                    whileHover={{ scale: 1.03, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-primary text-white hover:bg-primary-hover rounded-xl px-8 py-4 text-sm font-bold transition-all min-w-[180px]"
                                    style={{ boxShadow: '0 0 25px rgba(166, 124, 82, 0.5)' }}
                                >
                                    Get Started
                                </motion.button>
                            </Link>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="mt-10 flex items-center gap-6 text-xs text-text-muted dark:text-stone-400">
                            <span>Top Brands</span>
                            <div className="w-1 h-1 bg-cream-400 dark:bg-stone-600 rounded-full" />
                            <span>AI Powered</span>
                            <div className="w-1 h-1 bg-cream-400 dark:bg-stone-600 rounded-full" />
                            <span>Instant Results</span>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Hero Image - Right Side */}
                <div className="order-1 md:order-2 relative h-[45vh] md:h-auto overflow-hidden">
                    <motion.div
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="absolute inset-0"
                    >
                        <img
                            src="/assets/landing/hero-bg.png"
                            alt="Editorial Fashion"
                            className="w-full h-full object-cover object-top"
                        />
                        {/* Premium gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-cream-50/30 to-cream-50 dark:via-surface-dark/50 dark:to-surface-dark md:block hidden" />
                        <div className="absolute inset-0 bg-gradient-to-t from-cream-50 via-transparent to-transparent dark:from-surface-dark md:hidden" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
