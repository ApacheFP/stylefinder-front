import { motion } from 'framer-motion';
import { Sparkles, Shirt, Briefcase, PartyPopper, Search, Layers } from 'lucide-react';
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
  // 🔧 FEATURE: Suggestions enabled by default if handler provided
  const showSuggestions = !!onSuggestionClick;

  return (
    <motion.div
      className="h-full flex flex-col items-center justify-center text-center px-4"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Title */}
      <motion.div variants={staggerItem} className="mb-8">
        {isLoggedIn ? (
          <>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-[32px] font-roboto font-bold text-text-dark dark:text-white mb-2">
              Hi {userName}!
            </h2>
            <p className="font-inter text-[16px] text-text-light dark:text-gray-400 max-w-md mx-auto">
              {showSuggestions ? 'Ready to find your perfect look? Choose a style below or type your own.' : 'How can I help you today?'}
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-[32px] font-roboto font-bold text-text-medium mb-2">
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
          className="max-w-2xl w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SUGGESTIONS.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <motion.button
                  key={index}
                  onClick={() => onSuggestionClick?.(suggestion.prompt)}
                  className="flex flex-col items-center gap-3 p-5 bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-2xl hover:border-primary dark:hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all text-center group h-full"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-center group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-gray-400 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary-light transition-colors" />
                  </div>
                  <span className="font-inter text-[14px] font-medium text-text-dark dark:text-gray-200 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                    {suggestion.text}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Feature Cards - Only show if suggestions are enabled */}
      {showSuggestions && (
        <motion.div
          variants={staggerItem}
          className="mt-12 max-w-lg w-full mx-auto"
        >
          <div className="flex items-center gap-2 mb-3 justify-center opacity-60">
            <span className="h-px w-12 bg-gray-300 dark:bg-gray-700"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Or upload a photo to</span>
            <span className="h-px w-12 bg-gray-300 dark:bg-gray-700"></span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-500 dark:text-blue-400">
                <Search className="w-5 h-5" />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Find Similar</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">Discover items matching your photo</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-500 dark:text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Complete Outfit</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">Get matching pieces for your item</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatEmptyState;
