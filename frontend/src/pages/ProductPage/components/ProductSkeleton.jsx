import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const ProductSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#f0e6dc" highlightColor="#fffcf9" duration={0.8}>
      <div className="py-3 sm:px-[4vw] select-none -mt-2 sm:mt-0">
        {/* Breadcrumb */}
        <div className="hidden sm:block px-2 mb-4">
          <div className="flex items-center gap-2">
            <Skeleton width={50} height={12} />
            <Skeleton width={8} height={12} />
            <Skeleton width={70} height={12} />
            <Skeleton width={8} height={12} />
            <Skeleton width={60} height={12} />
            <Skeleton width={8} height={12} />
            <Skeleton width={100} height={12} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-10">
          {/* Images Section */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="flex flex-col-reverse md:flex-row gap-1 md:gap-2 w-full">
              {/* Thumbnails */}
              <div className="flex md:flex-col w-full md:w-30 gap-2 sm:gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar p-1 md:p-0 md:max-h-128 xl:max-h-144">
                {[...Array(4)].map((_, i) => (
                  <span
                    key={i}
                    className="w-22 sm:w-20 md:w-full h-16 sm:h-20 md:h-24 lg:h-28 shrink-0 block"
                  >
                    <Skeleton className="w-full h-full rounded-sm" />
                  </span>
                ))}
              </div>
              {/* Main Image */}
              <div className="flex-1">
                <Skeleton className="w-full h-84 sm:h-80 lg:h-96 xl:h-122 rounded-md" />
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="block sm:hidden">
              <Skeleton width={60} height={16} />
            </div>
            <div className="space-y-4 mt-2">
              {/* Title - 2 lines */}
              <div className="space-y-2">
                <Skeleton width="95%" height={24} />
                <Skeleton width="60%" height={24} />
              </div>

              {/* Rating + Wishlist/Share buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} width={16} height={16} borderRadius={8} />
                  ))}
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <Skeleton width={40} height={40} borderRadius={20} />
                  <Skeleton width={40} height={40} borderRadius={20} />
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <Skeleton width={120} height={28} />
                <Skeleton width={120} height={28} />
              </div>

              {/* Description - 3 lines */}
              <div className="space-y-2">
                <Skeleton width="100%" height={14} />
                <Skeleton width="95%" height={14} />
                <Skeleton width="95%" height={14} />
                <Skeleton width="70%" height={14} />
              </div>

              {/* Quantity + Add to Cart + Buy Now */}
              <div className="flex justify-between gap-3">
                <Skeleton width={130} height={44} borderRadius={20} />
                <Skeleton width="100%" height={44} borderRadius={20} />

                <div className="flex flex-col items-end">
                  <Skeleton width={120} height={10} borderRadius={20} />
                  <Skeleton width={180} height={44} borderRadius={20} />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2 ">
                <Skeleton width="100%" height={44} borderRadius={20} />
                <Skeleton width="100%" height={44} borderRadius={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default ProductSkeleton;
