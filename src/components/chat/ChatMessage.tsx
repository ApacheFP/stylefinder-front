import { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, ShoppingBag } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../../types';
import ProductCard from '../ui/ProductCard';
import ProductCarousel from '../ui/ProductCarousel';
import Button from '../ui/Button';
import ImageAttachment from './ImageAttachment';
import { fadeInUp } from '../../utils/animations';

interface ChatMessageProps {
  message: ChatMessageType;
  onExplainOutfit: (messageId: string, outfitId: string) => void;
  isLoadingExplanation?: boolean;
}

const ChatMessage = ({ message, onExplainOutfit, isLoadingExplanation }: ChatMessageProps) => {
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);

  if (message.role === 'user') {
    return (
      <motion.div
        className="flex justify-end mb-2"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        role="article"
        aria-label="User message"
      >
        <div className="bg-primary text-white font-inter px-5 py-3 rounded-2xl rounded-br-md max-w-lg shadow-md">
          {message.imageUrl && (
            <div className="mb-3">
              <ImageAttachment imageUrl={message.imageUrl} altText="User uploaded" />
            </div>
          )}
          {message.content}
        </div>
      </motion.div>
    );
  }

  // Calculate total price for outfit
  const totalPrice = message.outfit?.items.reduce((sum, item) => sum + item.price, 0) || 0;

  const handleShopAll = () => {
    const itemsWithLinks = message.outfit?.items.filter(item => item.link) || [];

    // Open all links simultaneously
    itemsWithLinks.forEach((item) => {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    });
  };

  return (
    <motion.div
      className="flex justify-start mb-2"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      role="article"
      aria-label="Assistant message"
    >
      <div className="max-w-4xl">
        {/* Text content in bubble style */}
        {!message.outfit ? (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-5 py-3 shadow-md max-w-lg">
            <div className="font-inter text-text-dark dark:text-gray-100">{message.content}</div>
          </div>
        ) : (
          <>
            {/* Text bubble for messages with outfit */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-5 py-3 shadow-md mb-3 max-w-lg">
              <div className="font-inter text-text-dark dark:text-gray-100">{message.content}</div>
            </div>

            {/* Outfit card with products */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-5 shadow-md">
              {/* Outfit Header & Gallery Toggle */}
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Recommended Outfit
                </h3>
                <button
                  onClick={() => setSelectedProductIndex(0)}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary dark:text-primary-light hover:text-primary-hover dark:hover:text-primary transition-all bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/20 px-2.5 py-1.5 rounded-lg group"
                  aria-label="View product gallery"
                >
                  <Maximize2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  View Gallery
                </button>
              </div>

              {/* Product Cards - Responsive Flex */}
              <div className="flex flex-wrap gap-2 mb-4 justify-start">
                {message.outfit.items.map((item, index) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    onImageClick={() => setSelectedProductIndex(index)}
                  />
                ))}
              </div>

              {/* Outfit Summary Box */}
              <div className="flex items-center justify-between mb-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-700/30 dark:to-gray-700/10 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-0.5">Estimated Total</span>
                  <span className="text-xl font-bold text-primary dark:text-primary-light">${totalPrice.toFixed(2)}</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleShopAll}
                  className="gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shop All Items
                </Button>
              </div>

              {/* Product Carousel Modal */}
              <ProductCarousel
                isOpen={selectedProductIndex !== null}
                onClose={() => setSelectedProductIndex(null)}
                items={message.outfit.items}
                initialIndex={selectedProductIndex || 0}
              />

              {/* Explain Button - Only show if explanation doesn't exist */}
              {!message.outfit.explanation ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExplainOutfit(message.id, message.outfit!.id)}
                  disabled={isLoadingExplanation}
                  className="mb-4 rounded-lg"
                  aria-label="Explain this outfit"
                >
                  {isLoadingExplanation ? (
                    <div className="flex items-center gap-2">
                      <span>Generating explanation</span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-text-medium dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-text-medium dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-text-medium dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  ) : (
                    'Explain this outfit'
                  )}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="mb-4 rounded-lg opacity-50 cursor-not-allowed"
                  aria-label="Explanation already shown below"
                >
                  Explanation shown below
                </Button>
              )}

              {/* Explanation - Show if it exists */}
              {message.outfit.explanation && (
                <div className="bg-gray-50 dark:bg-gray-700/50 border border-border dark:border-gray-600 rounded-xl p-6 mt-4">
                  <h4 className="font-roboto font-bold text-text-dark dark:text-gray-100 mb-3">
                    Why this outfit works:
                  </h4>
                  <p className="font-inter text-text-dark dark:text-gray-200 leading-relaxed">
                    {message.outfit.explanation}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
