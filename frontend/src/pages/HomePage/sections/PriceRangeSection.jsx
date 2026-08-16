import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

const PriceRangeSection = () => {
  const initializedRef = useRef(false);

  const [activePrice, setActivePrice] = useState(99);

  // Fetch all products
  const { products } = useGetAllProducts();

  const getPrice = (p) => {
    return p.price ?? 0;
  };

  // Only show price ranges that have at least one product
  const availablePrices = prices.filter((price) =>
    products.some((p) => {
      const productPrice = getPrice(p);
      return productPrice >= getRangeStart(price) && productPrice <= price;
    }),
  );

  // If active price has no products, switch to first available
  const effectiveActivePrice =
    availablePrices.length > 0
      ? availablePrices.includes(activePrice)
        ? activePrice
        : availablePrices[0]
      : null;

  // Auto-select first available price on load
  useEffect(() => {
    if (
      !initializedRef.current &&
      effectiveActivePrice !== null &&
      effectiveActivePrice !== activePrice
    ) {
      setActivePrice(effectiveActivePrice);
      initializedRef.current = true;
    }
  }, [effectiveActivePrice, activePrice]);

  // Filter products based on active price range
  const filteredProducts =
    effectiveActivePrice !== null
      ? products.filter((p) => {
          const productPrice = getPrice(p);
          return (
            productPrice >= getRangeStart(effectiveActivePrice) &&
            productPrice <= effectiveActivePrice
          );
        })
      : [];

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
          {effectiveActivePrice !== null && (
            <span className="hidden sm:inline text-lg font-semibold text-gray-900">
              Under
            </span>
          )}
          {availablePrices.map((price, i) => {
            const isActive = price === effectiveActivePrice;
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

        {filteredProducts.length > 10 && (
          <div className="flex items-center justify-center py-8">
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
          </div>
        )}
      </div>
    </section>
  );
};

export default PriceRangeSection;
