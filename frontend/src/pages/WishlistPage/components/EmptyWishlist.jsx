import LottieComponent from "lottie-react";
import emptyCartAnimation from "../../../assets/lottie/EmptyBox.json";

const Lottie = LottieComponent?.default || LottieComponent;

import CustomButton from "../../../components/CustomButton";
// Imports End---

const EmptyWishlist = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-gray-200 min-h-[60vh]">
      <div className="mb-6 w-48 h-48">
        <Lottie animationData={emptyCartAnimation} loop={false} />
      </div>

      <h2 className="text-xl font-bold text-gray-800 font-outfit text-center mb-1">
        Your wishlist is empty
      </h2>

      <p className="text-sm text-gray-500 mb-6 max-w-sm text-center">
        Save your favorite items here to review and purchase them later.
      </p>

      <CustomButton to="/shop" text="Return to Shop" />
    </div>
  );
};

export default EmptyWishlist;
