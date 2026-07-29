import { ArrowRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { vibrate } from "../../../utils/vibrate";
// Imports End-----

const MobileCartSummary = ({ cartItems, total }) => {
  const navigate = useNavigate();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-100 bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex items-start gap-3 p-4">
        {/* Summary Info */}
        <div className="flex-1 min-w-0 mt-2">
          {/* Items count */}
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
              cart
            </span>
          </div>

          {/* Total Amount */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs text-gray-500 font-medium">Total:</span>
            <div className="text-xl font-black text-gray-900 leading-none">
              Rs{" "}
              {total.toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={() => {
            vibrate(15);
            navigate("/place-order");
          }}
          className="shrink-0 flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-primary text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.96] active:opacity-85 transition-all duration-150 select-none"
        >
          <span>Place Order</span>

          <ArrowRightIcon className="w-4 h-4 transition-transform duration-150 group-active:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default MobileCartSummary;
