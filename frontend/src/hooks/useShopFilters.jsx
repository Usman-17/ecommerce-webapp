import { useState, useRef, useEffect, useMemo, useCallback } from "react";

import { useGetVariantOptions } from "./useGetVariantOptions";
import { useGetAllProducts } from "./useGetAllProducts";
import { useGetAllCategories } from "./useGetAllCategories";

const isSale = (product) => {
  const priceDetail = product?.productPriceDetailResponse || {};
  const salePrice =
    priceDetail.salePrice || product.salePrice || product.productSalePrice || 0;
  const netSalePrice = priceDetail.netSalePrice || product.netSalePrice || 0;
  return netSalePrice > 0 && netSalePrice < salePrice;
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
      return "grid-cols-2 sm:grid-cols-2 md:grid-cols-3";
    case 3:
      return "grid-cols-2 sm:grid-cols-2 md:grid-cols-3";
    case 4:
      return "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    case 5:
    default:
      return "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5";
  }
};

const useShopFilters = ({
  initialProducts,
  setSearchParams,
  categoryParam,
  areaParam,
  subcategoryParam,
} = {}) => {
  const { products: allProducts, productIsLoading: isLoading } =
    useGetAllProducts();
  const { colors, sizes, variantOptionsLoading } = useGetVariantOptions();
  const { data: categories = [], isLoading: categoriesLoading } =
    useGetAllCategories();

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
      .map((p) => {
        const priceDetail = p?.productPriceDetailResponse || {};
        const salePrice =
          priceDetail.salePrice || p.salePrice || p.productSalePrice || 0;
        const netSalePrice = priceDetail.netSalePrice || p.netSalePrice || 0;
        return isSale(p) ? netSalePrice : salePrice;
      })
      .filter((price) => price > 0);

    if (prices.length === 0) return [0, 10000];
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return [minPrice, maxPrice];
  }, [products]);

  // Sync price range when products load
  const priceRangeInited = useRef(false);
  useEffect(() => {
    if (products.length > 0 && !priceRangeInited.current) {
      priceRangeInited.current = true;
      const range = getPriceRange();
      setActualPriceRange(range);
      setPriceRange(range);
    }
  }, [products, getPriceRange]);

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Price filter
      const priceDetail = product?.productPriceDetailResponse || {};
      const salePrice =
        priceDetail.salePrice ||
        product.salePrice ||
        product.productSalePrice ||
        0;
      const netSalePrice =
        priceDetail.netSalePrice || product.netSalePrice || 0;
      const finalPrice = isSale(product) ? netSalePrice : salePrice;

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
        subcategoryParam === (product.productCategoryName || "") ||
        subcategoryParam === (product.productSubCategoryName || "");

      // Category filter
      const categoryMatch =
        !categoryParam || product.productCategoryName === categoryParam;

      // Area filter
      const areaMatch = !areaParam || product.productAreaName === areaParam;

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
    subcategoryParam,
  ]);

  // Sort filtered products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
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
      return products.filter(
        (product) => product.productCategoryName === categoryName,
      ).length;
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
    filtersLoading: isLoading || variantOptionsLoading || categoriesLoading,

    // Helpers
    isSale,
    isColorLight,
    sortOptions,
    getGridClass,
    getColorProductCount,
    getSizeProductCount,
    getCategoryProductCount,
    hasActiveFilters,
    clearAllFilters,
  };
};

export { useShopFilters };
