import { Truck } from "lucide-react";
import LottieComponent from "lottie-react";
import { motion as Motion } from "framer-motion";

import congratsAnimation from "../../../assets/lottie/successfulCheck.json";
// Imports End----

const Lottie = LottieComponent?.default || LottieComponent;

const FreeShippingBar = ({ subtotal, FREE_SHIPPING_THRESHOLD, progress }) => {
  return (
    <div className="mb-3 sm:mb-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm hidden sm:flex sm:flex-row items-center gap-6">
      {subtotal >= FREE_SHIPPING_THRESHOLD ? (
        <div className="w-14 h-14 -my-2">
          <Lottie animationData={congratsAnimation} loop={false} />
        </div>
      ) : (
        <div className="p-2 bg-green-50 text-green-600 rounded-full">
          <Truck size={20} />
        </div>
      )}

      <div className="flex-1 w-full">
        <div className="flex justify-between text-sm font-bold mb-2">
          <span className="text-gray-900">
            {subtotal >= FREE_SHIPPING_THRESHOLD
              ? "You've unlocked FREE Shipping!"
              : `Add Rs ${(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString(
                  "en-US",
                  {
                    maximumFractionDigits: 0,
                  },
                )} more for Free Shipping`}
          </span>

          <span className="text-gray-500">{progress.toFixed(0)}%</span>
        </div>

        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <Motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-accent rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default FreeShippingBar;
