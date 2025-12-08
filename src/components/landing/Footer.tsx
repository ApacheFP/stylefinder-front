import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-background-white border-t border-black/5 py-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black flex items-center justify-center">
                            <span className="text-white font-serif italic text-xl font-bold">S</span>
                        </div>
                        <span className="text-xl font-serif font-bold text-text-dark tracking-tight">StyleFinder AI</span>
                    </div>

                    <nav className="flex gap-8 text-sm font-medium text-text-medium tracking-wide uppercase">
                        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                        <Link to="/chat" className="hover:text-primary transition-colors">Chat</Link>
                        <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
                    </nav>

                    <div className="text-xs text-text-muted tracking-wider">
                        © {new Date().getFullYear()} StyleFinder AI.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
