import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ImageLightboxProps {
    isOpen: boolean;
    imageUrl: string;
    altText?: string;
    onClose: () => void;
}

const ImageLightbox = ({ isOpen, imageUrl, altText = 'Image', onClose }: ImageLightboxProps) => {
    const [scale, setScale] = useState(1);

    // Reset scale when opening new image
    useEffect(() => {
        if (isOpen) setScale(1);
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleZoomIn = (e: React.MouseEvent) => {
        e.stopPropagation();
        setScale(prev => Math.min(prev + 0.5, 3));
    };

    const handleZoomOut = (e: React.MouseEvent) => {
        e.stopPropagation();
        setScale(prev => Math.max(prev - 0.5, 1));
    };

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `stylefinder-image-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download image:', error);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    onClick={onClose}
                >
                    {/* Controls */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
                        <button
                            onClick={handleZoomOut}
                            className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                            title="Zoom Out"
                            disabled={scale <= 1}
                        >
                            <ZoomOut className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleZoomIn}
                            className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                            title="Zoom In"
                            disabled={scale >= 3}
                        >
                            <ZoomIn className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                            title="Download"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors ml-2"
                            title="Close"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Image */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full h-full flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.img
                            src={imageUrl}
                            alt={altText}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            animate={{ scale }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            drag
                            dragConstraints={{ left: -100 * scale, right: 100 * scale, top: -100 * scale, bottom: 100 * scale }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ImageLightbox;
