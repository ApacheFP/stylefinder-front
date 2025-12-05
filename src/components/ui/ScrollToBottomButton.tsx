import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

interface ScrollToBottomButtonProps {
  show: boolean;
  onClick: () => void;
}

const ScrollToBottomButton = ({ show, onClick }: ScrollToBottomButtonProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          onClick={onClick}
          className="fixed bottom-32 right-8 bg-cream-100 dark:bg-surface-darker border-2 border-primary text-primary dark:text-primary-light rounded-full p-3 shadow-lg dark:shadow-primary/10 hover:bg-primary hover:text-white dark:hover:bg-primary-light dark:hover:text-white transition-colors z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToBottomButton;
