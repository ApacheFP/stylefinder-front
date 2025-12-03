import Skeleton from './Skeleton';

const ProfileSkeleton = () => {
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
};

export default ProfileSkeleton;
