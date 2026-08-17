import toast from "react-hot-toast";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Zap } from "lucide-react";

import LoadingSpinner from "../../../components/common/LoadingSpinner";

import { getCart, setCart } from "../../../utils/cartStorage";

import useEcommerce from "../../../hooks/useEcommerce";

import { setInMemoryData } from "../../../services/storageService";
// Imports End----

const ProductActions = ({
  product,
  selectedPack,
  mainImage,
  activeVariantImage,
  selectedOptions,
  matchedVariant,
  selectedVariants,
  currentPrice,
  quantity,
  setQuantity,
  onShakeOptions,
}) => {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const { trackAddToCart } = useEcommerce();

  const total = useMemo(() => {
    const tiers = (product?.bulkPricing || [])
      .filter((t) => t.quantity && t.price)
      .sort((a, b) => b.quantity - a.quantity);
    const matchedTier = tiers.find((t) => quantity >= t.quantity);
    if (matchedTier) {
      const perItem = Number(matchedTier.price) / Number(matchedTier.quantity);
      return Math.round(perItem * quantity);
    }
    return currentPrice * quantity;
  }, [currentPrice, quantity, product?.bulkPricing]);

  const activeTier = useMemo(() => {
    const tiers = (product?.bulkPricing || [])
      .filter((t) => t.quantity && t.price)
      .sort((a, b) => b.quantity - a.quantity);
    return tiers.find((t) => quantity >= t.quantity) || null;
  }, [quantity, product?.bulkPricing]);

  const hasVariants =
    (product?.variants?.filter((v) => v.isActive !== false)?.length || 0) > 0;

  const missingVariantTypes = useMemo(() => {
    if (!hasVariants || !product?.variants) return [];
    const types = [
      ...new Set(
        product.variants
          .filter((v) => v.isActive !== false)
          .map((v) => v.type || "Other"),
      ),
    ];
    return types.filter((type) => !selectedOptions[`variant_${type}`]);
  }, [product, selectedOptions, hasVariants]);

  const allVariantTypesSelected = missingVariantTypes.length === 0;

  const variantErrorMessage = useMemo(() => {
    if (missingVariantTypes.length === 0) return "";
    if (missingVariantTypes.length === 1) {
      return `Please select ${missingVariantTypes[0]}`;
    }
    return `Please select ${missingVariantTypes.join(" and ")}`;
  }, [missingVariantTypes]);

  const { perItemPrice, hasBulkDiscount } = useMemo(() => {
    const tiers = (product?.bulkPricing || [])
      .filter((t) => t.quantity && t.price)
      .sort((a, b) => b.quantity - a.quantity);
    const matched = tiers.find((t) => quantity >= t.quantity);
    return {
      perItemPrice: matched
        ? Math.round(Number(matched.price) / Number(matched.quantity))
        : currentPrice,
      hasBulkDiscount: !!matched,
    };
  }, [quantity, currentPrice, product?.bulkPricing]);

  const handleAddToCart = () => {
    if (currentPrice <= 0) {
      toast.error("Product price is not available.", { id: "price-error" });
      return;
    }

    if (hasVariants && !allVariantTypesSelected) {
      onShakeOptions?.();
      toast.error(variantErrorMessage, { id: "variant-error" });
      return;
    }

    setIsAdding(true);

    const cartItem = {
      productId: product._id,
      productSlug: product.slug,
      name: product.title,
      image: mainImage,
      variantImage: activeVariantImage,
      category: product.categoryName,
      subCategory: product.subCategoryName,
      packId: selectedPack?.productPackId || null,
      packDescription: selectedPack?.productPackDescription || null,
      price: perItemPrice,
      oldPrice: hasBulkDiscount ? currentPrice : null,
      quantity: quantity,
      total: total,
      selectedOptions,
      variantId: matchedVariant?._id || null,
      selectedVariants: selectedVariants.map((v) => ({
        detailName: v.name,
        variantId: v._id,
      })),
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
      const updated = { ...existingCart[existingIndex] };
      updated.quantity += cartItem.quantity;
      updated.total = updated.quantity * updated.price;
      existingCart.splice(existingIndex, 1);
      existingCart.unshift(updated);
    } else {
      existingCart.unshift(cartItem);
    }

    setCart(existingCart);
    window.dispatchEvent(new Event("cartUpdated"));

    trackAddToCart(product, quantity, { item_list_name: "product_page" });

    setTimeout(() => {
      setIsAdding(false);
      window.dispatchEvent(new Event("openCartDrawer"));
    }, 600);
  };

  const handleBuyNow = () => {
    if (currentPrice <= 0) {
      toast.error("Product price is not available.", { id: "price-error" });
      return;
    }

    if (hasVariants && !allVariantTypesSelected) {
      onShakeOptions?.();
      toast.error(variantErrorMessage, { id: "variant-error" });
      return;
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
      price: perItemPrice,
      oldPrice: hasBulkDiscount ? currentPrice : null,
      quantity: quantity,
      total: total,
      selectedOptions,
      variantId: matchedVariant?._id || null,
      selectedVariants: matchedVariant
        ? [{ detailName: matchedVariant.name }]
        : [],
    };

    setInMemoryData("buyNowItem", buyNowItem);
    navigate("/place-order");
  };

  return (
    <div className="hidden sm:block pt-4 space-y-6">
      <div className="flex items-center justify-between gap-6">
        {/* Quantity Selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
            Quantity
          </label>

          <div className="flex items-center bg-[#fff8f8] border border-gray-200/80 rounded-full p-1 mt-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all"
            >
              -
            </button>

            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-12 text-center bg-transparent focus:outline-none font-bold text-primary select-none [&::-webkit-outer-spin-button]:appearance-none [&]:moz-appearance:textfield"
            />

            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all"
            >
              +
            </button>
          </div>
        </div>

        {/* Total Price */}
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Total Price
          </p>
          <p className="text-xl font-bold text-primary">
            Rs {total.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </p>

          {activeTier && (
            <p className="text-[10px] text-green-600 font-medium">
              Bulk deal! Rs{" "}
              {Math.round(
                Number(activeTier.price) / Number(activeTier.quantity),
              )}
              /item
            </p>
          )}
        </div>
      </div>

      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding || currentPrice <= 0}
          className={`relative overflow-hidden group flex items-center justify-center gap-2.5 py-4 px-6 rounded-full bg-white border border-gray-200 text-primary font-bold text-sm transition-all duration-300 min-w-40 ${
            isAdding
              ? ""
              : currentPrice <= 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-gray-400/40 hover:shadow-md active:scale-[0.98]"
          }`}
        >
          {isAdding ? (
            <LoadingSpinner width="w-auto" content="Adding..." />
          ) : (
            <div className="flex items-center gap-2.5 transition-all duration-300">
              <ShoppingCart
                size={18}
                className="group-hover:scale-110 transition-transform duration-300"
              />
              Add to Cart
            </div>
          )}
        </button>

        {/* Buy It Now Button */}
        <button
          onClick={handleBuyNow}
          disabled={currentPrice <= 0}
          className={`relative overflow-hidden group flex items-center justify-center gap-2.5 py-4 px-6 rounded-full bg-linear-to-tr from-accent to-pink-400 text-white font-black text-sm transition-all duration-300 ${
            currentPrice <= 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:shadow-xl hover:shadow-accent/30"
          }`}
        >
          <div
            className={`absolute inset-0 bg-white/30 -translate-x-full skew-x-[-15deg] transition-transform duration-700 ease-in-out ${
              currentPrice > 0 ? "group-hover:translate-x-full" : ""
            }`}
          />
          <Zap
            size={18}
            fill="currentColor"
            className="relative z-10  transition-transform duration-300"
          />
          <span className="relative z-10 text-sm">
            Buy It Now - Rs{" "}
            {total.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductActions;
