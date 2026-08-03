const AccountSettingsSkeleton = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden h-full flex flex-col animate-pulse">
      {/* Header */}
      <div className="px-6 py-5 shrink-0">
        <div className="h-6 w-48 bg-gray-200 rounded-lg" />
        <div className="h-3 w-72 bg-gray-100 rounded mt-2" />
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar Skeleton */}
        <aside className="w-56 shrink-0 border-r border-gray-50 p-3 space-y-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-lg"
            >
              <div className="w-5 h-5 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          ))}
        </aside>

        {/* Content Skeleton */}
        <div className="flex-1 min-w-0 p-6 space-y-5">
          {/* Profile photo */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full" />
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="h-3 w-16 bg-gray-200 rounded" />
                <div className="h-10 w-full bg-gray-100 rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-12 bg-gray-200 rounded" />
                <div className="h-10 w-full bg-gray-100 rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="h-3 w-14 bg-gray-200 rounded" />
                <div className="h-10 w-full bg-gray-100 rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-10 bg-gray-200 rounded" />
                <div className="h-10 w-full bg-gray-100 rounded-lg" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-100 rounded-lg" />
            </div>
          </div>

          {/* Button */}
          <div className="flex justify-end">
            <div className="h-10 w-32 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsSkeleton;
