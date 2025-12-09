import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    isDeleting: boolean;
}

const DeleteAccountModal = ({ isOpen, onClose, onConfirm, isDeleting }: DeleteAccountModalProps) => {
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const handleClose = () => {
        if (!isDeleting) {
            onClose();
            setDeleteConfirmation('');
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
                    className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
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
                    <Trash2 className="w-8 h-8 text-red-500" />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Are you sure?
                </h3>

                <p className="text-gray-500 dark:text-stone-400 mb-6">
                    This action is irreversible. To confirm, please type <span className="font-mono font-bold text-red-500 dark:text-red-400">DELETE</span> below.
                </p>

                <div className="mb-6">
                    <Input
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        className="text-center uppercase tracking-widest border-red-200 dark:border-red-900/50 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500/20"
                    />
                </div>

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
                        disabled={isDeleting || deleteConfirmation.toUpperCase() !== 'DELETE'}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 border-transparent transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Account'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteAccountModal;
