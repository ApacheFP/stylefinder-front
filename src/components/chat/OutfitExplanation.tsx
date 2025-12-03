import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Lightbulb, Palette } from 'lucide-react';

interface OutfitExplanationProps {
    explanation: string;
    isVisible: boolean;
}

const OutfitExplanation = ({ explanation, isVisible }: OutfitExplanationProps) => {
    if (!explanation || !isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative mt-4"
        >
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-800/80 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 border-b border-gray-200 dark:border-gray-700">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        Style Breakdown
                    </h4>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
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

                {/* Footer hint */}
                <div className="px-4 py-2.5 bg-gray-100/50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-[11px] text-gray-500 dark:text-gray-500 flex items-center gap-1.5">
                        <Palette className="w-3 h-3" />
                        Personalized based on your style preferences
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default OutfitExplanation;
