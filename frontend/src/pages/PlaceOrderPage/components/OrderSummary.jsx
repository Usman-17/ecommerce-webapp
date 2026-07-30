import { Link } from "react-router-dom";
import {
  Loader,
  ArrowRight,
  Ticket,
  Tag,
  BadgeInfo,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

import { vibrate } from "../../../utils/vibrate";
// Imports End-----

const OrderSummary = ({
  itemsToShow,
  subtotal,
  shippingFee,
  total,
  isPending,
  isDisabled,
  onSubmit,
  isBelowMinimum,
  minOrderAmount,
  couponCode,
  setCouponCode,
  couponError,
  couponSuccess,
  onApplyCoupon,
  orderType,
  scoopType,
  dealType,
}) => {
  return (
    <div className="hidden sm:block bg-[#fff8f8] rounded-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-accent to-accent" />

      {/* Header & Items - Hidden on Mobile */}
      <div className="hidden sm:block p-6 sm:p-8 pb-6">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
            Order Summary
          </h3>
          {orderType === "scoop" ? (
            <span className="inline-flex items-center gap-1.5 bg-accent/10 text-accent text-xs font-bold px-3 py-1.5 rounded-full">
              <Sparkles size={12} />
              {scoopType || "Scoop Deal"}
            </span>
          ) : orderType === "deal" ? (
            <span className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-600 text-xs font-bold px-3 py-1.5 rounded-full">
              <Tag size={12} />
              {dealType || "Deal"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full">
              <ShoppingBag size={12} />
              Normal Order
            </span>
          )}
        </div>

        <div className="space-y-6">
          {/* Item List */}
          <div className="max-h-70 overflow-y-auto pr-2 space-y-2 no-scrollbar">
            {itemsToShow.map((item, idx) => {
              const itemImage = item.variantImage || item.image;

              return (
                <div key={idx} className="flex gap-2 items-start group">
                  <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100 transition-colors relative">
                    <img
                      src={itemImage}
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                    {/* Quantity Badge on Image */}
                    <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-900 shadow-sm border border-gray-100">
                      x{item.quantity}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug mb-2 group-hover:text-accent transition-colors">
                      {item.name}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {item.selectedVariants?.map((v, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-50/30 text-gray-600 border border-gray-200 uppercase tracking-wide"
                        >
                          {v.detailName}
                        </span>
                      ))}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      {item.price > 0 && (
                        <p className="text-xs text-gray-400 font-medium">
                          {item.quantity} × Rs{" "}
                          {Math.floor(item.price || 0).toLocaleString("en-US")}
                        </p>
                      )}

                      {item.price > 0 && (
                        <p className="text-sm font-bold text-gray-900">
                          Rs{" "}
                          {Math.floor(item.total || 0).toLocaleString("en-US")}
                        </p>
                      )}

                      {item.price === 0 && (
                        <p className="text-xs text-gray-400 font-medium">
                          Included in bundle
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Section - Optimized for Mobile & Desktop */}
      <div className="bg-linear-to-b from-white to-gray-50 sm:bg-[#fff8f8] p-4 sm:p-8 border-t border-gray-100 backdrop-blur-sm">
        {/* Coupon Code Section */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Ticket size={18} strokeWidth={2.5} />
            </div>

            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && onApplyCoupon()}
              className={`w-full bg-white border rounded-lg pl-11 pr-24 py-4 text-[13px] outline-none transition-all font-bold placeholder:font-medium placeholder:text-gray-400 shadow-sm ${
                couponError
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/5"
                  : couponSuccess
                    ? "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/5"
                    : "border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5"
              }`}
            />

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                vibrate(5);
                onApplyCoupon();
              }}
              className="absolute right-2 top-2 bottom-2 px-5 bg-gray-900 text-white text-[11px] font-black uppercase tracking-wider rounded-lg hover:bg-gray-800 transition-all active:scale-95"
            >
              Apply
            </button>
          </div>

          {couponError && (
            <div className="flex items-center gap-2 mt-2 ml-1">
              <AlertCircle size={13} className="text-red-500 shrink-0" />
              <span className="text-[11px] text-red-500 font-semibold">
                {couponError}
              </span>
            </div>
          )}

          {couponSuccess && (
            <div className="flex items-center gap-2 mt-2 ml-1">
              <CheckCircle2 size={13} className="text-green-500 shrink-0" />
              <span className="text-[11px] text-green-600 font-semibold">
                {couponSuccess}
              </span>
            </div>
          )}

          {!couponError && !couponSuccess && (
            <div className="flex items-center gap-2 mt-3 ml-1">
              <Tag
                className="transform scale-x-[-1] text-gray-400"
                size={14}
                strokeWidth={2.5}
              />
              <span className="text-[11px] text-gray-400 font-bold">
                Apply a coupon code to get discount
              </span>
            </div>
          )}
        </div>

        {/* Calculations - Hidden on Mobile */}
        <div className="hidden sm:block space-y-3 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">
              Subtotal
            </span>

            <span className="font-bold text-gray-900">
              Rs {Math.floor(subtotal || 0).toLocaleString("en-US")}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">
              Shipping Charges
            </span>

            {shippingFee === 0 ? (
              <span className="font-bold text-green-600 bg-green-100/50 px-2 py-0.5 rounded text-xs uppercase tracking-wide">
                Free
              </span>
            ) : (
              <span className="font-bold text-gray-900">
                Rs {Math.floor(shippingFee || 0).toLocaleString("en-US")}
              </span>
            )}
          </div>
        </div>

        <div className="sm:border-t sm:border-gray-200/60 sm:pt-6 mb-6">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-1">
                Grand Total
              </span>
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest sm:hidden">
                Payable Amount
              </span>
              <span className="hidden sm:block text-sm font-bold text-gray-500 uppercase tracking-widest pb-1">
                Total
              </span>
            </div>
            <div className="text-right">
              <span className="text-3xl sm:text-3xl font-black text-gray-900 leading-none flex items-baseline gap-1">
                <span className="text-sm font-bold opacity-40">Rs.</span>
                {Math.floor(total || 0).toLocaleString("en-US")}
              </span>
            </div>
          </div>
        </div>

        {isBelowMinimum && (
          <div className="flex items-center gap-2 bg-amber-50/80 border border-amber-200/60 rounded-lg px-3 py-2 mb-4">
            <BadgeInfo size={16} className="text-amber-500 shrink-0" />
            <p className="text-amber-700 text-xs font-medium">
              Order total is below the minimum requirement.
              <br />
              Minimum Rs. {minOrderAmount.toLocaleString("en-US")}, current Rs.{" "}
              {Math.floor(subtotal).toLocaleString("en-US")}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || isDisabled}
          onClick={onSubmit}
          className="w-full relative overflow-hidden group flex items-center justify-center gap-3 py-4.5 sm:py-4 px-6 rounded-2xl sm:rounded-xl bg-gray-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] hover:shadow-2xl hover:shadow-gray-400/20 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale-[0.5] disabled:hover:translate-y-0"
        >
          {isPending ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            <>
              <div className="absolute inset-0 bg-white/10 -translate-x-full skew-x-[-20deg] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
              <span>Confirm Order</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          )}
        </button>

        <div className="mt-4 px-1">
          <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium text-center leading-relaxed">
            By placing this order you agree to our{"  "}
            <Link
              to="/terms"
              className="font-bold text-accent transition-colors"
            >
              Terms & Conditions
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
