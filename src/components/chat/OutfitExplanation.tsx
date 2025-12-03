import { motion } from 'framer-motion';

interface OutfitExplanationProps {
    explanation: string;
    isVisible: boolean;
}

const OutfitExplanation = ({ explanation, isVisible }: OutfitExplanationProps) => {
    if (!explanation || !isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative mt-3"
        >
            <div className="bg-gradient-to-br from-primary/5 via-purple-50/30 to-blue-50/30 dark:from-primary/10 dark:via-purple-900/10 dark:to-blue-900/10 border border-primary/10 dark:border-gray-600 rounded-xl p-5 shadow-sm backdrop-blur-sm relative overflow-hidden">
                <p className="font-inter text-gray-700 dark:text-gray-300 leading-relaxed text-sm relative z-10">
                    {explanation}
                </p>
            </div>
        </motion.div>
    );
};

export default OutfitExplanation;
