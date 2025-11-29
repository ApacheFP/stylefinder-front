import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Save, ArrowLeft, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { showToast } from '../utils/toast';
import { fadeInUp } from '../utils/animations';
import Skeleton from '../components/ui/Skeleton';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, isLoading: isAuthLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [name, setName] = useState(user?.name || '');

    // Update local state when user data loads
    useEffect(() => {
        if (user?.name) {
            setName(user.name);
        }
    }, [user]);

    // ... (handlers remain same)

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            showToast.error('Name cannot be empty');
            return;
        }

        setIsUpdatingProfile(true);

        try {
            // Call actual backend service
            await authService.updateProfile({ name });
            // We should ideally update the user context here, but for now a page reload or re-fetch would happen
            // Since authService.updateProfile returns the updated user, we could update context if exposed
            // For now, we rely on the fact that the backend is updated.
            // To make it perfect, we'd need a setUser method from useAuth, but let's just show success.
            showToast.success('Profile updated successfully');
        } catch {
            showToast.error('Failed to update profile');
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwords.new !== passwords.confirm) {
            showToast.error('New passwords do not match');
            return;
        }

        if (passwords.new.length < 6) {
            showToast.error('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            await authService.changePassword({
                current: passwords.current,
                new: passwords.new
            });
            showToast.success('Password updated successfully');
            setPasswords({ current: '', new: '', confirm: '' });
        } catch {
            showToast.error('Failed to update password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            await authService.deleteAccount();
            showToast.success('Account deleted. Bye bye! 👋');
            // Small delay to let the user see the toast
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        } catch {
            showToast.error('Failed to delete account');
            setIsDeleting(false);
        }
    };

    if (isAuthLoading) {
        return (
            <div className="min-h-screen bg-background dark:bg-gray-900 p-6 md:p-12">
                <div className="max-w-2xl mx-auto">
                    {/* Header Skeleton */}
                    <div className="flex items-center gap-4 mb-8">
                        <Skeleton variant="circular" className="w-10 h-10" />
                        <Skeleton variant="text" className="w-48 h-8" />
                    </div>

                    <div className="space-y-6">
                        {/* User Info Card Skeleton */}
                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <Skeleton variant="rectangular" className="w-9 h-9 rounded-lg" />
                                <Skeleton variant="text" className="w-40 h-6" />
                            </div>
                            <div className="grid gap-6 md:grid-cols-2 mb-6">
                                <div className="space-y-2">
                                    <Skeleton variant="text" className="w-20 h-4" />
                                    <Skeleton variant="rectangular" className="w-full h-12 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton variant="text" className="w-20 h-4" />
                                    <Skeleton variant="rectangular" className="w-full h-12 rounded-xl" />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Skeleton variant="rectangular" className="w-32 h-10 rounded-xl" />
                            </div>
                        </div>

                        {/* Password Card Skeleton */}
                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <Skeleton variant="rectangular" className="w-9 h-9 rounded-lg" />
                                <Skeleton variant="text" className="w-40 h-6" />
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Skeleton variant="text" className="w-32 h-4" />
                                    <Skeleton variant="rectangular" className="w-full h-12 rounded-xl" />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Skeleton variant="text" className="w-32 h-4" />
                                        <Skeleton variant="rectangular" className="w-full h-12 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton variant="text" className="w-32 h-4" />
                                        <Skeleton variant="rectangular" className="w-full h-12 rounded-xl" />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Skeleton variant="rectangular" className="w-32 h-10 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900 p-6">
                <div className="text-center max-w-md">
                    <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <User className="w-8 h-8 text-red-500 dark:text-red-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Found</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        We couldn't load your profile information. Please try logging in again.
                    </p>
                    <Button onClick={() => navigate('/login')} variant="primary">
                        Go to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background dark:bg-gray-900 p-6 md:p-12">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <motion.div
                    className="flex items-center gap-4 mb-8"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-text-dark dark:text-white" />
                    </button>
                    <h1 className="text-3xl font-roboto font-bold text-text-dark dark:text-white">
                        Profile Settings
                    </h1>
                </motion.div>

                <div className="space-y-6">
                    {/* User Info Card */}
                    <motion.div
                        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700 shadow-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <User className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-text-dark dark:text-white">Personal Information</h2>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <Input
                                    label="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                                <Input
                                    label="Email Address"
                                    value={user?.email || ''}
                                    disabled
                                    className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 cursor-not-allowed border-gray-200 dark:border-gray-700"
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={isUpdatingProfile || name === user?.name}
                                    variant="outline"
                                    className="w-full md:w-auto min-w-[140px]"
                                >
                                    {isUpdatingProfile ? (
                                        'Saving...'
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Update Profile
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Password Change Card */}
                    <motion.div
                        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700 shadow-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Lock className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-text-dark dark:text-white">Change Password</h2>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <Input
                                type="password"
                                label="Current Password"
                                value={passwords.current}
                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                placeholder="Enter current password"
                                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />

                            <div className="grid gap-4 md:grid-cols-2">
                                <Input
                                    type="password"
                                    label="New Password"
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    placeholder="Min. 6 characters"
                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                                <Input
                                    type="password"
                                    label="Confirm New Password"
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    placeholder="Re-enter new password"
                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full md:w-auto min-w-[140px]"
                                >
                                    {isLoading ? (
                                        'Updating...'
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Delete Account Section - Modern & Minimalist */}
                    <motion.div
                        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700 shadow-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-red-50/50 dark:hover:bg-red-900/10 border border-transparent hover:border-red-100 dark:hover:border-red-900/30">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                                    Delete Account
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Permanently remove your account and all of its contents.
                                </p>
                            </div>
                            <Button
                                onClick={() => setIsDeleteModalOpen(true)}
                                variant="outline"
                                className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-700 hover:border-red-300 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/30 transition-all duration-300"
                            >
                                Delete Account
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    if (!isDeleting) {
                        setIsDeleteModalOpen(false);
                        setDeleteConfirmation('');
                    }
                }}
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

                    <p className="text-gray-500 dark:text-gray-400 mb-6">
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
                            onClick={() => {
                                setIsDeleteModalOpen(false);
                                setDeleteConfirmation('');
                            }}
                            disabled={isDeleting}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleDeleteAccount}
                            disabled={isDeleting || deleteConfirmation !== 'DELETE'}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 border-transparent transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Account'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ProfilePage;
