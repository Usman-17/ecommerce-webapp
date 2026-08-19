import { Check, AlertCircle } from "lucide-react";
import { useState, useRef, useCallback } from "react";

import { calculateProductPrice } from "../../../utils/productPriceUtils";

const ScoopProductCard = ({
  product,
  selectedVariants,
  onVariantSelect,
  onQuickViewOpen,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageContainerRef = useRef(null);
  const touchStartX = useRef(null);

  const instanceId = product._instanceId || product._id;

  const variants = (product.variants || []).filter((v) => v.isActive !== false);
  const hasVariants = variants.length > 0;

  const allSelected = hasVariants ? !!selectedVariants?.[instanceId] : true;

  const { displayPrice, oldPrice, isSale } = calculateProductPrice(product);

  const allImages = (product.productImages || [])
    .filter(Boolean)
    .map((img) => img.url)
    .filter(Boolean);

  const hasMultipleImages = allImages.length > 1;

  const handleMouseMove = (e) => {
    if (!hasMultipleImages || hasVariants) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const newIndex = Math.floor((x / width) * allImages.length);
    const clampedIndex = Math.max(0, Math.min(newIndex, allImages.length - 1));
    if (clampedIndex !== currentImageIndex) {
      setCurrentImageIndex(clampedIndex);
    }
  };

  const handleMouseLeave = () => {
    if (hasVariants) return;
    setCurrentImageIndex(0);
  };

  const handleTouchStart = (e) => {
    if (!hasMultipleImages || hasVariants) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = useCallback(
    (e) => {
      if (!hasMultipleImages || hasVariants || touchStartX.current === null) return;
      const diff = e.touches[0].clientX - touchStartX.current;
      if (Math.abs(diff) > 30) {
        if (diff > 0 && currentImageIndex > 0) {
          setCurrentImageIndex((prev) => prev - 1);
        } else if (diff < 0 && currentImageIndex < allImages.length - 1) {
          setCurrentImageIndex((prev) => prev + 1);
        }
        touchStartX.current = null;
      }
    },
    [hasMultipleImages, hasVariants, currentImageIndex, allImages.length],
  );

  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  const handleImageClick = () => {
    if (onQuickViewOpen) {
      onQuickViewOpen(product);
    }
  };

  return (
    <div
      className={`group bg-white rounded-lg border overflow-hidden transition-all duration-300 cursor-pointer ${
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
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer"
        style={{ touchAction: "pan-x" }}
      >
        {allImages.length > 0 ? (
          allImages.map((src, idx) => (
            <img
              key={idx}
              src={selectedVariants?.[instanceId]?.image?.url || src}
              alt={`${product.title} - Image ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                idx === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
              decoding="async"
            />
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            No Image
          </div>
        )}

        {/* Dots indicator */}
        {hasMultipleImages && !hasVariants && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {allImages.map((_, idx) => (
              <span
                key={idx}
                className={`block rounded-full transition-all duration-300 ${
                  idx === currentImageIndex
                    ? "w-4 h-1.5 bg-white shadow-sm"
                    : "w-1.5 h-1.5 bg-white/50"
                }`}
              />
            ))}
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
          <div className="space-y-1 pt-0.5">
            <div className="flex flex-wrap gap-1">
              {variants.map((variant) => {
                const isSelected =
                  selectedVariants?.[instanceId]?._id === variant._id;
                return (
                  <button
                    key={variant._id}
                    onClick={() => onVariantSelect(instanceId, variant)}
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold transition-all duration-200 ${
                      isSelected
                        ? "bg-accent text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {variant.name}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-[9px] text-green-600 font-semibold flex items-center gap-0.5">
            <Check size={8} strokeWidth={3} /> No options
          </p>
        )}
      </div>
    </div>
  );
};

export default ScoopProductCard;
