import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, Check } from "lucide-react";

import { deleteVibrate, vibrate } from "../../../utils/vibrate";
// Imports End-----

const CartItemsList = ({
  cartItems,
  handleDelete,
  handleQuantityChange,
  isEditMode,
  selectedIndices,
  onToggleSelect,
}) => {
  return (
    <div className="space-y-2 sm:space-y-4">
      {cartItems.map((item, index) => {
        const isSelected = selectedIndices?.includes(index);

        return (
          <div
            key={`${item.productId}-${item.packId}-${JSON.stringify(
              item.selectedOptions,
            )}-${index}`}
            onClick={() => isEditMode && onToggleSelect(index)}
            className={`group relative flex flex-row gap-2 p-3 sm:gap-6 sm:p-5 bg-white rounded-xl border shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:hover:shadow-md select-none transition-[border-color,background-color,box-shadow] duration-300 ${
              isEditMode && isSelected
                ? "border-accent bg-accent/5"
                : "border-gray-200/60"
            } ${isEditMode ? "cursor-pointer" : ""}`}
          >
            {/* Edit Mode Checkbox — animates with opacity + scale only (no layout shift) */}
            <div
              className={`md:hidden flex items-center justify-center shrink-0 transition-all duration-300 ease-in-out ${
                isEditMode ? "w-7 opacity-100" : "w-0 opacity-0 overflow-hidden"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ease-out ${
                  isSelected
                    ? "bg-accent border-accent scale-100 shadow-md shadow-accent/30"
                    : "border-gray-300 bg-white scale-100"
                }`}
              >
                <Check
                  size={11}
                  strokeWidth={3.5}
                  className={`text-white transition-all duration-200 ${
                    isSelected ? "opacity-100 scale-100" : "opacity-0 scale-50"
                  }`}
                />
              </div>
            </div>

            {/* Product Image */}
            <Link
              to={`/product/${item.productSlug}`}
              onClick={(e) => isEditMode && e.preventDefault()}
              className="relative w-16 h-16 sm:w-28 sm:h-28 shrink-0 bg-gray-50 rounded-xl overflow-hidden cursor-pointer"
            >
              <img
                src={item.variantImage || item.image}
                alt={item.name}
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500"
              />
            </Link>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1.5 sm:space-y-2 min-w-0 flex-1">
                  <Link
                    to={`/product/${item.productSlug}`}
                    onClick={(e) => isEditMode && e.preventDefault()}
                    className="block text-xs sm:text-base font-semibold text-gray-900 hover:text-accent transition-colors line-clamp-2 sm:line-clamp-1 truncate leading-tight sm:leading-snug cursor-pointer mt-1"
                  >
                    {item.name}
                  </Link>

                  {/* Variants & Pack */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2.5">
                    {item.selectedVariants?.map((v, i) => {
                      const isColor = v.optionName === "CLRPOT";
                      const isSize = v.optionName === "SZEPOT";
                      const colorCode =
                        isColor && v.detailHex ? v.detailHex : null;

                      return (
                        <div
                          key={i}
                          className={`inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-semibold border ${
                            isColor
                              ? "bg-white border-gray-200"
                              : isSize
                                ? "bg-gray-100 border-gray-200"
                                : "bg-gray-50 border-gray-100"
                          }`}
                        >
                          {isColor && colorCode && (
                            <span
                              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-gray-200 shadow-sm"
                              style={{ backgroundColor: colorCode }}
                            />
                          )}

                          <span className="text-gray-900 font-bold truncate max-w-15 sm:max-w-none">
                            {v.detailName}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quantity & Price Row */}
                  <div className="flex items-center justify-between gap-2 mt-3">
                    <div
                      className={`flex items-center bg-[#fffaf5] rounded-full p-1 border border-gray-200/60 scale-90 sm:scale-100 origin-left shrink-0 transition-opacity duration-300 w-fit ${
                        isEditMode
                          ? "opacity-0 pointer-events-none"
                          : "opacity-100"
                      }`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.quantity === 1) {
                            deleteVibrate();
                            handleDelete(index);
                          } else {
                            vibrate(5);
                            handleQuantityChange(index, -1);
                          }
                        }}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white text-gray-900 shadow-sm border border-gray-100 hover:bg-gray-50 transition-all"
                      >
                        {item.quantity === 1 ? (
                          <Trash2 size={16} className="text-red-500" />
                        ) : (
                          <Minus size={16} strokeWidth={2.5} />
                        )}
                      </button>

                      <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-bold text-gray-900 select-none">
                        {item.quantity}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          vibrate(5);
                          handleQuantityChange(index, 1);
                        }}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-primary text-white shadow-sm hover:bg-primary/90 transition-all"
                      >
                        <Plus size={14} strokeWidth={2.5} />
                      </button>
                    </div>

                    <div className="text-right whitespace-nowrap">
                      <p className="text-sm sm:text-xl font-black text-accent">
                        Rs{" "}
                        {item.total?.toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                        Rs{" "}
                        {item.price?.toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}{" "}
                        each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartItemsList;
