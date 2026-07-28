import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import ProductCard from "../../../components/ProductCard";
import SectionHeader from "../../../components/SectionHeader";
import InViewAnimation from "../../../components/InViewAnimation";

import { useGetAllProducts } from "../../../hooks/useGetAllProducts";
// Imports End-----

const prices = [99, 199, 499, 999, 1499, 1999];

const getRangeStart = (price) => {
  const idx = prices.indexOf(price);
  return idx === 0 ? 1 : prices[idx - 1] + 1;
};

const SCROLL_AMOUNT = 320;

const PriceRangeSection = () => {
  const scrollRef = useRef(null);

  const [activePrice, setActivePrice] = useState(99);

  // Fetch all products
  const { products } = useGetAllProducts();

  const getPrice = (p) => {
    return p.price ?? 0;
  };

  // Filter products based on active price range
  const filteredProducts = products.filter((p) => {
    const productPrice = getPrice(p);
    return (
      productPrice >= getRangeStart(activePrice) && productPrice <= activePrice
    );
  });

  // Scroll handlers
  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
  };

  return (
    <section className="pt-8 pb-16 sm:pt-12 sm:pb-6 lg:px-32">
      <div className="max-w-480 mx-auto">
        <SectionHeader
          label="Shop by Price"
          title="Find Your Perfect Match"
          description="Choose a price range that works for you and explore our curated collections."
          viewAllLink="/shop"
        />

        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-8 mb-12">
          <span className="hidden sm:inline text-lg font-semibold text-gray-900">
            Under
          </span>
          {prices.map((price, i) => {
            const isActive = price === activePrice;
            return (
              <InViewAnimation key={price} delay={0.1 + i * 0.1}>
                <button
                  onClick={() => setActivePrice(price)}
                  className={`hover:cursor-pointer font-semibold transition-all duration-300 group text-sm sm:text-lg sm:relative sm:bg-transparent sm:px-0 sm:py-0
                    ${
                      isActive
                        ? "text-[#CC0D39] border-2 border-[#CC0D39] sm:text-[#CC0D39] sm:border-0 sm:bg-transparent rounded-full sm:rounded-none px-4 py-1.5 sm:px-0 sm:py-0"
                        : "bg-white/10 text-gray-700 border border-gray-200 sm:border-0 sm:bg-transparent rounded-full sm:rounded-none px-4 py-1.5 sm:px-0 sm:py-0 hover:bg-gray-50 sm:hover:bg-transparent sm:hover:text-[#CC0D39]"
                    }`}
                >
                  {i === 0 && <span className="sm:hidden">Under </span>}
                  Rs. {price.toLocaleString()}
                  <span
                    className={`hidden sm:block absolute -bottom-1 left-0 h-0.5 bg-[#CC0D39] transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                  />
                </button>
              </InViewAnimation>
            );
          })}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        {/* ── Navigation controls ── */}
        <div className="flex items-center justify-center gap-3 py-8 px-4 sm:px-0">
          {filteredProducts.length > 6 && (
            <>
              <button
                onClick={scrollLeft}
                aria-label="Scroll brands left"
                className="flex w-8 h-8 lg:w-10 lg:h-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all duration-200 text-gray-500 hover:text-gray-800 shadow-sm"
              >
                <ChevronLeft size={16} strokeWidth={2} />
              </button>

              <button
                onClick={scrollRight}
                aria-label="Scroll brands right"
                className="flex w-8 h-8 lg:w-10 lg:h-10 items-center justify-center rounded-full bg-primary hover:opacity-90 active:scale-95 transition-all duration-200 text-white shadow-sm"
              >
                <ChevronRight size={16} strokeWidth={2} />
              </button>
            </>
          )}

          {/* View All pill */}
          {filteredProducts.length > 6 && (
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 active:scale-95 transition-all duration-200 text-gray-700 hover:text-gray-900 text-xs font-bold uppercase tracking-widest shadow-sm"
            >
              View All
              <ArrowRight
                size={13}
                className="group-hover:translate-x-0.5 transition-transform duration-300"
              />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default PriceRangeSection;
