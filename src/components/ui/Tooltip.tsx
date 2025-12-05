import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
    children: ReactNode;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}

const Tooltip = ({ children, content, position = 'top', delay = 300 }: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState<number | null>(null);

    const handleMouseEnter = () => {
        const id = window.setTimeout(() => {
            setIsVisible(true);
        }, delay);
        setTimeoutId(id);
    };

    const handleMouseLeave = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
        setIsVisible(false);
    };

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-[55%] mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div
            className="relative inline-flex items-center justify-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <AnimatePresence>
                {isVisible && content && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}
                        role="tooltip"
                        aria-live="polite"
                    >
                        <div className="bg-gray-900 dark:bg-surface-muted text-white text-xs font-inter px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                            {content}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tooltip;
