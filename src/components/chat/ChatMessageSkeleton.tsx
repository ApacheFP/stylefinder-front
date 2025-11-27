import Skeleton from '../ui/Skeleton';

const ChatMessageSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* User Message Skeleton (Right) */}
      <div className="flex justify-end">
        <div className="bg-primary/10 dark:bg-primary/20 rounded-xl rounded-tr-sm p-4 max-w-[80%] w-[300px]">
          <div className="space-y-2">
            <Skeleton className="w-full h-4 bg-primary/20 dark:bg-primary/30" />
            <Skeleton className="w-2/3 h-4 bg-primary/20 dark:bg-primary/30" />
          </div>
        </div>
      </div>

      {/* AI Message Skeleton (Left) - With Outfit */}
      <div className="flex justify-start">
        <div className="max-w-full w-full">
          <div className="bg-white dark:bg-gray-800 border border-border dark:border-gray-600 rounded-xl p-6">
            {/* Message text skeleton */}
            <div className="mb-4 space-y-2">
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-5/6 h-4" />
            </div>

            {/* Product cards skeleton */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden w-[180px] flex-shrink-0">
                  {/* Image skeleton */}
                  <Skeleton className="w-full h-[120px]" variant="rectangular" />

                  {/* Info skeleton */}
                  <div className="p-3 space-y-2">
                    <Skeleton className="w-4/5 h-3" />
                    <Skeleton className="w-1/2 h-3" />
                    <Skeleton className="w-full h-8 rounded-lg" />
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
