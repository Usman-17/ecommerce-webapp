import { Check, ShoppingCart } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";

import { vibrate } from "../../../utils/vibrate";
// Imports End------

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

const VariantSelectorModal = ({
  isOpen,
  onClose,
  product,
  selectedOptions,
  handleSelect,
  currentPrice,
  mainImage,
  onConfirm,
  actionType,
  isAdding,
  isAdded,
  shakeOptions,
  setShakeOptions,
}) => {
  const [localQuantity, setLocalQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.history.pushState({ modal: "variant-selector" }, "");

      const handlePopState = () => {
        onClose();
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("popstate", handlePopState);
        if (window.history.state?.modal === "variant-selector") {
          window.history.back();
        }
      };
    }
  }, [isOpen, onClose]);

  const optionGroups = useMemo(() => {
    // Simply filter out options that have no details
    const activeOptions =
      product?.data?.productOptionResponses?.filter(
        (option) => option.productOptionDetailResponses?.length > 0,
      ) || [];

    // Sort by sequence number if available to preserve the natural ordering from your backend
    return [...activeOptions].sort(
      (a, b) => (a.productOptionSeqNo || 0) - (b.productOptionSeqNo || 0),
    );
  }, [product]);

  // Get active variant image for the summary row
  const displayImage = useMemo(() => {
    const colorOption = product?.data?.productOptionResponses?.find(
      (o) =>
        o.productOptionTypeId === 10 ||
        (o.productOptionTypeName || "").toLowerCase() === "color" ||
        o.productOptionPrefix === "CLRPOT",
    );
    if (!colorOption) return mainImage;

    const selectedColorId = selectedOptions[colorOption.productOptionId];
    if (!selectedColorId) return mainImage;

    const matchedVariant = product?.data?.productVariantResponses?.find(
      (v) =>
        v.colorProductOptionDetailId === selectedColorId && v.variantImageURL,
    );

    return matchedVariant?.variantImageURL || mainImage;
  }, [product, selectedOptions, mainImage]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            data-modal-backdrop
            className="fixed inset-0 bg-black/60 z-100"
          />

          {/* Sheet */}
          <Motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            dragDirectionLock
            onDrag={(event, info) => {
              if (info.offset.y <= 0) return;
              const progress = Math.min(info.offset.y / 300, 1);
              const backdrop = document.querySelector("[data-modal-backdrop]");
              if (backdrop) {
                backdrop.style.opacity = 1 - progress;
              }
            }}
            onDragEnd={(event, info) => {
              const backdrop = document.querySelector("[data-modal-backdrop]");
              if (backdrop) backdrop.style.opacity = "";
              if (info.offset.y > 80 || info.velocity.y > 200) {
                onClose();
              }
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 350,
              mass: 0.8,
            }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-101 max-h-[95vh] overflow-hidden flex flex-col safe-area-inset-bottom will-change-transform"
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-gray-300/50 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 pt-2 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">
                {actionType === "buy" ? "Buy Now" : "Add to Cart"}
              </h2>
            </div>

            {/* Scrollable Content */}
            <div
              className={`flex-1 overflow-y-auto px-5 py-2 space-y-3 ${shakeOptions ? "animate-shake" : ""}`}
              onAnimationEnd={() => setShakeOptions?.(false)}
            >
              {/* Product Summary Row */}
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-xl bg-white overflow-hidden shrink-0 border border-gray-100">
                  <img
                    src={displayImage}
                    alt={product?.data?.productName}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 tracking-tight leading-tight">
                    {product?.data?.productName}
                  </h3>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-bold text-accent">
                      Rs {currentPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Options */}
              {optionGroups.map((option) => {
                const typeName = (
                  option.productOptionTypeName || ""
                ).toLowerCase();
                const isColor =
                  typeName === "color" ||
                  option.productOptionPrefix === "CLRPOT";

                return (
                  <div key={option.productOptionId} className="space-y-1">
                    <label className="text-sm font-bold text-gray-900 block">
                      {option.productOptionTypeName ||
                        option.productOptionPrefix ||
                        "Option"}
                    </label>

                    <div className="flex flex-wrap gap-3">
                      {option.productOptionDetailResponses
                        ?.sort(
                          (a, b) =>
                            (a.optionDetailSeqNo || 0) -
                            (b.optionDetailSeqNo || 0),
                        )
                        ?.map((detail) => {
                          const isSelected =
                            selectedOptions[option.productOptionId] ===
                            detail.productOptionDetailId;

                          if (isColor) {
                            const hexColor =
                              detail.optionDetailHEXCode ||
                              detail.colorHEXCode ||
                              "#9ca3af";
                            const isLightColor = isColorLight(hexColor);
                            const checkColor = isLightColor
                              ? "#374151"
                              : "#ffffff";

                            return (
                              <div
                                key={detail.productOptionDetailId}
                                className="flex flex-col items-center gap-1.5"
                              >
                                <button
                                  onClick={() =>
                                    handleSelect(
                                      option.productOptionId,
                                      detail.productOptionDetailId,
                                    )
                                  }
                                  className={`relative w-9 h-9 rounded-full transition-all duration-300 ${
                                    isLightColor
                                      ? "border border-gray-300 sm:border-0"
                                      : ""
                                  } ${
                                    isSelected
                                      ? "scale-110 shadow-lg shadow-gray-200"
                                      : "hover:scale-105"
                                  }`}
                                  style={{ backgroundColor: hexColor }}
                                >
                                  {isSelected && (
                                    <Check
                                      size={16}
                                      className="absolute inset-0 m-auto"
                                      style={{ color: checkColor }}
                                    />
                                  )}
                                </button>
                                <span
                                  className={`text-[10px] font-semibold ${isSelected ? "text-gray-900" : "text-gray-500"}`}
                                >
                                  {detail.optionDetailName}
                                </span>
                              </div>
                            );
                          }

                          return (
                            <button
                              key={detail.productOptionDetailId}
                              onClick={() =>
                                handleSelect(
                                  option.productOptionId,
                                  detail.productOptionDetailId,
                                )
                              }
                              className={`min-w-16 px-4 py-2 text-xs font-bold rounded-full transition-all duration-200 border
                                 ${
                                   isSelected
                                     ? "bg-black text-white border-gray-900 shadow-sm"
                                     : "bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100"
                                 }`}
                            >
                              {detail.optionDetailName}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                );
              })}

              {/* Quantity */}
              <div className="flex items-center justify-between py-2">
                <label className="text-lg font-bold text-gray-900">
                  Quantity
                </label>

                <div className="flex items-center bg-white border border-gray-200/80 rounded-full p-0.5">
                  <button
                    onClick={() => setLocalQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    value={localQuantity}
                    onChange={(e) =>
                      setLocalQuantity(Math.max(1, Number(e.target.value)))
                    }
                    className="w-12 text-center bg-transparent focus:outline-none font-bold text-primary select-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&]:moz-appearance:textfield"
                  />

                  <button
                    onClick={() => setLocalQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="px-5 py-4 border-t border-gray-100 bg-white flex items-center gap-4">
              <div className="shrink-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                  Total Price
                </p>
                <p className="text-xl font-black text-accent leading-none tabular-nums">
                  Rs {(currentPrice * localQuantity).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => {
                  vibrate();
                  if (actionType === "buy") {
                    onConfirm(localQuantity);
                  } else {
                    onConfirm(localQuantity);
                  }
                }}
                disabled={isAdding}
                className={`flex-1 h-12 rounded-full font-bold text-white transition-all duration-300 shadow-lg active:scale-[0.98] flex items-center justify-center gap-2
                  ${
                    actionType === "buy"
                      ? "bg-accent shadow-accent/20"
                      : isAdded
                        ? "bg-green-500 shadow-green-500/20"
                        : "bg-primary shadow-primary/20"
                  }`}
              >
                {isAdding ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isAdded ? (
                  <>
                    <Check size={20} strokeWidth={3} />
                    Added!
                  </>
                ) : (
                  <>
                    {actionType === "buy" ? (
                      "Buy Now"
                    ) : (
                      <>
                        <ShoppingCart size={18} strokeWidth={2.5} />
                        Add to Cart
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VariantSelectorModal;
