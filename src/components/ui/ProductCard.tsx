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
      className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 w-[160px] flex-shrink-0 card-lift"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Brand */}
      {item.brand && (
        <div className="px-3 py-1 bg-gray-50 border-b border-gray-100 text-center">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            {item.brand}
          </span>
        </div>
      )}

      {/* Image */}
      <div
        className={`w-full h-[130px] bg-white flex items-center justify-center overflow-hidden relative ${onImageClick ? 'cursor-pointer' : ''}`}
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
          <ShoppingBag className="w-8 h-8 text-gray-200" />
        )}
      </div>

      {/* Info */}
      <div className="p-3 pt-1">
        <h3 className="font-medium text-[13px] text-gray-800 line-clamp-2 leading-snug mb-2 h-[2.4em]">
          {item.name}
        </h3>

        <p className="text-primary font-bold text-base mb-3">
          ${item.price.toFixed(2)}
        </p>

        {/* Button */}
        {hasLink ? (
          <button
            onClick={handleShopClick}
            className="w-full py-2 bg-primary text-white text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 hover:bg-primary-hover active:scale-95 transition-all shadow-sm hover:shadow"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Shop this item
          </button>
        ) : (
          <div className="w-full py-2 bg-gray-100 text-gray-400 text-xs font-medium rounded-md text-center">
            Out of stock
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
