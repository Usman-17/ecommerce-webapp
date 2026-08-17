import { useState, useRef, useEffect, useMemo, useCallback } from "react";

import { useGetVariantOptions } from "./useGetVariantOptions";
import { useGetAllProducts } from "./useGetAllProducts";
import { useGetAllCategories } from "./useGetAllCategories";
import { useGetAllProductAreas } from "./useGetAllProductAreas";

const isSale = (product) => {
  const secondaryPrice = product?.secondaryPrice || 0;
  const price = product?.price || 0;
  return secondaryPrice > 0 && secondaryPrice > price;
};

const isColorLight = (colorStr) => {
  if (!colorStr) return false;
  try {
    const rgb = colorStr.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
      const r = parseInt(rgb[0]);
      const g = parseInt(rgb[1]);
      const b = parseInt(rgb[2]);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.7;
    }
    if (colorStr.startsWith("#")) {
      const hex = colorStr.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.7;
    }
  } catch {
    return false;
  }
  return false;
};

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

const getGridClass = (gridColumns) => {
  switch (gridColumns) {
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-2 sm:grid-cols-3";
    case 4:
      return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
    case 5:
    default:
      return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5";
  }
};

const useShopFilters = ({
  initialProducts,
  setSearchParams,
  categoryParam,
  areaParam,
  subcategoryParam,
  selectedAreas,
} = {}) => {
  const { allProducts, productIsLoading: isLoading } = useGetAllProducts();
  const { colors, sizes, variantOptionsLoading } = useGetVariantOptions();
  const { categories, isLoading: categoriesLoading } = useGetAllCategories();
  const { areas, isLoading: areasLoading } = useGetAllProductAreas();

  const products = initialProducts || allProducts;

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [actualPriceRange, setActualPriceRange] = useState([0, 10000]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [gridColumns, setGridColumns] = useState(5);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  // Calculate min/max price from products for slider
  const getPriceRange = useCallback(() => {
    if (products.length === 0) return [0, 10000];
    const prices = products
      .map((p) => p?.price || 0)
      .filter((price) => price > 0);

    if (prices.length === 0) return [0, 10000];
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return [minPrice, maxPrice];
  }, [products]);

  // Sync price range when products first load
  const priceRangeInited = useRef(false);
  useEffect(() => {
    if (products.length > 0 && !priceRangeInited.current) {
      priceRangeInited.current = true;
      const range = getPriceRange();
      setActualPriceRange(range);
      setPriceRange(range);
    }
  }, [products, getPriceRange]);

  // Reset init flag when products change (e.g., after refetch with different data)
  useEffect(() => {
    if (products.length === 0) {
      priceRangeInited.current = false;
    }
  }, [products]);

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Price filter
      const finalPrice = product?.price || 0;

      const priceMatch =
        finalPrice === 0 ||
        (finalPrice >= priceRange[0] && finalPrice <= priceRange[1]);

      // Color filter
      let colorMatch = true;
      if (selectedColors.length > 0) {
        const optionRequests = product.productOptionResponses || [];
        const selectedColorNames = new Set(selectedColors);
        colorMatch = optionRequests.some(
          (opt) =>
            (opt.productOptionTypeName || "").toLowerCase() === "color" &&
            (opt.productOptionDetailResponses || []).some((detail) =>
              selectedColorNames.has(detail.optionDetailName || ""),
            ),
        );
      }

      // Size filter
      let sizeMatch = true;
      if (selectedSizes.length > 0) {
        const optionRequests = product.productOptionResponses || [];
        const selectedSizeNames = new Set(selectedSizes);
        sizeMatch = optionRequests.some(
          (opt) =>
            (opt.productOptionTypeName || "").toLowerCase() === "size" &&
            (opt.productOptionDetailResponses || []).some((detail) =>
              selectedSizeNames.has(detail.optionDetailName || ""),
            ),
        );
      }

      // Subcategory filter
      const subCategoryMatch =
        !subcategoryParam ||
        subcategoryParam === (product.categoryName || "") ||
        subcategoryParam === (product.subCategoryName || "");

      // Category filter
      const categoryMatch =
        !categoryParam || product.categoryName === categoryParam;

      // Area filter
      const areaMatch =
        (!areaParam || product.areaName === areaParam) &&
        (!selectedAreas ||
          selectedAreas.length === 0 ||
          selectedAreas.includes(product.areaName || ""));

      return (
        priceMatch &&
        colorMatch &&
        sizeMatch &&
        subCategoryMatch &&
        categoryMatch &&
        areaMatch
      );
    });
  }, [
    products,
    priceRange,
    selectedColors,
    selectedSizes,
    categoryParam,
    areaParam,
    selectedAreas,
    subcategoryParam,
  ]);

  // Sort filtered products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const getPrice = (product) => product?.price || 0;

      switch (sortBy) {
        case "price-asc":
          return getPrice(a) - getPrice(b);
        case "price-desc":
          return getPrice(b) - getPrice(a);
        case "name-asc":
          return (a.title || "").localeCompare(b.title || "");
        case "name-desc":
          return (b.title || "").localeCompare(a.title || "");
        case "newest":
        default:
          return (b._id || "").localeCompare(a._id || "");
      }
    });
  }, [filteredProducts, sortBy]);

  // Count products per color
  const getColorProductCount = useCallback(
    (colorName) => {
      return products.filter((product) => {
        const optionRequests = product.productOptionResponses || [];
        return optionRequests.some(
          (opt) =>
            (opt.productOptionTypeName || "").toLowerCase() === "color" &&
            (opt.productOptionDetailResponses || []).some(
              (detail) => (detail.optionDetailName || "") === colorName,
            ),
        );
      }).length;
    },
    [products],
  );

  // Count products per size
  const getSizeProductCount = useCallback(
    (sizeName) => {
      return products.filter((product) => {
        const optionRequests = product.productOptionResponses || [];
        return optionRequests.some(
          (opt) =>
            (opt.productOptionTypeName || "").toLowerCase() === "size" &&
            (opt.productOptionDetailResponses || []).some(
              (detail) => (detail.optionDetailName || "") === sizeName,
            ),
        );
      }).length;
    },
    [products],
  );

  // Count products per category
  const getCategoryProductCount = useCallback(
    (categoryName) => {
      return products.filter((product) => product.categoryName === categoryName)
        .length;
    },
    [products],
  );

  // Count products per area
  const getAreaProductCount = useCallback(
    (areaName) => {
      return products.filter((product) => product.areaName === areaName).length;
    },
    [products],
  );

  // Check if any filter is active
  const hasActiveFilters =
    selectedColors.length > 0 ||
    selectedSizes.length > 0 ||
    selectedSubCategories.length > 0 ||
    priceRange[0] !== actualPriceRange[0] ||
    priceRange[1] !== actualPriceRange[1];

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setPriceRange(actualPriceRange);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedSubCategories([]);
    if (setSearchParams) setSearchParams({});
  }, [actualPriceRange, setSearchParams]);

  return {
    // Data
    allProducts: products,
    filteredProducts,
    sortedProducts,
    colors,
    sizes,
    categories,
    areas,

    // Filter states
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
    selectedSubCategories,
    setSelectedSubCategories,

    // Loading states
    colorsLoading: variantOptionsLoading,
    sizesLoading: variantOptionsLoading,
    categoriesLoading,
    areasLoading,
    filtersLoading: isLoading || variantOptionsLoading || categoriesLoading,

    // Helpers
    isSale,
    isColorLight,
    sortOptions,
    getGridClass,
    getColorProductCount,
    getSizeProductCount,
    getCategoryProductCount,
    getAreaProductCount,
    hasActiveFilters,
    clearAllFilters,
  };
};

export { useShopFilters };
