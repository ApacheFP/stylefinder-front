import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag, X, ZoomIn, ZoomOut } from 'lucide-react';
import type { OutfitItem } from '../../types';
import Modal from './Modal';

interface ProductCarouselProps {
    isOpen: boolean;
    onClose: () => void;
    items: OutfitItem[];
    initialIndex: number;
}

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.95,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.95,
    })
};

const ProductCarousel = ({ isOpen, onClose, items, initialIndex }: ProductCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [direction, setDirection] = useState(0);

    const handleZoomToggle = () => {
        setZoomLevel(prev => prev === 1 ? 2 : 1);
    };

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            setDirection(0);
        }
    }, [isOpen, initialIndex]);

    const handlePrevious = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    }, [items.length]);

    const handleNext = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, [items.length]);

    // Keyboard Navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handlePrevious, handleNext, onClose]);

    // Swipe Gesture
    const onDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x > 100) {
            handlePrevious();
        } else if (info.offset.x < -100) {
            handleNext();
        }
    };

    const currentItem = items[currentIndex];

    if (!currentItem) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-5xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700">
            {/* Image Section */}
            <div className="w-full md:w-[60%] bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 relative flex flex-col items-center justify-center p-0 overflow-hidden group">

                {/* Counter - Glassmorphism */}
                <div className="absolute top-6 left-6 bg-white/40 dark:bg-black/40 backdrop-blur-lg px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 dark:text-white/90 shadow-sm z-20 border border-white/20">
                    {currentIndex + 1} / {items.length}
                </div>

                {/* Zoom Toggle - Glassmorphism */}
                <button
                    onClick={handleZoomToggle}
                    className="absolute top-6 right-6 p-2.5 bg-white/40 dark:bg-black/40 backdrop-blur-lg rounded-full text-gray-700 dark:text-white/90 shadow-sm z-20 border border-white/20 hover:bg-white/60 dark:hover:bg-black/60 transition-all active:scale-95"
                >
                    {zoomLevel > 1 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                </button>

                {/* Main Image Area */}
                <div className="w-full h-full flex items-center justify-center relative z-0 p-8 md:p-12">
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 280, damping: 28 },
                                opacity: { duration: 0.25 }
                            }}
                            drag={zoomLevel === 1 ? "x" : false}
                            dragConstraints={zoomLevel === 1 ? { left: 0, right: 0 } : undefined}
                            dragElastic={1}
                            onDragEnd={zoomLevel === 1 ? onDragEnd : undefined}
                            className={`relative w-full h-full flex items-center justify-center ${zoomLevel > 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                            onTap={handleZoomToggle}
                        >
                            <motion.img
                                src={currentItem.imageUrl}
                                alt={currentItem.name}
                                draggable="false"
                                animate={{ scale: zoomLevel }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                onDragStart={(e) => e.preventDefault()}
                                className="max-w-full max-h-full object-contain drop-shadow-2xl select-none"
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons (Desktop) - Fade in on hover */}
                {items.length > 1 && zoomLevel === 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3.5 bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-full text-gray-800 dark:text-white shadow-lg z-20 border border-white/40 hover:bg-white/50 dark:hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 hidden md:flex hover:scale-110 active:scale-95"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3.5 bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-full text-gray-800 dark:text-white shadow-lg z-20 border border-white/40 hover:bg-white/50 dark:hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 hidden md:flex hover:scale-110 active:scale-95"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Glass Thumbnails - Floating at bottom */}
                {items.length > 1 && zoomLevel === 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 dark:border-white/10 p-2 rounded-2xl flex gap-3 shadow-2xl z-20 max-w-[90%] overflow-x-auto scrollbar-hide">
                        {items.map((item, index) => (
                            <button
                                key={item.id}
                                onClick={(e) => { e.stopPropagation(); setDirection(index > currentIndex ? 1 : -1); setCurrentIndex(index); }}
                                className="relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden group/thumb"
                            >
                                {index === currentIndex && (
                                    <motion.div
                                        layoutId="active-thumb"
                                        className="absolute inset-0 border-2 border-primary rounded-xl z-10"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className={`w-full h-full object-cover bg-white transition-opacity duration-300 ${index === currentIndex ? 'opacity-100' : 'opacity-60 group-hover/thumb:opacity-100'}`}
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Details Section */}
            <div className="w-full md:w-[40%] p-8 md:p-10 flex flex-col bg-white dark:bg-gray-900 justify-center relative border-l border-gray-100 dark:border-gray-800">
                {/* Close Button (Mobile) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 md:hidden"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex-1 flex flex-col justify-center">
                    {currentItem.brand && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={`brand-${currentIndex}`}
                            className="text-[10px] font-bold text-primary/80 uppercase tracking-[0.2em] mb-3"
                        >
                            {currentItem.brand}
                        </motion.div>
                    )}
                    <motion.h2
                        key={`title-${currentIndex}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight font-display"
                    >
                        {currentItem.name}
                    </motion.h2>
                    <motion.div
                        key={`price-${currentIndex}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover mb-6"
                    >
                        ${currentItem.price.toFixed(2)}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed font-light">
                            Elevate your style with this premium piece from <span className="font-medium text-gray-700 dark:text-gray-300">{currentItem.brand || 'our collection'}</span>. Designed for comfort and versatility, it's the perfect addition to your modern wardrobe.
                        </p>
                    </motion.div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-50 dark:border-gray-800">
                    {currentItem.link ? (
                        <a
                            href={currentItem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="group relative w-full py-4 bg-primary text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 active:scale-[0.98] hover:bg-primary-hover"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out" />
                            <ShoppingBag className="w-4 h-4 relative z-10" />
                            <span className="relative z-10">Shop Now</span>
                        </a>
                    ) : (
                        <div className="w-full py-4 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-sm font-medium rounded-xl text-center border border-gray-100 dark:border-gray-700 cursor-not-allowed">
                            Out of Stock
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ProductCarousel;
