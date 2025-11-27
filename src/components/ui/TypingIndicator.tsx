import { motion } from 'framer-motion';

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1.5 py-3 px-4">
      <motion.div
        className="w-2.5 h-2.5 bg-primary dark:bg-primary-light rounded-full"
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: [0.4, 0, 0.2, 1],
          delay: 0,
        }}
      />
      <motion.div
        className="w-2.5 h-2.5 bg-primary dark:bg-primary-light rounded-full"
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: [0.4, 0, 0.2, 1],
          delay: 0.15,
        }}
      />
      <motion.div
        className="w-2.5 h-2.5 bg-primary dark:bg-primary-light rounded-full"
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: [0.4, 0, 0.2, 1],
          delay: 0.3,
        }}
      />
    </div>
  );
};

export default TypingIndicator;
