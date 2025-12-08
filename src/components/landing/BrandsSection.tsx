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
        <section className="py-12 border-b border-border/50 bg-white">
            <div className="container mx-auto px-4">
                <p className="text-center text-text-lighter text-sm font-medium uppercase tracking-widest mb-8">
                    Trusted Brands & Retailers
                </p>

                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    {brands.map((brand, index) => (
                        <motion.div
                            key={brand.name}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="w-32 md:w-40 h-16 flex items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
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
