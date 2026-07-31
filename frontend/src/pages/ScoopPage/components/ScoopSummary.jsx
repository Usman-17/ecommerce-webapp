import { ShoppingBag, Lock } from "lucide-react";

import { SCOOP_CONFIG } from "../scoopData";
import { calculateProductPrice } from "../../../utils/productPriceUtils";
// Imports End----

const ScoopSummary = ({
  selectedSize,
  selectedQuantity,
  scoopProducts,
  selectedVariants,
  onBuyNow,
}) => {
  const config = SCOOP_CONFIG[selectedSize];
  if (!config) return null;

  const quantity = selectedQuantity || 1;
  const currentPrice = config.pricing?.[quantity] || config.price;

  const totalProducts = scoopProducts.length;
  const readyCount = scoopProducts.filter((p) => {
    const instanceId = p._instanceId || p.productId;
    const variants = p.variants || [];
    if (variants.length === 0) return true;
    return !!selectedVariants?.[instanceId];
  }).length;

  const allReady = readyCount === totalProducts;

  const missingVariantTypes = [];
  if (!allReady) {
    missingVariantTypes.push("variants");
  }

  const totalRetailPrice = scoopProducts.reduce((sum, p) => {
    const { displayPrice } = calculateProductPrice(p);
    return sum + (displayPrice || 0);
  }, 0);

  const youSave = totalRetailPrice - currentPrice;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5 space-y-4">
      <h3 className="font-bold text-heading text-base">Scoop Summary</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Scoop Type</span>
          <span className="font-semibold text-heading">{config.name}</span>
        </div>
        {quantity > 1 && (
          <div className="flex justify-between">
            <span className="text-gray-500">Quantity</span>
            <span className="font-semibold text-heading">
              {quantity}x Scoops
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-500">Products</span>
          <span className="font-semibold text-heading">{totalProducts}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Variants Ready</span>
          <span
            className={`font-semibold text-xs ${allReady ? "text-green-600" : "text-accent"}`}
          >
            {readyCount} of {totalProducts}
          </span>
        </div>

        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${allReady ? "bg-green-500" : "bg-accent"}`}
            style={{
              width: `${totalProducts > 0 ? (readyCount / totalProducts) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Total Retail</span>
          <span className="text-gray-400 line-through">
            Rs {totalRetailPrice.toLocaleString()}
          </span>
        </div>
        {youSave > 0 && (
          <div className="flex justify-between">
            <span className="text-green-600 font-medium">You Save</span>
            <span className="text-green-600 font-bold">
              Rs {youSave.toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex justify-between items-end pt-1">
          <span className="text-gray-700 font-semibold">You Pay</span>
          <span className="text-xl font-bold text-heading">
            Rs {currentPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onBuyNow}
        disabled={!allReady || totalProducts === 0}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold text-sm transition-all duration-200 ${
          allReady && totalProducts > 0
            ? "bg-accent text-white hover:bg-accent/90 active:scale-[0.98] shadow-lg shadow-accent/20"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {allReady && totalProducts > 0 ? (
          <>
            <ShoppingBag size={16} />
            Buy Now
          </>
        ) : (
          <>
            <Lock size={14} />
            {missingVariantTypes.length > 0
              ? `Select all ${missingVariantTypes.join(" & ")}`
              : "Select all variants"}
          </>
        )}
      </button>
    </div>
  );
};

export default ScoopSummary;
