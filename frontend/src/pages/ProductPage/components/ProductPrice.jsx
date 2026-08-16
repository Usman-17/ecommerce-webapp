const ProductPrice = ({
  currentPrice,
  originalPrice,
  discountPercent,
  taxPercent,
  bulkPricing = [],
  onTierClick,
  activeQuantity,
}) => {
  const sortedTiers = [...bulkPricing]
    .filter((t) => t.quantity && t.price)
    .sort((a, b) => a.quantity - b.quantity);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-2xl font-bold text-red-500">
            Rs{" "}
            {currentPrice.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}
          </span>
          {discountPercent > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gray-400 line-through font-medium">
                Rs{" "}
                {originalPrice.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </span>
              <span className="hidden sm:block px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-red-200 animate-pulse">
                {Math.round(discountPercent)}% OFF
              </span>
            </div>
          )}
        </div>

        {discountPercent > 0 && (
          <span className="block sm:hidden text-[10px] font-bold text-accent bg-accent/5 px-2.5 py-1 border border-accent/20 rounded-full whitespace-nowrap">
            You Save Rs{" "}
            {(originalPrice - currentPrice).toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}
          </span>
        )}
      </div>
      {taxPercent > 0 && (
        <p className="text-[10px] text-gray-400 font-medium tracking-wide">
          Inclusive of {taxPercent}% GST
        </p>
      )}

      {sortedTiers.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {sortedTiers.map((tier, i) => {
            const perItem = Math.round(
              Number(tier.price) / Number(tier.quantity),
            );
            const bestTierIdx =
              sortedTiers.length -
              1 -
              [...sortedTiers]
                .reverse()
                .findIndex((t) => activeQuantity >= Number(t.quantity));
            const isActive =
              sortedTiers.length > 0 &&
              i === bestTierIdx &&
              activeQuantity >= Number(tier.quantity);
            return (
              <button
                key={i}
                type="button"
                onClick={() => onTierClick?.(Number(tier.quantity))}
                className={`inline-flex items-center gap-1.5 border rounded-full px-3 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                }`}
              >
                Buy {tier.quantity} at Rs {perItem.toLocaleString()}/each
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductPrice;
