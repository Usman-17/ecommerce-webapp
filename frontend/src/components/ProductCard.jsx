import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.slug}`}>
      <div className="rounded-lg transition-shadow duration-300 ease-in-out max-w-sm mx-auto sm:max-w-none group py-2 hover:shadow-sm mb-2">
        <div className="relative overflow-hidden">
          <div className="relative w-full h-0 pb-[100%] rounded-t-md overflow-hidden">
            {/* Badge for Sale */}
            {product?.secondaryPrice && (
              <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] sm:text-[11px] font-medium px-3 py-0.5 rounded-full shadow-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                (
                {Math.round(
                  ((product.secondaryPrice - product.price) /
                    product.secondaryPrice) *
                    100
                ).toFixed(0)}
                % OFF)
              </div>
            )}

            {/* First Image */}
            <img
              src={product?.productImages[0]?.url}
              alt={product?.title}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-0"
              loading="lazy"
              decoding="async"
            />

            {/* Second Image */}
            {product?.productImages[1]?.url && (
              <img
                src={product?.productImages[1].url}
                alt={`${product?.title} - Alt`}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"
              />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="py-2 px-0.5 sm:px-2">
          <p className="text-xs sm:text-sm text-gray-500">
            {product?.brand?.name || ""}
          </p>

          <h2
            className="font-medium text-xs sm:text-sm md:text-sm tracking-tight text-gray-800"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: "1.3",
            }}
          >
            {product?.title}
          </h2>

          {/* Price */}
          <div className="flex items-center gap-1 text-nowrap">
            <p className="text-lg font-semibold text-gray-900">
              Rs. {product?.price.toLocaleString()}
            </p>

            {product?.secondaryPrice && (
              <p className="text-sm text-gray-500 line-through">
                Rs. {product.secondaryPrice.toLocaleString()}
              </p>
            )}

            {!product?.secondaryPrice && product?.sold && (
              <div className="mt-0.5 sm:mt-0 text-xs sm:text-[12.5px] text-gray-600 font-medium">
                {product.sold} Sold
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
