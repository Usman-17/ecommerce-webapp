import { useState } from "react";
import { Search } from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const CategoryFilterSkeleton = () => (
  <SkeletonTheme baseColor="#f0e6dc" highlightColor="#fffcf9" duration={1}>
    <div className="space-y-4">
      <Skeleton width={80} height={16} borderRadius={4} />
      <Skeleton height={36} borderRadius={9999} />
      <div className="space-y-3 pt-2 pr-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton width={14} height={14} circle />
              <Skeleton width={96} height={14} />
            </div>
            <Skeleton width={24} height={16} borderRadius={9999} />
          </div>
        ))}
      </div>
    </div>
  </SkeletonTheme>
);

const CategoryFilter = ({
  subCategories: categories,
  selectedSubCategories: selectedCategories,
  setSelectedSubCategories: setSelectedCategories,
  getSubCategoryProductCount: getCategoryProductCount,
  initialItemCount,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  if (isLoading) return <CategoryFilterSkeleton />;

  if (!categories || categories.length === 0) return null;

  const filteredCategories = categories.filter((cat) => {
    const count = getCategoryProductCount
      ? getCategoryProductCount(cat.productCategoryName)
      : 0;
    return (
      count > 0 &&
      (cat.productCategoryName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  const itemLimit = typeof initialItemCount === "number" ? initialItemCount : 0;
  const displayItems =
    itemLimit > 0 && !showAll
      ? filteredCategories.slice(0, itemLimit)
      : filteredCategories;
  const hasMore = itemLimit > 0 && filteredCategories.length > itemLimit;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2 select-none">
        Category
      </label>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Find a Category"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-10 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 placeholder:text-gray-400"
        />
        <Search
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-accent pointer-events-none"
        />
      </div>

      {/* Category List */}
      <div className="space-y-3 pt-2 pr-2">
        {filteredCategories.length === 0 ? (
          <p className="text-sm text-gray-500">No categories found</p>
        ) : (
          displayItems.map((cat) => {
            const isSelected = selectedCategories.includes(
              cat.productCategoryName || "",
            );
            const productCount = getCategoryProductCount
              ? getCategoryProductCount(cat.productCategoryName)
              : 0;

            return (
              <div
                key={cat.productCategoryId || cat.key}
                className="flex items-center justify-between group cursor-pointer"
                onClick={() => {
                  if (isSelected) {
                    setSelectedCategories(
                      selectedCategories.filter(
                        (c) => c !== (cat.productCategoryName || ""),
                      ),
                    );
                  } else {
                    setSelectedCategories([
                      ...selectedCategories,
                      cat.productCategoryName || "",
                    ]);
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
                    {cat.productCategoryName}
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
          })
        )}
      </div>

      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-primary font-medium hover:underline"
        >
          {showAll
            ? "View Less"
            : `View More (${filteredCategories.length - initialItemCount})`}
        </button>
      )}
    </div>
  );
};

export default CategoryFilter;
