import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductCardSkeleton = () => {
  return (
    <div className="rounded-lg">
      <div className="relative overflow-hidden">
        <Skeleton className="rounded h-40" />
      </div>

      {/* Product Info */}
      <div className="mb-3">
        <Skeleton height={12} width={`30%`} />
        <Skeleton height={15} />
        <Skeleton height={12} />

        {/* Title placeholder */}
        <div className="flex gap-2 items-center mt-2">
          <div className="flex gap-5">
            <Skeleton height={20} width={50} />
            <Skeleton height={20} width={45} />
            <Skeleton height={20} width={40} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
