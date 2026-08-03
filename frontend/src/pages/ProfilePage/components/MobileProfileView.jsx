import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { useGetAllProducts } from "../../../hooks/useGetAllProducts";

import Support from "./mobile/Support";
import QuickLinks from "./mobile/QuickLinks";
import ProfileMenu from "./mobile/ProfileMenu";
import OrderTracker from "./mobile/OrderTracker";
import ProfileHeader from "./mobile/ProfileHeader";

import ProductCard from "../../../components/ProductCard";
import ProductCardSkeleton from "../../../components/Skeleton/ProductCardSkeleton";
// Imports End--------

const MobileProfileView = () => {
  const { products, productIsLoading } = useGetAllProducts();

  return (
    <div className="-mx-3 min-h-screen pb-3">
      <ProfileHeader />

      <QuickLinks />

      <OrderTracker />
      <Support />

      <ProfileMenu />

      {/* Recommended Products */}
      <div className="mx-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[15px] font-black text-gray-900 leading-tight tracking-tight">
              Recommended Products
            </h2>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-1 text-[12px] font-bold text-accent hover:text-accent/80 transition-colors"
          >
            View All
            <ChevronRight size={14} />
          </Link>
        </div>

        {productIsLoading ? (
          <div className="columns-2 sm:columns-2 gap-1.5 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="break-inside-avoid">
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <div className="columns-2 sm:columns-2 gap-1.5 space-y-3">
            {products?.map((product) => (
              <div key={product.productId} className="break-inside-avoid">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileProfileView;
