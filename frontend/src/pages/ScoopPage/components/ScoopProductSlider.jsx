import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ProductCard from "../../../components/ProductCard";
import ProductCardSkeleton from "../../../components/Skeleton/ProductCardSkeleton";
// Imports End-----

const ScoopProductSlider = ({ products, isLoading }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-8 sm:py-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[11px] uppercase tracking-[3px] font-bold text-accent mb-1">
            DISCOVER
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-heading">
            Scoop-Worthy Finds{" "}
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 max-w-xs mx-auto">
            Explore the products waiting to surprise you in your next scoop.
          </p>
        </div>

        {/* Nav Arrows */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-accent hover:text-accent transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-accent hover:text-accent transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Slider */}
      <div
        ref={scrollRef}
        className="flex gap-2 sm:gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-1 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <div key={i} className="shrink-0 w-[40%] lg:w-[15%]">
                <ProductCardSkeleton />
              </div>
            ))
          : products.map((product, idx) => (
              <div
                key={product._id}
                className="shrink-0 w-[40%] lg:w-[15%]"
              >
                <ProductCard product={product} index={idx} showDescription />
              </div>
            ))}
      </div>

      <div className="sm:hidden flex items-center justify-center gap-3 mt-4">
        <div className="h-px w-12 bg-linear-to-r from-transparent to-gray-300" />
        <span className="text-[10px] font-medium text-gray-400 tracking-wide uppercase">
          Swipe to explore more
        </span>
        <div className="h-px w-12 bg-linear-to-l from-transparent to-gray-300" />
      </div>
    </section>
  );
};

export default ScoopProductSlider;
