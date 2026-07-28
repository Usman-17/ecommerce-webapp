import { Star } from "lucide-react";
import { Link } from "react-router-dom";

const SaleProductCard = ({ product }) => {
  const discountPercent =
    product?.secondaryPrice && product.secondaryPrice > product?.price
      ? Math.round(((product.secondaryPrice - product.price) / product.secondaryPrice) * 100)
      : 0;

  return (
    <Link
      to={`/product/${product?.slug}`}
      className="group block max-w-4xl mx-auto rounded-xl sm:rounded-3xl overflow-hidden shadow-md sm:shadow-sm transition-shadow duration-400 bg-[#fffaf5]"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image Side */}
        <div className="relative w-full sm:w-1/3 bg-[#fffaf5] clip-image-curve">
          <img
            src={product?.productImages?.[0]?.url || product?.image}
            alt={product?.title}
            loading="lazy"
            decoding="async"
            className="object-cover w-full h-64 sm:h-full transition-transform duration-200 ease-in-out group-hover:scale-105"
          />

          {/*  tag */}
          {discountPercent > 0 && (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm select-none sm:opacity-0 sm:group-hover:opacity-100 flex items-center gap-2">
              {discountPercent}% OFF
            </div>
          )}
        </div>

        {/* Content side */}
        <div className="px-3 sm:px-6 py-5 sm:py-3 flex flex-col sm:w-2/3 rounded-b-3xl sm:rounded-r-3xl sm:rounded-bl-none bg-[#fffaf5]">
          <div>
            {product?.brandName && (
              <p className="uppercase tracking-widest font-semibold text-xs sm:text-sm text-gray-500">
                {product.brandName}
              </p>
            )}

            <p className="text-red-600 font-semibold text-sm">
              Limited Time Offer
            </p>

            <h3 className="text-md font-semibold mb-2 line-clamp-2 leading-tight">
              {product?.title}
            </h3>

            {/* Rating & Sold*/}
            <div className="flex items-center gap-3 mb-5 sm:mb-0">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-yellow-400"
                    fill="currentColor"
                  />
                ))}
              </div>

              {product?.sold > 0 && (
                <div className="mt-0.5 sm:mt-0 text-sm text-gray-600 font-medium">
                  {product.sold}+ Sold
                </div>
              )}
            </div>
          </div>

          {/* Price & button */}
          <div className="flex items-center justify-between sm:mt-10">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <p>Rs. {(product?.price ?? 0).toLocaleString()}</p>

              {product?.secondaryPrice && (
                <p className="text-sm text-gray-500 line-through">
                  Rs. {product.secondaryPrice.toLocaleString()}
                </p>
              )}
            </div>

            <button
              className="opacity-0 group-hover:opacity-100 bg-red-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-opacity duration-300 shadow-md"
              aria-label={`View details of ${product?.title}`}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SaleProductCard;
