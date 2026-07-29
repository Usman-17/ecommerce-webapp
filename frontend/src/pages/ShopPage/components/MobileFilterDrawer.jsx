import { useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";

import SizeFilter from "../filters/SizeFilter";
import PriceFilter from "../filters/PriceFilter";
import ColorFilter from "../filters/ColorFilter";
import CategoryFilter from "../filters/CategoryFilter";

const MobileFilterDrawer = ({
  isOpen,
  onClose,
  hasActiveFilters,
  clearAllFilters,
  sortOptions,
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
  actualPriceRange,
  subCategories,
  selectedSubCategories,
  setSelectedSubCategories,
  getSubCategoryProductCount,
  colors,
  selectedColors,
  setSelectedColors,
  getColorProductCount,
  isColorLight,
  sizes,
  selectedSizes,
  setSelectedSizes,
  getSizeProductCount,
  categoriesLoading,
  colorsLoading,
  sizesLoading,
}) => {
  useEffect(() => {
    if (isOpen) {
      window.history.pushState({ filterDrawer: true }, "");
      const handlePopState = () => onClose();
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-9998 lg:hidden"
          />

          {/* Drawer */}
          <Motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            dragDirectionLock
            onDragEnd={(event, info) => {
              if (info.offset.y > 80 || info.velocity.y > 200) {
                onClose();
              }
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 350,
              mass: 0.8,
            }}
            className="fixed bottom-0 left-0 right-0 z-9999 bg-[#fffaf5] rounded-t-2xl shadow-2xl max-h-[86vh] overflow-hidden flex flex-col will-change-transform lg:hidden"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-600 hover:text-red-500 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Sort By
                </h3>

                <div className="space-y-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-3 ${
                        sortBy === option.value
                          ? "text-primary font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          sortBy === option.value
                            ? "border-primary"
                            : "border-gray-300"
                        }`}
                      >
                        {sortBy === option.value && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Price Filter */}
              <div className="py-6">
                <PriceFilter
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  actualPriceRange={actualPriceRange}
                />
              </div>

              <div className="border-t border-gray-100" />

              {/* SubCategory Filter */}
              <div className="py-6">
                <CategoryFilter
                  subCategories={subCategories}
                  selectedSubCategories={selectedSubCategories}
                  setSelectedSubCategories={setSelectedSubCategories}
                  getSubCategoryProductCount={getSubCategoryProductCount}
                  initialItemCount={7}
                  isLoading={categoriesLoading}
                />
              </div>

              <div className="border-t border-gray-100" />

              {/* Colors Filter */}
              <div className="py-6">
                <ColorFilter
                  colors={colors}
                  selectedColors={selectedColors}
                  setSelectedColors={setSelectedColors}
                  getColorProductCount={getColorProductCount}
                  isColorLight={isColorLight}
                  initialItemCount={7}
                  isLoading={colorsLoading}
                />
              </div>

              <div className="border-t border-gray-100" />

              {/* Sizes Filter */}
              <div className="py-6">
                <SizeFilter
                  sizes={sizes}
                  selectedSizes={selectedSizes}
                  setSelectedSizes={setSelectedSizes}
                  getSizeProductCount={getSizeProductCount}
                  initialItemCount={7}
                  isLoading={sizesLoading}
                />
              </div>
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileFilterDrawer;
