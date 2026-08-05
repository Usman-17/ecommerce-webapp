import { useState } from "react";

import { useGetAllProducts } from "../../hooks/useGetAllProducts";
import { useGetAllCategories } from "../../hooks/useGetAllCategories";
import { useGetVariantOptions } from "../../hooks/useGetVariantOptions";
import { useGetAllProductAreas } from "../../hooks/useGetAllProductAreas";
import { useGetAllSubCategories } from "../../hooks/useGetAllSubCategories";

import CategoryMobileView from "./CategoryMobileView";
import CategoryDesktopView from "./CategoryDesktopView";
import SEO from "../../components/SEO";
// Imports End------

const CategoryPage = () => {
  // Data fetching hooks
  const { areas = [], isLoading: areasLoading } = useGetAllProductAreas();
  const { categories = [], isLoading: categoriesLoading } =
    useGetAllCategories();
  const { subCategories = [], isLoading: subCategoriesLoading } =
    useGetAllSubCategories();
  const {
    products = [],
    allProducts = [],
    isLoading: productsLoading,
  } = useGetAllProducts();
  const { colors, sizes } = useGetVariantOptions();

  // State variables
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);

  // Multi-select Filters
  const [selectedColorIds, setSelectedColorIds] = useState([]);
  const [selectedSizeIds, setSelectedSizeIds] = useState([]);

  // Sorting
  const [sortBy, setSortBy] = useState("newest");

  // Toggle functions
  const toggleColor = (id, clear = false) => {
    if (clear) return setSelectedColorIds([]);
    setSelectedColorIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleSize = (id, clear = false) => {
    if (clear) return setSelectedSizeIds([]);
    setSelectedSizeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const clearAllFilters = () => {
    setSelectedColorIds([]);
    setSelectedSizeIds([]);
  };

  // Reset category/subcategory when area changes
  const handleSetArea = (id) => {
    setSelectedAreaId(id);
    setSelectedCategoryId(null);
    setSelectedSubCategoryId(null);
  };

  // Reset subcategory when category changes
  const handleSetCategory = (id) => {
    setSelectedCategoryId(id);
    setSelectedSubCategoryId(null);
  };

  const filteredCategories = selectedAreaId
    ? categories.filter((c) => c.areaId === selectedAreaId)
    : categories;

  const categoryBelongsToArea =
    selectedCategoryId === null ||
    filteredCategories.some((c) => c._id === selectedCategoryId);

  const effectiveCategoryId = categoryBelongsToArea ? selectedCategoryId : null;

  const filteredSubCategories = effectiveCategoryId
    ? subCategories.filter((s) => s.categoryId === effectiveCategoryId)
    : subCategories.filter((s) =>
        filteredCategories.some((c) => c._id === s.categoryId),
      );

  const sharedProps = {
    productAreas: areas,
    categories,
    subCategories,
    products,
    allProducts,
    filteredCategories,
    filteredSubCategories,
    selectedAreaId,
    selectedCategoryId,
    selectedSubCategoryId,
    selectedColorIds,
    selectedSizeIds,
    setSelectedAreaId: handleSetArea,
    setSelectedCategoryId: handleSetCategory,
    setSelectedSubCategoryId,
    toggleColor,
    toggleSize,
    clearAllFilters,
    colors,
    sizes,
    sortBy,
    setSortBy,
    areasLoading,
    categoriesLoading,
    subCategoriesLoading,
    productsLoading,
  };

  const mobileProps = {
    productAreas: areas,
    categories,
    subCategories,
    products,
    allProducts,
    filteredCategories,
    filteredSubCategories,
    selectedAreaId,
    selectedCategoryId,
    selectedSubCategoryId,
    setSelectedAreaId: handleSetArea,
    setSelectedCategoryId: handleSetCategory,
    setSelectedSubCategoryId,
    clearAllFilters,
    sortBy,
    setSortBy,
  };

  return (
    <div className="flex flex-col overflow-hidden -mt-4 rounded-2xl -mx-3 h-[calc(100dvh-85px)] lg:h-auto">
      <SEO
        title="Categories - Jewelry, Makeup & Beauty, Hair Accessories"
        description="Explore our curated categories of jewelry, makeup & beauty products, and hair accessories. Shop by category to find exactly what you need."
        keywords="jewelry categories, makeup categories, hair accessories, browse categories"
        url="/category"
      />
      <CategoryMobileView {...mobileProps} />

      <div className="hidden md:block w-full">
        <CategoryDesktopView {...sharedProps} />
      </div>
    </div>
  );
};

export default CategoryPage;
