import { motion } from 'framer-motion';
import type { ChatMessage as ChatMessageType } from '../../types';
import ProductCard from '../ui/ProductCard';
import Button from '../ui/Button';
import { fadeInUp } from '../../utils/animations';

interface ChatMessageProps {
  message: ChatMessageType;
  onExplainOutfit: (messageId: string, outfitId: string) => void;
  isLoadingExplanation?: boolean;
}

const ChatMessage = ({ message, onExplainOutfit, isLoadingExplanation }: ChatMessageProps) => {
  if (message.role === 'user') {
    return (
      <motion.div
        className="flex justify-end"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="bg-primary text-white font-inter px-6 py-3 rounded-2xl max-w-3xl">
          {message.imageUrl && (
            <img
              src={message.imageUrl}
              alt="User uploaded"
              className="rounded-lg mb-2 max-w-xs max-h-64 object-cover"
            />
          )}
          {message.content}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex justify-start"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <div className="max-w-full">
        {/* Unified white background container */}
        <div className="bg-white border border-border rounded-2xl p-6">
          {/* Message content */}
          <div className="font-inter text-text-dark mb-4">{message.content}</div>

          {message.outfit && (
            <>
              {/* Product Cards - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 justify-items-center sm:justify-items-start">
                {message.outfit.items.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>

              {/* Explain Button - Only show if explanation doesn't exist */}
              {!message.outfit.explanation ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExplainOutfit(message.id, message.outfit!.id)}
                  disabled={isLoadingExplanation}
                  className="mb-4 rounded-lg"
                >
                  {isLoadingExplanation ? (
                    <div className="flex items-center gap-2">
                      <span>Generating explanation</span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-text-medium rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-text-medium rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-text-medium rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
                >
                  Explanation shown below
                </Button>
              )}

              {/* Explanation - Show if it exists */}
              {message.outfit.explanation && (
                <div className="bg-gray-50 border border-border rounded-xl p-6 mt-4">
                  <h4 className="font-roboto font-bold text-text-dark mb-3">
                    Why this outfit works:
                  </h4>
                  <p className="font-inter text-text-dark leading-relaxed">
                    {message.outfit.explanation}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
