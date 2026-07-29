import { useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const SizeFilterSkeleton = () => (
  <SkeletonTheme baseColor="#f0e6dc" highlightColor="#fffcf9" duration={1}>
    <div className="space-y-3">
      <Skeleton width={40} height={16} borderRadius={4} />
      <div className="space-y-2 pr-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton width={14} height={14} circle />
              <Skeleton width={56} height={14} />
            </div>
            <Skeleton width={24} height={16} borderRadius={9999} />
          </div>
        ))}
      </div>
    </div>
  </SkeletonTheme>
);

const SizeFilter = ({
  sizes,
  selectedSizes,
  setSelectedSizes,
  getSizeProductCount,
  initialItemCount,
  isLoading,
}) => {
  const [showAll, setShowAll] = useState(false);

  if (isLoading) return <SizeFilterSkeleton />;

  if (!sizes || sizes.length === 0) return null;

  const displayItems =
    initialItemCount && !showAll ? sizes.slice(0, initialItemCount) : sizes;
  const hasMore = initialItemCount && sizes.length > initialItemCount;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700 mb-4 select-none">
        Size
      </label>

      <div className="space-y-2 pr-2">
        {displayItems.map((size) => {
          const isSelected = selectedSizes.includes(size.sizeName || "");
          const productCount = getSizeProductCount
            ? getSizeProductCount(size.sizeName)
            : 0;

          return (
            <div
              key={size.sizeId || size.rno}
              className="flex items-center justify-between group cursor-pointer"
              onClick={() => {
                if (isSelected) {
                  setSelectedSizes(
                    selectedSizes.filter((s) => s !== (size.sizeName || "")),
                  );
                } else {
                  setSelectedSizes([...selectedSizes, size.sizeName || ""]);
                }
              }}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  className="h-3.5 w-3.5 text-accent border-gray-300 rounded focus:ring-accent cursor-pointer"
                  style={{ accentColor: "var(--color-accent)" }}
                />

                <label
                  className={`ml-3 text-sm cursor-pointer select-none transition-colors ${
                    isSelected
                      ? "text-gray-900 font-medium"
                      : "text-gray-600 group-hover:text-primary"
                  }`}
                >
                  {size.sizeName}
                </label>
              </div>

              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-all duration-300 font-semibold select-none ${
                  isSelected
                    ? "bg-accent text-white border-accent shadow-sm"
                    : "bg-transparent text-gray-400 border-gray-200 group-hover:border-gray-300"
                }`}
              >
                {productCount}
              </span>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-primary font-medium hover:underline"
        >
          {showAll
            ? "View Less"
            : `View More (${sizes.length - initialItemCount})`}
        </button>
      )}
    </div>
  );
};

export default SizeFilter;
