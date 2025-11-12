import { motion } from 'framer-motion';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
}

const HamburgerMenu = ({ isOpen, onClick }: HamburgerMenuProps) => {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-lg shadow-lg border border-border hover:bg-gray-50 transition-colors"
      aria-label="Toggle menu"
    >
      <div className="w-6 h-5 flex flex-col justify-between">
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
