import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave';
}

const Skeleton = ({
  className = '',
  variant = 'text',
  animation = 'wave'
}: SkeletonProps) => {
  const baseStyles = 'bg-gray-200 dark:bg-gray-700';

  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <motion.div
      className={`${baseStyles} ${variants[variant]} ${className} overflow-hidden relative`}
      animate={
        animation === 'pulse'
          ? { opacity: [0.5, 1, 0.5] }
          : {}
      }
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {animation === 'wave' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-600/30 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </motion.div>
  );
};

export default Skeleton;
