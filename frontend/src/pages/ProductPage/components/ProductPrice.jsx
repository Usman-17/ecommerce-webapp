const ProductPrice = ({
  currentPrice,
  originalPrice,
  discountPercent,
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

      {/* uy More, Save More */}
      {sortedTiers.length > 0 && (
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/30 to-accent/30" />
          <span className="text-[11px] font-bold text-accent tracking-wide whitespace-nowrap">
            ✨ Buy More, Save More ✨
          </span>

          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-accent/30 to-accent/30" />
        </div>
      )}

      {sortedTiers.length > 0 && (
        <div
          className={`grid gap-2 mt-1 ${
            sortedTiers.length === 2
              ? "grid-cols-2"
              : sortedTiers.length >= 3
                ? "grid-cols-3"
                : "grid-cols-1"
          }`}
        >
          {sortedTiers.map((tier, i) => {
            const perItem = Math.floor(
              Number(tier.price) / Number(tier.quantity),
            );
            const total = Math.floor(Number(tier.price));
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
                className={`flex flex-col items-center rounded-xl border-2 px-2 sm:py-2 py-3 transition-all cursor-pointer ${
                  isActive
                    ? "border-accent bg-accent/5"
                    : "border-orange-200 bg-orange-50/50 hover:border-orange-300"
                }`}
              >
                <span className="text-[11px] font-bold text-gray-700">
                  Buy {tier.quantity}
                </span>

                <span
                  className={`text-sm font-black mt-0.5 sm:mt-0 ${
                    isActive ? "text-accent" : "text-orange-600"
                  }`}
                >
                  Rs {perItem.toLocaleString()}/each
                </span>

                <span className="text-[10px] text-gray-400 mt-0.5 sm:mt-0">
                  Total{" "}
                  <span
                    className={`font-bold ${
                      isActive ? "text-accent" : "text-gray-600"
                    }`}
                  >
                    Rs {total.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductPrice;
