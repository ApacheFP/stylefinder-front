import Skeleton from '../ui/Skeleton';

const ChatMessageSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* User Message Skeleton (Right) */}
      <div className="flex justify-end">
        <div className="bg-primary/10 dark:bg-primary/20 rounded-2xl rounded-tr-sm p-4 max-w-[80%] w-[300px]">
          <div className="space-y-2">
            <Skeleton className="w-full h-4 bg-primary/20 dark:bg-primary/30" />
            <Skeleton className="w-2/3 h-4 bg-primary/20 dark:bg-primary/30" />
          </div>
        </div>
      </div>

      {/* AI Message Skeleton (Left) */}
      <div className="flex justify-start">
        <div className="max-w-full w-full">
          <div className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-2xl p-6">
            {/* Message text skeleton */}
            <div className="mb-4 space-y-2">
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-5/6 h-4" />
            </div>

            {/* Product cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden">
                  {/* Image skeleton */}
                  <Skeleton className="w-full h-[150px]" variant="rectangular" />

                  {/* Info skeleton */}
                  <div className="p-3 space-y-2">
                    <Skeleton className="w-4/5 h-3" />
                    <Skeleton className="w-1/2 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageSkeleton;
