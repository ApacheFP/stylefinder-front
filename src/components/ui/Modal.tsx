import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

const Modal = ({ isOpen, onClose, children, className = '' }: ModalProps) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl relative overflow-hidden ${className}`}
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            {children}
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default Modal;
