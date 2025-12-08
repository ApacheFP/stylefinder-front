import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-cream-50 dark:bg-surface-dark border-t border-cream-200 dark:border-surface-muted py-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/25">
                            <span className="text-white font-serif italic font-bold text-base">S</span>
                        </div>
                        <span className="font-serif font-bold tracking-tight text-text-dark dark:text-white text-lg group-hover:text-primary transition-colors">
                            StyleFinder
                        </span>
                    </Link>

                    {/* Copyright & Made with love */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs text-text-muted dark:text-stone-500">
                        <p>© {new Date().getFullYear()} StyleFinder AI</p>
                        <p className="flex items-center gap-1.5">
                            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by the StyleFinder Team
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
