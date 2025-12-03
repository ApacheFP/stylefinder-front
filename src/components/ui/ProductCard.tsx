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
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 overflow-hidden hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-300 w-full flex-shrink-0 group cursor-pointer relative"
      whileHover={{}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onImageClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image with gradient background */}
      <div className="w-full h-[130px] bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden relative">
        {item.imageUrl && !imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/20 to-transparent"
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
              className="max-w-[90%] max-h-[90%] object-contain transition-all duration-300 mix-blend-multiply dark:mix-blend-normal"
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
                  <div className="p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full shadow-lg border border-white/50 dark:border-gray-700/50">
                    <Maximize2 className="w-5 h-5 text-primary dark:text-primary-light" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-full">
              <ImageOff className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        )}


        {/* Availability Badge */}
        {item.available === false ? (
          <div className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
            OUT OF STOCK
          </div>
        ) : (
          <div className="absolute top-2 right-2 bg-green-500/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
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
        <h3 className="font-medium text-[11px] text-gray-800 dark:text-gray-100 line-clamp-2 leading-tight min-h-[2.2em]">
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
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-400 text-[10px] font-medium rounded-md">
              N/A
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
