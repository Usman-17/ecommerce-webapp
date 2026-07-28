import { X } from "lucide-react";
import { useEffect, useState, useRef } from "react";

import ProductCard from "./ProductCard";
import ProductCardSkeleton from "../components/Skeleton/ProductCardSkeleton";
import { useGetAllProducts } from "../hooks/useGetAllProducts";
// Imports End

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const SearchModal = ({ onClose }) => {
  const { products = [], productIsLoading } = useGetAllProducts();

  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const [searchData, setSearchData] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    setVisible(true);

    const isLargeScreen = window.innerWidth >= 640;

    if (isLargeScreen) {
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (debouncedSearch && Array.isArray(products)) {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );
      setSearchData(filtered);
    } else {
      // No search input: show popular products
      const popularProducts = products.filter((product) =>
        product.tags?.includes("Popular"),
      );
      setSearchData(popularProducts);
    }
  }, [debouncedSearch, products]);

  const handleClear = () => {
    setSearch("");
    inputRef.current.focus();
  };

  const handleProductClick = () => {
    setSearch("");
    setSearchData(products);
    handleClose();
  };

  const handleClose = () => {
    setVisible(false);

    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleClose}
      ></div>

      {/* Search Modal */}
      <div
        className={`flex flex-col fixed inset-x-0 bottom-0 top-0 z-50 bg-white transform transition-transform duration-200 ease-in-out         
           ${visible ? "translate-y-0" : "translate-y-full"} `}
      >
        {/* Close Search Button */}
        <div className="flex justify-end p-3 sm:p-4">
          <X
            className="cursor-pointer text-gray-700 hover:text-black transition-transform duration-150 hover:rotate-90"
            size={24}
            onClick={handleClose}
          />
        </div>

        {/* Page Title */}
        <h3 className="flex justify-center py-1 sm:py-2 text-xl sm:text-2xl">
          Search Our Site
        </h3>

        {/* Input */}
        <div className="mb-0 sm:mb-4 px-4 mx-auto  w-full sm:w-1/2 relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="I'm Looking for..."
            className="border border-gray-300 rounded-full w-full p-3 px-5 text-base focus:outline-none placeholder:font-normal"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Clear Search Button */}
          {search && (
            <button
              onClick={handleClear}
              className="absolute right-7  sm:right-8 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X size={22} />
            </button>
          )}
        </div>

        {/* Results Products */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-24 pb-6 my-4 sm:mt-12">
          {!debouncedSearch && searchData.length > 0 && (
            <h4 className="text-xl font-semibold mb-1">Popular Products</h4>
          )}

          {productIsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : searchData.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {searchData.map((product) => (
                <div key={product._id} onClick={handleProductClick}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            debouncedSearch && (
              <p className="text-gray-500 mt-0 text-center">
                Nothing matches your search &quot;{search}&quot;
              </p>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default SearchModal;
