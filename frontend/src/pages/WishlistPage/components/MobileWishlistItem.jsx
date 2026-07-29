import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { Heart, Trash2, Check, Star } from "lucide-react";

import { deleteVibrate } from "../../../utils/vibrate";
import { calculateProductPrice } from "../../../utils/productPriceUtils";
// Imports End-----

const MobileWishlistItem = ({
  product,
  isEditMode,
  isSelected,
  onToggleSelect,
  onRemove,
}) => {
  const navigate = useNavigate();

  const { displayPrice, oldPrice, isSale, discountPercentage } =
    calculateProductPrice(product);

  return (
    <Motion.div
      layout
      className={`bg-white rounded-2xl p-2 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#F1E4D8] flex items-center gap-0 select-none ${
        isEditMode && isSelected
          ? "border-accent bg-accent/5"
          : "border-[#f0e4da]"
      }`}
      onClick={() => {
        if (isEditMode) {
          onToggleSelect(product._id);
        } else {
          navigate(`/product/${product.slug}`);
        }
      }}
    >
      <div
        className={`overflow-hidden flex items-center shrink-0 transition-all duration-300 ease-in-out ${
          isEditMode ? "w-8 opacity-100 mr-1" : "w-0 opacity-0 mr-0"
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ease-out ${
            isSelected
              ? "bg-accent border-accent scale-100"
              : "border-gray-300 bg-white scale-100"
          }`}
        >
          <Check
            size={14}
            strokeWidth={3}
            className={`text-white transition-all duration-200 ${
              isSelected ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          />
        </div>
      </div>

      <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 relative border border-gray-50">
        <img
          src={product.productImages?.[0]?.url}
          alt={product.title}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500"
        />

        {isSale && (
          <div className="absolute -top-2 left-0">
            <span className="bg-accent text-white text-[8px] font-bold px-2 py-0.5 rounded-br-lg shadow-sm">
              {discountPercentage}% OFF
            </span>
          </div>
        )}
      </div>

      <div className="ml-2 flex-1 min-w-0 flex flex-col justify-center py-1">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="flex gap-0.5 shrink-0">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                className="fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>

          {product.subCategoryName && (
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide truncate">
              {product.subCategoryName}
            </span>
          )}
        </div>

        <h3 className="text-[14px] font-bold text-gray-900 leading-tight truncate">
          {product.title}
        </h3>

        <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
          <p className="text-[16px] font-extrabold text-accent">
            Rs. {displayPrice?.toLocaleString("en-PK")}
          </p>

          {oldPrice && (
            <p className="text-[11px] text-gray-400 line-through font-medium">
              Rs. {oldPrice?.toLocaleString("en-PK")}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-between h-20 items-end py-0.5">
        <button
          className="p-1 active:scale-110 transition-transform"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart
            size={19}
            fill="#e14a5c"
            color="#e14a5c"
            className="drop-shadow-sm"
          />
        </button>

        <button
          onClick={(e) => {
            deleteVibrate();
            e.stopPropagation();
            onRemove(product._id);
            const words = product.title?.split(" ") || [];
            const shortName =
              words.slice(0, 3).join(" ") + (words.length > 3 ? "..." : "");
            toast.success(`${shortName} removed from wishlist`);
          }}
          className="p-2 rounded-xl transition-all duration-300 bg-gray-100/50 text-gray-400 hover:text-red-500 hover:bg-red-50 active:translate-y-0 active:scale-[0.96] active:opacity-85"
        >
          <Trash2 size={18} strokeWidth={2} />
        </button>
      </div>
    </Motion.div>
  );
};

export default MobileWishlistItem;
