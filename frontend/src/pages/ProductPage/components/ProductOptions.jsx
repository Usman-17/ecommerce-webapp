import { useMemo } from "react";
import Tippy from "@tippyjs/react";

const ProductOptions = ({
  product,
  selectedOptions,
  handleSelect,
  shakeOptions,
  setShakeOptions,
}) => {
  const variants = useMemo(() => product?.variants || [], [product]);

  if (variants.length === 0) return null;

  return (
    <div
      className={`space-y-2 ${shakeOptions ? "animate-shake" : ""}`}
      onAnimationEnd={() => setShakeOptions?.(false)}
    >
      <label className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
        SELECT VARIANT
      </label>

      <div className="flex flex-wrap gap-2.5">
        {variants.map((variant) => {
          const isSelected = selectedOptions["variant"] === variant.name;

          return (
            <Tippy
              key={variant._id}
              content={`${variant.name} — Rs ${variant.price?.toLocaleString()}`}
              animation="shift-away"
              arrow={false}
              offset={[0, 8]}
              className="text-[10px]! font-bold! bg-primary! rounded-md!"
            >
              <button
                onClick={() => handleSelect("variant", variant.name)}
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
      </div>
    </div>
  );
};

export default ProductOptions;
