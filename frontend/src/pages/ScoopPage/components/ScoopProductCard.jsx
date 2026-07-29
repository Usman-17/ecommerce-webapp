import { useState, useRef } from "react";
import { Check, AlertCircle } from "lucide-react";

import { calculateProductPrice } from "../../../utils/productPriceUtils";

const ScoopProductCard = ({
  product,
  selections,
  onVariantSelect,
  onQuickViewOpen,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageContainerRef = useRef(null);

  const instanceId = product._instanceId || product._id;

  const options = product.productOptionResponses || [];
  const requiredOptions = options.filter(
    (opt) => opt.productOptionDetailResponses?.length > 1,
  );
  const hasVariants = requiredOptions.length > 0;

  const allSelected = hasVariants
    ? requiredOptions.every(
        (opt) => selections[`${instanceId}-${opt.productOptionTypeName}`],
      )
    : true;

  const { displayPrice, oldPrice, isSale } = calculateProductPrice(product);

  const allImages = (product.productImages || []).map((img) => img.url).filter(Boolean);

  const hasMultipleImages = allImages.length > 1;

  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  const handleImageClick = (e) => {
    if (hasMultipleImages && !isTouchDevice) {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const newIndex = Math.floor((x / width) * allImages.length);
      const clampedIndex = Math.max(
        0,
        Math.min(newIndex, allImages.length - 1),
      );
      if (clampedIndex !== currentImageIndex) {
        setCurrentImageIndex(clampedIndex);
      }
    }

    if (onQuickViewOpen) {
      onQuickViewOpen(product);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg border overflow-hidden transition-all duration-300 cursor-pointer ${
        allSelected
          ? "border-green-200 shadow-sm shadow-green-50"
          : "border-gray-100 shadow-sm"
      }`}
      style={{ contentVisibility: "auto", containIntrinsicSize: "300px" }}
    >
      {/* Image */}
      <div
        ref={imageContainerRef}
        onClick={handleImageClick}
        className="relative aspect-square overflow-hidden bg-gray-50"
        style={{ touchAction: "manipulation" }}
      >
        {allImages.length > 0 ? (
          <img
            src={allImages[currentImageIndex]}
            alt={`${product.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            No Image
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-1.5 left-1.5">
          {allSelected ? (
            <span className="inline-flex items-center gap-0.5 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              <Check size={8} strokeWidth={3} /> Ready
            </span>
          ) : hasVariants ? (
            <span className="inline-flex items-center gap-0.5 bg-amber-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              <AlertCircle size={8} /> Select
            </span>
          ) : null}
        </div>

        {/* Category */}
        {product.subCategoryName && (
          <span className="absolute bottom-1.5 left-1.5 bg-white/90 text-[8px] font-bold uppercase tracking-wider text-gray-500 px-1.5 py-0.5 rounded-full">
            {product.subCategoryName}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-2 space-y-2">
        <h3 className="text-xs font-bold text-heading line-clamp-2 leading-tight">
          {product.title}
        </h3>

        <div className="flex items-center gap-1.5">
          <span
            className={`flex items-start gap-0.5 font-bold text-xs leading-none ${isSale ? "text-accent" : "text-primary"}`}
          >
            <span className="text-[8px] font-semibold mt-0.5">Rs</span>
            <span>{displayPrice?.toLocaleString()}</span>
          </span>
          {oldPrice && (
            <span className="flex items-start gap-0.5 text-gray-400 text-[10px] line-through leading-none">
              <span className="text-[7px] font-semibold mt-0.5">Rs</span>
              <span>{oldPrice?.toLocaleString()}</span>
            </span>
          )}
        </div>

        {/* Variants */}
        {hasVariants ? (
          <div className="space-y-2 pt-0.5">
            {requiredOptions.map((opt) => {
              const isColor =
                (opt.productOptionTypeName || "").toLowerCase() === "color";
              const details = opt.productOptionDetailResponses || [];
              return isColor ? (
                <div key={opt.productOptionId} className="flex flex-wrap gap-1">
                  {details.map((detail) => {
                    const isSelected =
                      selections[
                        `${instanceId}-${opt.productOptionTypeName}`
                      ] === detail.productOptionDetailId;
                    return (
                      <button
                        key={detail.productOptionDetailId}
                        onClick={() =>
                          onVariantSelect(
                            instanceId,
                            opt.productOptionTypeName,
                            detail.productOptionDetailId,
                          )
                        }
                        title={detail.optionDetailName}
                        className={`relative h-5 w-5 rounded-full border transition-all duration-100 ${
                          isSelected
                            ? "border-gray-400 ring-1 ring-gray-300 scale-110"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        style={{
                          backgroundColor: detail.optionDetailHEXCode || "#ccc",
                        }}
                      >
                        {isSelected && (
                          <Check
                            size={10}
                            strokeWidth={3}
                            className="absolute inset-0 m-auto text-white"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : null;
            })}

            {!allSelected && (
              <div className="flex items-center gap-1.5 pt-0.5">
                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{
                      width: `${(Object.keys(selections).filter((k) => k.startsWith(instanceId)).length / requiredOptions.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[9px] font-bold text-gray-400">
                  {
                    Object.keys(selections).filter((k) =>
                      k.startsWith(instanceId),
                    ).length
                  }
                  /{requiredOptions.length}
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-[9px] text-green-600 font-semibold flex items-center gap-0.5">
            <Check size={8} strokeWidth={3} /> No variants needed
          </p>
        )}
      </div>
    </div>
  );
};

export default ScoopProductCard;
