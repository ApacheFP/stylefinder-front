import { motion } from 'framer-motion';
import { Sparkles, Shirt, Briefcase, PartyPopper } from 'lucide-react';
import { staggerContainer, staggerItem } from '../../utils/animations';

interface ChatEmptyStateProps {
  isLoggedIn: boolean;
  userName: string;
  onSuggestionClick?: (suggestion: string) => void;
}

const SUGGESTIONS = [
  {
    icon: Briefcase,
    text: 'Professional outfit for job interview',
    prompt: 'I need a professional outfit for a job interview, budget max 250€',
  },
  {
    icon: PartyPopper,
    text: 'Casual outfit for weekend',
    prompt: 'Show me a casual outfit for the weekend, something comfortable and stylish',
  },
  {
    icon: Shirt,
    text: 'Summer wedding guest look',
    prompt: 'I need an elegant outfit for a summer wedding, budget around 300€',
  },
];

const ChatEmptyState = ({ isLoggedIn, userName, onSuggestionClick }: ChatEmptyStateProps) => {
  // 🔧 FEATURE: Suggestions disabled by default (can be enabled via prop)
  const showSuggestions = !!onSuggestionClick;

  return (
    <motion.div
      className="h-full flex flex-col items-center justify-center text-center px-4"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Title */}
      <motion.div variants={staggerItem} className="mb-6">
        {isLoggedIn ? (
          <>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <h2 className="text-[32px] font-roboto font-bold text-text-dark">
                Hi {userName}!
              </h2>
            </div>
            <p className="font-inter text-[16px] text-text-light">
              {showSuggestions ? 'What style are you looking for today?' : 'How can I help you today?'}
            </p>
          </>
        ) : (
          <>
            <h2 className="text-[32px] font-roboto font-bold text-text-medium mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              StyleFinder AI
            </h2>
            <p className="font-inter text-[16px] text-text-light">
              Ask me for a style tip to get started
            </p>
          </>
        )}
      </motion.div>

      {/* Suggestions - Only show if enabled */}
      {showSuggestions && (
        <motion.div
          variants={staggerItem}
          className="max-w-2xl w-full mt-4"
        >
          <p className="text-sm font-inter text-text-medium mb-4">
            Try one of these:
          </p>
          <div className="grid gap-3">
            {SUGGESTIONS.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <motion.button
                  key={index}
                  onClick={() => onSuggestionClick?.(suggestion.prompt)}
                  className="flex items-center gap-3 p-4 bg-white border border-border rounded-xl hover:border-primary hover:shadow-md transition-all text-left group"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-inter text-[15px] text-text-dark group-hover:text-primary transition-colors">
                    {suggestion.text}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Tip - Only show if suggestions are enabled */}
      {showSuggestions && (
        <motion.p
          variants={staggerItem}
          className="mt-8 text-xs font-inter text-text-light max-w-md"
        >
          💡 Tip: You can also upload an image to get style recommendations based on what you like!
        </motion.p>
      )}
    </motion.div>
  );
};

export default ChatEmptyState;
