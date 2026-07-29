import { useMemo } from "react";
import {
  Ticket,
  Info,
  BadgeInfo,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { vibrate } from "../../../utils/vibrate";

const MobileOrderSummary = ({
  itemsToShow,
  subtotal,
  shippingFee,
  total,
  isBelowMinimum,
  minOrderAmount,
  couponCode,
  setCouponCode,
  couponError,
  couponSuccess,
  onApplyCoupon,
}) => {
  const inputClass = useMemo(
    () =>
      `w-full bg-white border rounded-lg pl-10 pr-24 py-3.5 text-xs outline-none transition-all duration-300 font-bold placeholder:font-medium placeholder:text-gray-400 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${
        couponError
          ? "border-red-300 focus:border-red-500"
          : couponSuccess
            ? "border-green-300 focus:border-green-500"
            : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/5"
      }`,
    [couponError, couponSuccess],
  );

  return (
    <div
      className="lg:hidden mt-3"
      style={{ contentVisibility: "auto", containIntrinsicSize: "500px" }}
    >
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
        {/* Header */}
        <div className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Order Summary
            </h2>
          </div>
        </div>

        <div className="px-4 pb-4">
          {/* Items List */}
          <div className="space-y-3 max-h-80 overflow-y-auto no-scrollbar py-3">
            {itemsToShow.map((item, idx) => {
              const itemImage = item.variantImage || item.image;

              return (
                <div key={idx} className="flex gap-4 items-start group">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100 relative">
                    <img
                      src={itemImage}
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-1 right-1 bg-white/90 px-1 py-0.5 rounded text-[8px] font-black text-gray-900 shadow-sm border border-gray-100">
                      x{item.quantity}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 py-0.5">
                    <p className="text-xs font-bold text-gray-900 line-clamp-1 leading-snug mb-1">
                      {item.name}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-1">
                      {item.selectedVariants?.map((v, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-black bg-gray-50 text-gray-500 border border-gray-200 uppercase tracking-tighter"
                        >
                          {v.detailName}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                        Rs {Math.floor(item.price || 0).toLocaleString()}
                      </p>
                      <p className="text-xs font-black text-gray-900">
                        Rs {Math.floor(item.total || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Coupon Section */}
          <div className="mt-2 pt-6 border-t border-dashed border-gray-200">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Ticket size={16} strokeWidth={2.5} />
              </div>

              <input
                type="text"
                placeholder="Promo Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && onApplyCoupon()}
                className={inputClass}
              />

              <button
                type="button"
                onClick={() => {
                  vibrate(5);
                  onApplyCoupon();
                }}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#CC0D39] text-white text-[10px] font-black uppercase tracking-wider rounded-lg hover:opacity-90 transition-all duration-300 active:scale-95"
              >
                Apply
              </button>
            </div>

            {couponError && (
              <div className="flex items-center gap-2 mt-2 ml-1">
                <AlertCircle size={12} className="text-red-500 shrink-0" />
                <span className="text-[10px] text-red-500 font-semibold">
                  {couponError}
                </span>
              </div>
            )}

            {couponSuccess && (
              <div className="flex items-center gap-2 mt-2 ml-1">
                <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                <span className="text-[10px] text-green-600 font-semibold">
                  {couponSuccess}
                </span>
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-gray-500 font-bold uppercase tracking-widest">
                Subtotal
              </span>
              <span className="font-black text-gray-900">
                Rs {Math.floor(subtotal || 0).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 font-bold uppercase tracking-widest">
                  Shipping
                </span>
                <Info size={10} className="text-gray-300" />
              </div>
              {shippingFee === 0 ? (
                <span className="font-black text-green-600 bg-green-50 px-2 py-0.5 rounded text-[9px] uppercase tracking-widest">
                  Free
                </span>
              ) : (
                <span className="font-black text-gray-900">
                  Rs {Math.floor(shippingFee || 0).toLocaleString()}
                </span>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-accent uppercase tracking-widest mb-0.5">
                  Total Amount
                </span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                  Payable Now
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-gray-900 leading-none flex items-baseline gap-1">
                  <span className="text-xs font-bold opacity-30">Rs.</span>
                  {Math.floor(total || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {isBelowMinimum && (
            <div className="flex items-center gap-2 bg-amber-50/80 border border-amber-200/60 rounded-lg px-3 py-2 mt-4">
              <BadgeInfo size={14} className="text-amber-500 shrink-0" />
              <p className="text-amber-700 text-[11px] font-medium">
                Order total is below the minimum requirement.
                <br />
                Minimum Rs. {minOrderAmount.toLocaleString("en-US")}, current
                Rs. {Math.floor(subtotal).toLocaleString("en-US")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileOrderSummary;
