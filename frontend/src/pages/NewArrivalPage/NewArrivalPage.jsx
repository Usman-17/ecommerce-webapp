import LottieComponent from "lottie-react";
import emptyAnimation from "../../assets/lottie/Empty.json";

import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { Filter, ChevronRight } from "lucide-react";

import { useShopFilters } from "../../hooks/useShopFilters";
import { useGetAllProducts } from "../../hooks/useGetAllProducts";
import newArrivalBanner from "../../assets/new-arrivals.webp";

import ProductCard from "../../components/ProductCard";
import SortDropdown from "../ShopPage/components/SortDropdown";
import MobileFilterDrawer from "../ShopPage/components/MobileFilterDrawer";
import DesktopFilterSidebar from "../ShopPage/components/DesktopFilterSidebar";
import ProductGridControls from "../ShopPage/components/ProductGridControls";
import FilterSkeleton from "../../components/Skeleton/FilterSkeleton";
import SEO from "../../components/SEO";
// Imports End------

const Lottie = LottieComponent?.default || LottieComponent;

const NewArrivalPage = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const mobileDrawerRef = useRef(null);

  // Get new arrivals products
  const { newArrivalsProducts, productIsLoading: productsLoading } =
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
  } = useShopFilters({ initialProducts: newArrivalsProducts });

  const toggleMobileFilter = () => setIsMobileFilterOpen((v) => !v);
  const closeMobileFilter = () => setIsMobileFilterOpen(false);

  return (
    <div className="min-h-screen -mt-1.5 sm:mt-0 pb-10 sm:pb-4 sm:py-3 sm:px-[4vw]">
      <SEO
        title="New Arrivals"
        description="Discover the latest jewelry, makeup & beauty products, and hair accessories at Jemzy. Be the first to shop our newest collections."
        keywords="new arrivals, latest jewelry, new makeup products, new hair accessories"
        url="/new-arrivals"
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

      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-3 px-1">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight size={14} className="text-gray-400" />
        <span className="text-gray-900 font-medium">New Arrivals</span>
      </nav>

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

        {/* Right Section: Products */}
        <section className="lg:col-span-3">
          <div className="mb-4">
            <img
              src={newArrivalBanner}
              alt="New Arrivals"
              className="w-full h-55 object-cover"
            />
          </div>

          <div className="mb-2 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="hidden sm:block text-sm text-gray-700">
                New Arrivals — {sortedProducts.length} of {allProducts.length}{" "}
                results
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

            {/* Products section */}
            <section>
              {sortedProducts.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-8">
                  <Lottie
                    animationData={emptyAnimation}
                    loop={false}
                    className="w-80 h-80"
                  />
                  <p className="mt-4 text-center text-gray-500 text-sm">
                    We couldn`&apos;t find any products for your selected
                    filters. Try different options.
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

export default NewArrivalPage;
