import { motion } from 'framer-motion';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
}

const HamburgerMenu = ({ isOpen, onClick }: HamburgerMenuProps) => {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed top-3 left-3 z-50 p-2.5 bg-cream-100 dark:bg-surface-dark rounded-lg shadow-sm border border-cream-300 dark:border-surface-muted hover:bg-cream-200 dark:hover:bg-surface-muted transition-colors"
      aria-label="Toggle menu"
    >
      <div className="w-5 h-4 flex flex-col justify-between">
        <motion.span
          className="w-full h-0.5 bg-text-dark rounded-full"
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 10 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="w-full h-0.5 bg-text-dark rounded-full"
          animate={{
            opacity: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="w-full h-0.5 bg-text-dark rounded-full"
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -10 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </button>
  );
};

export default HamburgerMenu;
