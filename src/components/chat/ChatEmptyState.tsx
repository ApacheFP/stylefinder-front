import { motion } from 'framer-motion';
import { Shirt, Briefcase, PartyPopper, Search, Layers } from 'lucide-react';
import ParticleBackground from '../ui/ParticleBackground';
import { staggerContainer, staggerItem } from '../../utils/animations';

interface ChatEmptyStateProps {
  isLoggedIn: boolean;
  userName: string;
  onSuggestionClick?: (suggestion: string) => void;
  suggestionsDisabled?: boolean;
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

const ChatEmptyState = ({ isLoggedIn, userName, onSuggestionClick, suggestionsDisabled = false }: ChatEmptyStateProps) => {
  // 🔧 FEATURE: Suggestions enabled by default if handler provided
  const showSuggestions = !!onSuggestionClick;

  return (
    <div className="h-full relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />

      <motion.div
        className="h-full flex flex-col items-center justify-center text-center px-4 relative z-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Title */}
        <motion.div variants={staggerItem} className="mb-6 md:mb-8">
          {isLoggedIn ? (
            <>
              <h2 className="text-2xl md:text-[32px] font-roboto font-bold text-text-dark dark:text-white mb-2">
                Hi {userName}!
              </h2>
              <p className="font-inter text-sm md:text-[16px] text-text-light dark:text-stone-400 max-w-md mx-auto">
                {showSuggestions ? 'Ready to find your perfect look? Choose a style below or type your own.' : 'How can I help you today?'}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl md:text-[32px] font-roboto font-bold text-text-medium dark:text-white mb-2">
                StyleFinder AI
              </h2>
              <p className="text-sm md:text-base font-inter text-text-medium dark:text-stone-300 mb-3">
                What would you like to find today?
              </p>
            </>
          )}
        </motion.div>

        {/* Suggestions - Show only first 2 on mobile, side by side */}
        {showSuggestions && (
          <motion.div
            variants={staggerItem}
            className="w-full max-w-2xl grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4"
          >
            {SUGGESTIONS.map((suggestion, index) => {
              const Icon = suggestion.icon;
              // Hide 3rd suggestion on mobile
              const hideOnMobile = index === 2;
              return (
                <motion.button
                  key={index}
                  onClick={() => !suggestionsDisabled && onSuggestionClick?.(suggestion.prompt)}
                  disabled={suggestionsDisabled}
                  className={`group relative backdrop-blur-sm border rounded-xl p-2.5 md:p-5 text-left md:text-center transition-all duration-300 focus:outline-none overflow-hidden ${hideOnMobile ? 'hidden md:block' : ''} ${suggestionsDisabled
                      ? 'bg-cream-100/50 dark:bg-surface-darker/50 border-cream-200 dark:border-surface-muted/50 cursor-not-allowed opacity-60'
                      : 'bg-cream-100/90 dark:bg-surface-darker/90 border-cream-300 dark:border-surface-muted hover:border-primary dark:hover:border-primary-light hover:shadow-lg focus:ring-2 focus:ring-primary/30 cursor-pointer'
                    }`}
                  whileHover={suggestionsDisabled ? {} : {
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={suggestionsDisabled ? {} : { scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: suggestionsDisabled ? 0.6 : 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  aria-label={suggestion.text}
                  aria-disabled={suggestionsDisabled}
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:animate-shimmer" />

                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10 flex flex-row md:flex-col items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:bg-primary group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                      <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary dark:text-primary-light group-hover:text-white transition-colors duration-300" />
                    </div>
                    <p className="font-inter text-xs md:text-sm font-medium text-text-dark dark:text-stone-100 group-hover:text-primary dark:group-hover:text-primary-light transition-colors duration-300">
                      {suggestion.text}
                    </p>
                  </div>

                  {/* Arrow indicator - hidden on mobile */}
                  <div className="hidden md:block absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
                    <Search className="w-4 h-4 text-primary dark:text-primary-light" />
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {/* Feature Cards - Upload Photo section */}
        {showSuggestions && (
          <motion.div
            variants={staggerItem}
            className="mt-4 md:mt-12 max-w-lg w-full mx-auto"
          >
            {/* Divider with "or" */}
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6 justify-center">
              <span className="h-px flex-1 bg-stone-300 dark:bg-surface-muted"></span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide md:tracking-widest text-stone-500 dark:text-stone-400">Or upload a photo</span>
              <span className="h-px flex-1 bg-stone-300 dark:bg-surface-muted"></span>
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-4">
              <motion.div
                className="bg-cream-100/90 dark:bg-surface-darker/90 backdrop-blur-sm border border-cream-300 dark:border-surface-muted p-2 md:p-4 rounded-lg md:rounded-2xl flex flex-row md:flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-default"
                whileHover={{ scale: 1.03 }}
              >
                <div className="p-1.5 md:p-2 bg-primary/10 dark:bg-primary/20 rounded-lg md:rounded-xl text-primary dark:text-primary-light flex-shrink-0">
                  <Search className="w-3.5 h-3.5 md:w-5 md:h-5" />
                </div>
                <div className="text-left md:text-center">
                  <h4 className="text-[11px] md:text-sm font-bold text-stone-900 dark:text-white">Find Similar</h4>
                  <p className="hidden md:block text-[11px] text-stone-500 dark:text-stone-400 leading-tight mt-0.5">Discover items matching your photo</p>
                </div>
              </motion.div>

              <motion.div
                className="bg-cream-100/90 dark:bg-surface-darker/90 backdrop-blur-sm border border-cream-300 dark:border-surface-muted p-2 md:p-4 rounded-lg md:rounded-2xl flex flex-row md:flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-default"
                whileHover={{ scale: 1.03 }}
              >
                <div className="p-1.5 md:p-2 bg-primary/10 dark:bg-primary/20 rounded-lg md:rounded-xl text-primary dark:text-primary-light flex-shrink-0">
                  <Layers className="w-3.5 h-3.5 md:w-5 md:h-5" />
                </div>
                <div className="text-left md:text-center">
                  <h4 className="text-[11px] md:text-sm font-bold text-stone-900 dark:text-white">Complete Outfit</h4>
                  <p className="hidden md:block text-[11px] text-stone-500 dark:text-stone-400 leading-tight mt-0.5">Get matching pieces for your item</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ChatEmptyState;
