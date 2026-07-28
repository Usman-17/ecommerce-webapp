import Tippy from "@tippyjs/react";
import { Check } from "lucide-react";

const ProductOptions = ({
  product,
  selectedOptions,
  handleSelect,
  shakeOptions,
  setShakeOptions,
}) => {
  const isColorLight = (colorStr) => {
    if (!colorStr) return false;
    try {
      // Handle rgb(r, g, b) or rgba(r, g, b, a)
      const rgb = colorStr.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        const r = parseInt(rgb[0]);
        const g = parseInt(rgb[1]);
        const b = parseInt(rgb[2]);

        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.7;
      }

      // Fallback for hex colors if they appear
      if (colorStr.startsWith("#")) {
        const hex = colorStr.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.7;
      }
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return false;
    }
    return false;
  };

  return (
    <div
      className={`space-y-2 ${shakeOptions ? "animate-shake" : ""}`}
      onAnimationEnd={() => setShakeOptions?.(false)}
    >
      {(() => {
        // Simply filter out options that have no details
        const activeOptions =
          product?.data?.productOptionResponses?.filter(
            (option) => option.productOptionDetailResponses?.length > 0,
          ) || [];

        // Sort by sequence number if available to preserve the natural ordering from your backend
        const sortedOptions = [...activeOptions].sort(
          (a, b) => (a.productOptionSeqNo || 0) - (b.productOptionSeqNo || 0),
        );

        return sortedOptions.map((option) => (
          <div key={option.productOptionId} className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
              SELECT {option.productOptionTypeName}
            </label>

            <div className="flex flex-wrap gap-2.5">
              {option.productOptionDetailResponses
                ?.sort(
                  (a, b) =>
                    (a.optionDetailSeqNo || 0) - (b.optionDetailSeqNo || 0),
                )
                ?.map((detail) => {
                  const isSelected =
                    selectedOptions[option.productOptionId] ===
                    detail.productOptionDetailId;

                  //  handling for color options
                  const typeName = (
                    option.productOptionTypeName || ""
                  ).toLowerCase();
                  if (typeName === "color") {
                    const hexColor = detail.optionDetailHEXCode;
                    const isLightColor = isColorLight(hexColor);
                    const checkColor = isLightColor ? "#374151" : "#ffffff";

                    return (
                      <Tippy
                        key={detail.productOptionDetailId}
                        content={detail.optionDetailName}
                        animation="shift-away"
                        arrow={false}
                        offset={[0, 8]}
                        className="text-[10px]! font-bold! bg-primary! rounded-md!"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <button
                            onClick={() =>
                              handleSelect(
                                option.productOptionId,
                                detail.productOptionDetailId,
                              )
                            }
                            className={`relative w-8 h-8 rounded-full transition-all duration-300 ${
                              isSelected
                                ? "scale-105 shadow-lg shadow-gray-200"
                                : "ring-1 ring-inset ring-black/5 hover:scale-105"
                            }`}
                            style={{
                              backgroundColor: hexColor,
                            }}
                          >
                            {isSelected && (
                              <Check
                                size={16}
                                className="absolute inset-0 m-auto"
                                style={{ color: checkColor }}
                              />
                            )}
                          </button>
                          <span
                            className={`text-[10px] font-semibold ${isSelected ? "text-gray-900" : "text-gray-500"}`}
                          >
                            {detail.optionDetailName}
                          </span>
                        </div>
                      </Tippy>
                    );
                  }

                  // handling for non-color options
                  return (
                    <Tippy
                      key={detail.productOptionDetailId}
                      content={detail.optionDetailName}
                      animation="shift-away"
                      arrow={false}
                      offset={[0, 8]}
                      className="text-[10px]! font-bold! bg-primary! rounded-md!"
                    >
                      <button
                        onClick={() =>
                          handleSelect(
                            option.productOptionId,
                            detail.productOptionDetailId,
                          )
                        }
                        className={`min-w-14 px-5 py-2.5 text-xs font-bold rounded-full transition-all duration-300 ${
                          isSelected
                            ? "bg-primary text-white shadow-lg shadow-gray-200 transform -translate-y-0.5"
                            : "bg-white/80 text-gray-500 hover:bg-gray-100 hover:text-primary"
                        }`}
                      >
                        {detail.optionDetailName}
                      </button>
                    </Tippy>
                  );
                })}
            </div>
          </div>
        ));
      })()}
    </div>
  );
};

export default ProductOptions;
