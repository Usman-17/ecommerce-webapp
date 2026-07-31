import { motion as Motion, AnimatePresence } from "framer-motion";
import { X, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
// Imports End---

const QuickViewContent = ({
  displayProduct,
  isSale,
  discountPercentage,
  displayPrice,
  oldPrice,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const thumbStripRef = useRef(null);

  const allImages = useMemo(
    () =>
      (displayProduct.productImages || [])
        .map((img) => img.url)
        .filter(Boolean),
    [displayProduct.productImages],
  );

  useEffect(() => {
    if (!thumbStripRef.current) return;
    const strip = thumbStripRef.current;
    const activeThumb = strip.children[currentImageIndex];
    if (activeThumb) {
      const scrollLeft =
        activeThumb.offsetLeft -
        strip.offsetWidth / 2 +
        activeThumb.offsetWidth / 2;
      strip.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [currentImageIndex]);

  const handlePrevImage = useCallback(
    (e) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) =>
        prev === 0 ? allImages.length - 1 : prev - 1,
      );
    },
    [allImages.length],
  );

  const handleNextImage = useCallback(
    (e) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) =>
        prev === allImages.length - 1 ? 0 : prev + 1,
      );
    },
    [allImages.length],
  );

  return (
    <>
      {/* Image - Left Side */}
      <div className="relative w-full sm:w-1/2 bg-gray-50 shrink-0 flex flex-col">
        {/* Main Image */}
        <div className="relative aspect-4/3 sm:aspect-square overflow-hidden">
          {allImages.length > 0 ? (
            <img
              src={allImages[currentImageIndex]}
              alt={`${displayProduct.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              No Image
            </div>
          )}

          {isSale && (
            <span className="absolute top-3 left-3 bg-accent text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10">
              {discountPercentage}% OFF
            </span>
          )}

          {/* Navigation arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors shadow-md z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors shadow-md z-10"
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Image counter */}
          {allImages.length > 1 && (
            <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-medium px-2 py-0.5 rounded-full z-10">
              {currentImageIndex + 1} / {allImages.length}
            </span>
          )}
        </div>

        {/* Thumbnail strip */}
        {allImages.length > 1 && (
          <div
            ref={thumbStripRef}
            className="flex gap-1.5 p-2 overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {allImages.map((src, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentImageIndex(idx);
                }}
                className={`shrink-0 w-[calc(25%-4.5px)] aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  idx === currentImageIndex
                    ? "border-accent"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={src}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content - Right Side */}
      <div className="p-3 sm:p-5 space-y-2 sm:space-y-4 flex-1 overflow-y-auto">
        {/* Category */}
        {displayProduct.subCategoryName && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {displayProduct.subCategoryName}
          </span>
        )}

        {/* Name */}
        <h2
          id="quick-view-title"
          className="text-lg font-bold text-heading leading-tight"
        >
          {displayProduct.title}
        </h2>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < (displayProduct.rating || 5) ? "currentColor" : "none"}
              className={
                i < (displayProduct.rating || 5)
                  ? "text-yellow-400"
                  : "text-gray-200"
              }
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">
            ({displayProduct.rating || 5})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span
            className={`flex items-start gap-0.5 font-bold text-xl leading-none ${isSale ? "text-accent" : "text-primary"}`}
          >
            <span className="text-xs font-semibold mt-1">Rs</span>
            <span>
              {displayPrice?.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </span>
          </span>
          {oldPrice && (
            <span className="flex items-start gap-0.5 text-gray-400 text-sm line-through leading-none">
              <span className="text-[10px] font-semibold mt-1">Rs</span>
              <span>
                {oldPrice?.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
            </span>
          )}
        </div>

        {/* Description */}
        {displayProduct.description && (
          <div
            className="text-xs text-gray-500 leading-relaxed prose prose-xs max-w-none"
            dangerouslySetInnerHTML={{ __html: displayProduct.description }}
          />
        )}

        {/* Variants */}
        {displayProduct.variants && displayProduct.variants.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Variants
            </span>
            <div className="flex flex-wrap gap-2">
              {displayProduct.variants.map((variant, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-700 bg-gray-50"
                >
                  {variant.name}
                  {variant.price
                    ? ` — Rs ${variant.price.toLocaleString()}`
                    : ""}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const ProductQuickView = ({ product, isOpen, onClose }) => {
  const modalRef = useRef(null);

  // Use the product data directly (flat backend fields)
  const displayProduct = product;

  // Escape key & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    if (window.history.state?.modalOpen) {
      window.history.back();
    } else {
      window.history.pushState({ modalOpen: true }, "");
    }

    const handlePopState = () => {
      onClose();
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
      window.removeEventListener("popstate", handlePopState);
      if (window.history.state?.modalOpen) {
        window.history.back();
      }
    };
  }, [isOpen, onClose]);

  if (!displayProduct) return null;

  // Price: flat backend fields
  const secondaryPrice = displayProduct?.secondaryPrice || 0;
  const price = displayProduct?.price || 0;
  const isSale = secondaryPrice > 0 && secondaryPrice > price;
  const displayPrice = isSale ? price : secondaryPrice || price;
  const oldPrice = isSale ? secondaryPrice : null;
  const discountPercentage = isSale
    ? Math.round(((secondaryPrice - price) / secondaryPrice) * 100)
    : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-view-title"
          className="fixed inset-0 z-9999 flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Modal */}
          <Motion.div
            ref={modalRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="relative bg-white w-full sm:max-w-3xl sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col sm:flex-row sm:rounded-2xl rounded-t-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors shadow-sm"
              aria-label="Close quick view"
            >
              <X size={16} />
            </button>

            <QuickViewContent
              key={displayProduct._id || displayProduct._instanceId}
              displayProduct={displayProduct}
              isSale={isSale}
              discountPercentage={discountPercentage}
              displayPrice={displayPrice}
              oldPrice={oldPrice}
            />
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductQuickView;
