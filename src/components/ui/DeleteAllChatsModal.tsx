import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

interface DeleteAllChatsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    isDeleting: boolean;
}

const DeleteAllChatsModal = ({ isOpen, onClose, onConfirm, isDeleting }: DeleteAllChatsModalProps) => {
    const handleClose = () => {
        if (!isDeleting) {
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            className="max-w-md w-full p-6"
        >
            <div className="text-center">
                <motion.div
                    className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    animate={{
                        rotate: [0, -10, 10, -10, 10, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 0.5,
                        delay: 0.2,
                        ease: "easeInOut"
                    }}
                >
                    <MessageSquare className="w-8 h-8 text-orange-500" />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Delete All Conversations?
                </h3>

                <p className="text-gray-500 dark:text-stone-400 mb-6">
                    This will permanently delete all your chat history and conversations. This action cannot be undone.
                </p>

                <div className="flex gap-3 justify-center">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isDeleting}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 border-transparent transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete All Chats'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteAllChatsModal;
