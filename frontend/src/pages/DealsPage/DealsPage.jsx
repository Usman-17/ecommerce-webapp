import LottieComponent from "lottie-react";
import emptyAnimation from "../../assets/lottie/Empty.json";

import { Filter } from "lucide-react";
import { useState, useRef } from "react";

import { useShopFilters } from "../../hooks/useShopFilters";
import { useGetAllProducts } from "../../hooks/useGetAllProducts";
import dealsBanner from "../../assets/deals.webp";

import ProductCard from "../../components/ProductCard";
import SortDropdown from "../ShopPage/components/SortDropdown";
import FilterSkeleton from "../../components/Skeleton/FilterSkeleton";
import MobileFilterDrawer from "../ShopPage/components/MobileFilterDrawer";
import ProductGridControls from "../ShopPage/components/ProductGridControls";
import DesktopFilterSidebar from "../ShopPage/components/DesktopFilterSidebar";
import SEO from "../../components/SEO";
// Imports End------

const Lottie = LottieComponent?.default || LottieComponent;

const DealsPage = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const mobileDrawerRef = useRef(null);

  const { dealsProducts, productIsLoading: productsLoading } =
    useGetAllProducts();

  const {
    allProducts,
    sortedProducts,
    colors,
    sizes,
    categories,
    priceRange,
    setPriceRange,
    actualPriceRange,
    selectedColors,
    setSelectedColors,
    selectedSizes,
    setSelectedSizes,
    sortBy,
    setSortBy,
    gridColumns,
    setGridColumns,
    isColorLight,
    sortOptions,
    getGridClass,
    getColorProductCount,
    getSizeProductCount,
    getCategoryProductCount,
    hasActiveFilters,
    clearAllFilters,
    colorsLoading,
    sizesLoading,
    categoriesLoading,
  } = useShopFilters({ initialProducts: dealsProducts });

  const toggleMobileFilter = () => setIsMobileFilterOpen((v) => !v);
  const closeMobileFilter = () => setIsMobileFilterOpen(false);

  return (
    <div className="min-h-screen -mt-1.5 sm:mt-0 pb-10 sm:pb-4 sm:py-3 sm:px-[4vw]">
      <SEO
        title="Deals"
        description="Grab the best deals on jewelry, makeup & beauty products, and hair accessories at Jemzy. Limited time offers you don't want to miss."
        keywords="deals, offers, discounts, sale, jewelry deals, makeup deals"
        url="/deals"
      />
      <div className="flex items-center justify-between">
        <button
          onClick={toggleMobileFilter}
          className="lg:hidden flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full transition-all duration-200"
        >
          <Filter size={16} className="text-gray-500" />
          <span className="text-sm font-medium">Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {productsLoading ? (
          <FilterSkeleton />
        ) : (
          <DesktopFilterSidebar
            hasActiveFilters={hasActiveFilters}
            clearAllFilters={clearAllFilters}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            actualPriceRange={actualPriceRange}
            subCategories={categories}
            selectedSubCategories={[]}
            setSelectedSubCategories={() => {}}
            getSubCategoryProductCount={getCategoryProductCount}
            colors={colors}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            getColorProductCount={getColorProductCount}
            isColorLight={isColorLight}
            sizes={sizes}
            selectedSizes={selectedSizes}
            setSelectedSizes={setSelectedSizes}
            getSizeProductCount={getSizeProductCount}
            categoriesLoading={categoriesLoading}
            colorsLoading={colorsLoading}
            sizesLoading={sizesLoading}
          />
        )}

        <section className="lg:col-span-3">
          <div className="mb-4 mt-0.5">
            <img
              src={dealsBanner}
              alt="Deals"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          <div className="mb-2 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="hidden sm:block text-sm text-gray-700">
                Deals — {sortedProducts.length} of {allProducts.length} results
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <ProductGridControls
                  gridColumns={gridColumns}
                  setGridColumns={setGridColumns}
                />
              </div>

              <div className="hidden sm:block">
                <SortDropdown
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                />
              </div>
            </div>
          </div>

          <div>
            <MobileFilterDrawer
              isOpen={isMobileFilterOpen}
              onClose={closeMobileFilter}
              drawerRef={mobileDrawerRef}
              hasActiveFilters={hasActiveFilters}
              clearAllFilters={clearAllFilters}
              sortOptions={sortOptions}
              sortBy={sortBy}
              setSortBy={setSortBy}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              actualPriceRange={actualPriceRange}
              subCategories={categories}
              selectedSubCategories={[]}
              setSelectedSubCategories={() => {}}
              getSubCategoryProductCount={getCategoryProductCount}
              colors={colors}
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
              getColorProductCount={getColorProductCount}
              isColorLight={isColorLight}
              sizes={sizes}
              selectedSizes={selectedSizes}
              setSelectedSizes={setSelectedSizes}
              getSizeProductCount={getSizeProductCount}
              categoriesLoading={categoriesLoading}
              colorsLoading={colorsLoading}
              sizesLoading={sizesLoading}
            />

            <section>
              {sortedProducts.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-8">
                  <Lottie
                    animationData={emptyAnimation}
                    loop={false}
                    className="w-80 h-80"
                  />
                  <p className="mt-4 text-center text-gray-500 text-sm">
                    No deals available right now. Check back soon!
                  </p>
                </div>
              ) : (
                <div
                  className={`sm:grid ${getGridClass(gridColumns)} gap-1.5 sm:gap-2 columns-2 sm:columns-auto space-y-2 sm:space-y-0`}
                >
                  {sortedProducts.map((product) => (
                    <div
                      key={product.productSlug}
                      className="break-inside-avoid mb-2 sm:mb-0"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DealsPage;
