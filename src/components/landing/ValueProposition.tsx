import { motion } from 'framer-motion';
import { Search, Layers, Clock, Smile } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../../utils/animations';

const features = [
    {
        header: "01.",
        icon: <Search className="w-8 h-8" />,
        title: "Intent-Based Search",
        description: "Forget keywords. Describe your needs naturally and get precise results."
    },
    {
        header: "02.",
        icon: <Layers className="w-8 h-8" />,
        title: "Complete Outfits",
        description: "We don't just find items; we assemble cohesive, ready-to-wear looks."
    },
    {
        header: "03.",
        icon: <Clock className="w-8 h-8" />,
        title: "Save Time",
        description: "Skip the endless scrolling. Get curated recommendations in seconds."
    },
    {
        header: "04.",
        icon: <Smile className="w-8 h-8" />,
        title: "Personalized",
        description: "The AI learns your style and preferences for increasingly better suggestions."
    }
];

const ValueProposition = () => {
    return (
        <section className="py-24 bg-white relative">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    className="mb-20 max-w-4xl mx-auto text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-serif text-text-dark mb-8 leading-tight">
                        More generic search? <br />
                        <span className="italic text-secondary">Your Personal Stylist is here.</span>
                    </motion.h2>
                    <motion.div variants={fadeInUp} className="w-24 h-1 bg-black mx-auto mb-8" />
                    <motion.p variants={fadeInUp} className="text-text-medium text-lg leading-relaxed font-light">
                        Unlike traditional platforms that focus on endless feeds, StyleFinder is task-oriented.
                        We translate your request into a complete, shoppable look instantly.
                    </motion.p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="group flex flex-col md:flex-row gap-6 items-start p-8 border border-gray-100 hover:border-black/10 hover:bg-background-beige/20 transition-all duration-500"
                        >
                            <div className="text-secondary font-serif text-4xl italic opacity-30 group-hover:opacity-100 transition-opacity">
                                {feature.header}
                            </div>
                            <div>
                                <div className="mb-4 text-text-dark group-hover:text-primary transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-serif text-text-dark mb-3">{feature.title}</h3>
                                <p className="text-text-medium leading-relaxed font-light">
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
