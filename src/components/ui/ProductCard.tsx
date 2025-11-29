import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ImageOff } from 'lucide-react';
import type { OutfitItem } from '../../types';
import Tooltip from './Tooltip';

interface ProductCardProps {
  item: OutfitItem;
  onImageClick?: () => void;
}

const ProductCard = ({ item, onImageClick }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleShopClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    if (item.link) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 300);
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  };

  const hasLink = !!item.link;

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 overflow-hidden hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20 dark:hover:ring-primary/30 transition-all duration-300 w-[160px] flex-shrink-0 group cursor-pointer relative"
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onImageClick}
    >
      {/* Brand bar at top */}
      {item.brand && (
        <div className="px-2 py-0.5 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:from-gray-700/50 dark:via-gray-700/70 dark:to-gray-700/50 border-b border-gray-200 dark:border-gray-600 text-center">
          <span className="text-[10px] font-bold text-gray-700 dark:text-gray-100 uppercase tracking-wider truncate block">
            {item.brand}
          </span>
        </div>
      )}

      {/* Image */}
      <div
        className={`w-full h-[120px] bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden relative`}
      >
        {item.imageUrl && !imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            )}
            <motion.img
              src={item.imageUrl}
              alt={item.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-110"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: imageLoaded ? 1 : 0,
                scale: imageLoaded ? 1 : 0.95
              }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center gap-2">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
              <ImageOff className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5">
        {/* Product name with tooltip */}
        <Tooltip content={item.name} position="top">
          <h3 className="font-medium text-xs text-gray-800 dark:text-gray-100 line-clamp-2 leading-snug mb-2 h-[2.4em]">
            {item.name}
          </h3>
        </Tooltip>

        {/* Price and Shop button on same line */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-primary dark:text-primary-light font-bold text-sm">
            ${item.price.toFixed(2)}
          </p>

          {hasLink ? (
            <button
              onClick={handleShopClick}
              className={`px-2 py-1.5 bg-primary text-white text-[10px] font-semibold rounded-lg flex items-center gap-1 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all duration-200 shadow-md ${isClicked ? 'animate-pulse-once' : ''
                }`}
              aria-label={`Shop ${item.name}`}
              title="Shop"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>Shop</span>
            </button>
          ) : (
            <div className="px-2 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-[10px] font-medium rounded-lg flex items-center gap-1 opacity-50">
              <ShoppingBag className="w-3 h-3" />
              <span>Shop</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
