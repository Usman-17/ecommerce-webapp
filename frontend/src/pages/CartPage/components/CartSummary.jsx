import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  ReceiptText,
  TruckElectric,
  Ticket,
  Tag,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { vibrate } from "../../../utils/vibrate";
// Imports End-----

const CartSummary = ({
  subtotal,
  shippingFee,
  total,
  FREE_SHIPPING_THRESHOLD,
  progress,
  couponCode,
  setCouponCode,
  couponError,
  couponSuccess,
  onApplyCoupon,
}) => {
  const navigate = useNavigate();
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="lg:col-span-4 space-y-6">
      <div className="sticky top-6 space-y-4 z-0">
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden relative">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 bg-[#FF4D6D] rounded-full" />
            <h2 className="text-[16px] font-black text-gray-900 uppercase tracking-wider">
              Order Summary
            </h2>
          </div>

          {/* Underline */}
          <div className="w-full h-px bg-gray-200 mb-6" />

          <div className="mb-8">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400">
                  <ReceiptText size={18} />
                </div>
                <span className="text-[13px] text-gray-600 font-bold">
                  Subtotal
                </span>
              </div>
              <span className="font-black text-gray-900 text-[15px]">
                Rs{" "}
                {subtotal.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>

            {/* Shipping */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400">
                  <TruckElectric size={18} />
                </div>

                <span className="text-[13px] text-gray-600 font-bold">
                  Shipping
                </span>

                {shippingFee === 0 && (
                  <span className="text-[9px] bg-green-100 text-green-600 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">
                    Free
                  </span>
                )}
              </div>

              {shippingFee === 0 ? (
                <span className="font-black text-green-600 text-[15px]">
                  Rs 0
                </span>
              ) : (
                <span className="font-black text-gray-900 text-[15px]">
                  Rs{" "}
                  {shippingFee.toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                  })}
                </span>
              )}
            </div>

            {shippingFee > 0 && (
              <p className="text-[10px] text-gray-400 font-medium mt-1 ml-12">
                Lahore: Rs 250 | Other cities: Rs 300
              </p>
            )}

            {/* Free Shipping Progress Bar */}
            {remaining > 0 && (
              <div className="mt-8 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                  <TruckElectric size={20} strokeWidth={2.5} />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[12px] font-black text-[#1e293b]">
                      Add Rs{" "}
                      <span className="text-[#FF4D6D]">
                        {remaining.toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}
                      </span>{" "}
                      more for Free Shipping
                    </span>

                    <span className="text-[11px] font-black text-gray-400">
                      {progress.toFixed(0)}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FF4D6D] rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dotted Divider */}
          <div className="border-t border-dashed border-gray-200 mb-8" />

          <div className="mb-8">
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
                className={`w-full bg-white border rounded-lg pl-11 pr-24 py-4 text-[13px] outline-none transition-all font-bold placeholder:text-gray-400 shadow-sm ${
                  couponError
                    ? "border-red-300 focus:ring-2 focus:ring-red-500/5"
                    : couponSuccess
                      ? "border-green-300 focus:ring focus:ring-green-500/5"
                      : "border-gray-200 focus:ring focus:ring-primary/20"
                }`}
              />

              <button
                onClick={() => {
                  vibrate(5);
                  onApplyCoupon();
                }}
                className="absolute right-2 top-2 bottom-2 px-5 bg-primary text-white text-[11px] font-black uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all active:scale-95"
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

          <div className="mt-4">
            {/* Total Amount Box */}
            <div className="bg-[#FFF5F7] rounded-2xl p-6 mb-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4D6D]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>

              <div className="flex justify-between items-center relative z-10">
                <div>
                  <span className="text-[15px] font-black text-gray-900 block">
                    Total
                  </span>
                  <span className="text-[11px] text-gray-400 font-bold mt-0.5 block">
                    Including GST
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[26px] font-black text-[#1e293b] leading-none tracking-tight">
                    Rs{" "}
                    {total.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate("/place-order")}
              className="hidden sm:flex items-center justify-center w-full relative overflow-hidden group  gap-2 py-4 px-6 rounded-xl bg-primary text-white font-bold text-sm uppercase tracking-widest shadow-lg hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-white/10 -translate-x-full skew-x-[-20deg] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
              <span>Proceed to Checkout</span>

              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            <div className="flex flex-col gap-2 mt-8 text-[10px] text-gray-400 font-medium text-center">
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck size={14} className="text-green-500" />
                <span>Secure Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
