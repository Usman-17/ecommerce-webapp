import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";

import WishlistButton from "./WishlistButton";
import { useWishlist } from "../hooks/useWishlist";

import { calculateProductPrice } from "../utils/productPriceUtils";
// Imports End----

const ProductCard = ({ product, index = 0 }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);

  // Image State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const imageContainerRef = useRef(null);

  // Image Array
  const allImages = (product.productImages || [])
    .map((img) => img.url)
    .filter(Boolean);

  const hasMultipleImages = allImages.length > 1;

  // Check if device is touch/mobile
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // Image Hover Move Function
  const handleMouseMove = (e) => {
    if (!hasMultipleImages || isTouchDevice) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    const newIndex = Math.floor((x / width) * allImages.length);
    const clampedIndex = Math.max(0, Math.min(newIndex, allImages.length - 1));

    if (clampedIndex !== currentImageIndex) {
      setCurrentImageIndex(clampedIndex);
    }
  };

  // Image Hover Leave Function
  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    setCurrentImageIndex(0);
  };

  // Price Logic
  const { displayPrice, oldPrice, isSale, discountPercentage } =
    calculateProductPrice(product);

  // Cycling Logic for Savings/Offers/Social Proof
  const [cycleIndex, setCycleIndex] = useState(index % 3);

  useEffect(() => {
    const hasSoldCount = product.sold > 0;
    const hasSaleInfo = isSale && oldPrice && displayPrice;
    const itemCount = (hasSaleInfo ? 1 : 0) + (hasSoldCount ? 1 : 0);
    if (itemCount <= 1) return;

    let intervalId;
    const staggerDelay = (index % 6) * 600;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setCycleIndex((prev) => (prev + 1) % itemCount);
      }, 3000);
    }, staggerDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSale, oldPrice, displayPrice, product, index]);

  return (
    <article className="relative group">
      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <WishlistButton
          isLiked={inWishlist}
          onToggle={() => toggleWishlist(product)}
          className="bg-white shadow-sm"
        />
      </div>
      <Link to={`/product/${product.slug}`}>
        <Motion.div
          className="bg-[#fffaf5] rounded-lg sm:rounded-lg border border-gray-50/50  transition-all duration-500 relative cursor-pointer overflow-hidden active:scale-[0.98] sm:h-85 sm:flex sm:flex-col"
          onMouseLeave={handleMouseLeave}
          whileTap={{ scale: 0.98 }}
        >
          {/* Badges */}
          <div className="absolute top-2 sm:top-2.5 left-2 sm:left-2 z-10 flex flex-col gap-2">
            {isSale && (
              <span className="bg-accent text-white text-[9px] font-bold px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow-sm">
                {discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Image */}
          <div
            ref={imageContainerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => !isTouchDevice && setIsImageHovered(true)}
            onMouseLeave={() => !isTouchDevice && setIsImageHovered(false)}
            className="relative aspect-square overflow-hidden"
          >
            {allImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`${product.title} - Image ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  idx === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {/* Dots Indicator */}
            {hasMultipleImages && (
              <div
                aria-hidden="true"
                className={`absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 transition-opacity ${
                  isImageHovered
                    ? "opacity-100 duration-300"
                    : "opacity-0 duration-0"
                }`}
              >
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
          </div>

          {/* Content */}
          <div className="p-2 sm:p-1.5 pt-3 flex flex-col gap-1">
            {/* Category and Ratings */}
            <div className="flex items-center justify-between gap-1">
              <span className="text-[8px] sm:text-[9px] text-gray-400 font-semibold uppercase tracking-wider truncate max-w-32">
                {product.subCategoryName}
              </span>

              <div
                className="flex gap-0.5"
                role="img"
                aria-label={`Rating: ${product.avgRating || 0} out of 5 stars`}
              >
                {[...Array(5)].map((_, i) => {
                  const rating = product.avgRating || 0;
                  const isFull = i < Math.floor(rating);
                  const isHalf = !isFull && i < rating;
                  return (
                    <span
                      key={i}
                      className="relative"
                      style={{ width: 10, height: 10 }}
                    >
                      <Star
                        size={10}
                        fill="none"
                        stroke="currentColor"
                        className="absolute inset-0 text-gray-200"
                      />
                      {isFull && (
                        <Star
                          size={10}
                          fill="currentColor"
                          stroke="currentColor"
                          className="absolute inset-0 text-yellow-400"
                        />
                      )}
                      {isHalf && (
                        <span
                          className="absolute inset-0 overflow-hidden"
                          style={{ width: "50%" }}
                        >
                          <Star
                            size={10}
                            fill="currentColor"
                            stroke="currentColor"
                            className="text-yellow-400"
                          />
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>

            <h3 className="text-gray-900 font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors mt-0.5">
              {product.title}
            </h3>

            {/* Dynamic Cycling text */}
            {(() => {
              const hasSoldCount = product.sold > 0;
              const hasSaleInfo = isSale && oldPrice && displayPrice;

              if (!hasSoldCount && !hasSaleInfo) return null;

              const items = [];
              if (hasSaleInfo) {
                items.push(
                  <>
                    You Save Rs.{" "}
                    {(oldPrice - displayPrice).toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </>,
                );
              }
              if (hasSoldCount) {
                items.push(<>Sold {product.sold}+</>);
              }

              if (items.length === 0) return null;

              return (
                <div className="h-4 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <Motion.div
                      key={cycleIndex}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={`text-[10px] font-bold ${
                        cycleIndex % 4 === 0
                          ? "text-emerald-600"
                          : cycleIndex % 4 === 1
                            ? "text-blue-600"
                            : cycleIndex % 4 === 2
                              ? "text-orange-500"
                              : "text-rose-500"
                      }`}
                    >
                      {items[cycleIndex % items.length]}
                    </Motion.div>
                  </AnimatePresence>
                </div>
              );
            })()}

            <div className="flex items-center justify-between pb-1">
              <div className="flex items-end gap-2">
                <span
                  className={`flex items-start gap-0.5 font-bold text-lg leading-none ${isSale ? "text-accent" : "text-primary"}`}
                >
                  <span className="text-[10px] font-semibold mt-0.5 opacity-80">
                    Rs
                  </span>

                  <span>
                    {displayPrice?.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </span>

                {oldPrice && (
                  <span className="flex items-start gap-0.5 text-gray-400 text-sm line-through leading-none">
                    <span className="text-[9px] font-semibold mt-0.5">Rs</span>
                    <span>
                      {oldPrice?.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </Motion.div>
      </Link>
    </article>
  );
};

export default ProductCard;
