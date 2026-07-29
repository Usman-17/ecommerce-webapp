import { useState } from "react";
import { Check } from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const ColorFilterSkeleton = () => (
  <SkeletonTheme baseColor="#f0e6dc" highlightColor="#fffcf9" duration={1}>
    <div className="space-y-3">
      <Skeleton width={50} height={16} borderRadius={4} />
      <div className="flex flex-col gap-2 pr-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton width={28} height={28} circle />
            <div className="flex items-center justify-between flex-1">
              <Skeleton width={72} height={14} />
              <Skeleton width={24} height={16} borderRadius={9999} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </SkeletonTheme>
);

const ColorFilter = ({
  colors,
  selectedColors,
  setSelectedColors,
  getColorProductCount,
  isColorLight,
  initialItemCount,
  isLoading,
}) => {
  const [showAll, setShowAll] = useState(false);

  if (isLoading) return <ColorFilterSkeleton />;

  if (!colors || colors.length === 0) return null;

  const displayItems =
    initialItemCount && !showAll ? colors.slice(0, initialItemCount) : colors;
  const hasMore = initialItemCount && colors.length > initialItemCount;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700 mb-4 select-none">
        Color
      </label>

      <div className="flex flex-col gap-2 pr-2">
        {displayItems.map((color) => {
          const isSelected = selectedColors.includes(color.colorName || "");
          const hexColor = color.hexCode || "#9ca3af";
          const isLight = isColorLight(hexColor);
          const checkColor = isLight ? "#374151" : "#ffffff";
          const productCount = getColorProductCount(color.colorName);

          return (
            <div
              key={color.colorId}
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => {
                if (isSelected) {
                  setSelectedColors(
                    selectedColors.filter((c) => c !== (color.colorName || "")),
                  );
                } else {
                  setSelectedColors([...selectedColors, color.colorName || ""]);
                }
              }}
            >
              <div
                className={`relative w-7 h-7 rounded-full transition-all duration-300 ring-2 ring-white border border-gray-200 shadow-sm shrink-0 ${
                  isSelected
                    ? "ring-primary shadow-md"
                    : "hover:scale-105 hover:border-gray-300"
                }`}
                style={{ backgroundColor: hexColor }}
              >
                {isSelected && (
                  <Check
                    size={12}
                    className="absolute inset-0 m-auto"
                    style={{ color: checkColor }}
                  />
                )}
              </div>

              <div className="flex items-center justify-between flex-1">
                <span
                  className={`text-sm select-none transition-all duration-200 ${
                    isSelected
                      ? "font-semibold text-gray-900"
                      : "text-gray-600 group-hover:text-primary"
                  }`}
                >
                  {color.colorName}
                </span>

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
            : `View More (${colors.length - initialItemCount})`}
        </button>
      )}
    </div>
  );
};

export default ColorFilter;
