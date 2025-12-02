import Skeleton from '../ui/Skeleton';

const ChatMessageSkeleton = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* User Message Skeleton (Right) */}
      <div className="flex justify-end">
        <div className="bg-primary/10 dark:bg-primary/20 rounded-2xl rounded-br-md p-4 max-w-[80%] w-[300px]">
          <div className="space-y-2">
            <Skeleton className="w-full h-4 bg-primary/20 dark:bg-primary/30" />
            <Skeleton className="w-2/3 h-4 bg-primary/20 dark:bg-primary/30" />
          </div>
        </div>
      </div>

      {/* AI Message Skeleton (Left) - With Outfit */}
      <div className="flex justify-start">
        <div className="max-w-4xl w-full">
          {/* Text bubble skeleton */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-5 py-3 shadow-md mb-3 max-w-lg">
            <div className="space-y-2">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-4/5 h-4" />
            </div>
          </div>

          {/* Outfit card skeleton */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-5 shadow-md">
            {/* Header skeleton */}
            <div className="flex items-center justify-between mb-3 px-1">
              <Skeleton className="w-32 h-3" />
              <Skeleton className="w-24 h-6 rounded-lg" />
            </div>

            {/* Product cards skeleton - matches ProductCard layout */}
            <div className="flex flex-wrap gap-2 mb-4 justify-start">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ width: '140px' }}
                >
                  {/* Image skeleton with aspect ratio */}
                  <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                    <Skeleton className="absolute inset-0" variant="rectangular" />
                  </div>

                  {/* Info skeleton */}
                  <div className="p-2.5 space-y-1.5">
                    <Skeleton className="w-4/5 h-3" />
                    <Skeleton className="w-1/2 h-4" />
                  </div>
                </div>
              ))}
            </div>

            {/* Summary box skeleton */}
            <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="space-y-1">
                <Skeleton className="w-20 h-2" />
                <Skeleton className="w-16 h-6" />
              </div>
              <Skeleton className="w-32 h-10 rounded-lg" />
            </div>

            {/* Explain button skeleton */}
            <Skeleton className="w-36 h-9 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageSkeleton;
