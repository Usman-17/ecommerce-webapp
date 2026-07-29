import { ShieldCheck, Banknote, RotateCcw } from "lucide-react";
import codIcon from "../../../assets/place-order/cash-on-delivery.png";

const PaymentModeSelector = () => {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-bold text-gray-900 uppercase tracking-tight">
          Payment Method
        </h3>
        <p className="text-xs text-gray-500 mt-1">Choose how you want to pay</p>
      </div>

      <label className="relative flex items-center gap-4 p-4 rounded-2xl border-2 border-accent bg-accent/3 cursor-default select-none">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 shadow-sm">
          <img
            src={codIcon}
            alt="COD"
            className="w-10 h-10 object-contain"
          />
        </div>

        <div className="flex-1 min-w-0 pr-8 sm:pr-10">
          <span className="block font-bold text-gray-900 text-base leading-tight">
            Cash on Delivery
          </span>
          <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
            Pay when you receive your order
          </p>
        </div>

        <div className="absolute right-4">
          <div className="w-6 h-6 rounded-full border-2 border-accent shadow-[0_0_0_4px_rgba(225,74,92,0.1)] flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-accent" />
          </div>
        </div>
      </label>

      {/* Features Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-0 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100 sm:border-0 bg-gray-50/30">
        <div className="flex items-center gap-3 sm:justify-center sm:border-r border-gray-100 px-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-bold text-gray-900 leading-tight">
              Safe & Secure
            </p>
            <p className="text-[9px] text-gray-500 mt-0.5 truncate">
              Your information is protected
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:justify-center sm:border-r border-gray-100 px-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
            <Banknote className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-bold text-gray-900 leading-tight">
              Pay on Delivery
            </p>
            <p className="text-[9px] text-gray-500 mt-0.5 truncate">
              No upfront payment needed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:justify-center px-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-bold text-gray-900 leading-tight">
              Easy Returns
            </p>
            <p className="text-[9px] text-gray-500 mt-0.5 truncate">
              7 days return policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModeSelector;
