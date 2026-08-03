import { useState, useRef, useEffect } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { ChevronDown, ChevronRight, LayoutGrid, RotateCcw } from "lucide-react";

import ProductCard from "../../components/ProductCard";
import ProductCardSkeleton from "../../components/Skeleton/ProductCardSkeleton";
import StillHaveQuestions from "../../components/StillHaveQuestions";

import SortDropdown from "../ShopPage/components/SortDropdown";

import filterIcon from "../../assets/filter.png";
import mainBanner from "../../assets/category/main.webp";
import categoryTopBanner from "../../assets/category/top.webp";
import bottomBanner from "../../assets/category/bottom.webp";
import sidebarBannerImg from "../../assets/category/sidebar.webp";

import LottieComponent from "lottie-react";
import emptyAnimation from "../../assets/lottie/Empty.json";

const Lottie = LottieComponent?.default || LottieComponent;
// Imports End-----

const CategoryDesktopView = ({
  productAreas,
  categories,
  subCategories,
  products,
  allProducts,
  selectedAreaId,
  selectedCategoryId,
  selectedSubCategoryId,
  selectedColorIds,
  selectedSizeIds,
  setSelectedAreaId,
  setSelectedCategoryId,
  setSelectedSubCategoryId,
  toggleColor,
  toggleSize,
  clearAllFilters,
  colors,
  sizes,
  sortBy,
  setSortBy,
  areasLoading,
  productsLoading,
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasActiveFilters = !!(
    selectedAreaId ||
    selectedCategoryId ||
    selectedSubCategoryId ||
    selectedColorIds.length > 0 ||
    selectedSizeIds.length > 0
  );

  const handleClearAll = () => {
    setSelectedAreaId(null);
    setSelectedCategoryId(null);
    setSelectedSubCategoryId(null);
    clearAllFilters();
    setActiveDropdown(null);
  };

  // Filter products based on selection
  const hasCategoryFilter =
    selectedAreaId || selectedCategoryId || selectedSubCategoryId;
  const sourceProducts = hasCategoryFilter ? products : allProducts || products;
  const displayProducts = sourceProducts.filter((p) => {
    // 1. Level Filtering (Tree)
    if (
      selectedSubCategoryId &&
      (p.subCategoryId || p.productSubCategoryId) !== selectedSubCategoryId
    ) {
      return false;
    }
    if (
      selectedCategoryId &&
      !selectedSubCategoryId &&
      (p.categoryId || p.productCategoryId) !== selectedCategoryId
    ) {
      return false;
    }
    if (selectedAreaId && !selectedCategoryId) {
      const productCategoryId = p.categoryId || p.productCategoryId;
      const productCategory = categories.find(
        (c) => (c.productCategoryId || c._id) === productCategoryId,
      );
      const catAreaId =
        productCategory?.productAreaId || productCategory?.areaId;
      if (catAreaId !== selectedAreaId) return false;
    }

    // 2. Color Filtering
    if (selectedColorIds.length > 0) {
      const hasMatch = p.productOptionResponses?.some(
        (opt) =>
          opt.productOptionTypeName?.toLowerCase() === "color" &&
          opt.productOptionDetailResponses?.some((detail) =>
            selectedColorIds.some((cid) => cid == detail.variantOptionId),
          ),
      );
      if (!hasMatch) return false;
    }

    // 3. Size Filtering
    if (selectedSizeIds.length > 0) {
      const hasMatch = p.productOptionResponses?.some(
        (opt) =>
          opt.productOptionTypeName?.toLowerCase() === "size" &&
          opt.productOptionDetailResponses?.some((detail) =>
            selectedSizeIds.some((sid) => sid == detail.variantOptionId),
          ),
      );
      if (!hasMatch) return false;
    }

    return true;
  });

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
  ];

  const isSale = (product) => {
    const priceDetail = product?.productPriceDetailResponse || {};
    const salePrice =
      priceDetail.salePrice ||
      product.salePrice ||
      product.productSalePrice ||
      0;
    const netSalePrice = priceDetail.netSalePrice || product.netSalePrice || 0;
    return netSalePrice > 0 && netSalePrice < salePrice;
  };

  const sortedProducts = [...displayProducts].sort((a, b) => {
    const getPrice = (product) => {
      const priceDetail = product?.productPriceDetailResponse || {};
      const salePrice =
        priceDetail.salePrice ||
        product.salePrice ||
        product.productSalePrice ||
        0;
      const netSalePrice =
        priceDetail.netSalePrice || product.netSalePrice || 0;
      return isSale(product) ? netSalePrice : salePrice;
    };

    switch (sortBy) {
      case "price-asc":
        return getPrice(a) - getPrice(b);
      case "price-desc":
        return getPrice(b) - getPrice(a);
      case "name-asc":
        return (a.productName || "").localeCompare(b.productName || "");
      case "name-desc":
        return (b.productName || "").localeCompare(a.productName || "");
      case "newest":
      default:
        return (b.productId || 0) - (a.productId || 0);
    }
  });

  const isFilterActive = (filter) => {
    if (filter === "Area") return selectedAreaId !== null;
    if (filter === "Color") return selectedColorIds.length > 0;
    if (filter === "Size") return selectedSizeIds.length > 0;
    return false;
  };

  return (
    <div className="min-h-[60vh] pb-10 sm:pb-12 px-0 md:px-[2vw] lg:px-[5vw] lg:pt-2">
      <div className="flex gap-6 items-start mt-4">
        <div className="hidden lg:flex flex-col gap-4 shrink-0 w-72">
          <aside className="hidden lg:flex shrink-0 bg-[#fffaf5] border border-[#f0e4da] rounded-xl overflow-hidden shadow-sm flex-col max-h-[calc(100vh-280px)]">
            <div className="-mt-2 py-2 overflow-y-auto no-scrollbar">
              {/* All Categories Button */}
              <button
                onClick={() => {
                  setSelectedAreaId(null);
                  setSelectedCategoryId(null);
                  setSelectedSubCategoryId(null);
                }}
                className={`flex items-center gap-3 px-5 py-3 text-[14px] font-bold transition-all border-b border-[#f0e4da] w-full text-left ${
                  selectedAreaId === null
                    ? "text-[#CC0D39] bg-[#CC0D39]/5"
                    : "text-gray-700 hover:bg-[#f0e4da]/50"
                }`}
              >
                <LayoutGrid
                  size={16}
                  className={
                    selectedAreaId === null ? "text-[#CC0D39]" : "text-gray-400"
                  }
                />
                <span>All Categories</span>
              </button>

              {areasLoading ? (
                <div className="px-5 py-3 flex flex-col gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <SkeletonTheme
                        baseColor="#f0e6dc"
                        highlightColor="#fffcf9"
                        duration={1}
                      >
                        <Skeleton width={16} height={16} circle />
                      </SkeletonTheme>
                      <SkeletonTheme
                        baseColor="#f0e6dc"
                        highlightColor="#fffcf9"
                        duration={1}
                      >
                        <Skeleton width={120} height={14} />
                      </SkeletonTheme>
                    </div>
                  ))}
                </div>
              ) : (
                productAreas.map((area) => {
                  const areaId = area.productAreaId || area._id;
                  const areaName = area.productAreaName || area.name;
                  const isAreaActive = selectedAreaId === areaId;
                  const areaCategories = categories.filter(
                    (c) => (c.productAreaId || c.areaId) === areaId,
                  );

                  return (
                    <div key={areaId} className="flex flex-col">
                      <button
                        onClick={() => {
                          setSelectedAreaId(isAreaActive ? null : areaId);
                          setSelectedCategoryId(null);
                        }}
                        className={`flex items-center justify-between px-5 py-3 text-[13px] font-bold transition-all ${
                          isAreaActive
                            ? "text-[#CC0D39] bg-[#CC0D39]/5"
                            : "text-gray-700 hover:bg-[#f0e4da]/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {(area.productAreaImageURL || area.imageUrl) && (
                            <img
                              src={area.productAreaImageURL || area.imageUrl}
                              alt={areaName}
                              className="w-4 h-4 object-contain shrink-0"
                            />
                          )}
                          <span>{areaName}</span>
                        </div>
                        {areaCategories.length > 0 &&
                          (isAreaActive ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} className="text-gray-400" />
                          ))}
                      </button>

                      {/* Level 2: Categories */}
                      {isAreaActive && (
                        <div className="flex flex-col ml-6 border-l border-gray-100">
                          {areaCategories.map((cat) => {
                            const catId = cat.productCategoryId || cat._id;
                            const catName = cat.productCategoryName || cat.name;
                            const isCatActive = selectedCategoryId === catId;
                            const catSubCategories = subCategories.filter(
                              (s) =>
                                (s.productCategoryId || s.categoryId) === catId,
                            );

                            return (
                              <div key={catId} className="flex flex-col">
                                <button
                                  onClick={() =>
                                    setSelectedCategoryId(
                                      isCatActive ? null : catId,
                                    )
                                  }
                                  className={`flex items-center justify-between pl-4 pr-5 py-2 text-[12.5px] font-semibold transition-all relative ${
                                    isCatActive
                                      ? "text-[#CC0D39]"
                                      : "text-gray-600 hover:text-gray-900"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-1.5 h-1.5 rounded-full ${isCatActive ? "bg-[#CC0D39]" : "bg-gray-200"}`}
                                    ></div>
                                    <span className="line-clamp-1">
                                      {catName}
                                    </span>
                                  </div>
                                  {catSubCategories.length > 0 &&
                                    (isCatActive ? (
                                      <ChevronDown size={12} />
                                    ) : (
                                      <ChevronRight
                                        size={12}
                                        className="text-gray-400"
                                      />
                                    ))}
                                </button>

                                {/* Level 3: Subcategories */}
                                {isCatActive && (
                                  <div className="flex flex-col ml-4 mb-2">
                                    {catSubCategories.map((sub) => {
                                      const subId =
                                        sub.productSubCategoryId || sub._id;
                                      const subName =
                                        sub.productSubCategoryName || sub.name;
                                      const isSubActive =
                                        selectedSubCategoryId === subId;
                                      return (
                                        <button
                                          key={sub.key || subId}
                                          onClick={() =>
                                            setSelectedSubCategoryId(
                                              isSubActive ? null : subId,
                                            )
                                          }
                                          className={`pl-6 pr-5 py-1.5 text-[12px] font-medium transition-colors border-l border-[#f0e4da] text-left ${
                                            isSubActive
                                              ? "text-[#CC0D39] font-bold"
                                              : "text-gray-500 hover:text-[#CC0D39]"
                                          }`}
                                        >
                                          {subName}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          <div className="hidden lg:block rounded-2xl overflow-hidden">
            <img
              src={sidebarBannerImg}
              alt="Category Banner"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="hidden lg:block">
            <StillHaveQuestions />
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          {/* Header Section: Banner Row or Dynamic Selection Title */}
          {!selectedAreaId && !selectedCategoryId && !selectedSubCategoryId ? (
            <div className="flex h-72 md:h-100 lg:h-90 gap-3 mb-4 overflow-hidden mx-0 md:mx-[-8vw] lg:mx-0">
              {/* Center: Main Category Banner */}
              <div className="flex-1 rounded-none md:rounded-xl overflow-hidden">
                <img
                  src={mainBanner}
                  alt="Hero Banner"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right: Two Stacked Side Banners */}
              <div className="hidden lg:flex w-72 shrink-0 flex-col gap-2">
                <div className="flex-1 rounded-xl overflow-hidden ">
                  <img
                    src={categoryTopBanner}
                    alt="Hero Top Banner"
                    className="w-full h-full object-cover transition-transform duration-700"
                  />
                </div>

                <div className="flex-1 rounded-xl overflow-hidden ">
                  <img
                    src={bottomBanner}
                    alt="Hero Bottom Banner"
                    className="w-full h-full object-cover transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 pt-2 animate-fade-in">
              <h1 className="text-3xl font-bold text-gray-700 tracking-tight">
                {selectedSubCategoryId
                  ? subCategories.find(
                      (s) =>
                        (s.productSubCategoryId || s._id) ===
                        selectedSubCategoryId,
                    )?.productSubCategoryName ||
                    subCategories.find(
                      (s) =>
                        (s.productSubCategoryId || s._id) ===
                        selectedSubCategoryId,
                    )?.name
                  : selectedCategoryId
                    ? categories.find(
                        (c) =>
                          (c.productCategoryId || c._id) === selectedCategoryId,
                      )?.productCategoryName ||
                      categories.find(
                        (c) =>
                          (c.productCategoryId || c._id) === selectedCategoryId,
                      )?.name
                    : productAreas.find(
                        (a) => (a.productAreaId || a._id) === selectedAreaId,
                      )?.productAreaName ||
                      productAreas.find(
                        (a) => (a.productAreaId || a._id) === selectedAreaId,
                      )?.name}
              </h1>
              <div className="h-1 w-12 bg-[#CC0D39] mt-2 rounded-full" />
            </div>
          )}

          {/* Toolbar: Filter & Sort Section */}
          <div className="flex items-center justify-between px-3 md:px-0 lg:px-2">
            {/* Left: Filter Options */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-700 font-bold text-[14px]">
                <img
                  src={filterIcon}
                  alt="Filter"
                  className="w-4 h-4 object-contain"
                />
                <span>Filter By</span>
              </div>

              <div className="h-6 w-[1.5px] bg-gray-200 mx-2"></div>

              <div
                className="flex items-center gap-2 relative"
                ref={dropdownRef}
              >
                {["Area", "Color", "Size"].map((filter) => (
                  <div
                    key={filter}
                    className={`relative ${filter === "Area" ? "lg:hidden" : ""}`}
                  >
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === filter ? null : filter,
                        )
                      }
                      className={`flex items-center gap-2 px-4 py-2 border rounded-full text-[13px] font-medium transition-all bg-white shadow-sm relative ${
                        activeDropdown === filter
                          ? "text-black border-gray-100"
                          : "border-gray-100 text-gray-600 hover:border-gray-300 hover:text-black"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isFilterActive(filter) && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#CC0D39] animate-pulse" />
                        )}
                        <span>{filter}</span>
                      </div>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          activeDropdown === filter ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === filter && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-lg shadow-xl z-100 py-3 animate-fade-in">
                        <div className="max-h-60 overflow-y-auto no-scrollbar px-2">
                          {filter === "Area" &&
                            (productAreas.length > 0 ? (
                              productAreas.map((area) => {
                                const areaId = area.productAreaId || area._id;
                                const areaName =
                                  area.productAreaName || area.name;
                                const isActive = selectedAreaId === areaId;
                                return (
                                  <button
                                    key={areaId}
                                    onClick={() => {
                                      setSelectedAreaId(
                                        isActive ? null : areaId,
                                      );
                                      setSelectedCategoryId(null);
                                      setSelectedSubCategoryId(null);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-[13px] rounded-lg transition-colors flex items-center justify-between ${
                                      isActive
                                        ? "bg-[#CC0D39]/5 text-[#CC0D39] font-bold"
                                        : "text-gray-600 hover:bg-[#f0e4da]/50 hover:text-gray-900"
                                    }`}
                                  >
                                    <span>{areaName}</span>
                                    {isActive && (
                                      <div className="w-1.5 h-1.5 rounded-full bg-[#CC0D39]" />
                                    )}
                                  </button>
                                );
                              })
                            ) : (
                              <p className="px-4 py-2 text-[12px] text-gray-400 italic">
                                No areas available
                              </p>
                            ))}

                          {filter === "Color" &&
                            (colors.length > 0 ? (
                              colors.map((color) => {
                                const colorId =
                                  color.colorId || color.productColorId;
                                const isActive = selectedColorIds.some(
                                  (id) => id == colorId,
                                );
                                const hexCode = (
                                  color.hexCode ||
                                  color.productHexCode ||
                                  color.colorCode ||
                                  color.productColorCode ||
                                  color.colorName ||
                                  color.productColorName ||
                                  ""
                                ).toLowerCase();
                                return (
                                  <button
                                    key={colorId}
                                    onClick={() => toggleColor(colorId)}
                                    className={`w-full text-left px-4 py-2 text-[13px] rounded-lg transition-colors flex items-center justify-between ${
                                      isActive
                                        ? "bg-[#CC0D39]/5 text-[#CC0D39] font-bold"
                                        : "text-gray-600 hover:bg-[#f0e4da]/50 hover:text-gray-900"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div
                                        className="w-4 h-4 rounded-full border border-[#f0e4da] shadow-sm"
                                        style={{ backgroundColor: hexCode }}
                                      ></div>
                                      <span className="flex flex-col">
                                        <span className="leading-tight">
                                          {color.colorName ||
                                            color.productColorName}
                                        </span>
                                      </span>
                                    </div>
                                    {isActive && (
                                      <div className="w-1.5 h-1.5 rounded-full bg-[#CC0D39]" />
                                    )}
                                  </button>
                                );
                              })
                            ) : (
                              <p className="px-4 py-2 text-[12px] text-gray-400 italic">
                                No colors available
                              </p>
                            ))}

                          {filter === "Size" &&
                            (sizes.length > 0 ? (
                              <div className="flex flex-col gap-1">
                                {sizes.map((size) => {
                                  const sizeId =
                                    size.sizeId || size.productSizeId;
                                  const isActive = selectedSizeIds.some(
                                    (id) => id == sizeId,
                                  );
                                  return (
                                    <button
                                      key={sizeId}
                                      onClick={() => toggleSize(sizeId)}
                                      className={`w-full text-left px-4 py-2 text-[13px] rounded-lg transition-colors flex items-center justify-between ${
                                        isActive
                                          ? "bg-[#CC0D39]/5 text-[#CC0D39] font-bold"
                                          : "text-gray-600 hover:bg-[#f0e4da]/50 hover:text-gray-900"
                                      }`}
                                    >
                                      <span>
                                        {size.sizeName || size.productSizeName}
                                      </span>
                                      {isActive && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#CC0D39]" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="px-4 py-2 text-[12px] text-gray-400 italic">
                                No sizes available
                              </p>
                            ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-50 px-4 flex items-center justify-between">
                          <button
                            onClick={() => {
                              if (filter === "Color") toggleColor(null, true);
                              if (filter === "Size") toggleSize(null, true);
                              setActiveDropdown(null);
                            }}
                            className="text-[11px] font-bold text-gray-400 hover:text-black transition-colors uppercase"
                          >
                            Clear
                          </button>
                          <button
                            onClick={() => setActiveDropdown(null)}
                            className="text-[11px] font-bold text-[#CC0D39] hover:text-[#CC0D39]/80 transition-colors uppercase"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {hasActiveFilters && (
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#CC0D39]/5 text-[#CC0D39] rounded-full text-[13px] font-bold hover:bg-[#CC0D39]/10 transition-all border border-[#CC0D39]/10 shadow-sm animate-fade-in"
                  >
                    <RotateCcw size={14} />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right: Sort & View Toggle */}
            <div className="flex items-center gap-6">
              <SortDropdown
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
              />
            </div>
          </div>

          {/* Product Results Section */}
          <div className="mt-4 flex flex-col gap-6">
            <div className="flex items-center justify-between text-gray-500 text-[14px]">
              {productsLoading ? (
                <SkeletonTheme
                  baseColor="#f0e6dc"
                  highlightColor="#fffcf9"
                  duration={1}
                >
                  <Skeleton width={180} height={14} />
                </SkeletonTheme>
              ) : (
                <span>
                  Showing 1-{Math.min(12, sortedProducts.length)} of{" "}
                  {sortedProducts.length} results
                </span>
              )}
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {[...Array(10)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-[#fef8f3] rounded-3xl border border-dashed border-[#f0e4da] flex flex-col items-center gap-4">
                <Lottie
                  animationData={emptyAnimation}
                  style={{ width: 150, height: 150 }}
                  loop={false}
                />
                <p className="text-gray-400 font-medium">
                  {selectedColorIds.length > 0 && selectedSizeIds.length > 0
                    ? "No products found with selected color and size."
                    : selectedColorIds.length > 0
                      ? "No products found in this color."
                      : selectedSizeIds.length > 0
                        ? "No products found in this size."
                        : "No products found in this category."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDesktopView;
