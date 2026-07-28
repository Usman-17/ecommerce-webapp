import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ProductCard from "../../../components/ProductCard";
import SectionHeader from "../../../components/SectionHeader";
import InViewAnimation from "../../../components/InViewAnimation";

import { useGetAllProducts } from "../../../hooks/useGetAllProducts";
// Imports End-----

const SCROLL_AMOUNT = 320;

const HairAccessoriesSection = () => {
  const scrollRef = useRef(null);

  const { products } = useGetAllProducts();

  const hairProducts = products.filter(
    (p) =>
      p.productAreaName?.toLowerCase() === "hair accessories" ||
      p.productAreaName?.toLowerCase().includes("hair"),
  );

  useEffect(() => {
    if (scrollRef.current && hairProducts.length > 0) {
      const isMobile = window.innerWidth < 640;
      if (isMobile) {
        const scrollWidth = scrollRef.current.scrollWidth;
        const clientWidth = scrollRef.current.clientWidth;
        scrollRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
      }
    }
  }, [hairProducts]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
  };

  if (hairProducts.length === 0) return null;

  return (
    <section className="pt-8 pb-16 sm:pt-12 sm:pb-6 lg:px-32">
      <div className="max-w-480 mx-auto">
        <SectionHeader
          label="Hair Accessories"
          title="Complete Your Style"
          description="Elevate your hairstyle with our curated collection of hair accessories."
          viewAllLink="/shop?area=Hair%20Accessories"
        />

        <div
          ref={scrollRef}
          role="region"
          aria-label="Hair accessories"
          className="flex overflow-x-auto overflow-y-hidden no-scrollbar gap-1 sm:gap-4 -mx-3 pl-12 pr-5 sm:mx-0 sm:pl-0 sm:pr-0"
        >
          {hairProducts.map((product, idx) => (
            <InViewAnimation
              key={product.productSlug}
              delay={0.04 * idx}
              className="shrink-0"
            >
              <div className="w-36 sm:w-56 shrink-0">
                <ProductCard product={product} />
              </div>
            </InViewAnimation>
          ))}
        </div>

        {hairProducts.length > 5 && (
          <div className="hidden sm:flex items-center justify-center gap-3 pt-8">
            <button
              onClick={scrollLeft}
              aria-label="Scroll left"
              className="flex w-9 h-9 items-center justify-center rounded-full bg-warm hover:bg-[#f0e4da] active:scale-95 transition-all duration-200 text-gray-600 hover:text-gray-900 border border-[#f0e4da]"
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>
            <button
              onClick={scrollRight}
              aria-label="Scroll right"
              className="flex w-9 h-9 items-center justify-center rounded-full bg-[#CC0D39] hover:opacity-90 active:scale-95 transition-all duration-200 text-white shadow-sm"
            >
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>
        )}

        <div className="sm:hidden flex items-center justify-center gap-3 mt-4">
          <div className="h-px w-12 bg-linear-to-r from-transparent to-gray-300" />
          <span className="text-[10px] font-medium text-gray-400 tracking-wide uppercase">
            Swipe to explore more
          </span>
          <div className="h-px w-12 bg-linear-to-l from-transparent to-gray-300" />
        </div>
      </div>
    </section>
  );
};

export default HairAccessoriesSection;
