import { useState, useEffect, useRef } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

import ProductOptions from "./ProductOptions";
import { vibrate } from "../../../utils/vibrate";
// Imports End------

const VariantSelectorModal = ({
  isOpen,
  onClose,
  product,
  currentPrice,
  mainImage,
  selectedOptions,
  handleSelect,
  onConfirm,
  actionType,
  isAdding,
  isAdded,
  shakeOptions,
  setShakeOptions,
}) => {
  const [localQuantity, setLocalQuantity] = useState(1);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.history.pushState({ modal: "variant-selector" }, "");

      const handlePopState = () => {
        onCloseRef.current();
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
  }, [isOpen]);

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
            <div className="flex justify-center pt-3 pb-1 active:cursor-grabbing">
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
                    src={mainImage}
                    alt={product?.title}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 tracking-tight leading-tight">
                    {product?.title}
                  </h3>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-bold text-accent">
                      Rs {currentPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Variant Selection */}
              <ProductOptions
                product={product}
                selectedOptions={selectedOptions}
                handleSelect={handleSelect}
                shakeOptions={shakeOptions}
                setShakeOptions={setShakeOptions}
              />

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
                    className="w-12 text-center bg-transparent focus:outline-none font-bold text-primary select-none [&::-webkit-inner-spin-button]:appearance-none [&]:moz-appearance:textfield"
                  />

                  <button
                    onClick={() => setLocalQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buy More Save More */}
              {(product?.bulkPricing || []).filter((t) => t.quantity && t.price)
                .length > 0 && (
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/30 to-accent/30" />
                  <span className="text-[11px] font-bold text-accent tracking-wide whitespace-nowrap">
                    ✨ Buy More, Save More ✨
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-accent/30 to-accent/30" />
                </div>
              )}

              {/* Bulk Pricing Tiers */}
              {(() => {
                const tiers = (product?.bulkPricing || [])
                  .filter((t) => t.quantity && t.price)
                  .sort((a, b) => a.quantity - b.quantity);
                if (tiers.length === 0) return null;
                const bestIdx =
                  tiers.length -
                  1 -
                  [...tiers]
                    .reverse()
                    .findIndex((t) => localQuantity >= Number(t.quantity));
                return (
                  <div
                    className={`grid gap-2 ${
                      tiers.length === 2
                        ? "grid-cols-2"
                        : tiers.length >= 3
                          ? "grid-cols-3"
                          : "grid-cols-1"
                    }`}
                  >
                    {tiers.map((tier, i) => {
                      const perItem = Math.round(
                        Number(tier.price) / Number(tier.quantity),
                      );
                      const total = Number(tier.price);
                      const isActive =
                        i === bestIdx && localQuantity >= Number(tier.quantity);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() =>
                            setLocalQuantity(Number(tier.quantity))
                          }
                          className={`flex flex-col items-center rounded-xl border-2 px-2 py-3 transition-all cursor-pointer ${
                            isActive
                              ? "border-accent bg-accent/5"
                              : "border-orange-200 bg-orange-50/50 hover:border-orange-300"
                          }`}
                        >
                          <span className="text-[11px] font-bold text-gray-700">
                            Buy {tier.quantity}
                          </span>

                          <span
                            className={`text-sm font-black mt-1 ${
                              isActive ? "text-accent" : "text-orange-600"
                            }`}
                          >
                            Rs {perItem.toLocaleString()}/each
                          </span>

                          <span className="text-[10px] text-gray-400 mt-1">
                            Total{" "}
                            <span
                              className={`font-bold ${
                                isActive ? "text-accent" : "text-gray-600"
                              }`}
                            >
                              Rs {total.toLocaleString()}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Sticky Footer */}
            <div className="px-5 py-4 border-t border-gray-100 bg-white flex items-center gap-4">
              <div className="shrink-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                  Total Price
                </p>
                <p className="text-xl font-black text-accent leading-none tabular-nums">
                  Rs{" "}
                  {(() => {
                    const tiers = (product?.bulkPricing || [])
                      .filter((t) => t.quantity && t.price)
                      .sort((a, b) => b.quantity - a.quantity);
                    const matched = tiers.find(
                      (t) => localQuantity >= t.quantity,
                    );
                    if (matched) {
                      const perItem =
                        Number(matched.price) / Number(matched.quantity);
                      return Math.round(
                        perItem * localQuantity,
                      ).toLocaleString();
                    }
                    return (currentPrice * localQuantity).toLocaleString();
                  })()}
                </p>
              </div>

              <button
                onClick={() => {
                  vibrate();
                  onConfirm(localQuantity);
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
