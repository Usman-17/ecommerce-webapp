import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Search, X, Clock, TrendingUp, ArrowRight, Trash2 } from "lucide-react";

import { useFuzzySearch } from "../../hooks/useFuzzySearch";
import { useGetAllProducts } from "../../hooks/useGetAllProducts";
import { useGetAllCategories } from "../../hooks/useGetAllCategories";
import { useGetAllSubCategories } from "../../hooks/useGetAllSubCategories";
import { useGetAllProductAreas } from "../../hooks/useGetAllProductAreas";
import { useAnalytics } from "../../hooks/useAnalytics";
// Imports End-----

const RECENT_SEARCHES_KEY = "recentSearches";
const MAX_RECENT = 5;

const SearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { trackSearch } = useAnalytics();

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [manualTab, setManualTab] = useState(null);
  const [manualTabSearch, setManualTabSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedIndexKey, setSelectedIndexKey] = useState("");
  const listRef = useRef(null);

  // Fetch products, categories, subcategories, and areas
  const { products } = useGetAllProducts();
  const { areas = [] } = useGetAllProductAreas();
  const { categories = [] } = useGetAllCategories();
  const { subCategories = [] } = useGetAllSubCategories();

  const {
    inputValue: searchTerm,
    setInputValue: setSearchTerm,
    normalProducts: filteredProducts,
    normalCategories: filteredCategories,
    normalSubCategories: filteredSubCategories,
    normalAreas: filteredAreas,
    suggestions,
    highlight,
    inputRef,
  } = useFuzzySearch({
    products,
    categories,
    subCategories,
    areas,
    searchTerm: "",
  });

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, inputRef]);

  // Reset search input when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen, setSearchTerm]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Save search to recent
  const saveToRecent = useCallback(
    (term) => {
      if (!term.trim()) return;
      const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(
        0,
        MAX_RECENT,
      );
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    },
    [recentSearches],
  );

  // Remove a single recent search
  const removeRecent = useCallback(
    (term) => {
      const updated = recentSearches.filter((s) => s !== term);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    },
    [recentSearches],
  );

  // Clear all recent searches
  const clearAllRecent = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }, []);

  // Compute effective tab: use manual choice only if it was made for current search term
  const effectiveTab =
    manualTab && manualTabSearch === searchTerm
      ? manualTab
      : filteredProducts.length > 0
        ? "products"
        : "categories";

  const hasSearchResults =
    searchTerm.trim() &&
    (filteredProducts.length > 0 ||
      filteredCategories.length > 0 ||
      filteredSubCategories.length > 0 ||
      filteredAreas.length > 0);
  const noResults =
    searchTerm.trim() && !hasSearchResults && suggestions.length === 0;
  const showSuggestions =
    searchTerm.trim() && !hasSearchResults && suggestions.length > 0;

  // Track search when results change
  useEffect(() => {
    if (searchTerm.trim() && hasSearchResults) {
      const totalResults =
        filteredProducts.length +
        filteredCategories.length +
        filteredSubCategories.length +
        filteredAreas.length;
      trackSearch(searchTerm, totalResults);
    }
  }, [
    searchTerm,
    filteredProducts.length,
    filteredCategories.length,
    filteredSubCategories.length,
    filteredAreas.length,
    hasSearchResults,
    trackSearch,
  ]);

  // Build flat list of all navigable items for keyboard navigation
  const allItems = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const items = [];

    if (effectiveTab === "products") {
      filteredProducts.slice(0, 10).forEach((p) => {
        items.push({ type: "product", data: p });
      });
    } else {
      filteredAreas.forEach((a) => {
        items.push({ type: "area", data: a });
      });
      filteredCategories.forEach((c) => {
        items.push({ type: "category", data: c });
      });
      filteredSubCategories.forEach((s) => {
        items.push({ type: "subcategory", data: s });
      });
    }

    if (showSuggestions) {
      suggestions.forEach((s) => {
        items.push({ type: "suggestion", data: s });
      });
    }

    return items;
  }, [
    searchTerm,
    effectiveTab,
    filteredProducts,
    filteredAreas,
    filteredCategories,
    filteredSubCategories,
    showSuggestions,
    suggestions,
  ]);

  // Compute effective selected index: reset when search/tab changes
  const effectiveSelectedIndex =
    selectedIndexKey === `${searchTerm}-${effectiveTab}` ? selectedIndex : -1;

  // Scroll selected item into view
  useEffect(() => {
    if (effectiveSelectedIndex >= 0 && listRef.current) {
      const el = listRef.current.children[effectiveSelectedIndex];
      if (el) el.scrollIntoView({ block: "nearest" });
    }
  }, [effectiveSelectedIndex]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    const key = `${searchTerm}-${effectiveTab}`;
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndexKey(key);
      setSelectedIndex((prev) => {
        const current = prev === -1 || selectedIndexKey !== key ? -1 : prev;
        return current < allItems.length - 1 ? current + 1 : 0;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndexKey(key);
      setSelectedIndex((prev) => {
        const current = prev === -1 || selectedIndexKey !== key ? -1 : prev;
        return current > 0 ? current - 1 : allItems.length - 1;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (
        effectiveSelectedIndex >= 0 &&
        effectiveSelectedIndex < allItems.length
      ) {
        const item = allItems[effectiveSelectedIndex];
        if (item.type === "product") {
          saveToRecent(searchTerm);
          setSearchTerm("");
          onClose();
          navigate(`/product/${item.data.slug}`);
        } else if (item.type === "category") {
          saveToRecent(searchTerm);
          setSearchTerm("");
          onClose();
          navigate(
            `/shop?category=${encodeURIComponent(item.data.categoryName)}`,
          );
        } else if (item.type === "subcategory") {
          saveToRecent(searchTerm);
          setSearchTerm("");
          onClose();
          navigate(`/shop?subcategory=${encodeURIComponent(item.data.name)}`);
        } else if (item.type === "area") {
          saveToRecent(searchTerm);
          setSearchTerm("");
          onClose();
          navigate(`/shop?area=${encodeURIComponent(item.data.name)}`);
        } else if (item.type === "suggestion") {
          handleSuggestionClick(item.data);
        }
      } else if (searchTerm.trim()) {
        handleSearchSubmit(searchTerm);
      }
    }
  };

  // Popular products (first 6)
  const popularProducts = products.slice(0, 6);

  // Handle search submit
  const handleSearchSubmit = (term) => {
    saveToRecent(term);
  };

  // Handle product click
  const handleProductClick = () => {
    saveToRecent(searchTerm);
    setSearchTerm("");
    onClose();
  };

  // Handle category click
  const handleCategoryClick = () => {
    saveToRecent(searchTerm);
    setSearchTerm("");
    onClose();
  };

  // Handle suggestion click - navigate directly based on type
  const handleSuggestionClick = (suggestion) => {
    saveToRecent(searchTerm);
    setSearchTerm("");
    onClose();
    if (suggestion.type === "product") {
      navigate(`/product/${suggestion.item.slug}`);
    } else if (suggestion.type === "category") {
      navigate(`/shop?category=${encodeURIComponent(suggestion.text)}`);
    } else if (suggestion.type === "subcategory") {
      navigate(`/shop?subcategory=${encodeURIComponent(suggestion.text)}`);
    } else if (suggestion.type === "area") {
      navigate(`/shop?area=${encodeURIComponent(suggestion.text)}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1100 flex sm:items-start sm:justify-center sm:pt-20">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white w-full h-full sm:h-125 sm:mx-6 sm:max-w-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0">
          <Search size={20} className="text-gray-400 shrink-0" />
          <label htmlFor="search-modal-input" className="sr-only">
            Search
          </label>
          <input
            ref={inputRef}
            type="text"
            id="search-modal-input"
            placeholder="Search products, categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-sm placeholder-gray-400 outline-none bg-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="p-1 hover:bg-[#fffaf5] rounded-full transition-colors"
              aria-label="Clear search"
            >
              <X size={16} className="text-gray-400" />
            </button>
          )}
          {!searchTerm && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#fffaf5] rounded-full transition-colors"
              aria-label="Close search"
            >
              <X size={18} className="text-gray-500" />
            </button>
          )}
        </div>

        {/* Tabs */}
        {searchTerm.trim() && (
          <div
            className="flex border-b border-gray-100 shrink-0"
            role="tablist"
          >
            {[
              {
                id: "products",
                label: "Products",
                count: filteredProducts.length,
              },
              {
                id: "categories",
                label: "Categories",
                count:
                  filteredCategories.length +
                  filteredSubCategories.length +
                  filteredAreas.length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setManualTab(tab.id);
                  setManualTabSearch(searchTerm);
                }}
                role="tab"
                aria-selected={effectiveTab === tab.id}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                  effectiveTab === tab.id
                    ? "text-[#CC0D39] border-b-2 border-[#CC0D39]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {/* No search term - Show recent & popular */}
          {!searchTerm.trim() && (
            <div className="p-4 space-y-5">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Recent Searches
                    </h3>
                    <button
                      onClick={clearAllRecent}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((term) => (
                      <div
                        key={term}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#fffaf5] group cursor-pointer"
                        onClick={() => setSearchTerm(term)}
                      >
                        <Clock size={14} className="text-gray-400 shrink-0" />
                        <span className="flex-1 text-sm text-gray-700">
                          {term}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRecent(term);
                          }}
                          className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-full transition-all"
                          aria-label={`Remove "${term}" from recent searches`}
                        >
                          <Trash2 size={12} className="text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Products */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Popular Products
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {popularProducts.map((product) => (
                    <Link
                      key={product.slug}
                      to={`/product/${product.slug}`}
                      onClick={handleProductClick}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#fffaf5] transition-colors"
                    >
                      <img
                        src={product.productImages?.[0]?.url || product.image}
                        alt={product.title}
                        className="w-10 h-10 object-cover rounded-lg bg-gray-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {product.title}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate">
                          {product.categoryName}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Quick Links
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["New Arrivals", "Best Sellers", "Sale"].map((link) => (
                    <Link
                      key={link}
                      to={
                        link === "New Arrivals"
                          ? "/new-arrivals"
                          : link === "Best Sellers"
                            ? "/best-sellers"
                            : "/offers"
                      }
                      onClick={handleProductClick}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50/20 rounded-full hover:bg-[#fffaf5] transition-colors"
                    >
                      {link}
                      <ArrowRight size={10} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search results */}
          {hasSearchResults && (
            <div className="p-2">
              {/* Categories Tab */}
              {effectiveTab === "categories" && (
                <div ref={listRef} className="space-y-1">
                  {filteredAreas.map((area, idx) => (
                    <Link
                      key={area._id}
                      to={`/shop?area=${encodeURIComponent(area.name || "")}`}
                      onClick={handleCategoryClick}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        effectiveSelectedIndex === idx
                          ? "bg-[#fffaf5] ring-1 ring-[#CC0D39]/20"
                          : "hover:bg-[#fffaf5]"
                      }`}
                    >
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                        <TrendingUp size={14} className="text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {area.name}
                        </p>
                        <p className="text-xs text-gray-500">Area</p>
                      </div>
                    </Link>
                  ))}
                  {filteredCategories.map((cat, idx) => (
                    <Link
                      key={cat._id}
                      to={`/shop?category=${encodeURIComponent(cat.name || "")}`}
                      onClick={handleCategoryClick}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        effectiveSelectedIndex === filteredAreas.length + idx
                          ? "bg-[#fffaf5] ring-1 ring-[#CC0D39]/20"
                          : "hover:bg-[#fffaf5]"
                      }`}
                    >
                      <div className="w-8 h-8 bg-[#CC0D39]/10 rounded-lg flex items-center justify-center shrink-0">
                        <TrendingUp size={14} className="text-[#CC0D39]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {cat.name}
                        </p>
                        <p className="text-xs text-gray-500">Category</p>
                      </div>
                    </Link>
                  ))}
                  {filteredSubCategories.map((sub, idx) => (
                    <Link
                      key={sub._id}
                      to={`/shop?subcategory=${encodeURIComponent(sub.name || "")}`}
                      onClick={handleCategoryClick}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        effectiveSelectedIndex ===
                        filteredAreas.length + filteredCategories.length + idx
                          ? "bg-[#fffaf5] ring-1 ring-[#CC0D39]/20"
                          : "hover:bg-[#fffaf5]"
                      }`}
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                        <TrendingUp size={14} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {sub.name}
                        </p>
                        <p className="text-xs text-gray-500">Subcategory</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Products Tab */}
              {effectiveTab === "products" && (
                <div ref={listRef} className="space-y-1">
                  {filteredProducts.slice(0, 10).map((product, idx) => (
                    <Link
                      key={product.slug || idx}
                      to={`/product/${product.slug}`}
                      onClick={handleProductClick}
                      className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                        effectiveSelectedIndex === idx
                          ? "bg-[#fffaf5] ring-1 ring-[#CC0D39]/20"
                          : "hover:bg-[#fffaf5]"
                      }`}
                    >
                      <img
                        src={product.productImages?.[0]?.url || product.image}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-lg bg-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {product.categoryName}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* No results */}
          {noResults && (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-gray-500">
                No results found for &quot;{searchTerm}&quot;
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try different keywords or browse categories
              </p>
            </div>
          )}

          {/* Did you mean? Suggestions */}
          {showSuggestions && (
            <div className="p-2">
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Did you mean?
                </h3>
              </div>
              <div ref={listRef} className="space-y-1">
                {suggestions.map((suggestion, idx) => {
                  const label =
                    suggestion.type === "product"
                      ? "Product"
                      : suggestion.type === "category"
                        ? "Category"
                        : suggestion.type === "area"
                          ? "Area"
                          : "Subcategory";
                  const iconBg =
                    suggestion.type === "product"
                      ? "bg-[#CC0D39]/10"
                      : suggestion.type === "area"
                        ? "bg-purple-100"
                        : "bg-gray-100";
                  const iconColor =
                    suggestion.type === "product"
                      ? "text-[#CC0D39]"
                      : suggestion.type === "area"
                        ? "text-purple-500"
                        : "text-gray-500";

                  return (
                    <button
                      key={`${suggestion.type}-${idx}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                        effectiveSelectedIndex === idx
                          ? "bg-[#fffaf5] ring-1 ring-[#CC0D39]/20"
                          : "hover:bg-[#fffaf5]"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center shrink-0`}
                      >
                        <TrendingUp size={14} className={iconColor} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {highlight(suggestion.text, suggestion.matches).map(
                            (part, i) =>
                              part.highlight ? (
                                <mark
                                  key={i}
                                  className="bg-yellow-200 text-gray-900 rounded px-0.5"
                                >
                                  {part.text}
                                </mark>
                              ) : (
                                <span key={i}>{part.text}</span>
                              ),
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{label}</p>
                      </div>
                      <ArrowRight
                        size={14}
                        className="text-gray-400 shrink-0"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-white shrink-0">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="hidden sm:inline">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px]">
                ↑↓
              </kbd>{" "}
              navigate{" "}
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px]">
                ↵
              </kbd>{" "}
              select{" "}
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px]">
                ESC
              </kbd>{" "}
              close
            </span>
            <span>{products.length} products available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
