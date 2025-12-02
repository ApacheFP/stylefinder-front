import { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, ShoppingBag, AlertTriangle, RefreshCw, Copy, Check } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../../types';
import ProductCard from '../ui/ProductCard';
import ProductCarousel from '../ui/ProductCarousel';
import Button from '../ui/Button';
import ImageAttachment from './ImageAttachment';
import { fadeInUp } from '../../utils/animations';

interface ChatMessageProps {
  message: ChatMessageType;
  onExplainOutfit: (messageId: string) => void;
  isLoadingExplanation?: boolean;
  onRetry?: (messageId: string, originalMessage: string, originalImage?: File) => void;
}

const ChatMessage = ({ message, onExplainOutfit, isLoadingExplanation, onRetry }: ChatMessageProps) => {
  if (message.outfit) {
    console.log(`DEBUG: ChatMessage ${message.id} has outfit with ${message.outfit.items.length} items`);
  }
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Copy message to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Handle error message display
  if (message.isError) {
    const handleRetry = async () => {
      if (!onRetry || !message.errorDetails) return;
      setIsRetrying(true);
      await onRetry(message.id, message.errorDetails.originalMessage, message.errorDetails.originalImage);
      setIsRetrying(false);
    };

    const errorTitle = message.errorDetails?.errorTitle || 'Something went wrong';
    const errorMsg = message.errorDetails?.errorMessage || 'We couldn\'t process your request. Please try again.';

    return (
      <motion.div
        className="flex justify-start mb-2"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        role="alert"
        aria-label="Error message"
      >
        <div className="max-w-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl rounded-bl-md px-5 py-4 shadow-md">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-roboto font-bold text-red-700 dark:text-red-400 mb-1">
                {errorTitle}
              </h4>
              <p className="font-inter text-sm text-red-600 dark:text-red-300 mb-3">
                {errorMsg}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                disabled={isRetrying}
                className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Retrying...' : 'Try Again'}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Format timestamp
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  if (message.role === 'user') {
    return (
      <motion.div
        className="flex flex-col items-end mb-2"
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
        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 mr-1">
          {formatTime(message.timestamp)}
        </span>
      </motion.div>
    );
  }

  const [showExplanation, setShowExplanation] = useState(false);

  // Handle explanation toggle
  const handleExplainClick = () => {
    if (message.outfit?.explanation) {
      setShowExplanation(!showExplanation);
    } else {
      onExplainOutfit(message.id);
    }
  };

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
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="max-w-4xl relative group">
        {/* Text content in bubble style */}
        {!message.outfit ? (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-5 py-3 shadow-md max-w-lg relative">
            <div className="font-inter text-text-dark dark:text-gray-100">{message.content}</div>

            {/* Copy button - appears on hover */}
            {showActions && message.content && (
              <button
                onClick={handleCopy}
                className="absolute -right-10 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Copy message"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                )}
              </button>
            )}
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

              {/* Explain Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExplainClick}
                disabled={isLoadingExplanation && !message.outfit.explanation}
                className="mb-4 rounded-lg"
                aria-label={showExplanation ? "Hide explanation" : "Explain this outfit"}
              >
                {isLoadingExplanation && !message.outfit.explanation ? (
                  <div className="flex items-center gap-2">
                    <span>Generating explanation</span>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-text-medium dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-text-medium dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-text-medium dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                ) : (
                  showExplanation ? 'Hide Explanation' : 'Explain this outfit'
                )}
              </Button>

              {/* Explanation - Show if it exists and is toggled on */}
              {message.outfit.explanation && showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-50 dark:bg-gray-700/50 border border-border dark:border-gray-600 rounded-xl p-6 mt-4 overflow-hidden"
                >
                  <h4 className="font-roboto font-bold text-text-dark dark:text-gray-100 mb-3">
                    Why this outfit works:
                  </h4>
                  <p className="font-inter text-text-dark dark:text-gray-200 leading-relaxed">
                    {message.outfit.explanation}
                  </p>
                </motion.div>
              )}
            </div>
          </>
        )}

        {/* Timestamp for assistant messages */}
        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 ml-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
