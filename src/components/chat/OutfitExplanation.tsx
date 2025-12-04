import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useRef, useLayoutEffect, useState } from 'react';

interface OutfitExplanationProps {
    explanation: string;
    isVisible: boolean;
    onAnimationComplete?: () => void;
}

const OutfitExplanation = ({ explanation, isVisible, onAnimationComplete }: OutfitExplanationProps) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | "auto">("auto");

    useLayoutEffect(() => {
        if (isVisible && contentRef.current) {
            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    setHeight(entry.contentRect.height);
                }
            });
            resizeObserver.observe(contentRef.current);
            return () => resizeObserver.disconnect();
        }
    }, [isVisible, explanation]);

    if (!explanation) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="explanation"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                        height: height,
                        opacity: 1,
                    }}
                    exit={{ 
                        height: 0,
                        opacity: 0,
                    }}
                    transition={{
                        height: {
                            duration: 0.3,
                            ease: [0.25, 0.1, 0.25, 1]
                        },
                        opacity: {
                            duration: 0.2,
                        }
                    }}
                    onAnimationComplete={onAnimationComplete}
                    className="relative mt-4 overflow-hidden"
                >
                    <div ref={contentRef}>
                        <div className="bg-gradient-to-br from-slate-50/80 to-gray-50/80 dark:from-gray-800/60 dark:to-gray-800/40 border border-gray-200/80 dark:border-gray-700/60 rounded-xl backdrop-blur-sm">
                            <div className="p-4">
                                <div className="prose prose-sm max-w-none dark:prose-invert
                                    prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed prose-p:my-1.5 prose-p:text-[13px]
                                    prose-strong:text-gray-800 dark:prose-strong:text-gray-200 prose-strong:font-medium
                                    prose-ul:my-2 prose-ul:space-y-1
                                    prose-li:text-gray-600 dark:prose-li:text-gray-400 prose-li:text-[13px] prose-li:my-0
                                    [&_ul]:list-none [&_ul]:pl-0
                                    [&_li]:relative [&_li]:pl-4
                                    [&_li]:before:content-[''] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.6em] [&_li]:before:w-1.5 [&_li]:before:h-1.5 [&_li]:before:bg-primary/40 [&_li]:before:rounded-full
                                ">
                                    <ReactMarkdown>{explanation}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OutfitExplanation;
