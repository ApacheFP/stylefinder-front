import { motion } from 'framer-motion';
import { Plus, ArrowRight, ShoppingBag, Image, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const DemoPreview = () => {
    const mockChatHistory = [
        'Job Interview Outfit',
        'Summer Wedding Out...',
        'Summer Night Beach...',
        'Elegant Summer Wed...',
        'Casual weekend outfit',
    ];

    const mockProducts = [
        { name: 'Regular Fit Linen Blend Shirt', brand: 'ZARA', price: '$34.99', inStock: true },
        { name: 'Moccasin Suede Loafers', brand: 'Mango', price: '$44.99', inStock: true },
        { name: 'Slim Fit 5-Pocket Pants', brand: 'H&M', price: '$29.99', inStock: true },
        { name: 'Metal Link Bracelet', brand: 'COS', price: '$35.90', inStock: true },
    ];

    return (
        <section className="py-20 md:py-28 bg-gradient-to-b from-cream-100 to-cream-50 dark:from-surface-darker dark:to-surface-dark relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-1/2 right-0 w-64 h-64 bg-secondary/5 dark:bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-medium uppercase tracking-[0.2em] text-primary dark:text-primary-light mb-4"
                    >
                        See It In Action
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl lg:text-5xl font-serif text-text-dark dark:text-white leading-tight"
                    >
                        Your AI Stylist <span className="italic bg-gradient-to-r from-primary via-secondary to-primary dark:from-primary-light dark:via-primary dark:to-primary-light bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">Awaits</span>
                    </motion.h2>
                </div>

                {/* Demo Container */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-5xl mx-auto"
                >
                    {/* Browser Mockup */}
                    <div className="bg-cream-50 dark:bg-surface-dark rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 border border-cream-200 dark:border-surface-muted overflow-hidden">
                        {/* Browser Header */}
                        <div className="bg-cream-100 dark:bg-surface-darker border-b border-cream-200 dark:border-surface-muted px-4 py-3 flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="bg-cream-200 dark:bg-surface-muted rounded-lg px-4 py-1.5 text-xs text-text-muted dark:text-stone-500 flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-primary flex items-center justify-center">
                                        <span className="text-white text-[6px] font-bold">S</span>
                                    </div>
                                    stylefinder.ai/chat
                                </div>
                            </div>
                        </div>

                        {/* App Interface */}
                        <div className="flex min-h-[450px]">
                            {/* Sidebar */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="hidden md:block w-56 bg-cream-100/50 dark:bg-surface-darker border-r border-cream-200 dark:border-surface-muted p-3"
                            >
                                {/* New Chat Button */}
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 px-3 py-2 bg-cream-200/50 dark:bg-surface-muted rounded-lg text-xs text-text-medium dark:text-stone-400">
                                        <Plus className="w-3 h-3" />
                                        New Chat
                                    </div>
                                </div>

                                {/* History Label */}
                                <p className="text-[10px] uppercase tracking-wider text-text-muted dark:text-stone-500 px-2 mb-2">History</p>

                                {/* Chat History */}
                                <div className="space-y-1">
                                    {mockChatHistory.map((chat, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 + index * 0.05 }}
                                            className={`px-3 py-2 rounded-lg text-xs truncate cursor-pointer transition-colors ${index === 1
                                                ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light font-medium'
                                                : 'text-text-medium dark:text-stone-400 hover:bg-cream-200/50 dark:hover:bg-surface-muted'
                                                }`}
                                        >
                                            {chat}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Main Chat Area */}
                            <div className="flex-1 flex flex-col">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-cream-200 dark:border-surface-muted">
                                    <span className="text-sm font-semibold text-text-dark dark:text-white">StyleFinder AI</span>
                                    <span className="text-xs font-medium text-text-medium dark:text-stone-400 truncate max-w-[150px]">Elegant Summer Wed...</span>
                                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">J</span>
                                    </div>
                                </div>

                                {/* Chat Content */}
                                <div className="flex-1 p-4 space-y-4 overflow-hidden">
                                    {/* User Message */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.4 }}
                                        className="flex justify-end"
                                    >
                                        <div className="bg-primary text-white px-4 py-2.5 rounded-2xl rounded-br-md max-w-[85%] text-xs shadow-md">
                                            I need an elegant outfit for a summer wedding, budget around $300
                                        </div>
                                    </motion.div>

                                    {/* AI Response */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.6 }}
                                        className="flex justify-start"
                                    >
                                        <div className="bg-cream-100 dark:bg-surface-darker border border-cream-200 dark:border-surface-muted rounded-2xl rounded-bl-md max-w-[95%] p-4 shadow-sm">
                                            <p className="text-xs text-text-dark dark:text-stone-200 mb-3">
                                                Here are your outfit options.
                                            </p>

                                            {/* Recommended Outfit Card */}
                                            <div className="bg-white dark:bg-surface-dark rounded-xl border border-cream-200 dark:border-surface-muted p-3">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-dark dark:text-stone-200">Recommended Outfit</span>
                                                    <div className="flex items-center gap-1 text-primary dark:text-primary-light text-[10px]">
                                                        <Eye className="w-3 h-3" />
                                                        View Gallery
                                                    </div>
                                                </div>

                                                {/* Product Cards Grid */}
                                                <div className="grid grid-cols-4 gap-2 mb-3">
                                                    {mockProducts.map((product, index) => (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            whileInView={{ opacity: 1, y: 0 }}
                                                            viewport={{ once: true }}
                                                            transition={{ delay: 0.8 + index * 0.1 }}
                                                            className="bg-cream-50 dark:bg-surface-darker rounded-lg p-2 border border-cream-200 dark:border-surface-muted"
                                                        >
                                                            {/* Stock Badge */}
                                                            <div className="flex justify-end mb-1">
                                                                <span className="text-[6px] px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full font-bold uppercase border border-green-200 dark:border-green-700">
                                                                    In Stock
                                                                </span>
                                                            </div>

                                                            {/* Product Image Placeholder */}
                                                            <div className="w-full h-12 bg-gradient-to-br from-cream-200 to-cream-100 dark:from-surface-muted dark:to-surface-dark rounded-md mb-2 flex items-center justify-center">
                                                                <Image className="w-4 h-4 text-cream-400 dark:text-stone-600" />
                                                            </div>

                                                            {/* Product Info */}
                                                            <p className="text-[7px] text-primary dark:text-primary-light font-bold uppercase mb-0.5">{product.brand}</p>
                                                            <p className="text-[8px] text-text-dark dark:text-stone-200 font-medium truncate mb-1">{product.name}</p>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[9px] text-primary dark:text-primary-light font-bold">{product.price}</span>
                                                                <span className="text-[6px] px-1.5 py-0.5 bg-primary text-white rounded font-medium flex items-center gap-0.5">
                                                                    <ShoppingBag className="w-2 h-2" />
                                                                    Shop
                                                                </span>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>

                                                {/* Estimated Total and Actions */}
                                                <div className="pt-2 border-t border-cream-200 dark:border-surface-muted">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div>
                                                            <p className="text-[8px] text-text-muted dark:text-stone-500 uppercase">Estimated Total</p>
                                                            <p className="text-sm font-bold text-text-dark dark:text-white">$149.87</p>
                                                        </div>
                                                        <span className="text-[8px] px-2.5 py-1.5 bg-primary text-white rounded-lg flex items-center gap-1 font-medium">
                                                            <ShoppingBag className="w-2.5 h-2.5" />
                                                            Shop All Items
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[8px] px-3 py-1.5 bg-white dark:bg-surface-dark text-text-dark dark:text-stone-200 rounded-lg border border-cream-300 dark:border-surface-muted font-medium">Why this outfit?</span>
                                                        <span className="text-[8px] px-3 py-1.5 bg-white dark:bg-surface-dark text-text-dark dark:text-stone-200 rounded-lg border border-cream-300 dark:border-surface-muted font-medium">Select to modify</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Input Area */}
                                <div className="p-4 border-t border-cream-200 dark:border-surface-muted">
                                    <div className="flex items-center gap-2 px-4 py-3 bg-cream-100 dark:bg-surface-darker rounded-xl border border-cream-200 dark:border-surface-muted">
                                        <Plus className="w-4 h-4 text-text-muted dark:text-stone-500" />
                                        <span className="text-xs text-text-muted dark:text-stone-500">Describe your ideal outfit or upload a photo...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA under demo */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1 }}
                        className="text-center mt-10"
                    >
                        <Link to="/chat">
                            <motion.button
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary-hover rounded-xl px-8 py-4 text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all group"
                            >
                                Try It Yourself
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default DemoPreview;
