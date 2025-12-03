
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, ShoppingBag, AlertTriangle, RefreshCw, Copy, Check, Sparkles, User, Search } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../../types';
import ReactMarkdown from 'react-markdown';
import ProductCard from '../ui/ProductCard';
import ProductCarousel from '../ui/ProductCarousel';
import Button from '../ui/Button';
import OutfitExplanation from './OutfitExplanation';
import ImageAttachment from './ImageAttachment';
import { fadeInUp } from '../../utils/animations';
import { formatTime } from '../../utils/dateUtils';

interface ChatMessageProps {
  message: ChatMessageType;
  onExplainOutfit: (messageId: string) => void;
  isLoadingExplanation?: boolean;
  onRetry?: (messageId: string, originalMessage: string, originalImage?: File) => void;
}

const ChatMessage = ({ message, onExplainOutfit, isLoadingExplanation, onRetry }: ChatMessageProps) => {
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Track previous loading state to detect completion
  const prevIsLoadingRef = useRef(isLoadingExplanation);

  useEffect(() => {
    // If we were loading and now we're not, and we have an explanation, show it
    if (prevIsLoadingRef.current && !isLoadingExplanation && message.outfit?.explanation) {
      setShowExplanation(true);
    }
    prevIsLoadingRef.current = isLoadingExplanation;
  }, [isLoadingExplanation, message.outfit?.explanation]);

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

    // Check if this is a "no results" info message (not a real error)
    const isNoResults = errorTitle === 'No Results Found';

    if (isNoResults) {
      // Show as informational message, not as error
      return (
        <motion.div
          className="flex justify-start mb-6"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          role="status"
          aria-label="No results message"
        >
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 mt-1 mr-3">
            <Search className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>

          <div className="max-w-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm">
            <h4 className="font-roboto font-bold text-amber-700 dark:text-amber-400 mb-1">
              {errorTitle}
            </h4>
            <p className="font-inter text-sm text-amber-600 dark:text-amber-300 mb-3">
              {errorMsg}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={isRetrying}
              className="border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Searching...' : 'Try Different Request'}
            </Button>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        className="flex justify-start mb-6"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        role="alert"
        aria-label="Error message"
      >
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 mt-1 mr-3">
          <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
        </div>

        <div className="max-w-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm">
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
      </motion.div>
    );
  }



  if (message.role === 'user') {
    return (
      <motion.div
        className="flex justify-end mb-6"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        role="article"
        aria-label="User message"
      >
        <div className="flex flex-col items-end max-w-lg">
          <div className="bg-primary text-white font-inter px-5 py-3 rounded-2xl rounded-tr-none shadow-md">
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
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mt-1 ml-3">
          <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
      </motion.div>
    );
  }

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
      className="flex justify-start mb-8"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      role="article"
      aria-label="Assistant message"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0 mt-1 mr-3 shadow-md">
        <Sparkles className="w-4 h-4 text-white" />
      </div>

      <div className={`flex-1 min-w-0 max-w-3xl relative group`}>
        {/* Text content */}
        {!message.outfit ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm max-w-lg relative">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>

            {/* Copy button - appears on hover */}
            {showActions && message.content && (
              <button
                onClick={handleCopy}
                className="absolute -right-10 top-2 p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100"
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
          <div className="space-y-3">
            {/* Text bubble for messages with outfit - Full width to match outfit card */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm w-full">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>

            {/* Outfit card with products */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-lg shadow-gray-100/50 dark:shadow-black/20 w-full">
              {/* Outfit Header & Gallery Toggle */}
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-primary rounded-full"></div>
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wide">
                    Recommended Outfit
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProductIndex(0)}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary dark:text-primary-light hover:text-primary-hover dark:hover:text-primary transition-all bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/20 px-3 py-1.5 rounded-full group"
                  aria-label="View product gallery"
                >
                  <Maximize2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  View Gallery
                </button>
              </div>

              {/* Product Cards - Responsive Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
                {message.outfit.items.map((item, index) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    onImageClick={() => setSelectedProductIndex(index)}
                  />
                ))}
              </div>

              {/* Outfit Summary Box */}
              <div className="flex items-center justify-between mb-5 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-0.5">Estimated Total</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleShopAll}
                  className="gap-2 shadow-md hover:shadow-lg transition-all duration-200"
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
              <div className="flex justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExplainClick}
                  disabled={isLoadingExplanation && !message.outfit.explanation}
                  className={`
                    transition-all duration-200 rounded-full px-4 py-2 font-semibold text-sm flex items-center gap-2 cursor-pointer hover:scale-105
                    ${showExplanation
                      ? 'bg-primary text-white border-primary hover:bg-primary-hover'
                      : 'text-primary dark:text-primary-light border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/20'
                    }
                  `}
                  aria-label={showExplanation ? "Hide explanation" : "Explain this outfit"}
                >
                  {isLoadingExplanation && !message.outfit.explanation ? (
                    <>
                      <span>Generating</span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </>
                  ) : (
                    <span>{showExplanation ? 'Hide Explanation' : 'Why this outfit?'}</span>
                  )}
                </Button>
              </div>

              {/* Explanation - Show if it exists and is toggled on */}
              <OutfitExplanation
                explanation={message.outfit.explanation || ''}
                isVisible={showExplanation}
              />
            </div>
          </div>
        )}

        {/* Timestamp for assistant messages */}
        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 ml-1 block">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
