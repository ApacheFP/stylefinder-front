import { motion } from 'framer-motion';
import { MessageSquare, Shirt, ShoppingBag } from 'lucide-react';

const steps = [
    {
        number: "01",
        title: "Describe",
        description: "Tell the AI about your event, style, and budget.",
        icon: <MessageSquare className="w-6 h-6" />
    },
    {
        number: "02",
        title: "Discover",
        description: "Review curated outfits mixed from top brands.",
        icon: <Shirt className="w-6 h-6" />
    },
    {
        number: "03",
        title: "Buy it!",
        description: "Select your favorite pieces and shop immediately.",
        icon: <ShoppingBag className="w-6 h-6" />
    }
];

const HowItWorks = () => {
    return (
        <section className="py-24 bg-background-beige border-y border-stone-200">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-stretch">

                    <div className="md:w-1/3 flex flex-col justify-center">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-serif text-text-dark mb-6 leading-tight"
                        >
                            Effortless Style in <span className="italic text-secondary">Three Steps.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-text-medium leading-relaxed font-light"
                        >
                            We've simplified personal styling down to a science. No subscriptions, just results.
                        </motion.p>
                    </div>

                    <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="relative pt-12 border-t border-black/10 hover:border-black/30 transition-colors"
                            >
                                <div className="absolute top-0 left-0 -translate-y-1/2 bg-background-beige pr-4 text-xs font-bold uppercase tracking-widest text-text-muted">
                                    Step {step.number}
                                </div>

                                <div className="mb-6 text-primary">
                                    {step.icon}
                                </div>

                                <h3 className="text-xl font-serif font-bold text-text-dark mb-2">{step.title}</h3>
                                <p className="text-sm text-text-medium leading-relaxed font-light">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
