import { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Image as ImageIcon } from 'lucide-react';
import ImageLightbox from '../ui/ImageLightbox';

interface ImageAttachmentProps {
    imageUrl: string;
    altText?: string;
}

const ImageAttachment = ({ imageUrl, altText = 'Attached image' }: ImageAttachmentProps) => {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    return (
        <>
            <motion.div
                className="relative group cursor-pointer overflow-hidden rounded-xl border border-white/10 shadow-sm max-w-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => !hasError && setIsLightboxOpen(true)}
            >
                {/* Loading State */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* Error State */}
                {hasError && (
                    <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center text-gray-400 gap-2 p-4">
                        <ImageIcon className="w-8 h-8" />
                        <span className="text-xs text-center">Failed to load image</span>
                    </div>
                )}

                {/* Image */}
                <img
                    src={imageUrl}
                    alt={altText}
                    className={`w-full h-auto max-h-64 object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setIsLoading(false);
                        setHasError(true);
                    }}
                />

                {/* Overlay on Hover */}
                {!isLoading && !hasError && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm">
                            <Maximize2 className="w-5 h-5" />
                        </div>
                    </div>
                )}
            </motion.div>

            <ImageLightbox
                isOpen={isLightboxOpen}
                imageUrl={imageUrl}
                altText={altText}
                onClose={() => setIsLightboxOpen(false)}
            />
        </>
    );
};

export default ImageAttachment;
