import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

import ProductCard from "../../../components/ProductCard";

const RelatedProducts = ({ category, currentProductId, allProducts }) => {
  const location = useLocation();

  const related = useMemo(() => {
    if (!allProducts || allProducts.length === 0 || !currentProductId)
      return [];

    const currentId = String(currentProductId);
    return allProducts
      .filter((item) => {
        const itemId = String(item._id || "");
        const isSameProduct = itemId === currentId;
        return item.categoryName === category && !isSameProduct;
      })
      .slice(0, 6);
  }, [allProducts, category, currentProductId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  if (!related || related.length === 0) return null;

  return (
    <div className="my-5 mb-5 sm:mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6 gap-y-6 gap-2 sm:gap-2">
        {related.map((product) => (
          <ProductCard key={product.slug || product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
