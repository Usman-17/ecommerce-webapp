import { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";

import { useWishlist } from "../../hooks/useWishlist";

import ProductCard from "../../components/ProductCard";
import RecommendedProducts from "../../components/RecommendedProducts";
import Breadcrumbs from "../../components/common/Breadcrumbs";

import EmptyWishlist from "./components/EmptyWishlist";
import BulkActionBar from "./components/BulkActionBar";
import MobileWishlistItem from "./components/MobileWishlistItem";
// Imports End-----

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [selectedIds, setSelectedIds] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const handleAction = (e) => {
      if (e.detail.path === "/wishlist") {
        setIsEditMode((prev) => {
          if (prev) setSelectedIds([]);
          return !prev;
        });
      }
    };

    window.addEventListener("headerActionTriggered", handleAction);
    return () =>
      window.removeEventListener("headerActionTriggered", handleAction);
  }, []);

  // Reset edit mode when wishlist becomes empty
  useEffect(() => {
    if (wishlist.length === 0 && isEditMode) {
      const timer = setTimeout(() => {
        setIsEditMode(false);
        window.dispatchEvent(new Event("resetHeaderEditMode"));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [wishlist.length, isEditMode]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => removeFromWishlist(id));
    setSelectedIds([]);
    setIsEditMode(false);
    window.dispatchEvent(new Event("resetHeaderEditMode"));
  };

  const handleSelectAll = () => {
    if (selectedIds.length === wishlist.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(wishlist.map((p) => p._id));
    }
  };

  return (
    <div className="min-h-[60vh] pb-10 sm:pb-12 pt-0 md:pt-4 sm:px-[4vw]">
      {wishlist.length === 0 ? (
        <div className="space-y-8">
          <EmptyWishlist />
          <RecommendedProducts limit={30} />
        </div>
      ) : (
        <>
          {/* Title & Breadcrumbs */}
          <div className="hidden sm:block mb-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              My Wishlist
            </h1>
            <Breadcrumbs items={[{ label: "Wishlist", path: "/wishlist" }]} />
          </div>

          {/* Select All Toggle (Only in Edit Mode) */}
          <AnimatePresence>
            {isEditMode && wishlist.length > 0 && (
              <Motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex items-center justify-between px-2 mb-3 md:hidden"
              >
                <button
                  onClick={handleSelectAll}
                  className="text-[13px] font-bold text-primary flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-full active:scale-95 transition-all"
                >
                  {selectedIds.length === wishlist.length
                    ? "Deselect All"
                    : "Select All"}

                  <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                    {selectedIds.length}
                  </span>
                </button>

                <p className="text-[12px] text-gray-400 font-medium italic">
                  {wishlist.length} Items total
                </p>
              </Motion.div>
            )}
          </AnimatePresence>

          <div
            className={`flex flex-col gap-2 md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 md:gap-2 min-h-[70vh] ${isEditMode ? "pb-24" : ""}`}
          >
            {wishlist.map((product) => (
              <div key={product._id} className="relative">
                <div className="md:hidden">
                  <MobileWishlistItem
                    product={product}
                    isEditMode={isEditMode}
                    isSelected={selectedIds.includes(product._id)}
                    onToggleSelect={toggleSelect}
                    onRemove={removeFromWishlist}
                  />
                </div>

                <div className="hidden md:block relative">
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>

          <BulkActionBar
            isEditMode={isEditMode}
            selectedCount={selectedIds.length}
            onDelete={handleBulkDelete}
          />
        </>
      )}
    </div>
  );
};

export default WishlistPage;
