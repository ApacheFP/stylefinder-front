import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { fadeInUp, staggerContainer } from '../../utils/animations';

const HeroSection = () => {
    return (
        <section className="relative min-h-[90vh] w-full flex flex-col overflow-hidden bg-background-beige/30">
            {/* Navigation */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full py-6 px-4 md:px-8 flex justify-between items-center z-50 absolute top-0 left-0"
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black flex items-center justify-center">
                        <span className="text-white font-serif italic text-lg font-bold">S</span>
                    </div>
                    <span className="text-xl md:text-2xl font-serif font-bold tracking-tight text-text-dark">
                        StyleFinder
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/login" className="hidden sm:block text-sm font-medium text-text-dark hover:text-secondary transition-colors uppercase tracking-widest">
                        Log In
                    </Link>
                    <Link to="/signup">
                        <Button size="sm" className="bg-primary text-white hover:bg-primary-hover rounded-none px-6 py-2 uppercase tracking-wide text-xs font-bold border border-transparent">
                            Sign Up
                        </Button>
                    </Link>
                </div>
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
                        <motion.div variants={fadeInUp} className="mb-6">
                            <span className="inline-block border-b border-black pb-1 text-text-dark font-medium text-xs tracking-[0.2em] uppercase">
                                AI Personal Stylist
                            </span>
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            className="text-5xl md:text-6xl lg:text-7xl font-serif text-text-dark mb-6 leading-[1.1]"
                        >
                            Curated Style. <br />
                            <span className="italic text-secondary">Instantly.</span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="text-lg text-text-medium mb-10 leading-relaxed max-w-md font-light"
                        >
                            Experience the new era of personal shopping.
                            Describe your occasion, and let our AI curate the perfect look from top global brands.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                            <Link to="/chat">
                                <Button size="lg" className="bg-primary text-white hover:bg-primary-hover rounded-none px-10 py-4 text-sm font-bold uppercase tracking-widest shadow-none min-w-[200px]">
                                    Try it for free
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="mt-12 flex items-center gap-4 text-xs text-text-muted uppercase tracking-wider">
                            <span>Powered by AI</span>
                            <div className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span>Global Brands</span>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Hero Image - Right Side */}
                <div className="order-1 md:order-2 relative h-[50vh] md:h-auto overflow-hidden">
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
                        {/* Overlay for integration */}
                        <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
