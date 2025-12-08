import { motion } from 'framer-motion';
import { MessageSquare, Shirt, ShoppingBag } from 'lucide-react';

const steps = [
    {
        number: "01",
        title: "Describe",
        description: "Tell the AI about your event, style, and budget in natural language.",
        icon: <MessageSquare className="w-6 h-6" />
    },
    {
        number: "02",
        title: "Discover",
        description: "Review curated outfits mixed from top global brands.",
        icon: <Shirt className="w-6 h-6" />
    },
    {
        number: "03",
        title: "Shop",
        description: "Select your favorite pieces and shop them immediately.",
        icon: <ShoppingBag className="w-6 h-6" />
    }
];

const HowItWorks = () => {
    return (
        <section className="py-20 md:py-28 bg-cream-50 dark:bg-surface-dark relative overflow-hidden">
            {/* Decorative line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cream-300 dark:via-surface-muted to-transparent hidden md:block" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-medium uppercase tracking-[0.2em] text-primary dark:text-primary-light mb-4"
                    >
                        How It Works
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl lg:text-5xl font-serif text-text-dark dark:text-white leading-tight"
                    >
                        Style in <span className="italic bg-gradient-to-r from-primary to-secondary dark:from-primary-light dark:to-primary bg-clip-text text-transparent">Three Steps</span>
                    </motion.h2>
                </div>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, duration: 0.5 }}
                            className="relative group"
                        >
                            {/* Card */}
                            <motion.div
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                className="relative bg-cream-100/80 dark:bg-surface-darker/80 backdrop-blur-sm border border-cream-200 dark:border-surface-muted rounded-2xl p-8 text-center hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 dark:hover:shadow-primary/20 transition-all duration-300"
                            >
                                {/* Step number badge */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-white text-xs font-bold rounded-full shadow-lg shadow-primary/30">
                                        {step.number}
                                    </span>
                                </div>

                                {/* Icon */}
                                <div className="mt-4 mb-5 mx-auto p-4 bg-cream-200/50 dark:bg-surface-muted/50 rounded-2xl inline-block group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors duration-300">
                                    <div className="text-primary dark:text-primary-light">
                                        {step.icon}
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold text-text-dark dark:text-white mb-3">{step.title}</h3>
                                <p className="text-text-medium dark:text-stone-400 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </motion.div>

                            {/* Connector arrow (hidden on last item and mobile) */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 transform -translate-y-1/2">
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5 + index * 0.15 }}
                                        className="text-cream-400 dark:text-surface-muted"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </motion.div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
