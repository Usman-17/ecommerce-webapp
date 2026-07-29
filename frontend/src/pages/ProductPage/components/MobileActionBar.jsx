import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Share2, ShoppingCart } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import VariantSelectorModal from "./VariantSelectorModal";

import { getCart, setCart } from "../../../utils/cartStorage";

import { setInMemoryData } from "../../../services/storageService";
// Imports End------

const MobileActionBar = ({
  product,
  selectedPack,
  selectedOptions,
  matchedVariant,
  currentPrice,
  mainImage,
  activeVariantImage,
  handleSelect,
  isLiked,
  onWishlistToggle,
  onShare,
}) => {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("cart");
  const [shakeOptions, setShakeOptions] = useState(false);

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hasVariants = (product?.variants?.length || 0) > 0;

  const addToCartInternal = (qty, opts, pk) => {
    if (currentPrice <= 0) {
      toast.error("Product price is not available.", { id: "price-error" });
      return false;
    }
    if (hasVariants && !opts["variant"]) {
      setShakeOptions(true);
      setTimeout(() => setShakeOptions(false), 500);
      toast.error("Please select a variant", { id: "variant-error" });
      return false;
    }

    const cartItem = {
      productId: product._id,
      productSlug: product.slug,
      name: product.title,
      image: mainImage,
      variantImage: activeVariantImage,
      category: product.categoryName,
      subCategory: product.subCategoryName,
      packId: pk?.productPackId || null,
      packDescription: pk?.productPackDescription || null,
      price: currentPrice,
      quantity: qty,
      total: currentPrice * qty,
      selectedOptions: opts,
      variantId: matchedVariant?._id || null,
      selectedVariants: matchedVariant
        ? [{ detailName: matchedVariant.name }]
        : [],
    };

    const existingCart = getCart();
    const existingIndex = existingCart.findIndex(
      (item) =>
        item.productId === cartItem.productId &&
        item.packId === cartItem.packId &&
        JSON.stringify(item.selectedOptions) ===
          JSON.stringify(cartItem.selectedOptions),
    );
    if (existingIndex > -1) {
      existingCart[existingIndex].quantity += cartItem.quantity;
      existingCart[existingIndex].total =
        existingCart[existingIndex].quantity *
        existingCart[existingIndex].price;
    } else {
      existingCart.unshift(cartItem);
    }
    setCart(existingCart);
    window.dispatchEvent(new Event("cartUpdated"));
    return true;
  };

  const openSelectionModal = (action) => {
    setModalAction(action);
    setIsModalOpen(true);
  };

  const handleConfirmAction = (qty) => {
    if (modalAction === "cart") {
      const ok = addToCartInternal(qty, selectedOptions, selectedPack);
      if (ok) {
        setIsAdding(true);
        setTimeout(() => {
          setIsAdding(false);
          setIsAdded(true);
          setTimeout(() => {
            setIsAdded(false);
            setIsModalOpen(false);
          }, 1000);
        }, 400);
      }
    } else {
      const ok = handleBuyNowInternal(qty);
      if (ok) {
        setIsModalOpen(false);
        setTimeout(() => navigate("/place-order"), 50);
      }
    }
  };

  const handleBuyNowInternal = (qty) => {
    if (hasVariants && !selectedOptions["variant"]) {
      setShakeOptions(true);
      setTimeout(() => setShakeOptions(false), 500);
      toast.error("Please select a variant", { id: "variant-error" });
      return false;
    }

    const buyNowItem = {
      productId: product._id,
      productSlug: product.slug,
      name: product.title,
      image: mainImage,
      variantImage: activeVariantImage,
      category: product.categoryName,
      subCategory: product.subCategoryName,
      packId: selectedPack?.productPackId || null,
      packDescription: selectedPack?.productPackDescription || null,
      price: currentPrice,
      quantity: qty,
      total: currentPrice * qty,
      selectedOptions,
      variantId: matchedVariant?._id || null,
      selectedVariants: matchedVariant
        ? [{ detailName: matchedVariant.name }]
        : [],
    };
    setInMemoryData("buyNowItem", buyNowItem);
    return true;
  };

  return (
    <>
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-60 bg-warm border-t border-[#f0e4da] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-4 py-3 safe-area-inset-bottom transition-all duration-300 ease-in-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            {/* Share */}
            <button
              onClick={onShare}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-transparent hover:bg-black/5 text-gray-600 transition-all duration-200 active:scale-95 border border-gray-200"
              aria-label="Share product"
            >
              <Share2 size={18} strokeWidth={2} />
            </button>

            {/* Heart Icon */}
            <button
              onClick={onWishlistToggle}
              className={`flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 active:scale-95 border ${
                isLiked
                  ? "bg-red-50 text-red-500 border-red-100"
                  : "bg-red-50 text-gray-600 border-[#f0e4da] hover:bg-[#e8d9ce]"
              }`}
              aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => openSelectionModal("cart")}
            disabled={currentPrice <= 0}
            className={`flex-[1.4] flex items-center justify-center gap-1 h-11 rounded-full text-[13px] font-bold transition-all duration-300 active:scale-[0.97] border
              ${
                currentPrice <= 0
                  ? "bg-gray-100 text-gray-300 border-gray-100"
                  : "bg-primary text-white border-primary hover:opacity-90"
              }`}
          >
            <ShoppingCart size={18} strokeWidth={2.5} />
            Add To Cart
          </button>

          <button
            onClick={() => openSelectionModal("buy")}
            disabled={currentPrice <= 0}
            className={`flex-1 flex items-center justify-center h-11 rounded-full text-white font-bold text-sm transition-all duration-200 active:scale-[0.97] shadow-lg
              ${
                currentPrice <= 0
                  ? "bg-gray-300 cursor-not-allowed opacity-60 shadow-none"
                  : "bg-linear-to-r from-accent to-pink-500 shadow-accent/25"
              }`}
          >
            Buy
          </button>
        </div>
      </div>

      <VariantSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        selectedOptions={selectedOptions}
        handleSelect={handleSelect}
        currentPrice={currentPrice}
        mainImage={mainImage}
        onConfirm={handleConfirmAction}
        actionType={modalAction}
        isAdding={isAdding}
        isAdded={isAdded}
        shakeOptions={shakeOptions}
        setShakeOptions={setShakeOptions}
      />
    </>
  );
};

export default MobileActionBar;
