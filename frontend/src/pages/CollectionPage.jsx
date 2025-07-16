import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Helmet } from "react-helmet-async";

import ProductCard from "../components/ProductCard";
import Animation from "../components/Animation";
import InViewAnimation from "../components/InViewAnimation";
import FilterSkeleton from "../components/Skeleton/FilterSkeleton";
import ProductCardSkeleton from "../components/Skeleton/ProductCardSkeleton";

import { useGetAllBrands } from "../hooks/useGetAllBrands";
import { useGetAllProducts } from "../hooks/useGetAllProducts";
import { useGetAllCategories } from "../hooks/useGetAllCategories";
// Imports End

const CollectionPage = () => {
  const { brands = [], brandIsLoading } = useGetAllBrands();
  const { products = [], productIsLoading } = useGetAllProducts();
  const { categories = [], categoryIsLoading } = useGetAllCategories();

  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortOption, setSortOption] = useState("relevant");

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((cat) => cat !== category)
        : [...prevSelected, category]
    );
  };

  const handleBrandChange = (brandName) => {
    setSelectedBrands((prevSelected) =>
      prevSelected.includes(brandName)
        ? prevSelected.filter((br) => br !== brandName)
        : [...prevSelected, brandName]
    );
  };

  const filteredProducts = products.filter((product) => {
    const categoryName = product.category?.name || product.category;
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(categoryName);

    const brandName = product.brand?.name || product.brand;
    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(brandName);

    return matchesCategory && matchesBrand;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "low-high") {
      return a.price - b.price;
    } else if (sortOption === "high-low") {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <>
      <Helmet>
        <title>Explore Elegant Jewelry Collections | Jemzy.pk</title>
        <meta
          name="description"
          content="Browse Jemzy.pk’s premium collection of rings, necklaces, earrings, and more. Discover the perfect jewelry piece that complements your style."
        />
        <meta
          name="keywords"
          content="Jemzy.pk jewelry, women’s jewelry, necklaces, earrings, rings, bracelets, Pakistani jewelry store, fashion accessories"
        />
        <link rel="canonical" href="https://www.jemzy.pk/collection" />
        <meta
          property="og:title"
          content="Explore Elegant Jewelry Collection | Jemzy.pk"
        />
        <meta
          property="og:description"
          content="Shop elegant and trendy jewelry pieces at Jemzy.pk. Find rings, necklaces, earrings, and more with premium quality."
        />
        <meta property="og:url" content="https://www.jemzy.pk/collection" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-3 sm:pt-5 border-t sm:h-[calc(100vh)] overflow-hidden">
        {/* Left Side Filter   */}
        <div className="min-w-60 md:min-w-40 lg:min-w-60 h-full overflow-y-auto sticky top-0">
          <p
            onClick={() => setShowFilter(!showFilter)}
            className="my-2 text-xl uppercase flex items-center gap-1 cursor-pointer"
          >
            Filters
            <ChevronDown
              size={18}
              className={`sm:hidden ${
                showFilter ? "rotate-90" : ""
              } text-gray-500`}
            />
          </p>

          {/* Category Filter */}
          <div
            className={`border border-gray-300 pl-5 py-3 mt-6 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <h2 className="uppercase mb-3 text-sm font-medium">Categories</h2>

            {categoryIsLoading ? (
              <FilterSkeleton />
            ) : (
              <div className="flex flex-col gap-3 text-sm text-gray-700 select-none">
                {categories.map((category, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-rose-500"
                      value={category.name}
                      onChange={() => handleCategoryChange(category.name)}
                      checked={selectedCategories.includes(category.name)}
                      aria-label={`Filter by ${category.name}`}
                    />
                    <span className="font-medium">{category?.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Brand Filter */}
          <div
            className={`border border-gray-300 pl-5 py-3 my-5 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <h2 className="uppercase mb-3 text-sm font-medium">Brands</h2>
            {brandIsLoading ? (
              <FilterSkeleton />
            ) : (
              <div className="flex flex-col gap-3 text-sm text-gray-700 select-none">
                {brands.map((brand) => (
                  <label
                    key={brand._id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-rose-500"
                      value={brand.name}
                      onChange={() => handleBrandChange(brand.name)}
                      checked={selectedBrands.includes(brand.name)}
                      aria-label={`Filter by ${brand.name}`}
                    />
                    <span className="font-medium">{brand.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side All Products */}
        <div className="flex-1 overflow-y-auto px-0 sm:px-4 mb-20">
          <div className="flex justify-between items-center text-xs sm:text-2xl mb-2 gap-6">
            <InViewAnimation delay={0.1}>
              <div className="inline-flex gap-2 items-center mb-3 overflow-hidden">
                <h1 className="text-gray-500 text-[14px] sm:text-2xl">
                  ALL{" "}
                  <span className="text-gray-700 font-medium">COLLECTIONS</span>
                </h1>
                <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
              </div>
            </InViewAnimation>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 bg-[#fffaf1] text-xs sm:text-sm px-0 py-2 sm:px-3 sm:py-2 rounded-md focus:outline-none transition duration-100 ease-in-out hover:bg-[#fffaf8] mb-3 cursor-pointer"
            >
              <option value="relevant">Sort By: Relevant</option>
              <option value="low-high">Sort By: Low to High</option>
              <option value="high-low">Sort By: High to Low</option>
            </select>
          </div>

          {/* All Products */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 gap-y-0">
            {productIsLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            ) : sortedProducts.length === 0 ? (
              <p className="col-span-full text-center text-sm text-gray-500 flex justify-center py-20 items-center">
                No products match your selected filters.
              </p>
            ) : (
              sortedProducts.map((product, index) => (
                <Animation key={product._id} delay={index * 0.1}>
                  <ProductCard product={product} />
                </Animation>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionPage;
