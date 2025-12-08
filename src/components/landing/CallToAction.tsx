import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
    return (
        <section className="py-20 md:py-28 bg-gradient-to-br from-text-dark via-stone-900 to-stone-950 text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="container mx-auto px-4 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto"
                >

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6 leading-tight"
                    >
                        Ready to Upgrade<br />
                        <span className="bg-gradient-to-r from-primary-light via-primary to-secondary bg-clip-text text-transparent">Your Style?</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-lg md:text-xl text-white/70 max-w-xl mx-auto mb-10 leading-relaxed"
                    >
                        Experience the future of personal styling. Start chatting with your AI stylist now.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link to="/chat">
                            <motion.button
                                whileHover={{ scale: 1.03, y: -3 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center bg-white text-stone-900 hover:bg-cream-100 rounded-xl px-10 py-4 text-base font-bold shadow-2xl shadow-black/30 hover:shadow-white/20 transition-all group"
                            >
                                Get Started
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>
                    </motion.div>


                </motion.div>
            </div>
        </section>
    );
};

export default CallToAction;
