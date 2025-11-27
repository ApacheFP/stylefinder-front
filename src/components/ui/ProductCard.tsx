import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import type { OutfitItem } from '../../types';

interface ProductCardProps {
  item: OutfitItem;
  onImageClick?: () => void;
}

const ProductCard = ({ item, onImageClick }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleShopClick = () => {
    if (item.link) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  };

  const hasLink = !!item.link;

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl dark:hover:shadow-primary/5 transition-all duration-300 w-[160px] flex-shrink-0 group cursor-pointer relative"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >  {item.brand && (
      <div className="px-2 py-0.5 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 text-center">
        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider truncate block">
          {item.brand}
        </span>
      </div>
    )}

      {/* Image */}
      <div
        className={`w-full h-[110px] bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden relative ${onImageClick ? 'cursor-pointer' : ''}`}
        onClick={onImageClick}
      >
        {item.imageUrl && !imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-50 animate-pulse" />
            )}
            <img
              src={item.imageUrl}
              alt={item.name}
              className={`max-w-[85%] max-h-[85%] object-contain transition-all duration-300 ease-out group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <div className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-center mb-0.5">
              {item.brand}
            </div>
            <h3 className="font-inter font-medium text-text-dark dark:text-white text-xs leading-tight line-clamp-2 mb-1 min-h-[2.5em] text-center" title={item.name}>
              {item.name}
            </h3>
            <div className="flex items-center justify-between mt-auto pt-1 border-t border-gray-50 dark:border-gray-700">
              <span className="font-roboto font-bold text-primary text-sm">
                ${item.price.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2 pt-1">
        <h3 className="font-medium text-xs text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug mb-1.5 h-[2.4em]">
          {item.name}
        </h3>

        <p className="text-primary dark:text-primary-light font-bold text-sm mb-2">
          ${item.price.toFixed(2)}
        </p>

        {/* Button */}
        {hasLink ? (
          <button
            onClick={handleShopClick}
            className="w-full py-1.5 bg-primary text-white text-[10px] font-semibold rounded flex items-center justify-center gap-1 hover:bg-primary-hover active:scale-95 transition-all shadow-sm hover:shadow"
          >
            <ShoppingBag className="w-3 h-3" />
            Shop
          </button>
        ) : (
          <div className="w-full py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-[10px] font-medium rounded text-center">
            Out of stock
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
