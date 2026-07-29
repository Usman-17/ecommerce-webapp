import SizeFilter from "../filters/SizeFilter";
import PriceFilter from "../filters/PriceFilter";
import ColorFilter from "../filters/ColorFilter";
import CategoryFilter from "../filters/CategoryFilter";

const DesktopFilterSidebar = ({
  hasActiveFilters,
  clearAllFilters,
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
}) => (
  <aside className="hidden lg:block lg:col-span-1">
    <div className="bg-white  p-6 rounded-lg border border-[#f1e7db] shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-8">
      <div className="flex items-center justify-between">
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

      <PriceFilter
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        actualPriceRange={actualPriceRange}
      />

      <CategoryFilter
        subCategories={subCategories}
        selectedSubCategories={selectedSubCategories}
        setSelectedSubCategories={setSelectedSubCategories}
        getSubCategoryProductCount={getSubCategoryProductCount}
        initialItemCount={7}
        isLoading={categoriesLoading}
      />

      <ColorFilter
        colors={colors}
        selectedColors={selectedColors}
        setSelectedColors={setSelectedColors}
        getColorProductCount={getColorProductCount}
        isColorLight={isColorLight}
        initialItemCount={7}
        isLoading={colorsLoading}
      />

      <SizeFilter
        sizes={sizes}
        selectedSizes={selectedSizes}
        setSelectedSizes={setSelectedSizes}
        getSizeProductCount={getSizeProductCount}
        initialItemCount={7}
        isLoading={sizesLoading}
      />
    </div>
  </aside>
);

export default DesktopFilterSidebar;
