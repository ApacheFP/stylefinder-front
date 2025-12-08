import { motion } from 'framer-motion';

const brands = [
    { name: 'H&M', logo: '/assets/landing/logo-hm.png' },
    { name: 'Nike', logo: '/assets/landing/logo-nike.png' },
    { name: 'ZARA', logo: '/assets/landing/logo-zara.png' },
    { name: 'adidas', logo: '/assets/landing/logo-adidas.png' },
    { name: 'Mango', logo: '/assets/landing/logo-mango.png' },
];

const BrandsSection = () => {
    return (
        <section className="py-10 bg-cream-50 dark:bg-surface-dark border-y border-cream-200 dark:border-surface-muted">
            <div className="container mx-auto px-4">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center text-text-muted dark:text-stone-500 text-xs font-medium uppercase tracking-[0.2em] mb-8"
                >
                    Curated from World-Class Brands
                </motion.p>

                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
                    {brands.map((brand, index) => (
                        <motion.div
                            key={brand.name}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.1, y: -2 }}
                            className="w-24 md:w-32 h-12 flex items-center justify-center grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300 cursor-pointer"
                        >
                            <img
                                src={brand.logo}
                                alt={`${brand.name} logo`}
                                className="max-w-full max-h-full object-contain"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandsSection;
