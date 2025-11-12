import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { OutfitItem } from '../../types';
import { tapScale } from '../../utils/animations';

interface ProductCardProps {
  item: OutfitItem;
}

const ProductCard = ({ item }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    if (item.link) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl border border-border overflow-hidden transition-all duration-500 ease-out max-w-[200px] cursor-pointer group hover:shadow-2xl hover:border-primary/30"
      whileHover={{ scale: 1.03, y: -6 }}
      whileTap={tapScale}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="w-full h-[200px] bg-gray-100 flex items-center justify-center relative overflow-hidden">
        {item.imageUrl && !imageError ? (
          <>
            {/* Blur Placeholder - shown while loading */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
            )}
            
            {/* Actual Image */}
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              } group-hover:scale-110`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              style={{ transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.7s ease-out' }}
            />

            {/* View on Store Overlay - shown only on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out flex flex-col items-center justify-end pb-6 gap-2">
              <ExternalLink className="w-6 h-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out" />
              <span className="text-white text-sm font-inter font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out delay-75">
                View on store
              </span>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col items-center justify-center gap-2 group-hover:from-primary/10 group-hover:to-primary/5 transition-colors">
            <ExternalLink className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
            <span className="text-gray-400 text-xs font-inter group-hover:text-primary transition-colors">No image</span>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4 bg-white">
        {/* Brand Badge */}
        {item.brand && (
          <div className="mb-2">
            <span className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-[11px] font-inter font-semibold rounded-md uppercase tracking-wider">
              {item.brand}
            </span>
          </div>
        )}
        
        {/* Product Name */}
        <h3 className="font-roboto font-bold text-[15px] text-text-dark mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300">
          {item.name}
        </h3>
        
        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-primary font-roboto font-bold text-lg">
            €{item.price.toFixed(0)}
          </span>
          {item.price % 1 !== 0 && (
            <span className="text-primary font-roboto font-bold text-sm">
              .{item.price.toFixed(2).split('.')[1]}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
