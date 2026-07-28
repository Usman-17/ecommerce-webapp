import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import InViewAnimation from "../../../components/InViewAnimation";
import SectionHeader from "../../../components/SectionHeader";

import { useGetAllCategories } from "../../../hooks/useGetAllCategories";
import { useGetAllProductAreas } from "../../../hooks/useGetAllProductAreas";
// Imports End-----

const SCROLL_AMOUNT = 320;

const CategorySection = () => {
  const scrollRef = useRef(null);
  const touchStartX = useRef(0);
  const hasScrolled = useRef(false);

  const { categories = [], categoryIsLoading: isLoading } =
    useGetAllCategories();
  const { areas = [] } = useGetAllProductAreas();

  // Precompute area lookup map for O(1) access
  const areaMap = {};
  areas.forEach((a) => {
    areaMap[a._id] = a.name;
  });

  useEffect(() => {
    if (scrollRef.current && categories.length > 0) {
      const isMobile = window.innerWidth < 640;
      if (isMobile) {
        const scrollWidth = scrollRef.current.scrollWidth;
        const clientWidth = scrollRef.current.clientWidth;
        scrollRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
      }
    }
  }, [categories]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
  };

  const handleTouchStart = (e) => {
    e.stopPropagation();
    touchStartX.current = e.touches[0].clientX;
    hasScrolled.current = false;
  };

  const handleTouchMove = (e) => {
    e.stopPropagation();
    const diff = Math.abs(e.touches[0].clientX - touchStartX.current);
    if (diff > 10) {
      hasScrolled.current = true;
    }
  };

  const handleCategoryClick = (e) => {
    if (hasScrolled.current) {
      e.preventDefault();
    }
  };

  if (!isLoading && categories.length === 0) return null;

  return (
    <section className="pt-8 pb-16 sm:pt-12 sm:pb-6 sm:px-5 lg:px-32 -mx-3">
      <div className="mx-auto">
        <SectionHeader
          label="Categories"
          title="Shop by Category"
          description="Discover elegant jewelry and trendy hair accessories, thoughtfully curated to elevate your everyday look."
          viewAllLink="/category"
        />

        {isLoading ? (
          <div className="flex gap-6 px-5 sm:px-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 animate-pulse shrink-0"
              >
                <div className="w-24 h-24 rounded-full bg-[#f0e4da]" />
                <div className="w-16 h-3 rounded bg-[#f0e4da]" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div
              ref={scrollRef}
              role="region"
              aria-label="Category list"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              className="flex overflow-x-auto overflow-y-hidden no-scrollbar gap-3 sm:gap-6 snap-x snap-mandatory px-4 sm:px-0"
            >
              {categories.map((cat, idx) => {
                const areaName = areaMap[cat.areaId];
                const areaParam = areaName
                  ? `&area=${encodeURIComponent(areaName)}`
                  : "";
                return (
                  <InViewAnimation
                    key={cat._id}
                    delay={0.04 * idx}
                    className="shrink-0 snap-center"
                  >
                    <Link
                      to={`/shop?category=${encodeURIComponent(cat.name || "")}${areaParam}`}
                      onClick={handleCategoryClick}
                      className="flex flex-col items-center gap-3 group shrink-0"
                    >
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-warm border border-[#f0e4da] shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-[#CC0D39]/30 group-hover:scale-105 mt-2">
                        <img
                          src={cat.imageUrl || "/category.png"}
                          alt={cat.name || "Category"}
                          loading="lazy"
                          width={112}
                          height={112}
                          onError={(e) => {
                            e.currentTarget.src = "/category.png";
                          }}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <span className="max-w-20 sm:max-w-xs text-[11px] sm:text-xs font-bold text-gray-600 text-center leading-tight line-clamp-1 group-hover:text-[#CC0D39] transition-colors">
                        {cat.name}
                      </span>
                    </Link>
                  </InViewAnimation>
                );
              })}
            </div>

            <div className="sm:hidden flex items-center justify-center gap-3 mt-4">
              <div className="h-px w-12 bg-linear-to-r from-transparent to-gray-300" />
              <span className="text-[10px] font-medium text-gray-400 tracking-wide uppercase">
                Swipe to explore more
              </span>
              <div className="h-px w-12 bg-linear-to-l from-transparent to-gray-300" />
            </div>

            {categories.length > 5 && (
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
          </>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
