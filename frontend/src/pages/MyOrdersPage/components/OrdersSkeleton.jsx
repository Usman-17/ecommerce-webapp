const OrdersSkeleton = () => {
  return (
    <div className="h-full">
      <div className="bg-white rounded-xl h-full flex flex-col animate-pulse">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 shrink-0">
          <div className="h-5 w-28 bg-gray-200 rounded" />
          <div className="h-3 w-56 bg-gray-100 rounded mt-2" />
        </div>

        {/* Tabs */}
        <div className="px-6 pb-4 shrink-0">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-9 w-20 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-6 pb-6 min-h-0 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 border border-gray-100 rounded-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-100 rounded" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gray-100 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="h-3 w-20 bg-gray-100 rounded" />
                <div className="h-8 w-24 bg-gray-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersSkeleton;
