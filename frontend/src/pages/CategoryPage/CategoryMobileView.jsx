import { Link } from "react-router-dom";
import { useRef, useCallback, useEffect } from "react";

const CategoryMobileView = ({
  productAreas,
  categories,
  filteredCategories,
  filteredSubCategories,
  selectedAreaId,
  selectedCategoryId,
  setSelectedAreaId,
  setSelectedCategoryId,
}) => {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const tabsRef = useRef(null);

  useEffect(() => {
    const container = tabsRef.current;
    if (!container) return;
    const idx =
      selectedAreaId === null
        ? 0
        : productAreas.findIndex((a) => a._id === selectedAreaId) + 1;
    const btn = container.children[idx];
    if (btn) {
      btn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedAreaId, productAreas]);

  const handleTouchStart = useCallback((e) => {
    e.nativeEvent.stopPropagation();
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      e.nativeEvent.stopPropagation();
      const diffX = e.changedTouches[0].clientX - touchStartX.current;
      const diffY = e.changedTouches[0].clientY - touchStartY.current;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        const currentIndex = productAreas.findIndex(
          (a) => a._id === selectedAreaId,
        );

        if (diffX < 0) {
          if (selectedAreaId === null && productAreas.length > 0) {
            setSelectedAreaId(productAreas[0]._id);
          } else if (currentIndex < productAreas.length - 1) {
            setSelectedAreaId(productAreas[currentIndex + 1]._id);
          }
        } else if (diffX > 0) {
          if (selectedAreaId !== null) {
            if (currentIndex === 0) {
              setSelectedAreaId(null);
            } else if (currentIndex > 0) {
              setSelectedAreaId(productAreas[currentIndex - 1]._id);
            }
          }
        }
      }
    },
    [productAreas, selectedAreaId, setSelectedAreaId],
  );

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      data-prevent-nav-swipe
      className="flex flex-col flex-1 overflow-hidden md:hidden bg-white [touch-action:pan-y]"
    >
      {/* Top Header - Product Areas (Tabs) */}
      <div className="border-b border-gray-50">
        <div
          ref={tabsRef}
          className="flex items-center overflow-x-auto no-scrollbar px-3 py-1.5 [touch-action:pan-x]"
        >
          {/* All Button */}
          <button
            onClick={(e) => {
              setSelectedAreaId(null);
              setSelectedCategoryId(null);
              e.currentTarget.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
              });
            }}
            className={`relative py-1.5 px-5 text-[13px] font-bold transition-all whitespace-nowrap rounded-2xl ${
              selectedAreaId === null
                ? "bg-primary text-white"
                : "text-gray-500 hover:text-gray-800 hover:bg-[#f0e4da]"
            }`}
          >
            All
          </button>

          {productAreas.map((area) => (
            <button
              key={area._id}
              onClick={(e) => {
                setSelectedAreaId(area._id);
                setSelectedCategoryId(null);
                e.currentTarget.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                  inline: "center",
                });
              }}
              className={`relative py-1.5 px-4 text-[13px] font-bold transition-all whitespace-nowrap rounded-2xl ${
                selectedAreaId === area._id
                  ? "bg-primary text-white"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {area.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Categories */}
        <aside className="w-31 sm:w-32 bg-white overflow-y-auto no-scrollbar border-r border-[#fff8f2] [touch-action:pan-y]">
          <div className="flex flex-col">
            {/* All Categories Button */}
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`w-full py-5 px-3 text-left transition-all relative ${
                selectedCategoryId === null
                  ? " text-gray-900 font-black"
                  : "text-gray-500 font-medium hover:bg-[#f0e4da]/50"
              }`}
            >
              <div className="flex items-center gap-2">
                {selectedCategoryId === null && (
                  <div className="absolute left-0 w-1 h-5 bg-[#CC0D39] rounded-r-full"></div>
                )}
                <span className="text-[13px] leading-[1.3] line-clamp-2">
                  All Categories
                </span>
              </div>
            </button>

            {filteredCategories.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategoryId(category._id)}
                className={`w-full py-3.5 px-3 text-left transition-all relative ${
                  selectedCategoryId === category._id
                    ? " text-gray-900 font-black"
                    : "text-gray-500 font-medium hover:bg-[#f0e4da]/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {selectedCategoryId === category._id && (
                    <div className="absolute left-0 w-1 h-5 bg-[#CC0D39] rounded-r-full"></div>
                  )}
                  <span className="text-[13px] leading-[1.3] line-clamp-2">
                    {category.name}
                  </span>
                </div>
              </button>
            ))}
            <div className="h-20"></div>
          </div>
        </aside>

        {/* Main Content Area - Subcategories */}
        <main className="flex-1 bg-white overflow-y-auto no-scrollbar p-5 pb-24 [touch-action:pan-y]">
          {filteredSubCategories.length > 0 ? (
            <div className="grid grid-cols-3 gap-x-3 gap-y-3">
              {filteredSubCategories.map((sub) => (
                <Link
                  key={sub._id}
                  to={`/shop?area=${encodeURIComponent(
                    productAreas.find((a) => a._id === selectedAreaId)?.name ||
                      "",
                  )}&category=${encodeURIComponent(
                    categories.find((c) => c._id === selectedCategoryId)
                      ?.name || "",
                  )}&subcategory=${encodeURIComponent(sub.name)}`}
                  className="flex flex-col items-center gap-2 group active:scale-95 transition-transform"
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden transition-all border border-[#f0e4da]/20">
                    <img
                      src={sub.imageUrl || "/category.png"}
                      alt={sub.name}
                      onError={(e) => {
                        e.currentTarget.src = "/category.png";
                      }}
                      className="w-18 h-18 object-contain transition-transform"
                    />
                  </div>

                  <span className="text-[11px] font-bold text-gray-500 text-center leading-tight line-clamp-2 px-1">
                    {sub.name}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <p className="text-sm font-medium">
                No categories in this section
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryMobileView;
