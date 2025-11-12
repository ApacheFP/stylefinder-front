import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave';
}

const Skeleton = ({ 
  className = '', 
  variant = 'text',
  animation = 'pulse' 
}: SkeletonProps) => {
  const baseStyles = 'bg-gray-200';
  
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <motion.div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      animate={
        animation === 'pulse'
          ? { opacity: [0.6, 1, 0.6] }
          : { backgroundPosition: ['200% 0', '-200% 0'] }
      }
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: animation === 'pulse' ? 'easeInOut' : 'linear',
      }}
      style={
        animation === 'wave'
          ? {
              background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
              backgroundSize: '200% 100%',
            }
          : undefined
      }
    />
  );
};

export default Skeleton;
