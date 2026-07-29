import { ArrowRightIcon, Loader } from "lucide-react";
// Imports End-----

const CheckoutBottomBar = ({ total, isPending, isDisabled, onSubmit }) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-100 bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex items-center justify-between p-4 gap-3">
        {/* Total Amount */}
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">
            Total Amount
          </span>
          <div className="text-xl font-black text-gray-900 leading-none flex items-baseline gap-1">
            <span className="text-sm font-bold opacity-40">Rs.</span>
            {total.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}
          </div>
        </div>

        {/* Confirm Order Button */}
        <button
          type="submit"
          disabled={isPending || isDisabled}
          onClick={onSubmit}
          className="relative shrink-0 flex items-center justify-center py-3 px-6 rounded-full bg-gray-900 text-white font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:shadow-gray-400/20 active:translate-y-0 active:scale-[0.96] active:opacity-85 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed select-none overflow-hidden"
        >
          <div
            className={`flex items-center gap-2 transition-opacity duration-200 ${isPending ? "opacity-0" : "opacity-100"}`}
          >
            <span>Confirm Order</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform duration-150" />
          </div>

          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader
                className="animate-spin text-white"
                stroke="currentColor"
                strokeWidth={2.5}
                size={18}
              />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default CheckoutBottomBar;
