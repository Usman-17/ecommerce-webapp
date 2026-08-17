import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";

import { useGetAllProducts } from "../../../hooks/useGetAllProducts";
import { calculateProductPrice } from "../../../utils/productPriceUtils";
// Imports End----

const SuggestedProducts = ({ currentItems = [] }) => {
  const { allProducts, productIsLoading } = useGetAllProducts();

  const currentIds = new Set(
    currentItems.map((item) => item.productId || item.id),
  );

  const suggestions = (allProducts || [])
    .filter((p) => !currentIds.has(p._id))
    .slice(0, 4);

  if (productIsLoading || suggestions.length === 0) return null;

  return (
    <div className="sm:mt-3 bg-white rounded-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-3">
      <h3 className="text-sm font-bold text-gray-900 mb-2">
        Add more to your order
      </h3>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {suggestions.map((product, idx) => {
          const { displayPrice, oldPrice } = calculateProductPrice(product);

          return (
            <Motion.div
              key={product._id || product.productSlug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                to={`/product/${product.slug || product.productSlug}`}
                className="flex gap-3 items-center bg-white border border-gray-100 rounded-xl p-2.5 min-w-55 hover:border-accent/30 hover:shadow-sm transition-all group"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                  <img
                    src={product.productImages?.filter(Boolean)?.[0]?.url}
                    alt={product.title || product.productName}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug mb-1">
                    {product.title || product.productName}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {oldPrice && (
                      <span className="text-[10px] text-gray-400 line-through">
                        Rs.{" "}
                        {oldPrice?.toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    )}
                    <p className="text-[11px] font-black text-accent">
                      Rs.{" "}
                      {displayPrice?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center group-hover:bg-accent transition-colors">
                  <Plus size={14} strokeWidth={3} />
                </div>
              </Link>
            </Motion.div>
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
    </div>
  );
};

export default SuggestedProducts;
