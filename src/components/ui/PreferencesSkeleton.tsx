import Skeleton from './Skeleton';

const PreferencesSkeleton = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-surface-dark px-4">
            <div className="max-w-2xl w-full bg-cream-100 dark:bg-surface-darker rounded-2xl shadow-lg p-6 md:p-8">
                <div className="text-center mb-8">
                    <Skeleton className="w-48 h-8 mx-auto mb-4" />
                </div>

                {/* Preference skeletons */}
                {[1, 2, 3].map(i => (
                    <div key={i} className="mb-8">
                        <Skeleton className="w-32 h-6 mb-4" />
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4].map(j => (
                                <Skeleton key={j} className="w-24 h-10 rounded-full" />
                            ))}
                        </div>
                    </div>
                ))}

                {/* Buttons skeleton */}
                <div className="flex gap-4">
                    <Skeleton className="flex-1 h-12" />
                    <Skeleton className="flex-1 h-12" />
                </div>
            </div>
        </div>
    );
};

export default PreferencesSkeleton;
