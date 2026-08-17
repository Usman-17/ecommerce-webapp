import { useState, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { useShopFilters } from "../../hooks/useShopFilters";
import { useGetAllSubCategories } from "../../hooks/useGetAllSubCategories";
import { useGetAllProductAreas } from "../../hooks/useGetAllProductAreas";

import ProductCard from "../../components/ProductCard";
import ProductCardSkeleton from "../../components/Skeleton/ProductCardSkeleton";

import ShopHeader from "./components/ShopHeader";
import SortDropdown from "./components/SortDropdown";
import MobileFilterDrawer from "./components/MobileFilterDrawer";
import DesktopFilterSidebar from "./components/DesktopFilterSidebar";
import ProductGridControls from "./components/ProductGridControls";

import LottieComponent from "lottie-react";
import emptyAnimation from "../../assets/lottie/Empty.json";
import SEO from "../../components/SEO";

const Lottie = LottieComponent?.default || LottieComponent;
// Imports End------

const ShopPage = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const mobileDrawerRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get("category");
  const subcategoryParam = searchParams.get("subcategory");
  const areaParam = searchParams.get("area");

  const selectedSubCategoriesFromUrl = useMemo(
    () => (subcategoryParam ? [subcategoryParam] : []),
    [subcategoryParam],
  );

  const selectedAreasFromUrl = useMemo(
    () => (areaParam ? [areaParam] : []),
    [areaParam],
  );

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
    getAreaProductCount,
    hasActiveFilters,
    clearAllFilters,
    colorsLoading,
    sizesLoading,
    categoriesLoading,
    filtersLoading,
  } = useShopFilters({
    setSearchParams,
    categoryParam,
    areaParam,
    subcategoryParam,
  });

  const { areas: productAreas = [] } = useGetAllProductAreas();
  const { subCategories } = useGetAllSubCategories();

  // Filter categories for current area
  const areaCategories = (() => {
    if (!areaParam) return [];
    const currentArea = productAreas.find((a) => a.name === areaParam);
    if (!currentArea) return [];
    return categories.filter((c) => c.areaId === currentArea._id);
  })();

  // Filter subcategories for current category
  const categorySubCategories = (() => {
    if (!categoryParam) return [];
    const currentCat = categories.find((c) => c.name === categoryParam);
    if (!currentCat) return [];
    return subCategories.filter((sc) => sc.categoryId === currentCat._id);
  })();

  const toggleMobileFilter = () => setIsMobileFilterOpen((v) => !v);
  const closeMobileFilter = () => setIsMobileFilterOpen(false);

  const breadcrumbLabel = (() => {
    if (subcategoryParam) return subcategoryParam;
    if (categoryParam) return categoryParam;
    if (areaParam) return areaParam;
    return null;
  })();

  return (
    <div className="min-h-screen -mt-1.5 sm:mt-0 pb-10 sm:pb-4 sm:py-3 px-0 sm:px-[4vw]">
      <SEO
        title="Shop - Jewelry, Makeup & Beauty, Hair Accessories"
        description="Browse our complete collection of jewelry, makeup & beauty products, and hair accessories. Find trending necklaces, bracelets, earrings, cosmetics and more at affordable prices."
        keywords="shop jewelry, buy makeup, hair accessories online, necklaces, bracelets, earrings, cosmetics Pakistan"
        url="/shop"
      />
      <ShopHeader
        breadcrumbLabel={breadcrumbLabel}
        areaParam={areaParam}
        categoryParam={categoryParam}
        subcategoryParam={subcategoryParam}
        areaCategories={areaCategories}
        categorySubCategories={categorySubCategories}
        toggleMobileFilter={toggleMobileFilter}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <DesktopFilterSidebar
          hasActiveFilters={hasActiveFilters}
          clearAllFilters={clearAllFilters}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          actualPriceRange={actualPriceRange}
          areas={productAreas}
          selectedAreas={selectedAreasFromUrl}
          setSelectedAreas={(names) => {
            if (names.length > 0) {
              setSearchParams({ area: names[names.length - 1] });
            } else {
              setSearchParams({});
            }
          }}
          getAreaProductCount={getAreaProductCount}
          areasLoading={false}
          subCategories={categories}
          selectedSubCategories={selectedSubCategoriesFromUrl}
          setSelectedSubCategories={(names) => {
            if (names.length > 0) {
              setSearchParams({ subcategory: names[names.length - 1] });
            } else {
              setSearchParams({});
            }
          }}
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

        {/* Right Section: Products */}
        <section className="lg:col-span-3">
          <div className="mb-2 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="hidden sm:block text-sm text-gray-700">
                Showing {sortedProducts.length} of {allProducts.length} results
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
              areas={productAreas}
              selectedAreas={selectedAreasFromUrl}
              setSelectedAreas={(names) => {
                if (names.length > 0) {
                  setSearchParams({ area: names[names.length - 1] });
                } else {
                  setSearchParams({});
                }
              }}
              getAreaProductCount={getAreaProductCount}
              areasLoading={false}
              subCategories={categories}
              selectedSubCategories={selectedSubCategoriesFromUrl}
              setSelectedSubCategories={(names) => {
                if (names.length > 0) {
                  setSearchParams({ subcategory: names[names.length - 1] });
                } else {
                  setSearchParams({});
                }
              }}
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
              {filtersLoading ? (
                <div
                  className={`sm:grid ${getGridClass(gridColumns)} gap-1.5 sm:gap-2 columns-2 sm:columns-auto space-y-2 sm:space-y-0`}
                >
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="break-inside-avoid mb-2 sm:mb-0">
                      <ProductCardSkeleton />
                    </div>
                  ))}
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-8">
                  <Lottie
                    animationData={emptyAnimation}
                    loop={false}
                    className="w-80 h-80"
                  />
                  <p className="max-w-xs sm:max-w-sm mt-4 text-center text-gray-500 text-sm">
                    We couldn&apos;t find any products for your selected
                    filters. Try different options.
                  </p>
                </div>
              ) : (
                <div
                  className={`sm:grid ${getGridClass(gridColumns)} gap-1.5 sm:gap-2 columns-2 sm:columns-auto space-y-2 sm:space-y-0`}
                >
                  {sortedProducts.map((product) => (
                    <div
                      key={product._id}
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

export default ShopPage;
