import { motion as Motion } from "framer-motion";
import { Check, Minus, Plus, Tag, Sparkles } from "lucide-react";

import scoopImg from "../../../assets/scoop/scoop.png";

import InViewAnimation from "../../../components/InViewAnimation";
// Imports End-----

const ScoopSizeCard = ({
  config,
  isSelected,
  onSelect,
  selectedQuantity,
  onSelectQuantity,
}) => {
  const quantity = selectedQuantity || 1;
  const currentPrice = config.pricing?.[quantity] || config.price;

  return (
    <InViewAnimation>
      <Motion.button
        type="button"
        onClick={() => onSelect(config.id)}
        whileTap={{ scale: 0.97 }}
        className={`relative w-full h-full text-left p-6 sm:p-8 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col ${
          config.popular ? "sm:-mt-2" : ""
        } ${
          isSelected
            ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
            : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-md"
        }`}
      >
        {/* Popular badge */}
        {config.popular && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-accent text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm whitespace-nowrap">
            <Sparkles size={12} />
            Most Popular
          </div>
        )}

        {/* Selection indicator */}
        <div
          className={`absolute top-5 right-5 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected ? "border-accent bg-accent" : "border-gray-300"
          }`}
        >
          {isSelected && (
            <Check size={14} className="text-white" strokeWidth={3} />
          )}
        </div>

        <div className={`flex-1 flex flex-col ${config.popular ? "mt-3" : ""}`}>
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <img
              src={scoopImg}
              alt={config.name}
              className="w-20 h-20 object-contain"
            />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-heading text-center">
            {config.name}
          </h3>
          <p className="text-accent font-bold text-2xl sm:text-3xl mt-2 text-center">
            Rs {currentPrice.toLocaleString()}
          </p>
          <div className="mt-3 text-center">
            <span className="inline-flex items-center gap-1.5 bg-pink-50 text-accent text-xs font-bold px-3 py-1.5 rounded-full">
              {config.itemCount} Products
            </span>
          </div>
          <p className="mt-4 text-sm text-gray-500 leading-relaxed text-center">
            {config.description}
          </p>

          {/* Quantity selector */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-600 mb-2">Quantity</p>
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-3 border border-gray-200 rounded-full px-1 py-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (quantity > 1) onSelectQuantity(quantity - 1);
                  }}
                  disabled={quantity <= 1}
                  className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Minus size={14} />
                </button>
                <span className="text-lg font-bold text-heading w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (quantity < 3) onSelectQuantity(quantity + 1);
                  }}
                  disabled={quantity >= 3}
                  className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Next tier price hint */}
            {quantity < 3 && config.pricing?.[quantity + 1] && (
              <p className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-500">
                <Tag size={12} className="text-accent" />
                Buy {quantity + 1} in{" "}
                <span className="font-semibold text-accent">
                  Rs {config.pricing[quantity + 1].toLocaleString()}
                </span>
                <span className="text-green-600 font-semibold">
                  & save Rs{" "}
                  {(
                    config.pricing[1] * (quantity + 1) -
                    config.pricing[quantity + 1]
                  ).toLocaleString()}
                </span>
              </p>
            )}
            {quantity === 3 && (
              <p className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-500">
                <Tag size={12} className="text-accent" />
                You're saving{" "}
                <span className="font-semibold text-green-600">
                  Rs{" "}
                  {(config.pricing[1] * 3 - config.pricing[3]).toLocaleString()}
                </span>{" "}
                on this bundle!
              </p>
            )}
          </div>
        </div>
      </Motion.button>
    </InViewAnimation>
  );
};

export default ScoopSizeCard;
