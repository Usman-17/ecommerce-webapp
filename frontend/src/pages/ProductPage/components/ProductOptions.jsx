import { useMemo } from "react";
import Tippy from "@tippyjs/react";

const ProductOptions = ({
  product,
  selectedOptions,
  handleSelect,
  shakeOptions,
  setShakeOptions,
  hasBulkPricing,
  quantity,
}) => {
  const variants = useMemo(
    () => (product?.variants || []).filter((v) => v.isActive !== false),
    [product],
  );

  const groupedVariants = useMemo(() => {
    const groups = {};
    variants.forEach((v) => {
      const type = v.type || "Other";
      if (!groups[type]) groups[type] = [];
      groups[type].push(v);
    });
    return groups;
  }, [variants]);

  if (variants.length === 0) return null;

  const groupLabels = {
    Color: "Select Color",
    Size: "Size",
    Shade: "Shade",
    Material: "Material",
    Weight: "Weight",
    Other: "Variant",
  };

  return (
    <div
      className={`pt-3 space-y-4 ${shakeOptions ? "animate-shake" : ""}`}
      onAnimationEnd={() => setShakeOptions?.(false)}
    >
      {Object.entries(groupedVariants).map(([type, typeVariants]) => {
        const optionKey = `variant_${type}`;
        const showMix = hasBulkPricing && quantity >= 2;
        const isMixSelected = selectedOptions[optionKey] === "Mix";

        return (
          <div key={type}>
            <label className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-2.5 block">
              {groupLabels[type] || type}
            </label>

            {type === "Color" ? (
              <div className="flex flex-wrap gap-3">
                {typeVariants.map((variant) => {
                  const isSelected =
                    selectedOptions[optionKey] === variant.name;
                  const hex = variant.hexColor || "#ccc";
                  const r = parseInt(hex.slice(1, 3), 16);
                  const g = parseInt(hex.slice(3, 5), 16);
                  const b = parseInt(hex.slice(5, 7), 16);
                  const isDark = r * 0.299 + g * 0.587 + b * 0.114 < 140;

                  return (
                    <Tippy
                      key={variant._id}
                      content={
                        <span className="font-bold">{variant.name}</span>
                      }
                      animation="shift-away"
                      arrow={false}
                      offset={[0, 8]}
                      className="text-[10px]! font-bold! bg-gray-900! rounded-lg! text-white!"
                    >
                      <button
                        onClick={() => handleSelect(optionKey, variant.name)}
                        className="flex flex-col items-center gap-1.5 group cursor-pointer"
                      >
                        <div
                          className={`w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center ${
                            isSelected
                              ? "scale-110"
                              : "ring-1 ring-gray-200 hover:scale-105"
                          }`}
                          style={{ backgroundColor: hex }}
                        >
                          {isSelected && (
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke={isDark ? "#fff" : "#000"}
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-semibold transition-colors ${
                            isSelected
                              ? "text-gray-900"
                              : "text-gray-400 group-hover:text-gray-600"
                          }`}
                        >
                          {variant.name}
                        </span>
                      </button>
                    </Tippy>
                  );
                })}
                {showMix && (
                  <Tippy
                    content={<span className="font-bold">Mix all colors</span>}
                    animation="shift-away"
                    arrow={false}
                    offset={[0, 8]}
                    className="text-[10px]! font-bold! bg-gray-900! rounded-lg! text-white!"
                  >
                    <button
                      onClick={() => handleSelect(optionKey, "Mix")}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer"
                    >
                      <div
                        className={`w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center bg-gradient-to-br from-red-400 via-yellow-400 via-50% to-blue-400 ${
                          isMixSelected ? "scale-110" : "hover:scale-105"
                        }`}
                      >
                        {isMixSelected && (
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-semibold transition-colors ${
                          isMixSelected
                            ? "text-gray-900"
                            : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      >
                        Mix
                      </span>
                    </button>
                  </Tippy>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {typeVariants.map((variant) => {
                  const isSelected =
                    selectedOptions[optionKey] === variant.name;

                  return (
                    <Tippy
                      key={variant._id}
                      content={`${variant.name}${variant.price ? ` — Rs ${variant.price.toLocaleString()}` : ""}`}
                      animation="shift-away"
                      arrow={false}
                      offset={[0, 8]}
                      className="text-[10px]! font-bold! bg-gray-900! rounded-lg! text-white!"
                    >
                      <button
                        onClick={() => handleSelect(optionKey, variant.name)}
                        className={`min-w-14 px-5 py-2.5 text-xs font-bold rounded-full transition-all duration-300 ${
                          isSelected
                            ? "bg-primary text-white shadow-lg shadow-gray-200 transform -translate-y-0.5"
                            : "bg-white/80 text-gray-500 hover:bg-gray-100 hover:text-primary"
                        }`}
                      >
                        {variant.name}
                      </button>
                    </Tippy>
                  );
                })}
                {showMix && (
                  <Tippy
                    content={<span className="font-bold">Mix all options</span>}
                    animation="shift-away"
                    arrow={false}
                    offset={[0, 8]}
                    className="text-[10px]! font-bold! bg-gray-900! rounded-lg! text-white!"
                  >
                    <button
                      onClick={() => handleSelect(optionKey, "Mix")}
                      className={`min-w-14 px-5 py-2.5 text-xs font-bold rounded-full transition-all duration-300 ${
                        isMixSelected
                          ? "bg-accent text-white shadow-lg shadow-accent/20 transform -translate-y-0.5"
                          : "bg-gradient-to-r from-accent/10 to-pink-400/10 text-accent hover:from-accent/20 hover:to-pink-400/20 border border-accent/30"
                      }`}
                    >
                      Mix
                    </button>
                  </Tippy>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProductOptions;
