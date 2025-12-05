import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ImageOff, Maximize2 } from 'lucide-react';
import type { OutfitItem } from '../../types';

interface ProductCardProps {
  item: OutfitItem;
  onImageClick?: () => void;
}

const ProductCard = ({ item, onImageClick }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleShopClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.link) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  };

  const hasLink = !!item.link;

  return (
    <motion.div
      className="bg-cream-100 dark:bg-surface-darker rounded-xl shadow-sm border border-cream-300 dark:border-surface-border overflow-hidden hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-300 w-full flex-shrink-0 group cursor-pointer relative"
      whileHover={{}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onImageClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image with gradient background */}
      <div className="w-full h-[130px] bg-gradient-to-b from-cream-100 to-cream-50 dark:from-surface-darker dark:to-surface-dark flex items-center justify-center overflow-hidden relative">
        {item.imageUrl && !imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-cream-200 via-cream-100 to-cream-200 dark:from-surface-muted dark:via-surface-darker dark:to-surface-muted">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            )}
            <motion.img
              src={item.imageUrl}
              alt={item.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="max-w-[90%] max-h-[90%] object-contain transition-all duration-300 rounded-lg bg-white p-1 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{
                opacity: imageLoaded ? (isHovered ? 0.4 : 1) : 0,
                scale: isHovered ? 1.05 : 1
              }}
              transition={{ duration: 0.3 }}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />

            {/* Centered Expand overlay on hover */}
            <AnimatePresence>
              {isHovered && imageLoaded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="p-3 bg-cream-100/80 dark:bg-surface-dark/80 backdrop-blur-md rounded-full shadow-lg border border-white/50 dark:border-surface-muted/50">
                    <Maximize2 className="w-5 h-5 text-primary dark:text-primary-light" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="p-2.5 bg-cream-200 dark:bg-surface-muted rounded-full">
              <ImageOff className="w-5 h-5 text-text-muted dark:text-stone-500" />
            </div>
          </div>
        )}


        {/* Availability Badge */}
        {item.available === false ? (
          <div className="absolute top-2 right-2 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm border-2 border-red-500 text-red-600 dark:text-red-400 text-[9px] font-bold px-2 py-1 rounded-full shadow-sm z-10 flex items-center justify-center leading-none">
            OUT OF STOCK
          </div>
        ) : (
          <div className="absolute top-2 right-2 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm border-2 border-green-500 text-green-600 dark:text-green-400 text-[9px] font-bold px-2 py-1 rounded-full shadow-sm z-10 flex items-center justify-center leading-none">
            IN STOCK
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 space-y-1.5">
        {/* Brand with glassmorphism */}
        {item.brand && (
          <div className="inline-flex">
            <span className="text-[8px] font-bold text-primary dark:text-primary-light uppercase tracking-wider px-1.5 py-0.5 bg-primary/10 dark:bg-primary/20 backdrop-blur-sm rounded-md border border-primary/20 dark:border-primary/30">
              {item.brand}
            </span>
          </div>
        )}

        {/* Product name */}
        <h3 className="font-medium text-[11px] text-gray-800 dark:text-stone-100 line-clamp-2 leading-tight min-h-[2.2em]">
          {item.name}
        </h3>

        {/* Price and Shop */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-primary dark:text-primary-light font-bold text-[13.5px]">
            ${item.price.toFixed(2)}
          </span>

          {hasLink ? (
            <motion.button
              onClick={handleShopClick}
              whileHover={item.available !== false ? { scale: 1.05 } : {}}
              whileTap={item.available !== false ? { scale: 0.95 } : {}}
              disabled={item.available === false}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-md flex items-center gap-1 transition-colors ${item.available === false
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-hover'
                }`}
              aria-label={`Shop ${item.name}`}
            >
              <ShoppingBag className="w-2.5 h-2.5" />
              <span>{item.available === false ? 'Sold Out' : 'Shop'}</span>
            </motion.button>
          ) : (
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-surface-muted text-gray-400 text-[10px] font-medium rounded-md">
              N/A
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
