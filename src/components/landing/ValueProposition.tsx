import { motion } from 'framer-motion';
import { Search, Layers, Clock, Smile } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../../utils/animations';

const features = [
    {
        icon: <Search className="w-6 h-6" />,
        title: "Intent-Based Search",
        description: "Forget keywords. Describe your needs naturally and get precise results."
    },
    {
        icon: <Layers className="w-6 h-6" />,
        title: "Complete Outfits",
        description: "We don't just find items; we assemble cohesive, ready-to-wear looks."
    },
    {
        icon: <Clock className="w-6 h-6" />,
        title: "Save Time",
        description: "Skip the endless scrolling. Get curated recommendations in seconds."
    },
    {
        icon: <Smile className="w-6 h-6" />,
        title: "Personalized",
        description: "The AI learns your style and preferences for increasingly better suggestions."
    }
];

const ValueProposition = () => {
    return (
        <section className="py-20 md:py-28 bg-cream-100 dark:bg-surface-darker relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 dark:bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                    className="mb-16 max-w-3xl mx-auto text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    <motion.p
                        variants={fadeInUp}
                        className="text-xs font-medium uppercase tracking-[0.2em] text-primary dark:text-primary-light mb-4"
                    >
                        Why StyleFinder
                    </motion.p>
                    <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl font-serif text-text-dark dark:text-white mb-6 leading-tight">
                        Your Personal Stylist,<br />
                        <span className="italic bg-gradient-to-r from-primary to-secondary dark:from-primary-light dark:to-primary bg-clip-text text-transparent">Powered by AI</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="text-text-medium dark:text-stone-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                        Unlike traditional platforms that focus on endless feeds, StyleFinder is task-oriented.
                        We translate your request into a complete, shoppable look instantly.
                    </motion.p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="group relative bg-cream-50/80 dark:bg-surface-dark/80 backdrop-blur-sm border border-cream-200 dark:border-surface-muted rounded-2xl p-6 hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-primary/10 transition-all duration-300"
                        >
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="relative z-10">
                                <div className="mb-4 p-3 bg-primary/10 dark:bg-primary/20 rounded-xl inline-block group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                                    <div className="text-primary dark:text-primary-light group-hover:text-white transition-colors duration-300">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-text-dark dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-text-medium dark:text-stone-400 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ValueProposition;
