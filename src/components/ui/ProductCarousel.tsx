import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag, X } from 'lucide-react';
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
    const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x > 100) {
            handlePrevious();
        } else if (info.offset.x < -100) {
            handleNext();
        }
    };

    const currentItem = items[currentIndex];

    if (!currentItem) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] bg-white rounded-2xl shadow-2xl">
            {/* Image Section */}
            <div className="w-full md:w-[55%] bg-gray-50/80 relative flex flex-col items-center justify-center p-6 md:p-8 overflow-hidden">

                {/* Counter */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-500 shadow-sm z-10">
                    {currentIndex + 1} / {items.length}
                </div>

                {/* Main Image with Swipe */}
                <div className="flex-1 w-full flex items-center justify-center min-h-[250px] relative z-0">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentItem.id}
                            src={currentItem.imageUrl}
                            alt={currentItem.name}
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={onDragEnd}
                            className="max-w-full max-h-[350px] object-contain mix-blend-multiply drop-shadow-md cursor-grab active:cursor-grabbing"
                        />
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons (Desktop) */}
                {items.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg text-gray-700 transition-all hover:scale-110 backdrop-blur-sm hidden md:flex"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg text-gray-700 transition-all hover:scale-110 backdrop-blur-sm hidden md:flex"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Thumbnails */}
                {items.length > 1 && (
                    <div className="mt-6 flex gap-2 overflow-x-auto max-w-full pb-2 px-2 scrollbar-hide snap-x">
                        {items.map((item, index) => (
                            <button
                                key={item.id}
                                onClick={() => setCurrentIndex(index)}
                                className={`relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all snap-center ${index === currentIndex
                                        ? 'border-primary shadow-md scale-105'
                                        : 'border-transparent opacity-60 hover:opacity-100'
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
            <div className="w-full md:w-[45%] p-6 md:p-8 flex flex-col bg-white justify-center relative">
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
                        className="text-2xl font-bold text-gray-900 mb-2 leading-tight"
                    >
                        {currentItem.name}
                    </motion.h2>
                    <motion.p
                        key={`price-${currentIndex}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl font-bold text-primary mb-6"
                    >
                        ${currentItem.price.toFixed(2)}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                    >
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Elevate your style with this premium piece from {currentItem.brand || 'our collection'}. Designed for comfort and versatility, it's the perfect addition to your modern wardrobe.
                        </p>
                    </motion.div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50">
                    {currentItem.link ? (
                        <button
                            onClick={() => window.open(currentItem.link, '_blank', 'noopener,noreferrer')}
                            className="w-full py-3.5 bg-primary text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-hover active:scale-95 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Shop Now
                        </button>
                    ) : (
                        <div className="w-full py-3.5 bg-gray-50 text-gray-400 text-sm font-medium rounded-xl text-center border border-gray-100">
                            Out of Stock
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ProductCarousel;
