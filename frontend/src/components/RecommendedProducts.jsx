import { motion as Motion } from "framer-motion";

import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";
import ProductCardSkeleton from "./Skeleton/ProductCardSkeleton";
import { useGetAllProducts } from "../hooks/useGetAllProducts";
// Imports End----

const RecommendedProducts = ({
  limit = 12,
  allProducts: propAllProducts,
  productIsLoading: propProductIsLoading,
}) => {
  const hookProducts = useGetAllProducts();

  const allProducts =
    propAllProducts !== undefined
      ? propAllProducts
      : hookProducts.products || [];
  const productIsLoading =
    propProductIsLoading !== undefined
      ? propProductIsLoading
      : hookProducts.productIsLoading;

  const products = limit ? allProducts.slice(0, limit) : allProducts;

  return (
    <section className="pb-4 sm:pb-8 sm:py-4">
      {/* Header */}
      <div className="mb-4 sm:mb-5">
        <SectionHeader
          label="Our Picks"
          title="Recommended For You"
          description="Handpicked products just for you"
          viewAllLink="/shop"
        />
      </div>

      {/* Products Grid  */}
      <div className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {productIsLoading
          ? [...Array(12)].map((_, i) => (
              <div key={i}>
                <ProductCardSkeleton />
              </div>
            ))
          : products.map((product, idx) => (
              <Motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
              >
                <ProductCard product={product} index={idx} />
              </Motion.div>
            ))}
      </div>

      {/* Mobile Masonry Grid */}
      <div className="sm:hidden columns-2 gap-1 space-y-1">
        {productIsLoading
          ? [...Array(8)].map((_, i) => (
              <div key={i} className="break-inside-avoid">
                <ProductCardSkeleton />
              </div>
            ))
          : products.map((product, idx) => (
              <Motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                className="break-inside-avoid"
              >
                <ProductCard product={product} index={idx} />
              </Motion.div>
            ))}
      </div>
    </section>
  );
};

export default RecommendedProducts;
