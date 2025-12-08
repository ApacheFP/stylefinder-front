import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const CallToAction = () => {
    return (
        <section className="py-24 bg-text-dark text-white relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="container mx-auto px-4 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl md:text-5xl font-roboto font-bold mb-6">
                        Ready to Upgrade Your Style?
                    </h2>
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-inter">
                        Experience the future of personal styling. No subscriptions, just great outfits.
                    </p>
                    <Link to="/chat">
                        <Button size="lg" className="bg-white text-black hover:bg-white/90 border-none px-10 py-4 text-lg font-bold shadow-2xl">
                            Try Now for Free
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default CallToAction;
