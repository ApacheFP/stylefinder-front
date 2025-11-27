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

const ProductCarousel = ({ isOpen, onClose, items, initialIndex }: ProductCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [zoomLevel, setZoomLevel] = useState(1);

    const handleZoomToggle = () => {
        setZoomLevel(prev => prev === 1 ? 2 : 1);
    };

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
        }
    }, [isOpen, initialIndex]);

    const handlePrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    }, [items.length]);

    const handleNext = useCallback(() => {
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
        <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
            {/* Image Section */}
            {/* Image Section */}
            <div className="w-full md:w-[55%] bg-gray-50/80 dark:bg-gray-700/50 relative flex flex-col items-center justify-center p-0 overflow-hidden group">

                {/* Counter */}
                <div className="absolute top-6 left-6 bg-white/80 dark:bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-gray-600 dark:text-white/90 shadow-sm z-20 border border-white/20">
                    {currentIndex + 1} / {items.length}
                </div>

                {/* Zoom Toggle */}
                <button
                    onClick={handleZoomToggle}
                    className="absolute top-6 right-6 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full text-gray-600 dark:text-white/90 shadow-sm z-20 border border-white/20 hover:bg-white dark:hover:bg-black/70 transition-all"
                >
                    {zoomLevel > 1 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                </button>

                {/* Main Image Area */}
                <div className="w-full h-full flex items-center justify-center relative z-0 p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentItem.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{
                                opacity: 1,
                                scale: zoomLevel,
                                x: 0,
                                y: 0
                            }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            drag={zoomLevel === 1 ? "x" : false}
                            dragConstraints={zoomLevel === 1 ? { left: 0, right: 0 } : undefined}
                            dragElastic={0.2}
                            onDragEnd={zoomLevel === 1 ? onDragEnd : undefined}
                            className={`relative w-full h-full flex items-center justify-center ${zoomLevel > 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                            onTap={handleZoomToggle}
                        >
                            <img
                                src={currentItem.imageUrl}
                                alt={currentItem.name}
                                draggable="false"
                                onDragStart={(e) => e.preventDefault()}
                                className="max-w-full max-h-full object-contain drop-shadow-xl transition-transform duration-500 select-none"
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons (Desktop) - Minimal & Glass */}
                {items.length > 1 && zoomLevel === 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full text-gray-600 dark:text-white/90 shadow-sm z-20 border border-white/20 hover:bg-white dark:hover:bg-black/70 transition-all hidden md:flex"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full text-gray-600 dark:text-white/90 shadow-sm z-20 border border-white/20 hover:bg-white dark:hover:bg-black/70 transition-all hidden md:flex"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Glass Thumbnails - Floating at bottom */}
                {items.length > 1 && zoomLevel === 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/30 dark:bg-black/30 backdrop-blur-md border border-white/20 dark:border-white/10 p-1.5 rounded-2xl flex gap-2 shadow-lg z-20 max-w-[90%] overflow-x-auto scrollbar-hide">
                        {items.map((item, index) => (
                            <button
                                key={item.id}
                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                                className={`relative w-10 h-10 flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 ${index === currentIndex
                                    ? 'ring-2 ring-primary scale-110 z-10'
                                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                                    }`}
                            >
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-full h-full object-cover bg-white"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Details Section */}
            <div className="w-full md:w-[45%] p-6 md:p-8 flex flex-col bg-white dark:bg-gray-800 justify-center relative">
                {/* Close Button (Mobile) - Desktop handled by Modal */}
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
                            className="text-xs font-bold text-primary/80 uppercase tracking-widest mb-2"
                        >
                            {currentItem.brand}
                        </motion.div>
                    )}
                    <motion.h2
                        key={`title-${currentIndex}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight"
                    >
                        {currentItem.name}
                    </motion.h2>
                    <motion.p
                        key={`price-${currentIndex}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl font-bold text-primary dark:text-primary-light mb-6"
                    >
                        ${currentItem.price.toFixed(2)}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                    >
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            Elevate your style with this premium piece from {currentItem.brand || 'our collection'}. Designed for comfort and versatility, it's the perfect addition to your modern wardrobe.
                        </p>
                    </motion.div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-700">
                    {currentItem.link ? (
                        <button
                            onClick={() => window.open(currentItem.link, '_blank', 'noopener,noreferrer')}
                            className="w-full py-3.5 bg-primary text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-hover active:scale-95 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Shop Now
                        </button>
                    ) : (
                        <div className="w-full py-3.5 bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-sm font-medium rounded-xl text-center border border-gray-100 dark:border-gray-600">
                            Out of Stock
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ProductCarousel;
