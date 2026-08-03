const ProfileLayoutSkeleton = () => {
  return (
    <div className="md:p-6 lg:px-[4vw] min-h-screen animate-pulse">
      <div className="flex gap-2.5 items-stretch">
        {/* Sidebar Skeleton */}
        <aside className="hidden md:block w-72 shrink-0">
          <div className="bg-white rounded-lg border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 h-full">
            {/* User Info */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gray-200" />
              <div className="h-4 w-28 bg-gray-200 rounded mx-auto" />
              <div className="h-3 w-36 bg-gray-100 rounded mx-auto mt-2" />
            </div>

            {/* Nav Items */}
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-3">
                  <div className="w-5 h-5 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded flex-1" />
                </div>
              ))}
              <div className="flex items-center gap-3 px-3 py-3 mt-4">
                <div className="w-5 h-5 bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded w-16" />
              </div>
            </div>

            {/* Help Card */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl space-y-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-100 rounded" />
              <div className="h-8 w-full bg-gray-200 rounded-lg" />
            </div>
          </div>
        </aside>

        {/* Content Skeleton */}
        <main className="flex-1 min-w-0 bg-white rounded-xl p-6 space-y-4">
          {/* Banner */}
          <div className="h-32 bg-gray-100 rounded-xl" />

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 border border-gray-100 rounded-xl space-y-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                  <div className="space-y-1.5">
                    <div className="h-5 w-6 bg-gray-200 rounded" />
                    <div className="h-3 w-16 bg-gray-100 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Status */}
          <div className="p-5 border border-gray-100 rounded-xl space-y-3">
            <div className="flex justify-between">
              <div className="h-5 w-28 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-100 rounded" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl space-y-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileLayoutSkeleton;
