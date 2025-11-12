import Skeleton from '../ui/Skeleton';

const ChatMessageSkeleton = () => {
  return (
    <div className="flex justify-start mb-6">
      <div className="max-w-full w-full">
        <div className="bg-white border border-border rounded-2xl p-6">
          {/* Message text skeleton */}
          <div className="mb-4 space-y-2">
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-5/6 h-4" />
          </div>

          {/* Product cards skeleton */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-xl overflow-hidden max-w-[200px]">
                {/* Image skeleton */}
                <Skeleton className="w-full h-[200px]" variant="rectangular" />
                
                {/* Info skeleton */}
                <div className="p-3 space-y-2">
                  <Skeleton className="w-4/5 h-4" />
                  <Skeleton className="w-1/2 h-4" />
                  <Skeleton className="w-2/3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageSkeleton;
